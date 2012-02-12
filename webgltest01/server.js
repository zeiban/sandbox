var port = process.env.C9_PORT || process.env.app_port || 8080;

var express = require("express");
var app = express.createServer();


app.use(express.static(__dirname + '/public'));
app.listen(port);

console.log('Listening on port ' + port);