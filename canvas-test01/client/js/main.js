require(["Vector2"], function() {
    var v1 = new Vector2(2,0);
    v1.normalize();
    console.log(v1);
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
    
    var selectedUnit;
    var selectedMode = "None";
    var mouseMapTileX, mouseMapTileY;
    var mouseMapX, mouseMapY;
    var offsetX, offsetY;
    
    var camera = {};
    camera.x = 0;
    camera.y = 0;
    
    var tileWidth = 32;
    var tileHeight = 32;
    var map = {};
    map.width = 8;
    map.height = 8;
    map.data = [
            1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,1,
            1,0,1,0,0,0,0,1,
            1,0,0,1,1,0,0,1,
            1,0,0,1,1,0,0,1,
            1,0,0,0,1,0,0,1,
            1,0,0,0,0,0,0,1,
            1,1,1,1,1,1,1,1
        ];
    var Unit = function(name, x, y, angle, health, time) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.health = health;
        this.time = time;
    }
    
    var players = [];
    players.push({name:'Player 1',units:[
        new Unit("Unit 1", 1,1,Math.floor(Math.random()*360), 10, 25),
        new Unit("Unit 2", 2,1,Math.floor(Math.random()*360), 13, 15),
    new Unit("Unit 3", 1,2,Math.floor(Math.random()*360), 15, 35),]});
    
    players.push({name:'Player 2',units:[{x:5,y:6,angle:45},{x:6,y:6,angle:45},{x:6,y:5,angle:45}]});
    
    selectedUnit = players[0].units[0];
    /*
    var map = {w:8,h:8,data:
        [
            1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,1,
            1,0,1,0,0,0,0,1,
            1,0,0,1,0,0,0,1,
            1,0,0,0,1,0,0,1,
            1,0,0,0,0,1,0,1,
            1,0,0,0,0,0,0,1,
            1,1,1,1,1,1,1,1
        ]};*/
        /*
    for(var i=0; i<map.w*map.h; i++) {
        map.data.push(Math.floor(Math.random()*2));
    }*/
    var canvas = document.createElement("canvas");
    
    var ctx = canvas.getContext("2d");
    
    canvas.width = 256;
    canvas.height = 256;
    
    document.body.appendChild(canvas);
    onResize();
    
    var mouseDown = false;
    var lastMouseX, deltaMouseX;
    var lastMouseY, deltaMouseY;
    
    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    function onMouseMove() {
        deltaMouseX = event.clientX - lastMouseX;
        deltaMouseY = event.clientY - lastMouseY;
        if(mouseDown) {
            camera.x -= deltaMouseX;
            camera.y -= deltaMouseY;
            console.log(camera);
        }
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
    
    function onMouseDown() {
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        mouseDown = true;
        for(var u=0; u<players[0].units.length; u++) {
            var unit = players[0].units[u];
            if(mouseMapTileX === unit.x && mouseMapTileY === unit.y) {
                selectedUnit = unit;
            }
        }
    }
    function onMouseUp() {
        mouseDown = false;
    }
    var scale = 1.0;
    function onMouseWheel(event) {
        console.log(event);
        if(event.wheelDelta > 0) {
            scale += (0.25*scale);
        } else {
            scale -= (0.25*scale);
        }
    }
    
    function onKeyDown(e){
        if(e.keyCode === 49) {
            selectedMode = "Look";
        }
        if(e.keyCode === 50) {
            selectedMode = "Move";
        }
        if(e.keyCode === 51) {
            selectedMode = "Attack";
        }
    }
    window.addEventListener('resize', onResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener('mousewheel', onMouseWheel, false);
    window.addEventListener('keydown', onKeyDown, false);
    
    
    
    function update() {
        offsetX = Math.floor((canvas.width - (map.width * tileWidth))*0.5);     
        offsetY = Math.floor((canvas.height - (map.height * tileHeight))*0.5);     
        mouseMapX = lastMouseX - offsetX;
        mouseMapY = lastMouseY - offsetY;
        mouseMapTileX = Math.floor(mouseMapX / tileWidth);
        mouseMapTileY = Math.floor(mouseMapY / tileHeight);
    }
    
    function draw() {
        var screenCenterX = (canvas.width * 0.5);
        var screenCenterY = (canvas.height * 0.5);
        
    //    var offsetX = Math.floor(screenCenterX - ((map.w * tileWidth) * 0.5));     
    //    var offsetY = Math.floor(screenCenterY - ((map.h * tileHeight) * 0.5));     
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.save();
    //    ctx.translate(Math.floor((canvas.width - (map.w * tileWidth))* 0.5),Math.floor((canvas.height - (map.h * tileHeight))* 0.5));
    //    ctx.translate(Math.floor(20-camera.x),Math.floor(20-camera.y));
    //    ctx.translate(Math.floor(screenCenterX-camera.x),Math.floor(screenCenterY-camera.y));
    //    ctx.scale(scale,scale);
    //    ctx.translate(10,10);
        //Draw Map
        for(var y=0; y<map.height; y++) {
            for(var x=0; x<map.width; x++) {
                if(map.data[y*map.width+x] === 1) {
                    ctx.fillStyle = 'gray';
                } else {
                    ctx.fillStyle = 'brown';
                }
                ctx.fillRect(offsetX + (x*tileWidth), offsetY + (y*tileHeight),tileWidth, tileHeight);
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 1;
                ctx.strokeRect(offsetX + (x*tileWidth), offsetY + (y*tileHeight),tileWidth, tileHeight);
            }
        }
        ctx.restore();
        ctx.save();
        ctx.translate(offsetX, offsetY);
        var halfTileWidth = tileWidth * 0.5;
        var halfTileHeight = tileHeight * 0.5;
        //Draw Units
        for(var p=0; p<players.length; p++) {
            for(var u=0; u<players[p].units.length; u++) {
                var unit = players[p].units[u];
                var x = unit.x;
                var y = unit.y;
                var radians = players[p].units[u].angle * (Math.PI / 180);
                var tileCenterX = (x*tileWidth) + halfTileWidth;
                var tileCenterY = (y*tileHeight) + halfTileHeight;
    //            halfTileWidth * Math.cos(radians);
     //           halfTileHeight * Math.sin(radians);
                ctx.beginPath();
                ctx.arc(tileCenterX, tileCenterY, tileWidth * 0.5, 0, 2 * Math.PI, false);
                ctx.fillStyle = "green";
                ctx.fill();
                
                if(unit !== selectedUnit) {
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                
                ctx.strokeStyle = 'black';
                ctx.moveTo(tileCenterX, tileCenterY);
                ctx.lineTo(tileCenterX + halfTileWidth * Math.cos(radians), tileCenterY + halfTileHeight * Math.sin(radians));
                ctx.stroke();
            }
        }
        ctx.restore();
    
            
        // Draw Selected Unit
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.beginPath();
        ctx.arc((selectedUnit.x*tileWidth) + halfTileWidth, (selectedUnit.y*tileHeight) + halfTileHeight, tileWidth * 0.5, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.restore();
        
    // Draw Look Cone
        var mouseAngle = new Vector2(mouseMapX - (selectedUnit.x*tileWidth), mouseMapY - (selectedUnit.y*tileHeight));
//        console.log(mouseAngle);
        mouseAngle.normalize();
 //       console.log(mouseAngle);
//        var previewAngle =  Math.acos(mouseAngle.dot(new Vector2(1,0))) *(180/Math.PI);
        var previewAngle = mouseAngle.dot(new Vector2(1,0)) *10;
        previewAngle = Math.atan((mouseAngle.x)/(mouseAngle.y)) * (180/Math.PI);
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo((selectedUnit.x*tileWidth) + halfTileWidth, (selectedUnit.y*tileHeight) + halfTileHeight);
    //    ctx.lineTo(mouseMapX,mouseMapY);
        ctx.arc((selectedUnit.x*tileWidth) + halfTileWidth, (selectedUnit.y*tileHeight) + halfTileHeight, 100, (previewAngle - 20) * (Math.PI / 180), (previewAngle + 20) * (Math.PI / 180), false);
        ctx.lineTo((selectedUnit.x*tileWidth) + halfTileWidth, (selectedUnit.y*tileHeight) + halfTileHeight);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.moveTo(offsetX+ (selectedUnit.x*tileWidth) + halfTileWidth, offsetY + (selectedUnit.y*tileHeight) + halfTileHeight);
        ctx.lineTo(lastMouseX, lastMouseY);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.restore();
        
        // Draw Text    
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = "10pt Calibri";
        ctx.fillText('Camera: [' + camera.x + ',' + camera.y+']', 0, 10);
        ctx.fillText('Camera Tile: [' + Math.floor(camera.x / tileWidth) + ',' + Math.floor(camera.y / tileHeight) +']', 0, 25);
        ctx.fillText('Mouse Screen: [' + lastMouseX + ',' + lastMouseY +']', 0, 40);
        ctx.fillText('Mouse Map: [' + mouseMapX + ',' + mouseMapY +']', 0, 55);
        ctx.fillText('Mouse Tile: [' + Math.floor(mouseMapX / tileWidth) + ',' + Math.floor(mouseMapY / tileHeight), 0, 70);
        ctx.fillText('Unit', 0, 85);
        ctx.fillText(' Mode: ' + selectedMode, 0, 100);
        ctx.fillText(' Name: ' + selectedUnit.name, 0, 115);
        ctx.fillText(' Health: ' + selectedUnit.health, 0, 130);
        ctx.fillText(' Time: ' + selectedUnit.time, 0, 145);
        ctx.fillText('Angle: ' + previewAngle, 0, 160);
        ctx.restore();
    
    }
    function frame() {
        window.requestAnimFrame(frame);
        update();
        draw();
    }
    
    frame();
});
