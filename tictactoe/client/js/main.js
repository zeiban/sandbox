require(['requestAnimFrame'],function() {

    var canvas, ctx;
    
    function update() {
    }
    
    function draw(){
        ctx.save();
        ctx.translate(canvas.width * 0.5,canvas.height * 0.5);
        var scale;
        if(canvas.height < canvas.width) {
            scale = canvas.height/150;
        } else {
            scale = canvas.width/150;
        }
        //scale -= 150/150;
        ctx.scale(scale,scale);
        ctx.translate(-75,-75);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;

        ctx.moveTo(50,0);
        ctx.lineTo(50,150);

        ctx.moveTo(100,0);
        ctx.lineTo(100,150);
        
        ctx.moveTo(0,50);
        ctx.lineTo(150,50);

        ctx.moveTo(0,100);
        ctx.lineTo(150,100);

        ctx.moveTo(5,5);
        ctx.lineTo(45,45);

        ctx.moveTo(45,5);
        ctx.lineTo(5,45);

        ctx.stroke();
        
        ctx.restore();
    }
    
    function frame(){
        window.requestAnimFrame(frame);
        update();
        draw();
    }
    
    function onResize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function onMouseDown() {
    }
    
    function onMouseUp() {
    }
    window.addEventListener('resize', onResize, false);
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mouseup', onMouseUp, false);

    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    onResize();

    frame();
});