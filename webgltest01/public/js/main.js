

var blockSize = 1.0;


var camera = new Camera();
camera.transform.position.x = 4;
camera.transform.position.y = 0;
camera.transform.position.z = 4;


console.log(camera.transform.position[2]);


var map = {
    width:8,
    height:8,
    data:
    [
        1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1
    ]
};

function isPointInWall(v) {
    var x = Math.floor(v.x / blockSize);
    var y = Math.floor(v.z / blockSize);
    x = Math.min(Math.max(0,x),map.width-1);
    y = Math.min(Math.max(0,y),map.height-1);
    
    if(map.data[y * map.width + x] == 1) {
        return true;
    } else {
        return false;
    }
}    
console.log(map.width);
console.log(map.height);
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


var vertexPositionAttribute;
function loadShaders() {
    var fragmentShader = getShader(gl,'shader-fs;');
    var vertexShader = getShader(gl,'shader-vs;');
    
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Unable to initialize shader program");
    }
    gl.useProgram(program);
    vertexPositionAttribute = gl.getAttributeLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
}
var perspectiveMatrix;
var gl;
function render() {
    gl.clearColor(Math.random(),Math.random(),Math.random(),1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    perspectiveMatrix = makePerspective(45,640.0/480.0,0.1,100.0);
}
function initGL() {
    try {
        document.
        gl = canvas.getContext("experimental") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

var shaderProgram;

function initShaders(){
    var  fragmentShader = getShader(gl, "shader-fs");
    var  vertexShader = getShader(gl, "shader-vs");
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");    
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

var wallTexture;
var floorTexture;

function initTextures() {
    wallTexture = gl.createTexture();
    wallTexture.image = new Image();
    wallTexture.image.onload = function () {
        handleLoadedTexture(wallTexture)
    }

    wallTexture.image.src = "assets/wall.png";

    floorTexture = gl.createTexture();
    floorTexture.image = new Image();
    floorTexture.image.onload = function () {
        handleLoadedTexture(floorTexture)
    }

    floorTexture.image.src = "assets/floor.png";
}
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length === 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
var Mesh = {};
Mesh.Primitive = {
    Lines:0,
    Triangles:1
};

var axis =  {
    primitive:Mesh.Primitive.Lines,
    position:[0, 0, 0, 1, 0, 0,
              0, 0, 0, 0, 1, 0,
              0, 0, 0, 0, 0, 1],
    color:[1,0,0,
           1,0,0,
           0,1,0,
           0,1,0,
           0,0,1,
           0,0,1],
    texcoords:[],
    indexes:[]
};

function convertToGL(primitive){
    switch(primitive) {
        case Mesh.Primitive.Lines:
            return gl.LINES;
        case Mesh.Primitive.Trianges:
            return gl.TRIANGLES;
    }
}

function renderMesh(mesh) {
    if(mesh.position.length > 0 && mesh.positionBuffer === undefined) {
        mesh.positionBuffer = gl.createBuffer();
//        mesh.positionBuffer.itemSize = 3;
//        mesh.positionBuffer.numItems = mesh.position.length / 3;
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.position), gl.STATIC_DRAW);
    }
    if(mesh.color.length > 0 && mesh.colorBuffer === undefined) {
        mesh.colorBuffer = gl.createBuffer();
//        mesh.positionBuffer.itemSize = 3;
//        mesh.positionBuffer.numItems = mesh.position.length / 3;
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.color), gl.STATIC_DRAW);
    }

    if(mesh.indexes.length > 0 && mesh.indexBuffer == undefined) {
        mesh.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indexes), gl.STATIC_DRAW);
    }
    
    var mode = convertToGL(mesh.primitive);
    if(mesh.indexes.length > 0 ) {
        gl.drawElements(mode, mesh.indexes.length, gl.UNSIGNED_SHORT, 0);
    } else {
        var count =0;
        switch(mode) {
            case gl.LINES:
                count = mesh.position.length / 2;
                break;
            case gl.TRIANGLES:
                count = mesh.position.length / 3;
                break;
        }
        gl.drawArrays(mode, 0, count);
    }
}

var mapVertexPositionBuffer;
var mapVertexTextureCoordBuffer;
var mapVertexIndexBuffer;

function initBuffers() {
    var x, y;
    var vertices = [];
    var texCoords = [];
    var indexes = [];
    var indexOffset=0;

    var xOffset = map.width * -0.5;
    var yOffset = map.height * 0.5;
    
    for(y=0; y<map.height; y++) {
        for(x=0; x<map.width; x++) {
            if(map.data[y*map.width+x] === 0) {
                /*
                vertices.push(x,0,y);
                vertices.push(x+1,0,y);
                vertices.push(x,0,y+1);
                vertices.push(x+1,0,y+1);
                */

                // floor
                vertices.push(xOffset+x+1,-0.5,yOffset-y);
                vertices.push(xOffset+x,-0.5,yOffset-y);
                vertices.push(xOffset+x+1,-0.5,yOffset-y-1);
                vertices.push(xOffset+x,-0.5,yOffset-y-1);

                texCoords.push(0.0,0.0);
                texCoords.push(1.0,0.0);
                texCoords.push(0.0,1.0);
                texCoords.push(1.0,1.0);

                indexes.push(indexOffset,indexOffset+1,indexOffset+2);
                indexes.push(indexOffset+2,indexOffset+1,indexOffset+3);
                indexOffset+=4;

                //Celing
                vertices.push(xOffset+x,0.5,yOffset-y);
                vertices.push(xOffset+x+1,0.5,yOffset-y);
                vertices.push(xOffset+x,0.5,yOffset-y-1);
                vertices.push(xOffset+x+1,0.5,yOffset-y-1);
                

                texCoords.push(0.0,0.0);
                texCoords.push(1.0,0.0);
                texCoords.push(0.0,1.0);
                texCoords.push(1.0,1.0);

                indexes.push(indexOffset,indexOffset+1,indexOffset+2);
                indexes.push(indexOffset+2,indexOffset+1,indexOffset+3);
                indexOffset+=4;
                
                //West Wall
                if(x == 0 || map.data[y*map.width+(x-1)] == 1) {
                    vertices.push(xOffset+x,0.5,yOffset-y);
                    vertices.push(xOffset+x,0.5,yOffset-y-1);
                    vertices.push(xOffset+x,-0.5,yOffset-y);
                    vertices.push(xOffset+x,-0.5,yOffset-y-1);

                    texCoords.push(0.0,0.0);
                    texCoords.push(1.0,0.0);
                    texCoords.push(0.0,1.0);
                    texCoords.push(1.0,1.0);

                    indexes.push(indexOffset,indexOffset+1,indexOffset+2);
                    indexes.push(indexOffset+2,indexOffset+1,indexOffset+3);
                    indexOffset+=4;
                }
                //East Wall
                if(x == map.width-1 || map.data[y*map.width+(x+1)] == 1) {
                    vertices.push(xOffset+x+1,0.5,yOffset-y-1);
                    vertices.push(xOffset+x+1,0.5,yOffset-y);
                    vertices.push(xOffset+x+1,-0.5,yOffset-y-1);
                    vertices.push(xOffset+x+1,-0.5,yOffset-y);

                    texCoords.push(0.0,0.0);
                    texCoords.push(1.0,0.0);
                    texCoords.push(0.0,1.0);
                    texCoords.push(1.0,1.0);

                    indexes.push(indexOffset,indexOffset+1,indexOffset+2);
                    indexes.push(indexOffset+2,indexOffset+1,indexOffset+3);
                    indexOffset+=4;
                }
                //South Wall
                if(y == 0 || map.data[(y-1)*map.width+x] == 1) {
                    vertices.push(xOffset+x+1,0.5,yOffset-y);
                    vertices.push(xOffset+x,0.5,yOffset-y);
                    vertices.push(xOffset+x+1,-0.5,yOffset-y);
                    vertices.push(xOffset+x,-0.5,yOffset-y);

                    texCoords.push(0.0,0.0);
                    texCoords.push(1.0,0.0);
                    texCoords.push(0.0,1.0);
                    texCoords.push(1.0,1.0);

                    indexes.push(indexOffset,indexOffset+1,indexOffset+2);
                    indexes.push(indexOffset+2,indexOffset+1,indexOffset+3);
                    indexOffset+=4;
                }
                //North Wall
                if(y == map.height-1 || map.data[(y+1)*map.width+x] == 1) {
                    vertices.push(xOffset+x,0.5,yOffset-y-1);
                    vertices.push(xOffset+x+1,0.5,yOffset-y-1);
                    vertices.push(xOffset+x,-0.5,yOffset-y-1);
                    vertices.push(xOffset+x+1,-0.5,yOffset-y-1);

                    texCoords.push(0.0,0.0);
                    texCoords.push(1.0,0.0);
                    texCoords.push(0.0,1.0);
                    texCoords.push(1.0,1.0);

                    indexes.push(indexOffset,indexOffset+1,indexOffset+2);
                    indexes.push(indexOffset+2,indexOffset+1,indexOffset+3);
                    indexOffset+=4;
                }
            }
        }
    }
    mapVertexPositionBuffer = gl.createBuffer();
    mapVertexPositionBuffer.itemSize = 3;
    mapVertexPositionBuffer.numItems = vertices.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER,mapVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    mapVertexTextureCoordBuffer = gl.createBuffer();
    mapVertexTextureCoordBuffer.itemSize = 2;
    mapVertexTextureCoordBuffer.numItems = texCoords.length / 2;
    gl.bindBuffer(gl.ARRAY_BUFFER,mapVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

    mapVertexIndexBuffer = gl.createBuffer();
    mapVertexIndexBuffer.itemSize = 1;
    mapVertexIndexBuffer.numItems = indexes.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mapVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);
    /*
    var cubeVertexIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mapVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mapVertexIndices), gl.STATIC_DRAW);
    
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    var vertices = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = 24;

    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    var textureCoords = [
      // Front face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Back face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Top face
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,

      // Bottom face
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      // Right face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Left face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = 24;

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    var cubeVertexIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;
    */
}

var xRot = 0;
var yRot = 0;
var zRot = 0;
var camyrot=0;
var camxrot=0;
function drawScene() {
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    mat4.perspective(45, canvas.width / canvas.height, 0.1, 100.0, pMatrix);
    
    camera.transform.rotation.fromAxisAngle(Vector3.Y, camyrot);
    mat4.identity(mvMatrix);
    var rotation = quat4.create([
        camera.transform.rotation.x,
        camera.transform.rotation.y,
        camera.transform.rotation.z,
        camera.transform.rotation.w
        ]);
    //quat4.toMat4(rotation, mvMatrix);
//    mat4.rotate(mvMatrix, degToRad(camyrot), [0, 1, 0]);
//    mat4.rotate(mvMatrix, degToRad(camxrot), [1, 0, 0]);
    var mymat = new Matrix4();
    var f32array = new Float32Array(16); 
    
    var forward = mymat.right();
//    position.add(forward.scale(2));
//    camera.transform.position.add(new Vector3(0,0,1));
    mymat.setTranslation(camera.transform.position);
    mymat.toArray(f32array);
    mvMatrix = f32array;   
    /*
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [camera.transform.position.x, camera.transform.position.y, camera.transform.position.z]);
    if(keys[Input.Keys.D] === true) {
        console.log("mat4");
        console.log(mvMatrix);
    }
    */
//    mat4.rotate(mvMatrix, degToRad(xRot), [1, 0, 0]);
//    mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
//    mat4.rotate(mvMatrix, degToRad(zRot), [0, 0, 1]);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, mapVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mapVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, mapVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mapVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wallTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mapVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, mapVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    
    renderMesh(axis);
}

var lastTime = 0;
var deltaTime = 0;
var startTime = 0;
var elapsedTime = 0;
function animate() {
    var timeNow = new Date().getTime();
    if(startTime === 0) {
        startTime = timeNow;
    }
    elapsedTime = (timeNow - startTime)/1000;
    
    if (lastTime !== 0) {
        deltaTime = (timeNow - lastTime)/1000;

    }
    lastTime = timeNow;
}
var fps = document.getElementById('fps');

var bx = document.getElementById('bx');
var by = document.getElementById('by');

var cx = document.getElementById('cx');
var cy = document.getElementById('cy');
var cz = document.getElementById('cz');

var nextFPSUpdate = 0;
function checkCollision(){
    
    if(elapsedTime > nextFPSUpdate) {
        fps.innerHTML = Math.round((1/deltaTime));   
        nextFPSUpdate = elapsedTime + 1.0;
    }
    bx.innerHTML = Math.floor(camera.transform.position.x / blockSize);    
    by.innerHTML = Math.floor(camera.transform.position.z / blockSize);

    cx.innerHTML = camera.transform.position.x;    
    cy.innerHTML = camera.transform.position.y;
    cz.innerHTML = (camera.transform.position.z).toString().substring(0,6);
//    if(map.data[blockY* map.width * blockX])
//    */
}

function tick() {
    window.requestAnimFrame(tick);
    drawScene();
    animate();
    handleInput();
    checkCollision();
}
var canvas;

function initGL() {
    canvas = document.createElement("canvas");
    resizeCanvas();
    document.body.appendChild(canvas);
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        //gl.viewportWidth = canvas.width;
        //gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}  
function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
var keys = {};
function keyDown() {
    keys[event.keyCode] = true;
    console.log(String.fromCharCode(event.keyCode));
}

function keyUp(){
    keys[event.keyCode] = false;
    console.log(String.fromCharCode(event.keyCode));
}
var Input = {};
Input.Keys = {};

Input.Keys.A    = 65;
Input.Keys.W    = 87;
Input.Keys.S    = 83;
Input.Keys.D    = 68;
Input.Keys.UP   = 38;
Input.Keys.DOWN = 40;
Input.Keys.LEFT = 37;
Input.Keys.RIGHT = 39;

var speed = 1.0;

function handleInput() {
    var currentPosiiton = camera.transform.position.clone();
    var newPosition = camera.transform.position.clone();
    if(keys[Input.Keys.W] === true) {
        newPosition.addSelf(camera.transform.forward().multiplyScalar(speed * deltaTime));
    }
    if(keys[Input.Keys.S] === true) {
        newPosition.subtractSelf(camera.transform.forward().multiplyScalar(speed * deltaTime));
    }
    if(keys[Input.Keys.A] === true) {
        newPosition.addSelf(camera.transform.right().multiplyScalar(speed * deltaTime));
    }
    if(keys[Input.Keys.D] === true) {
        newPosition.subtractSelf(camera.transform.right().multiplyScalar(speed * deltaTime));
    }
    
    if(isPointInWall(newPosition) !== true) {
        camera.transform.position = newPosition;
    }
    
    if(keys[Input.Keys.LEFT] === true) {
        camyrot -= 0.50;
    }
    if(keys[Input.Keys.RIGHT] === true) {
        camyrot += 0.50;
    }

    if(keys[Input.Keys.UP] === true) {
        camxrot += 0.50;
    }
    if(keys[Input.Keys.DOWN] === true) {
        camxrot -= 0.50;
    }
}
var lastMouseX, lastMouseY;
var deltaMouseX, deltaMouseY;
function onMouseMove(){
    deltaMouseX = event.clientX - lastMouseX;
    deltaMouseY = event.clientY - lastMouseY;
}
function onMouseDown(){
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}
function onMouseUp(){
}
window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('keydown', keyDown, false);
window.addEventListener('keyup', keyUp, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);

initGL();
initShaders();
initBuffers();
initTextures();
gl.clearColor(1.0,0.0,0.0,1.0);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.frontFace(gl.CW);
tick();
//canvas.webkitRequestFullScreen(); 

