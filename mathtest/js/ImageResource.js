define(['Resource'],function(Resource){
    var ImageResource = function(loader, url){
        var self = this;
        this.loader = loader;
        this.url = url;
        this.image = new Image();
        this.status = Resource.Status.QUEUED;
        
        var onLoad = function(){
            self.status = Resource.Status.LOADED;
            this.loader.onStatus(self);
        };
        var onReadyStateChange = function(){
            if (self.image.readyState == 'complete') {
                self.status = Resource.Status.LOADED;
                self.loader.onStatus(self);
            }
        };
        var onError = function(){
            self.loader.onError(self);
        };   
        this.start = function(){
            self.addEventListener('load', onLoad,false);
            self.addEventListener('readystatechange', onReadyStateChange, false);
            self.addEventListener('error', onError, false);
            self.status = Resource.Status.LOADING;
            self.image.src = self.url;
            self.loader.onStatus(self);
        }
    };
    
    return ImageResource;
});