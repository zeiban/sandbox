var requirejs = require('requirejs');
requirejs.config({
        nodeRequire: require
    });
    
requirejs(['../../client/js/Messages'], function   (Messages) {
    console.log(Messages);
    var express = require('express'),
        sio = require('socket.io');
    
    var app = express.createServer();
    var sio = sio;
    console.log(__dirname);
    app.configure(function(){
        app.use(express.static(__dirname + '/../../client'));
    });
    
    app.listen(process.env.PORT || 8080);
    
    var io = sio.listen(app);
    io.set('log level', 1); 
    
    var clients = [];
    var zombies = [];
    
    var startTime=0, lastTime=0, elapsedTime=0, deltaTime=0;
    
    var timer = setInterval(function(){
        var currentTime = new Date().getTime();
        if(startTime === 0) {
            startTime = currentTime;
        }
        elapsedTime = (currentTime - startTime) / 1000;

        if (lastTime !== 0) {
            deltaTime = (currentTime - lastTime) / 1000;
    
        }
        lastTime = currentTime;

        console.log('Tick: ' + deltaTime);
            for(var z=0; z<zombies.length; z++) {
                var props = zombies[z].properties;
                props.position.x+=(props.velocity.x*deltaTime);
                //console.log(props.position.x);
                props.position.y+=(props.velocity.y*deltaTime);
            }
            for(var i=0; i<clients.length; i++) {
                for(var z=0; z<zombies.length; z++) {
                    var zombie = zombies[z];
                    clients[i].json.send({
                        id:Messages.OBJECT,
                            data:{
                                id:zombie.id,
                                properties:zombie.properties
                            }
                    });
                }
            }
        }, 1000/30);
    var nextObjId = 0;
    
    for(var i=0; i<50; i++) {
        zombies.push({
            id:nextObjId++,
            properties:{
                position:{
                    x:(Math.random()*100) - 50,
                    y:(Math.random()*100) - 50
                },
                velocity:{
                    x:(Math.random()*10)-5,
                    y:(Math.random()*10)-5
                }
            }
        });
    }
    io.sockets.on('connection', function(socket) {
        console.log('Connected ' + socket);
        clients.push(socket);
        
        socket.on('message',function(msg){
            console.log('Received: ' + msg);
            if(msg.id === Messages.LOGIN) {
                console.log("Authenticating: " + msg.data.email);
                var playerId = nextObjId++;
                zombies.push({
                    id:playerId,
                    properties:{
                        position:{
                            x:(Math.random()*100) - 50,
                            y:(Math.random()*100) - 50
                        },
                        velocity:{
                            x:0,
                            y:0
                        }
                    }
                });
                socket.set('playerId',playerId,function(){
                    socket.json.send({id:Messages.LOGIN, data:{retval:0,id:playerId}});
                });
            } else if (msg.id === Messages.MOVE_LEFT){
                socket.get('playerId',function(err,id){
                    var player = zombies[id];
                    if(msg.data.state === 1) {
                        player.properties.velocity.x = -30;
                    } else {
                        player.properties.velocity.x = 0;
                    }
                });
            } else if (msg.id === Messages.MOVE_RIGHT){
                socket.get('playerId',function(err,id){
                    var player = zombies[id];
                    if(msg.data.state === 1) {
                        player.properties.velocity.x = 30;
                    } else {
                        player.properties.velocity.x = 0;
                    }
                });
            } else {
                console.log("Unknown Message ID: " + msg.id);
            }
        });
        socket.on('disconnect',function(){
            var i = clients.indexOf(socket);
            clients.splice(i,1);
            console.log('Disconnected: ' + socket);
        });
    });
});
