require(['Loader','Engine','Transform','Vector3','Texture','Material','Shader'],
        function(Loader,Engine,Transform, Vector3,Texture,Material,Shader) {
        
    var p = new Transform();
    p.position.set(2,2,2);
    
    var c = new Transform();
    c.position.set(2,2,2);
    
    p.addChild(c);

    p.update();
    
    console.log(p);
    var te = c.worldMatrix.elements;
    console.log(te[0] + ' ' + te[4] + ' ' + te[8] + ' ' + te[12]);
    console.log(te[1] + ' ' + te[5] + ' ' + te[9] + ' ' + te[13]);
    console.log(te[2] + ' ' + te[6] + ' ' + te[10] + ' ' + te[14]);
    console.log(te[3] + ' ' + te[7] + ' ' + te[11] + ' ' + te[15]);
    
    var v = new Vector3(1,1,0);
    console.log(v.length());

    var engine = new Engine();
    engine.run();

    var loader = new Loader();
    loader.add('assets/textures/textuwre.json');
    loader.add('assets/textures/texture.json');
    loader.add('assets/textures/texture.json');
    loader.add('assets/textures/texture.json');
    loader.add('assets/textures/texture.json');
    loader.add('assets/textures/texture.json');
    loader.addStatusListener(function(res){
        console.log(res);
    });    
    loader.addFinsihedListener(function(){
        console.log('Done');

    });    
//    loader.start();

    var texture = new Texture();
    var shader = new Shader();

    shader.vertexSource = [
        'attribute vec4 position;',
        'void main() {',
        '   gl_Position = position;',
        '}'
    ].join('\n');
      
    shader.fragmentSource = [
        'precision highp float;',
        'void main() {',
        '   gl_FragColor = vec4(1.0, 1.0, 0.2, 1.0);',
        '}'    
    ].join('\n');
    
    var gl = engine.renderer.gl; 
    console.log(gl);
    var vertexShader;
    var fragmentShader;
    
    console.log("Compiling Shaders");

    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shader.vertexSource);
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        var log = gl.getShaderInfoLog(vertexShader);
        console.log("Error:" + log);
    }
    
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shader.fragmentSource);
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        var log = gl.getShaderInfoLog(vertexShader);
        console.log("Error:" + log);
    }
    shader.program = gl.createProgram();
    gl.attachShader(shader.program, vertexShader);
    gl.attachShader(shader.program, fragmentShader);
    gl.linkProgram(shader.program);
    gl.detachShader(shader.program, vertexShader);
    gl.deleteShader(vertexShader);
    gl.detachShader(shader.program, fragmentShader);
    gl.deleteShader(fragmentShader);
    
    var material = new Material();
    material.setShader(shader);
    material.setTexture('Diffuse',texture);    
});