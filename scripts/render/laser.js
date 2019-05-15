// --------------------------------------------------------------
//
// Renders a Laser
//
//
// --------------------------------------------------------------
MyGame.render.Laser = (function(graphics) {
    'use strict';

    function render(spec) {
        graphics.drawLaser(spec);
    }

    return {
        render: render
    };
}(MyGame.graphics));
