require(['Transform'],function(Transform) {
        
    var p = new Transform();
    p.position.set(2,2,2);
    
    var c = new Transform();
    c.position.set(2,2,2);
    
    p.addChild(c);

    p.update();
    
    console.log(p);
    var te = c.worldMatrix.elements;
    console.log(te[0] + ' ' + te[4] + ' ' + te[8] + ' ' + te[12]);
    console.log(te[1] + ' ' + te[5] + ' ' + te[9] + ' ' + te[13]);
    console.log(te[2] + ' ' + te[6] + ' ' + te[10] + ' ' + te[14]);
    console.log(te[3] + ' ' + te[7] + ' ' + te[11] + ' ' + te[15]);
});