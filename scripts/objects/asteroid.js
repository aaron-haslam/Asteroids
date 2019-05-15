// --------------------------------------------------------------
//
// Creates an Asteroid object, with functions for managing state.
//
// spec = {
//      x:
//      y:
//      r:
//      a:
//      rot:
//      rotSpeed:
//      thrusting:
//      thrust: {x: , y:}
//      acceleration:
// }
//
// --------------------------------------------------------------
MyGame.objects.Asteroid = function(ast) {
    'use strict';

    function setX(value){
        ast.x = value;
    }
    function setY(value){
        ast.y = value;
    }

    function update(elapsedTime){
        ast.x += ast.xVel / elapsedTime;
        ast.y += ast.yVel / elapsedTime;

        ast.a += ast.speed / 50 /elapsedTime;
    }
    

    let api = {
        setX: setX,
        setY: setY,
        update: update,
        get x() { return ast.x; },
        get y() { return ast.y; },
        get r() { return ast.r; },
        get a() { return ast.a; },
        get speed() { return ast.speed; },
        get xVel() { return ast.xVel; },
        get yVel() { return ast.yVel; },
    };

    return api;
}
