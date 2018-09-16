const path = require('path');
const rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/web_chat',
    root: rootPath,
    app: {
      name: 'Web Chat'
    }
  },
  production: {
    db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/web_chat',
    root: rootPath,
    app: {
      name: 'Web Chats'
    }
  }
};
