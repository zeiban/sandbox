var socket = io.connect();
socket.on('connect', function () {
    console.log('Connected');
    var out ={};
    out.id = 0;
    out.data = {};
    out.data.email = 'email@email.com';
    out.data.password = 'password'
    socket.json.send(out);
    socket.on('message', function (msg) {
        console.log('Received: ' + msg);
    });
});