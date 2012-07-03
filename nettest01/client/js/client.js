define(['../../common/js/time'],function(Time){
    var Client = function(){
         this.run = function(config){
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
            
            //renderer.initialize();
            var socket = io.connect();
            socket.on('connect', function () {
        		console.log('Connected');
            	socket.on('disconnect',function(){
            		console.log('Disconnect');
            	});
            	socket.on('message',function(msg){
            		console.log('Received');
            		console.log(msg);
            	});
            });
            var nextFPSUpdate = 0;
            
            function frame() {
                
                window.requestAnimFrame(frame);
                //input.update();
                //network.update();
                //renderer.update();
                Time.update();
                if(Time.elapsedTime > nextFPSUpdate) {
//                    console.log(Math.floor(1.0/Time.deltaTime));
                    document.getElementById('fps').innerHTML = Math.floor(1.0/Time.deltaTime);
                    nextFPSUpdate = Time.elapsedTime + 1.0;
                }
            }
        frame();
        };
    };
    return Client;
});