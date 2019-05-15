// --------------------------------------------------------------
//
// Creates a Logo object, with functions for managing state.
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
MyGame.objects.Ship = function(ship) {
    'use strict';

    let fxLaser = new Sound("./assets/sounds/laser.wav");
    let fxWarp = new Sound("./assets/sounds/warp.wav", 1, 0.05);
    let fxThrust = new Sound("./assets/sounds/thrust.mp3", 1, 0.1);
    
    function Sound(src, maxStreams = 10, vol = 0.5){
        this.streamNum = 0;
        this.streams = [];
        for(var i = 0; i < maxStreams; i++){
            this.streams.push(new Audio(src));
            this.streams[i].volume = vol;
        }

        this.play = function(){
            this.streamNum = (this.streamNum + 1) % maxStreams;
            this.streams[this.streamNum].play();
        }

        this.stop = function(){
            this.streams[this.streamNum].pause();
            this.streams[this.streamNum].currentWarpTime = 0;
        }
    }

    function setX(value){
        ship.x = value;
    }

    function setY(value){
        ship.y = value;
    }

    function toggleInvulnerability(){
        ship.invulnerable = !ship.invulnerable;
    }
    
    function rotateLeft(elapsedTime){
        ship.rot =  ship.rotSpeed / 180 * Math.PI / elapsedTime;
        rotateShip();
    };

    function rotateRight(elapsedTime){
        ship.rot = - ship.rotSpeed / 180 * Math.PI / elapsedTime;
        rotateShip();
    };

    function thrustShip(elapsedTime){

        fxThrust.play();
        
        ship.thrust.x += ship.acceleration * Math.cos(ship.a) / elapsedTime;
        ship.thrust.y -= ship.acceleration * Math.sin(ship.a) / elapsedTime;

    };

    function rotateShip(){
        ship.a += ship.rot;
    };

    function toggleHitBox(){
        ship.showHitBox = !ship.showHitBox;
    }
    function toggleInvulnerability(){
        ship.invulnerable = !ship.invulnerable;
    }

    function fire(elapsedTime){
        ship.fireRate -= elapsedTime;

        if(ship.fireRate <= 0){
            ship.lasers.push(
                {
                    x: ship.x + 4/3 * ship.r * Math.cos(ship.a), 
                    y: ship.y - 4/3 * ship.r * Math.sin(ship.a),
                    xVel:  (ship.laserSpeed) * Math.cos(ship.a) / elapsedTime,
                    yVel: -(ship.laserSpeed) * Math.sin(ship.a) / elapsedTime,
                    life: 1.0,
                }
            );
            fxLaser.play();

            ship.fireRate = 100;
        }
        
    }

    function handleStartInvulnerability(elapsedTime){

        ship.invulnerableDuration -= elapsedTime;

        if(ship.invulnerableDuration <= 0){
            ship.invulnerable = false;
        }
    }

    

    function updateLasers(elapsedTime){
        if(ship.lasers.length > 0){
            //
            // Check life of laser
            for(let i = ship.lasers.length - 1; i >= 0; i--){
                if(ship.lasers[i].life <= 0){
                    ship.lasers.splice(i,1);
                }else{
                    ship.lasers[i].life -= elapsedTime / 1000;
                }
            }

            //
            // Move Laser
            for(let i = 0; i < ship.lasers.length; i++){
                ship.lasers[i].x += ship.lasers[i].xVel / elapsedTime;
                ship.lasers[i].y += ship.lasers[i].yVel / elapsedTime;
            }
        }        
    }

    function updateShip(elapsedTime){
        //
        // Starting Invulnerability
        if(ship.invulnerable){
            handleStartInvulnerability(elapsedTime);
        }
        //
        // Move Ship
        ship.x += ship.thrust.x;
        ship.y += ship.thrust.y;
        //
        // Move Lasers
        updateLasers(elapsedTime);
        //
        // Update Warp Time
        updateWarpTime(elapsedTime);
    };

    function reset(x, y){
        ship.x = x;
        ship.y = y;
        ship.thrust = {x: 0, y: 0};
        ship.a = 90/180*Math.PI;
        ship.rot = 0;
        ship.invulnerable = true;
        ship.invulnerableDuration = 2000;
        ship.lasers = [];
    }
    function setDead(value){
        ship.dead = value;
    }

    function warp(){
        fxWarp.play();
        ship.warpReady = false;
    }

    function updateWarpTime(elapsedTime){
        if(!ship.warpReady){
            if(ship.currentWarpTime >= 0){
                ship.currentWarpTime -= elapsedTime / 1000;
            }else{
                ship.warpReady = true;
                ship.currentWarpTime = ship.warpTime;
            }
        }
    }

    let api = {
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        thrustShip: thrustShip,
        updateShip: updateShip,
        fire: fire,
        reset: reset,
        setX: setX,
        setY: setY,
        toggleHitBox: toggleHitBox,
        toggleInvulnerability: toggleInvulnerability,
        setDead: setDead,
        warp: warp,
        updateWarpTime: updateWarpTime,
        
        get x() { return ship.x; },
        get y() { return ship.y; },
        get r() { return ship.r; },
        get a() { return ship.a; },
        get rot() { return ship.rot; },
        get rotSpeed() { return ship.rotSpeed; },
        get thrusting() { return ship.thrusting; },
        get thrust() { return ship.thrust; },
        get acceleration() { return ship.acceleration; },
        get showHitBox() { return ship.showHitBox; },
        get hitRadius() { return ship.hitRadius; },
        get invulnerable() { return ship.invulnerable; },
        get invulnerableDuration() { return ship.invulnerableDuration; },
        get lasers() { return ship.lasers; },
        get dead() { return ship.dead; },
        get warpReady() { return ship.warpReady; },
        get warpTime() { return ship.warpTime; },
    };

    return api;
}
