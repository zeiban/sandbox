var WebSocketServer  = require('websocket').server;
var http = require('http');

var server = http.createServer(function(req, res){
    console.log((new Date()) + ' Received request for ' + req.url);
    res.writeHead(404);
    res.end();
    });
var port = process.env.PORT || 8080;
server.listen(port, function(){
    console.log((new Date()) + ' Server is listening on port ' + port);
    });
    
var wsServer = new WebSocketServer({
    httpServer:server,
    autoAcceptConnections: false
    });
    
wsServer.on('request', function(request){
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + 'Connection accepted.');
    connection.on('message', function(message){
        if(message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close',  function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disocnnected.');
    });
});