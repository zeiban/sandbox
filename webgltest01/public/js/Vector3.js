function Vector3(x, y, z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
Vector3.prototype.add = function(v,r) {
    r = r || new Vector3();
    r.x = this.x + v.x;
    r.y = this.y + v.y;
    r.z = this.z + v.z;
    return r;
};
Vector3.prototype.addSelf = function(v) {
    this.add(v, this);
    return this;
};
Vector3.prototype.subtract = function(v,r) {
    r = r || new Vector3();
    r.x = this.x - v.x;
    r.y = this.y - v.y;
    r.z = this.z - v.z;
    return r;
};
Vector3.prototype.subtractSelf = function(v) {
    this.subtract(v, this);
    return this;
};
Vector3.prototype.multiplyScalar = function(s, r) {
    r = r || new Vector3();
    r.x = this.x * s;
    r.y = this.y * s;
    r.z = this.z * s;
    return r;
};
Vector3.prototype.multiplyScalarSelf = function(s) {
    this.multiplyScalar(s, this);
    return this;
};
Vector3.prototype.clone = function() {
    return new Vector3(this.x, this.y, this.z);
};
Vector3.X = new Vector3(1,0,0);
Vector3.Y = new Vector3(0,1,0);
Vector3.Z = new Vector3(0,0,1);