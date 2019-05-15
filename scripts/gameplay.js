MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let myKeyboard = input.Keyboard();

    let FirstPlaceKey = 'first';
    let SecondPlaceKey = 'second';
    let ThirdPlaceKey = 'third';

    
    let fxExplode = new Sound("./assets/sounds/explosion.wav", 1, 0.2);
    
    
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
    }

    let fxBackground = new Sound("./assets/sounds/background.mp3", 1 , 0.1);



    //////////////////////
    //
    // Game Level
    //
    //////////////////////

    // Level
    var Game_level;
    let Game_TotalLives = 3;
    let Game_currentLives = Game_TotalLives;

    // Scoring
    let Score_asteroid_large  = 20;
    let Score_asteroid_medium = 50;
    let Score_asteroid_small  = 100;

    let Score_currentScore = 0;

    function newGame(){
        

        Game_level = 0;
        Game_currentLives = Game_TotalLives;
        ship.reset(graphics.canvas.width / 2, graphics.canvas.height / 2);
        createAsteroidBelt();

        text.setLevel(Game_level);
        text.setLives(Game_currentLives);
        text.setGameOver(false);
        ship.setDead(false);

        Score_currentScore = 0;
        text.setScore(Score_currentScore);
    }
    function newLevel(){
        createAsteroidBelt();
        text.setLevel(Game_level);
        ship.reset(graphics.canvas.width / 2, graphics.canvas.height / 2);
    }

    function gameOver(){
        text.setGameOver(true);
        ship.setDead(true);

        let first = JSON.parse(localStorage.getItem(FirstPlaceKey));
        let second = JSON.parse(localStorage.getItem(SecondPlaceKey));
        let third = JSON.parse(localStorage.getItem(ThirdPlaceKey));

        if(first == null){
            first = 0;
        }
        if(second == null){
            second = 0;
        }
        if(third == null){
            third = 0;
        }

        if(text.score > first){
            localStorage.setItem(FirstPlaceKey, text.score);
            localStorage.setItem(SecondPlaceKey, first);
            localStorage.setItem(ThirdPlaceKey, second);
        }

        else if(text.score > second){
            localStorage.setItem(SecondPlaceKey, text.score);
            localStorage.setItem(ThirdPlaceKey, second);
        }

        else if(text.score > third){
            localStorage.setItem(ThirdPlaceKey, text.score);
        }

        MyGame.screens['high-scores'].initialize();
        
        
    }

    let text = objects.Text({
        level: Game_level,
        level_Position: {x:0, y:0},
        lives: Game_currentLives,
        lives_Position: {x:0, y:graphics.canvas.height},
        gameOver: false,
        gameOver_Position: {x:graphics.canvas.width / 2, y:graphics.canvas.height / 2},
        score: Score_currentScore,
        score_Position: {x:graphics.canvas.width, y:0},
        warpReady: false,
    });

    

    //////////////////////
    //
    // Ship
    //
    //////////////////////

    let ship = objects.Ship({
        x: graphics.canvas.width / 2,
        y: graphics.canvas.height / 2,
        r: 10,
        a: 90 / 180 * Math.PI,
        rot: 0,
        rotSpeed: 100,
        thrusting: false,
        thrust: {
            x: 0,
            y: 0
        },
        acceleration: 2,
        showHitBox: false,
        hitRadius: 8,
        invulnerable: true,
        invulnerableDuration: 2000,
        fireRate: 0,
        laserSpeed: 2000,
        lasers: [],
        dead: false,
        warpReady: false,
        warpTime: 5,
        currentWarpTime: 5,
    });

    function warpShip(){
        if(ship.warpReady){
            ship.warp();

            var x,y;

            do {
                x = Math.floor(Math.random() * graphics.canvas.width);
                y = Math.floor(Math.random() * graphics.canvas.height);
            } while ( findSafeSpot(x,y) );
            
            ship.reset(x,y);
        

            
        }
        
        
    }

    function findSafeSpot(x, y){
        for(let i = 0; i< asteroidBelt.length; i++){
            if(distBetweenPoints(asteroidBelt[i].x, asteroidBelt[i].y, x, y) < asteroidBelt[i].r * 2 + ship.r){
                return true;
            }
        }
        return false;
    }


    //////////////////////
    //
    // Asteroid Belt
    //
    //////////////////////

    let Asteroids_num = 1;
    let Asteroids_speed = 10;
    let Asteroids_size = 100;
    let asteroidBelt = [];

    function createAsteroidBelt(){
        asteroidBelt = [];

        var x, y;

        for (let i = 0; i < Asteroids_num + Game_level; i++){
            do {
                x = Math.floor(Math.random() * graphics.canvas.width);
                y = Math.floor(Math.random() * graphics.canvas.height);
            } while (distBetweenPoints(ship.x, ship.y, x, y) < Asteroids_size * 2 + ship.r);
            

            asteroidBelt.push(newAsteroid(x, y, Math.ceil(Asteroids_size / 2), Asteroids_speed));
        }
    }

    function updateAsteroidBelt(elapsedTime){
        for(let i = 0; i < asteroidBelt.length; i++){
            asteroidBelt[i].update(elapsedTime);
        }
    }

    function newAsteroid(x, y, r, speed){
        let lvlMultiplier = 1 + 0.1 * Game_level;

        let asteroid = objects.Asteroid({
            x: x,
            y: y,
            r: r,
            speed: speed,
            a: Math.random() * Math.PI * 2,
            xVel: Math.random() * speed * lvlMultiplier * (Math.random() < 0.5 ? 1 : -1),
            yVel: Math.random() * speed * lvlMultiplier * (Math.random() < 0.5 ? 1 : -1),
        });

        return asteroid;
    }

    function destroyAsteroid(index){
        var x = asteroidBelt[index].x;
        var y = asteroidBelt[index].y;
        var r = asteroidBelt[index].r;
        var s = asteroidBelt[index].speed;

        //
        //Split asteroid if original size
        if(r == Math.ceil(Asteroids_size / 2)){
            asteroidBelt.push(newAsteroid(x, y, r/2, s*1.5));
            asteroidBelt.push(newAsteroid(x, y, r/2, s*1.5));
            asteroidBelt.push(newAsteroid(x, y, r/2, s*1.5));

            //
            // Update Score
            Score_currentScore += (Score_asteroid_large * (Game_level + 1) * Game_currentLives);
            text.setScore(Score_currentScore);
        }

        //
        //Split asteroid if medium size
        else if(r == Math.ceil(Asteroids_size / 4)){
            asteroidBelt.push(newAsteroid(x, y, r/2, s*1.5));
            asteroidBelt.push(newAsteroid(x, y, r/2, s*1.5));
            asteroidBelt.push(newAsteroid(x, y, r/2, s*1.5));
            asteroidBelt.push(newAsteroid(x, y, r/2, s*1.5));
            //
            // Update Score
            Score_currentScore += (Score_asteroid_medium * (Game_level + 1) * Game_currentLives);
            text.setScore(Score_currentScore);
        }

        else{
            //
            // Update Score
            Score_currentScore += (Score_asteroid_small * (Game_level + 1) * Game_currentLives);
            text.setScore(Score_currentScore);
        }

        //
        // Remove hit asteroid
        asteroidBelt.splice(index, 1);

        //
        // Check asteroid belt is empty
        if(asteroidBelt.length == 0){
            Game_level++;
            newLevel();
        }
    }

    function distBetweenPoints(x1, y1, x2, y2){
        return Math.sqrt(Math.pow(x2-x1, 2)+ Math.pow(y2-y1,2));
    }

    //////////////////////
    //
    // Edge Handling
    //
    //////////////////////

    function handleEdgeOfScreen(object){
        // x
        if(object.x < 0 - object.r){
            object.setX(graphics.canvas.width + object.r);
        }
        else if(object.x > graphics.canvas.width + object.r){
            object.setX(0 - object.r);
        }

        // y
        if(object.y < 0 - object.r){
            object.setY(graphics.canvas.height + object.r);
        }
        else if(object.y > graphics.canvas.height + object.r){
            object.setY(0 - object.r);
        }
    }

    function checkEdge(){
        //
        // Check ship
        handleEdgeOfScreen(ship);
        //
        // Check All Asteroids
        for(let i = 0; i < asteroidBelt.length; i++){
            handleEdgeOfScreen(asteroidBelt[i]);
        }
        //
        // Check All lasers
        for(let i = 0; i < ship.lasers.length; i++){
             // x
            if(ship.lasers[i].x < 0){
                ship.lasers[i].x = graphics.canvas.width;
            }
            else if(ship.lasers[i].x > graphics.canvas.width){
                ship.lasers[i].x = 0;
            }

            // y
            if(ship.lasers[i].y < 0){
                ship.lasers[i].y = graphics.canvas.width;
            }
            else if(ship.lasers[i].y > graphics.canvas.width){
                ship.lasers[i].y = 0;
            }
        }
    }

    //////////////////////
    //
    // Colision Handling
    //
    //////////////////////

    function checkForCollisions(){
       
        //
        // Check Asteroids if hit by Ship or Lasers
        for(let i = asteroidBelt.length - 1; i >= 0; i--){
            //
            // Ship
            if(distBetweenPoints(ship.x, ship.y, asteroidBelt[i].x, asteroidBelt[i].y) < ship.hitRadius + asteroidBelt[i].r){
                if(!ship.invulnerable && !ship.dead){
                    fxExplode.play();
                    //
                    // If ship hits asteroid reset ship
                    let lastLife = destroyShip();
                    if(lastLife){
                        break;
                    }

                    //
                    // If ship hits asteroid break asteroid
                    destroyAsteroid(i);

                    //
                    //Make sure it doesn't break two asteroids
                    break;
                }
            }

            

            //
            // Missles
            for(let j = ship.lasers.length - 1; j >= 0; j--){
                if(ship.lasers[j] && asteroidBelt[i] && !ship.dead){
                    if(distBetweenPoints(ship.lasers[j].x, ship.lasers[j].y, asteroidBelt[i].x, asteroidBelt[i].y) < asteroidBelt[i].r){
                        fxExplode.play();
                        //
                        //Remove laser if hit asteroid
                        ship.lasers.splice(j,1);

                        //
                        //If asteroid is hit
                        destroyAsteroid(i);

                        //
                        //Make sure it doesn't break two asteroids
                        break;
                    }
                }
            }
            
        }
    }

    function destroyShip(){
        //
        //Reduce Life
        Game_currentLives--;
        text.setLives(Game_currentLives);

        //
        // Check if Game over
        if(Game_currentLives < 0){
            gameOver();
            ship.reset(graphics.canvas.width / 2, graphics.canvas.height / 2);
            return true;
        }

        //
        // Move ship to center
        ship.reset(graphics.canvas.width / 2, graphics.canvas.height / 2);

        return false;
    }

    //////////////////////
    //
    // Input Handling
    //
    //////////////////////

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    


    //////////////////////
    //
    // Game Loop
    //
    //////////////////////
    function update(elapsedTime) {
        ship.updateShip(elapsedTime);
        updateAsteroidBelt(elapsedTime);
        checkEdge();
        checkForCollisions();

        text.setWarpReady(ship.warpReady);
    }

    function render(elapsedTime) {
        graphics.clear();
        
        renderer.Ship.render(ship);
        renderer.Asteroid.render(asteroidBelt);
        renderer.Text.render(text);
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render(elapsedTime);

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        createAsteroidBelt();
        newGame();

        
       
        

        //
        // Bind keys
        myKeyboard.register('w', ship.thrustShip);
        myKeyboard.register('W', ship.thrustShip);
        myKeyboard.register('ArrowUp', ship.thrustShip);

        myKeyboard.register('a', ship.rotateLeft);
        myKeyboard.register('A', ship.rotateLeft);
        myKeyboard.register('ArrowLeft', ship.rotateLeft);

        myKeyboard.register('d', ship.rotateRight);
        myKeyboard.register('D', ship.rotateRight);
        myKeyboard.register('ArrowRight', ship.rotateRight);

        myKeyboard.register('z', warpShip);
        myKeyboard.register('Z', warpShip);

        myKeyboard.register('h', ship.toggleHitBox);

        myKeyboard.register(' ', ship.fire);

        myKeyboard.register('Escape', function() {
            //
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            //
            //Reset everything
            resetEverything();
            
            //
            // Then, return to the main menu
            game.showScreen('main-menu');
        });

        let canvas = document.getElementById('id-canvas');
    }

    function resetEverything(){
        newGame();
    }

    function run() {
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input));
