var Loader = function() {
    this.resources = [];
};

Loader.prototype = {
    add:function(url) {
        this.resources.push(url);
    },
    start:function() {
    },
    addProgressListener:function(){
    }
    addCompleteListener:function(){
        this.completeListeners.push();
    }
};