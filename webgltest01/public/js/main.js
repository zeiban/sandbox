function Matrix4(){
    this.m11 = this.m22 = this.m33 = this.m44 = 1.0;

    this.m12 = this.m13 = this.m14 = 
    this.m21 = this.m23 = this.m24 = 
    this.m31 = this.m32 = this.m34 =
    this.m41 = this.m42 = this.m43 = 0.0;
}

Matrix4.prototype.multiply = function(a,b) {
    var 
    a11 = a.m11, a12 = a.m12, a13 = a.m13, a14 = a.m14,
	a21 = a.m21, a22 = a.m22, a23 = a.m23, a24 = a.m24,
	a31 = a.m31, a32 = a.m32, a33 = a.m33, a34 = a.m34,
	a41 = a.m41, a42 = a.m42, a43 = a.m43, a44 = a.m44,

	b11 = b.m11, b12 = b.m12, b13 = b.m13, b14 = b.n14,
	b21 = b.m21, b22 = b.m22, b23 = b.m23, b24 = b.m24,
	b31 = b.m31, b32 = b.m32, b33 = b.m33, b34 = b.m34,
	b41 = b.m41, b42 = b.m42, b43 = b.m43, b44 = b.m44;    

    this.m11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
	this.m12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
	this.m13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
	this.m14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

	this.m21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
	this.m22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
	this.m23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
	this.m24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

	this.m31 = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
	this.m32 = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
	this.m33 = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
	this.m34 = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

	this.m41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
	this.m42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
	this.m43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
	this.m44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return this;
}
Matrix4.prototype.fromTranslation = function(translation) {
    this.m14 = translation.x;
    this.m24 = translation.y;
    this.m34 = translation.z;
}
Matrix4.prototype.fromQuaternion = function(q) {
    var xx      = q.x * q.x;
    var xy      = q.x * q.y;
    var xz      = q.x * q.z;
    var xw      = q.x * q.w;
    
    var yy      = q.y * q.y;
    var yz      = q.y * q.z;
    var yw      = q.y * q.w;
    
    var zz      = q.z * q.z;
    var zw      = q.z * q.w;    

    this.m00  = 1 - 2 * ( yy + zz );
    this.m01  =     2 * ( xy - zw );
    this.m02 =     2 * ( xz + yw );
    
    this.m10  =     2 * ( xy + zw );
    this.m11  = 1 - 2 * ( xx + zz );
    this.m12  =     2 * ( yz - xw );
    
    this.m20  =     2 * ( xz - yw );
    this.m21  =     2 * ( yz + xw );
    this.m22  = 1 - 2 * ( xx + yy );
    
    this.m03  = this.m13 = this.m23 = this.m30 = this.m31 = this.m32 = 0;
    this.m33 = 1;
}
function Vector3(x, y, z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
Vector3.X = new Vector3(1,0,0);
Vector3.Y = new Vector3(0,1,0);
Vector3.Z = new Vector3(0,0,1);

function Quaternion(x, y, z, w){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;
}
Quaternion.prototype.fromAxisAngle = function(axis, angle) {
    var halfAngle = angle*0.5;
    var s =  Math.sin(halfAngle);
    this.x = axis.x * s;
    this.y = axis.y * s;
    this.z = axis.z * s;
    this.w = Math.cos(halfAngle);
};

function Transform(position, rotation) {
    this.position = position || new Vector3();
    this.position = rotation || new Quaternion();
}
/*
Quaternion.prototype.mul = function(q) {

}

Quaternion.prototype.toMatrix = function(m) {
}*/

function Transform(){
    this.position = new Vector3();
    this.rotation = new Quaternion();
    this.localMatrix = new Matrix4();
    this.worldMatrix = new Matrix4();
}
function Camera() {
    this.transform = new Transform();
}
var camera = {
    transform:{
        position: new Vector3(0.0,1.0,-5.0),
        rotation: new Quaternion()
    }
};
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
    mat4.rotate(mvMatrix, degToRad(camyrot), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(camxrot), [1, 0, 0]);

    mat4.translate(mvMatrix, [0.0, 0.0, camera.transform.position.z]);
    
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
}

var lastTime = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime !== 0) {
        var elapsed = timeNow - lastTime;

        xRot += (90 * elapsed) / 1000.0;
        yRot += (90 * elapsed) / 1000.0;
        zRot += (90 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
}
function tick() {
    window.requestAnimFrame(tick);
    drawScene();
    animate();
    handleInput();
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

function handleInput() {
    if(keys[Input.Keys.W] === true) {
        camera.transform.position.z += 0.5;
    }
    if(keys[Input.Keys.S] === true) {
        camera.transform.position.z -= 0.5;
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

