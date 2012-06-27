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
    
    app.listen(process.env.PORT);
    
    var io = sio.listen(app);

    var clients = [];
    var zombies = [];
    
    var timer = setInterval(function(){
        //    console.log('Tick');
            for(var z=0; z<zombies.length; z++) {
                var props = zombies[z].properties;
                props.position.x+=props.velocity.x;
                props.position.y+=props.velocity.y;
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
        }, 1000);
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
                playerId = nextObjId++;
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
                })
                socket.json.send({id:Messages.LOGIN, data:{retval:0,id:playerId}});
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
