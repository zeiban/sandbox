var Resource = function(loader,url){
    this.loader = loader;
    this.url = url;
};
Resource.State = {
    QUEUED:0,
    WAITING:1,
    LOADED:2,
    TIMEOUT:3,
    ERROR:4
};
Resource.prototype = {
    start:function(){
        var xhr = new XMLHttpRequest();
        var loader = this.loader;
        xhr.open('GET', this.url,true);
        xhr.onreadystatechange = function(event){
            //console.log(event);
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    loader.onComplete(this, JSON.parse(xhr.responseText));
                    //console.log(xhr.responseText);
                    
                } else {
                    loader.onError(this);
                    //console.log("Error", xhr.statusText);
                }
            }  
        };
        xhr.send(null);
    }
}
var Loader = function() {
    this.resources = [];
    this.progressListeners = [];
    this.completeListeners = [];
};

Loader.prototype = {
    add:function(url) {
        this.resources.push(new Resource(this,url));
    },
    start:function() {
        this.completed = 0;
        for(var i=0; i<this.resources.length; i++) {
            var resource = this.resources[i];
            resource.start();
        }
    },
    addProgressListener:function(listener){
        this.progressListeners.push(listener);
    },
    addCompleteListener:function(listener){
        this.completeListeners.push(listener);
    },
    onError:function(res){
        for(var i=0; i<this.progressListeners.length; i++){
            this.progressListeners[i]();
        }
    },
    onComplete:function(res, text){
        //console.log(text);
        this.completed++;
        for(var i=0; i<this.progressListeners.length; i++){
            this.progressListeners[i](res,text);
        }
        if(this.completed === this.resources.length) {
            for(var i=0; i<this.progressListeners.length; i++){
                this.completeListeners[i]();
            }
        }            
    },
    
    
};