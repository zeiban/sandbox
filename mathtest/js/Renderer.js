define(function(){
    var Renderer = function(gl){
        this.gl = gl;
    };
    
    Renderer.prototype = {
        setMaterial:function(material){
            if(material.program === null) {
            }
        }
    };
    return Renderer;
});