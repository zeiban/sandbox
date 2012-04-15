var Vector2 = function(x, y){
    this.x = x;
    this.y = y;
};

Vector2.prototype = {
    add:function(v, r){
        r = r || new Vector2();
        r.x = this.x + v.x;
        r.y = this.y + v.y;
        return r;
    },
    sub:function(v, r){
        r = r || new Vector2();
        r.x = this.x - v.x;
        r.y = this.y - v.y;
        return r;
    },
    div:function(v, r){
        r = r || new Vector2();
        r.x = this.x / v.x;
        r.y = this.y / v.y;
        return r;
    },
    divScalar:function(s, r){
        r = r || new Vector2();
        r.x = this.x / s;
        r.y = this.y / s;
        return r;
    },
    normalize:function(){
        this.divScalar(this.length(),this);        
    },
    dot:function(v){
        return this.x * v.x + this.y * v.y;        
    },
    length:function(){
        return Math.sqrt((this.x*this.x)+(this.y*this.y));
    }
};