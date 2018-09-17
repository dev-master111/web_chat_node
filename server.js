import express from 'express';
import passport from 'passport';
import morgan from 'morgan';
//import logger from './api/common/log';
import cors from 'cors';
import bodyParser from 'body-parser';
import { messageSocketStart } from './api/utils/socketManager';

let env = process.env.NODE_ENV || 'development';
console.log("Environment: ", env);

let config = require('./config/config')[env];
let app = express();

app.set('superSecret', config.secret);
//app.use(morgan('short', {stream: logger.asStream('info')}));

app.use(express.static('./public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.raw({ limit: '50mb' }));
app.use(bodyParser.text({ type: 'application/json', limit: '50mb' }));

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Acncess-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.set(`X-Powered-By`, `WebChat`);
  next();
});

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(5000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// WebSocker Server Management
messageSocketStart(io);

