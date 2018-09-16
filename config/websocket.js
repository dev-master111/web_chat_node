#!/usr/bin/env node
const WebSocketServer = require('websocket').server;
const { Message } = require('../api/models');
const http = require('http');
const moment = require('moment');
 
const server = http.createServer((request, response) => {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8080, () => {
    console.log((new Date()) + ' Server is listening on port 8080');
});
 
const wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for productsion
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});
 
const originIsAllowed = origin => {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

export const startSocket = () => {
  wsServer.on('request', request => {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    const connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', async(message) => {
      if (message.type === 'utf8') {
        const messageData = JSON.parse(message.utf8Data);
        if (messageData._sender && messageData._receiver && messageData.content && messageData._boat) {
          console.log(messageData);
          const result = await createMessage(messageData);
          if (result) connection.sendUTF(message.utf8Data);
        }
      }
    });
  
    connection.on('close', (reasonCode, description) => {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  });
}