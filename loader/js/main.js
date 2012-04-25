require(['loader'],function() {
    var loader = new Loader();
    console.log(loader);
//    var mesh = loader.add('assets/meshes/mesh.json');
    for(var i=0; i<1; i++) {
        loader.add('assets/models/model.json');
    }
    var completed = 0;
    loader.addProgressListener(function(res, obj){
            console.log("progress " + (++completed));
//            console.log(text);
            if(obj.type === "model") {
            console.log(obj);
                loader.add(obj.data.mesh);
                loader.add(obj.data.material);
            } else {
            }
        });   
    loader.addCompleteListener(function(){
            console.log("completed");
        });   
    loader.start(); 
    /*
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/meshes/mesh.json',true);
    xhr.onreadystatechange = function(event){
        console.log(event);
        if(xhr.readyState === 4) {
            if(xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                console.log(json.size);
                
            } else {
                console.log("Error", xhr.statusText);
            }
        }  
    };
    xhr.send(null);*/
});