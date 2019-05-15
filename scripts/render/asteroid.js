// --------------------------------------------------------------
//
// Renders an Asteroid
//
//
// --------------------------------------------------------------
MyGame.render.Asteroid = (function(graphics) {
    'use strict';

    function render(spec) {
        graphics.drawAsteroid(spec);
    }

    return {
        render: render
    };
}(MyGame.graphics));
