require(['loader'],function() {
    var JSONLoader = function(loader, url){
        this.loader = loader;
        this.url = url;
        this.xhr = null;

    }
    JSONLoader.prototype = {
        start:function(){
            var xhr;
            xhr.open('GET', this.url,true);
            xhr.onreadystatechange = function(event){
                console.log(event);
                if(xhr.readyState === 4) {
                    if(xhr.status === 200) {
                        var json = JSON.parse(xhr.responseText);
                        loader.onLoad(self);
//                        console.log(json.size);
                        
                    } else {
 //                       console.log("Error", xhr.statusText);
                        loader.onError(this.self);
                    }
                }  
            };
            xhr.send(null);
        }
    }
}