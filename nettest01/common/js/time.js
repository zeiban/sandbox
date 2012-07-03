define(function(){
    var Time = {};
    var lastTime = 0.0;
    var startTime = 0.0;

    Time.deltaTime = 0.0;
    Time.elapsedTime = 0.0;
    
    Time.update = function(){
        var currentTime = new Date().getTime();
        if(startTime === 0) {
            startTime = currentTime;
        }
        Time.elapsedTime = (currentTime - startTime) / 1000.0;

        if (lastTime !== 0) {
            Time.deltaTime = (currentTime - lastTime) / 1000.0;
    
        }
        lastTime = currentTime;
    };
    return Time;
    
});