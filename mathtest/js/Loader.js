define(['JSONResource','ImageResource'],function(JSONResource,ImageResource){
    var Loader = function(){
        this.resources = [];
        this.statusListeners = [];
        this.finishedListeners = [];
        var addImage = function(url){
            this.resources.push(new ImageResource(this,url));
        }
    };
    Loader.prototype = {
        addStatusListener:function(listener){
            this.statusListeners.push(listener);
        },
        removeStatusListener:function(listener){
            var index;
            if((index = this.statusListener.indexOf(listener)) !== -1) {
                this.statusListeners.splice(index,1);
            }
        },
        addFinsihedListener:function(listener){
            this.finishedListeners.push(listener);
        },
        removeFinsihedListener:function(listener){
            var index;
            if((index = this.finishedListeners.indexOf(listener)) !== -1) {
                this.finishedListeners.splice(index,1);
            }
        },
        onStatus:function(res){
            console.log('onStatus:' + res.status);
            console.log(res);
            /*
            if(res.status === Resource.State.LOADED) {
                
            }*/
        },
        onFinsished:function(){
            console.log('onFinished');
            console.log(res);
        },
        
        add:function(url){
            this.resources.push(new JSONResource(this,url));
        },
        start:function(){
            for(var i=0; i<this.resources.length; i++) {
                this.resources[i].start();
            }
        }
    };
    return Loader;
});