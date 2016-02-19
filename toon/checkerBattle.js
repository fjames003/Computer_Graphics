/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas");
    window.SpriteLibrary = window.SpriteLibrary || { };
    // First, a selection of "drawing functions" from which we
    // can choose.  Their common trait: they all accept a single
    // renderingContext argument.
    var renderingContext = canvas.getContext("2d");
    renderingContext.save();
    renderingContext.scale(0.7, 0.7);
    var board = function (renderingContext) {
        SpriteLibrary.drawBoard({
          renderingContext: renderingContext, 
          border: 12,
          degradation: 0,
          waveFrequency: 0.03
        });

    };

    var blackPiece = function (renderingContext) {
        SpriteLibrary.drawPiece({
                renderingContext: renderingContext,
                color: "black",
                limbAngle: 120,
                facialExpression: -1,
                elbowAngle: 135
            });
    };

    var redPiece = function (renderingContext) {
        SpriteLibrary.drawPiece({
                renderingContext: renderingContext,
                color: "red",
                limbAngle: 95,
                facialExpression: 0,
                elbowAngle: -135
            });
    };

    // Then, we have "easing functions" that determine how
    // intermediate frames are computed.

    // Now, to actually define the animated sprites.  Each sprite
    // has a drawing function and an array of keyframes.
    var sprites = [
        {
            draw: board,
            keyframes: [
                {
                    frame: 0,
                    ease: KeyframeTweener.linear
                },

                {
                    frame: 200
                }
            ]
        },

        {
            draw: blackPiece,
            keyframes: [
                {
                    frame: 0,
                    // tx: SpriteLibrary.getTileLocations(1)[0],
                    // ty: SpriteLibrary.getTileLocations(1)[1],
                    tx: 73,
                    ty: 73,
                    sx: 0.45,
                    sy: 0.45,
                    ease: KeyframeTweener.quadEaseOut
                },

                {
                    frame: 100,
                    // tx: SpriteLibrary.getTileLocations(64)[0],
                    // ty: SpriteLibrary.getTileLocations(64)[1],
                    tx: 927,
                    ty: 927,
                    sx: 0.45,
                    sy: 0.45,
                    ease: KeyframeTweener.quadEaseOut
                },

                {
                    frame: 150,
                    // tx: SpriteLibrary.getTileLocations(32)[0],
                    // ty: SpriteLibrary.getTileLocations(32)[1],
                    tx: 927,
                    ty: 439,
                    sx: 0.45,
                    sy: 0.45
                }
            ]
        },

        {
            draw: redPiece,
            keyframes: [
                {
                    frame: 0,
                    // tx: SpriteLibrary.getTileLocations(57)[0],
                    // ty: SpriteLibrary.getTileLocations(57)[1],
                    tx: 73,
                    ty: 927,
                    sx: 0.45,
                    sy: 0.45,
                    ease: KeyframeTweener.quadEaseOut
                },

                {
                    frame: 125,
                    // tx: SpriteLibrary.getTileLocations(8)[0],
                    // ty: SpriteLibrary.getTileLocations(8)[1],
                    tx: 927,
                    ty: 73,
                    sx: 0.45,
                    sy: 0.45
                }
            ]
        }
    ];

    // Finally, we initialize the engine.  Mainly, it needs
    // to know the rendering context to use.  And the animations
    // to display, of course.
    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        width: canvas.width,
        height: canvas.height,
        sprites: sprites
    });
}());
