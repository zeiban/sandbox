define(['Resource'],function(Resource){
    var JSONResource = function(loader, url){
        this.loader = loader;
        this.url = url;
        this.obj = null;
        
    };
    console.log(Resource.State);

//    JSONResource.prototype = new Resource();

    JSONResource.prototype.start = function(){
        var xhr = new XMLHttpRequest();
        var loader = this.loader;
        var self = this;
        xhr.open('GET', this.url,true);
        xhr.onreadystatechange = function(event){
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    self.obj = JSON.parse(xhr.responseText);
                    self.status = Resource.Status.LOADED;
                    loader.onStatus(self);
                } else {
                    self.status = Resource.Status.ERROR;
                    loader.onStatus(self);
                }
            }  
        };
        self.status = Resource.Status.LOADING;
        loader.onStatus(self);
        xhr.send(null);
    }
    return JSONResource;
});
