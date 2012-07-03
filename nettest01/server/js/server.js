define(['path','module','express','socket.io'],function(path,module,express,sio){
    var Server = function(){
        this.run = function(config){
                console.log('Starting server...');
                    
                var server = express.createServer();
                server.configure(function(){
                    server.use(express.static(path.dirname(module.uri) + '/../..'));
                });
                
                server.listen(process.env.PORT || 8080);
                
                var io = sio.listen(server);
                //io.set('log level', 1);
                
                io.on('connect',function(socket){
                	console.log('Connected');
                    socket.on('message',function(msg){
                    	console.log('Received');
                    	console.log(msg);
                    });
                    socket.on('disconnect',function(){
                    	console.log('Disconnected');
                    });
                });
        };
    };
    
    return Server;
});