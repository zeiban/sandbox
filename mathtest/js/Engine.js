define(['Renderer'],function(Renderer){
    var Engine = function(){
    };
    Engine.prototype = {
        run:function(){
                
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
                        
            var gl, canvas;
            this.renderer = new Renderer();
            
            canvas = document.createElement("canvas");
            this.renderer.gl = gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            
            canvas.width = 200;
            canvas.height = 200;
            window.addEventListener('resize', onResize, false);
            document.body.appendChild(canvas);
            onResize();
            
            gl.clearColor(0.75,0,0,1.0);
            
            function onResize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                gl.viewport(0,0,canvas.width, canvas.height);
            }
            
            function frame() {
                window.requestAnimFrame(frame);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            }
            
            frame();
        }
    };
    return Engine;
});