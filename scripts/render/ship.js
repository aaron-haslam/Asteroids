// --------------------------------------------------------------
//
// Renders a Ship
//
//
// --------------------------------------------------------------
MyGame.render.Ship = (function(graphics) {
    'use strict';

    function render(spec) {
        graphics.drawShip(spec);
    }

    return {
        render: render
    };
}(MyGame.graphics));
