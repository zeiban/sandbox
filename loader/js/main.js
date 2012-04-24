require(['loader'],function() {
    var loader = new Loader();
    console.log(loader);
    var mesh = loader.add('assets/meshes/mesh.json');
    loader.callback = function() {
        alert(mesh.size);
    };
    
    loader.start();   
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
    xhr.send(null);
});