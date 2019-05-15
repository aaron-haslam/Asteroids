// --------------------------------------------------------------
//
// Creates a Text object, with functions for managing state.
//
// spec = {
//    text: ,
//    font: ,
//    fillStyle: ,
//    strokeStyle: ,
//    position: { x: , y: }
// }
//
// --------------------------------------------------------------
MyGame.objects.Text = function(text) {
    'use strict';

    function setLevel(value){
        text.level = value;
    }
    function setLives(value){
        text.lives = value;
    }
    function setGameOver(value){
        text.gameOver = value;
    }
    function setScore(value){
        text.score = value;
    }
    function setWarpReady(value){
        text.warpReady = value;
    }
    

    let api = {
        setLevel: setLevel,
        setLives: setLives,
        setGameOver: setGameOver,
        setScore: setScore,
        setWarpReady: setWarpReady,

        get level() { return text.level; },
        get level_Position() { return text.level_Position; },
        get lives() { return text.lives; },
        get lives_Position() { return text.lives_Position; },
        get gameOver() { return text.gameOver; },
        get gameOver_Position() { return text.gameOver_Position; },
        get score() { return text.score; },
        get score_Position() { return text.score_Position; },
        get warpReady() { return text.warpReady; },
    };

    return api;
}
