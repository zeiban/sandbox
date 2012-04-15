var port = process.env.PORT || 8080;
var io = require('socket.io').listen(port);
/*
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
*/