define(['Vector3','Quaternion','Matrix4'],function(Vector3, Quaternion, Matrix4) {
    var Transform = function(){
        this.children = [];
        this.parent = null;
        this.position = new Vector3();
        this.rotation = new Quaternion();
        this.localMatrix = new Matrix4();
        this.worldMatrix = new Matrix4();
    };
    
    Transform.prototype = {
        addChild:function(child) {
            child.parent = this;
            this.children.push(child);
        },
        removeChild:function(child) {
            var index;
            if((index = this.children.indexOf(child)) !== -1) {
                this.children.splice(index ,1);
                child.parent = null;
            }
        },
        update:function(){
            var rotation = new Matrix4();
            var translation = new Matrix4();
            
            rotation.setRotation(this.rotation)
            translation.setTranslation(this.position);
            
            this.localMatrix.multiply(rotation,translation);
            if(this.parent === null) {
                this.worldMatrix.copy(this.localMatrix);
            } else {
                this.worldMatrix.multiply(this.parent.worldMatrix, this.localMatrix);
            }
            for(var i=0; i<this.children.length; i++) {
                this.children[i].update();
            }
        }
    };
    return Transform;
});