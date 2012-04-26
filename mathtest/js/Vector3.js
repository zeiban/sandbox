define(function(){
    var Vector3 = function(x, y, z){
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    };
    
    Vector3.prototype = {
        set:function(x, y, z){
            this.x = x;
            this.y = y;
            this.z = z;
        }
    };
    return Vector3;
});
