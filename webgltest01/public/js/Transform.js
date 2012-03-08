function Transform(){
    this.position = new Vector3();
    this.rotation = new Quaternion();
    this.localMatrix = new Matrix4();
    this.worldMatrix = new Matrix4();
}

Transform.prototype.right = function(){
    return this.localMatrix.right();
};

Transform.prototype.up = function(){
    return this.localMatrix.up();
};

Transform.prototype.forward = function(){
    return this.localMatrix.forward();
};

