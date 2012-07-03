var requirejs = require('requirejs');
requirejs.config({
        nodeRequire: require
    });

requirejs(['server'],function(Server){
    var server = new Server();
    server.run();
});
