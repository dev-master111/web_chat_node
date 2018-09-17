// Socket.io Handler
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(80);

const moment = require('moment');
const messages = [];
const userList = [];

export const messageSocketStart = () => {
  io.on('connection', socket => {
    try {
      // Handler for action event. (Connected, Ack of a message)
      socket.on('action', data => {
        // Receive a ack for the message
        switch (data.type) {
          case 'ack':
            const messageIndex = messages.findIndex( msg => msg.messageId === data.messageId );
            if (messages[messageIndex]) {
              messages[messageIndex].isRead = true;
            }
            break;
          case 'connected':
            // Connection for user established
            const { user } = data;
            const userIndex = userList.findIndex(u => u.username === user)
            if (userIndex < 0) {
              userList.push({
                username: user,
                sessionId: socket.handshake.query.t,
                status: true
              })
            } else {
              userList[userIndex].status = true;
            }

            io.emit('users', { users: userList });

            // Send previous messages when user connect
            const originMessages = messages.filter(m => m.sender === user || m.receiver === user);
            io.emit('messages', { user, messages: originMessages });
            break;
          default:
            break;
        }
      });

      socket.on('send_message', data => {
        // Handler for receive message event
        const { sender, receiver, content } = data;
        if (sender && receiver && content) {
          const messageId = Date.now();
          const newMessage = {
            messageId,
            sender: sender,
            receiver: receiver,
            isRead: false,
            date: new Date(),
            content: content
          };
          // Store new message in message list(This will be stored in database)
          messages.push(newMessage);
          // Send new message to the socket
          socket.broadcast.emit('receive_message', newMessage);
        }
      });

      socket.on('disconnect', data => {
        // Handler for disconnection
        const userIndex = userList.findIndex(user => user.sessionId === socket.handshake.query.t)
        if (userIndex >= 0) {
          userList[userIndex].status = false;
        }
        
        io.emit('users', { users: userList });
      });
      console.log('user connected');
    } catch (error) {
      console.log('socket error: ', error);
    }
  });
}
