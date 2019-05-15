MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    let shipImage = new Image();
    shipImage.src = 'assets/images/ship.png';

    let asteroidImage_Large = new Image();
    asteroidImage_Large.src = 'assets/images/asteroid_large.png';

    let asteroidImage_Medium = new Image();
    asteroidImage_Medium.src = 'assets/images/asteroid_medium.png';

    let asteroidImage_Small = new Image();
    asteroidImage_Small.src = 'assets/images/asteroid_small.png';


    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height);

        context.restore();
    }

    function drawShip(spec) {
        let center = {
            x: spec.x,
            y: spec.y
        }

        let rotation = spec.a - 89.58;

        let size = {
            width:  spec.r * 2,
            height: spec.r * 2
        };

        

        if(!spec.dead){

            

            if(spec.invulnerable){
                context.save();
                context.strokeStyle = 'red';
                context.globalAlpha = 0.7;

                context.save();

                context.translate(center.x, center.y);
                context.rotate(-rotation);
                context.translate(-center.x, -center.y);

                context.drawImage(
                    shipImage,
                    center.x - size.width / 2,
                    center.y - size.height / 2,
                    size.width, size.height);

                


                context.restore();
            

                let head = {
                    x: spec.x + 4/3 * spec.r * Math.cos(spec.a), 
                    y: spec.y - 4/3 * spec.r * Math.sin(spec.a)
                };
                let bottomLeft = {
                    x: spec.x - spec.r * (2/3 * Math.cos(spec.a) + Math.sin(spec.a)), 
                    y: spec.y + spec.r * (2/3 * Math.sin(spec.a) - Math.cos(spec.a))
                };
                let bottomRight = {
                    x: spec.x - spec.r * (2/3 * Math.cos(spec.a) - Math.sin(spec.a)), 
                    y: spec.y + spec.r * (2/3 * Math.sin(spec.a) + Math.cos(spec.a))
                };




                context.restore();
            }else{
                context.save();

                context.strokeStyle = 'white';
                context.globalAlpha = 1.0;


                context.translate(center.x, center.y);
                context.rotate(-rotation);
                context.translate(-center.x, -center.y);

                context.drawImage(
                    shipImage,
                    center.x - size.width / 2,
                    center.y - size.height / 2,
                    size.width, size.height);

                


                context.restore();
            

                let head = {
                    x: spec.x + 4/3 * spec.r * Math.cos(spec.a), 
                    y: spec.y - 4/3 * spec.r * Math.sin(spec.a)
                };
                let bottomLeft = {
                    x: spec.x - spec.r * (2/3 * Math.cos(spec.a) + Math.sin(spec.a)), 
                    y: spec.y + spec.r * (2/3 * Math.sin(spec.a) - Math.cos(spec.a))
                };
                let bottomRight = {
                    x: spec.x - spec.r * (2/3 * Math.cos(spec.a) - Math.sin(spec.a)), 
                    y: spec.y + spec.r * (2/3 * Math.sin(spec.a) + Math.cos(spec.a))
                };




                context.restore();
            }

            /*
            context.lineWidth = 2;
            context.beginPath();
            // head
            context.moveTo(
                head.x,
                head.y
            );
            // back left
            context.lineTo(
                bottomLeft.x,
                bottomLeft.y
            );
            // back right
            context.lineTo(
                bottomRight.x,
                bottomRight.y
            );
            context.closePath();
            context.stroke();
            */
        
            

            //
            // Draw Hitbox
            if(spec.showHitBox){
                context.strokeStyle = 'red';
                context.beginPath();
                context.arc(spec.x,spec.y, spec.hitRadius, 0, Math.PI * 2, false);
                context.stroke()
            }

            //
            // Draw Lasers
            if(spec.lasers.length > 0){
                for(let i = 0; i < spec.lasers.length; i++){
                    context.strokeStyle = 'red';
                    context.lineWidth = '2';
                    context.beginPath();
                    context.arc(spec.lasers[i].x,spec.lasers[i].y, spec.hitRadius / 15, 0, Math.PI * 2, false);
                    context.fill
                    context.stroke()
                }
                
            }

        } 
    }

    function drawAsteroid(asteroidBelt) {
        
        for(let i = 0; i < asteroidBelt.length; i++){
            let image = asteroidImage_Medium;

            let center = {
                x: asteroidBelt[i].x,
                y: asteroidBelt[i].y
            }
    
            let rotation = asteroidBelt[i].a;
    
            let size = {
                width:  asteroidBelt[i].r * 3,
                height: asteroidBelt[i].r * 3
            };
            
            context.save();
    
            context.translate(center.x, center.y);
            context.rotate(rotation);
            context.translate(-center.x, -center.y);
    
            context.drawImage(
                image,
                center.x - size.width / 2,
                center.y - size.height / 2,
                size.width, size.height);
    
            context.restore();
        }

        
        // context.strokeStyle = 'red';
        // context.lineWidth = '2';

        // for(let i = 0; i < asteroidBelt.length; i++){
        //     context.beginPath();
        //     context.arc(asteroidBelt[i].x, asteroidBelt[i].y, asteroidBelt[i].r, 0, 2 * Math.PI);
        //     context.stroke();
        // }
        

    }

    function drawText(txt){

        //
        // Level Text        
        
        let Level_text = "Level: "+ (txt.level+1);
        let Level_textSize = 25;

        context.save();
        context.fillStyle = 'white';
        context.textAlign = "start";
        context.font = "small-caps "+ Level_textSize+"px Arial";
        context.fillText(Level_text, txt.level_Position.x, txt.level_Position.y + 20);
        context.restore();

        //
        // Lives Text  
        let Lives_text = "Lives: "+ (txt.lives);
        let Lives_textSize = 25;

        context.save();
        context.fillStyle = 'white';
        context.textAlign = "start";
        if(txt.lives >= 0){
            context.font = "small-caps "+ Lives_textSize+"px Arial";
            context.fillText(Lives_text, txt.lives_Position.x, txt.lives_Position.y-2);
        }else{
            context.font = "small-caps "+ Lives_textSize+"px Arial";
            context.fillText("Lives: ", txt.lives_Position.x, txt.lives_Position.y-2);
        }
        context.restore();

        //
        // Level Text        
        let Level_score = txt.score;
        let Level_scoreSize = 25;

        context.save();
        context.textAlign = "right";
        context.fillStyle = 'white';
        context.font = "small-caps "+ Level_scoreSize + "px Arial";
        context.fillText(Level_score, txt.score_Position.x, txt.score_Position.y + 20);
        context.restore();


        

        //
        // GameOver Text 
        if(txt.gameOver == true){

            let gameOver_text = "Game Over";
            let gameOver_text_Escape = "press ESC to return to menu";
            let gameOver_text_score = txt.score;
            let gameOver_textSize = 50;

            context.save();
            context.fillStyle = 'white';
            context.textAlign = "center";
            context.font = "small-caps "+ gameOver_textSize+"px Arial";
            context.fillText(gameOver_text, txt.gameOver_Position.x, txt.gameOver_Position.y - 50);

            context.font = "small-caps "+ gameOver_textSize+"px Arial";
            context.fillText(gameOver_text_score, txt.gameOver_Position.x, txt.gameOver_Position.y);

            context.font = "small-caps "+ (gameOver_textSize / 3)+"px Arial";
            context.fillText(gameOver_text_Escape, txt.gameOver_Position.x, txt.gameOver_Position.y + 50);
            context.restore();
        }

        //
        // Warp Ready Text 
        if(txt.warpReady){
            context.save();
            context.fillStyle = 'red';
            context.textAlign = "right";
            context.font = "small-caps 25px Arial";
            context.fillText("Warp Ready!!", txt.score_Position.x + 2, txt.lives_Position.y);
            context.restore();
        }else{

        }


    }

    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawTexture: drawTexture,
        drawText: drawText,
        drawShip: drawShip,
        drawAsteroid: drawAsteroid,
    };

    return api;
}());
