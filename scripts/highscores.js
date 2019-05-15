MyGame.screens['high-scores'] = (function(game) {
    'use strict';
    
    function initialize() {
        document.getElementById('id-high-scores-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });


        let first = localStorage.getItem('first');
        let second = localStorage.getItem('second');
        let third = localStorage.getItem('third');

        
            
            

        if(first == null){
            first = 0;
        }
        if(second == null){
            second = 0;
        }
        if(third == null){
            third = 0;
        }

        document.getElementById('first').innerHTML = first;
        document.getElementById('second').innerHTML = second;
        document.getElementById('third').innerHTML = third;
        
    }
    
    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
