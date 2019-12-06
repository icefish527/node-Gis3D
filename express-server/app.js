var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var stationsRouter = require('./routes/stations');

var app = express();

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/stations', stationsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var WebSocketServer = require('websocket').server;

var http = require('http');



var server = http.createServer(function (request, response) {

  console.log((new Date()) + ' Received request for ' + request.url);

  response.writeHead(404);

  response.end();

});

server.listen(4000, function () {

  console.log((new Date()) + ' Server is listening on port 4000');

});



wsServer = new WebSocketServer({

  httpServer: server,



});





wsServer.on('request', function (request) {

  //当前的连接

  var connection = request.accept(null, request.origin);



  setInterval(function () {

    connection.sendUTF('服务端发送消息' + (Math.random().toFixed(2)))

  }, 500)



  console.log((new Date()) + '已经建立连接');

  connection.on('message', function (message) {

    if (message.type === 'utf8') {

      console.log('Received Message: ' + message.utf8Data);

      connection.sendUTF(message.utf8Data);

    }

    else if (message.type === 'binary') {

      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');

      connection.sendBytes(message.binaryData);

    }

  });

  connection.on('close', function (reasonCode, description) {

    console.log((new Date()) + ' Peer ' + connection.remoteAddress + '断开连接');

  });

});

module.exports = app;
