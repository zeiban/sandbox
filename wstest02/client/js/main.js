window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

var canvas, ctx;

var lastTime = 0;
var deltaTime = 0;
var startTime = 0;
var elapsedTime = 0;
var nextFPSUpdateTime = 0;

var isConnected = false;
var isAuthenticated = false;
var playerId = 0;
function onResize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

var objects = {};


require(['Messages','Input'], function(Messages,Input) {
    
    var socket = io.connect();
    socket.on('connect', function () {
        console.log('Connected');
        isConnected = true;
        var out ={
            id:Messages.LOGIN,
            data:{
                email:'email@domain.com',
                password:'password'
            }
        };
        socket.json.send(out);
        socket.on('disconnect', function () {
            console.log('Disconnected');
        });
    
        socket.on('message', function (msg) {
//            console.log('Received: ' + msg.id);
            if(msg.id === Messages.LOGIN) {
                var retval = msg.data.retval;
                if(retval === 0) {
                    console.log('Authentication: Success');
                    isAuthenticated = true;
                    playerId = msg.data.id;
                } else if (retval === 1) {
                    console.log('Authentication: Invalid email or password');
                } else if (retval === 2) {
                    console.log('Authentication: Account disabled');
                } else {
                    console.log('Authentication: Unknown login response ' + retval);
                }
            } else if (msg.id === Messages.OBJECT) {
                objects[msg.data.id] = msg.data.properties;
            }
        });
    });

    window.addEventListener('keydown', function(){
        if(event.keyCode === Input.Keys.A) {
            socket.json.send({id:Messages.MOVE_LEFT,data:{state:1}});
        } else if (event.keyCode === Input.Keys.D) {
            socket.json.send({id:Messages.MOVE_RIGHT,data:{state:1}});
        }
    }, false);
    
    window.addEventListener('keyup', function(){
        if(event.keyCode === Input.Keys.A) {
            socket.json.send({id:Messages.MOVE_LEFT,data:{state:0}});
        } else if (event.keyCode === Input.Keys.D) {
            socket.json.send({id:Messages.MOVE_RIGHT,data:{state:0}});
        }
    }, false);
    
    function update() {
        for(var prop in objects) {
            var obj = objects[prop];
            if(parseInt(prop) === playerId) {
                if(Input.isKeyDown(Input.Keys.A)) {
                    obj.velocity.x = -30;
                }
                if(Input.isKeyDown(Input.Keys.D)) {
                    obj.velocity.x = 30;
                }
            }
            obj.position.x += obj.velocity.x*deltaTime;
            obj.position.y += obj.velocity.y*deltaTime;
        }
    }
    
    function draw(){
        if(isConnected) {
            if(isAuthenticated){
                ctx.fillStyle = 'gray';
                ctx.fillRect(0,0,canvas.width, canvas.height);
                
                for (var prop in objects) {
                    var obj = objects[prop];
                    ctx.beginPath();
                    ctx.arc(obj.position.x+(canvas.width*0.5), obj.position.y+(canvas.height*0.5), 5, 0, 2 * Math.PI, false);
                    if(parseInt(prop) === playerId) {
                        ctx.fillStyle = "red";
                    } else {
                        ctx.fillStyle = "green";
                    }
                    ctx.fill();
                }
            } else {
                ctx.fillStyle = 'white';
                ctx.fillText("Authenticating", 10, 50);  
            }
        } else {
            ctx.fillStyle = 'white';
            ctx.fillText("Connecting", 10, 50);  
        }
    }
    function frame(){
        var currentTime = new Date().getTime();
        if(startTime === 0) {
            startTime = currentTime;
        }
        elapsedTime = (currentTime - startTime) / 1000;

        if (lastTime !== 0) {
            deltaTime = (currentTime - lastTime) / 1000;
    
        }
        lastTime = currentTime;
        if(elapsedTime > nextFPSUpdateTime) {
            console.log(Math.round((1/deltaTime)));
            nextFPSUpdateTime = elapsedTime + 1.0;
        }
        window.requestAnimFrame(frame);
        update();
        draw();
    }
    
    window.addEventListener('resize', onResize, false);
    
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas); 
    onResize();

    frame();
});
