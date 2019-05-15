// --------------------------------------------------------------
//
// Creates a Laser object, with functions for managing state.
//
// spec = {
//      x:
//      y:
//      thrust: {x: , y:}
// }
//
// --------------------------------------------------------------
MyGame.objects.Laser = function(las) {
    'use strict';

    function setX(value){
        las.x = value;
    }
    function setY(value){
        las.y = value;
    }

    function update(elapsedTime){
        las.x += las.xVel / elapsedTime;
        las.y += las.yVel / elapsedTime;
    }
    

    let api = {
        setX: setX,
        setY: setY,
        update: update,
        get x() { return las.x; },
        get y() { return las.y; },
        get r() { return las.r; },
        get a() { return las.a; },
        get xVel() { return las.xVel; },
        get yVel() { return las.yVel; },
    };

    return api;
}
