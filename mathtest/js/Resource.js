define(['Resource'],function(Resource){
    var Resource = function(loader, url){
        this.loader = loader;
        this.url = url;
        this.status = Resource.State.QUEUED;
    };
    Resource.prototype = {
        start:function(){
        }
    };
    
    Resource.Status = {
        QUEUED:0,
        LOADING:1,
        LOADED:2,
        ERROR:3
    };
    return Resource;
});