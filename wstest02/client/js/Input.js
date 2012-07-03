define(function() {
    var Input = {};
    Input.Keys = {};
    var keys = {};
    Input.Keys.A    = 65;
    Input.Keys.W    = 87;
    Input.Keys.S    = 83;
    Input.Keys.D    = 68;
    Input.Keys.UP   = 38;
    Input.Keys.DOWN = 40;
    Input.Keys.LEFT = 37;
    Input.Keys.RIGHT = 39;
    
    window.addEventListener('keydown', function(){
        keys[event.keyCode] = true;

    }, false);
    
    window.addEventListener('keyup', function(){
        keys[event.keyCode] = false;
    }, false);
    
    Input.isKeyDown = function(keyCode){
        return keys[keyCode];
    }    
    return Input
});
