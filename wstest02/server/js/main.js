var express = require('express'),
    sio = require('socket.io');

var app = express.createServer();
var sio = sio;
console.log(__dirname);
app.configure(function(){
    app.use(express.static(__dirname + '/../../client'));
});

app.listen(process.env.PORT);

var io = sio.listen(app);
/*
io.configure(function(){
  io.set('transports', ['websocket']);
});*/
var clients = [];
var timer = setInterval(function(){
        console.log('Tick');
        
    }, 1000);

io.sockets.on('connection', function(socket) {
    console.log('Connected ' + socket);
    clients.push(socket);        
    socket.on('message',function(msg){
        console.log(msg.id);
        console.log(msg.data.email);
        console.log(msg.data.password);
//        var obj = JSON.parse(msg);
    });
    socket.on('disconnect',function(){
        var i = clients.indexOf(socket);
        clients.splice(i,1);        
        console.log('Disconnected: ' + socket);
    });
});

