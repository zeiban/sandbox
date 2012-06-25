define(function(){
    var Quaternion = function(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
    };
    
    Quaternion.prototype = {
        setFromAxisAngle:function(axis, angle){
            var halfAngle = angle / 2,
            	s = Math.sin( halfAngle );
            
            this.x = axis.x * s;
            this.y = axis.y * s;
            this.z = axis.z * s;
            this.w = Math.cos( halfAngle );
            
            return this;
        }
    };
    return Quaternion;
});