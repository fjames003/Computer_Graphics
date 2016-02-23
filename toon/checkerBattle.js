/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {

    var getTileLocations = function(tileNumber) {
        var tileSize = 122;
            var tileXLocation = (tileNumber % 8) ? (tileNumber % 8) - 1 : 7;
            var tileYLocation = Math.ceil(tileNumber / 8) - 1;
            var tileOne = (12 + tileSize / 2);
            return [tileOne + (tileSize * tileXLocation), tileOne + (tileSize * tileYLocation)];
    };

    var canvas = document.getElementById("canvas");
    window.SpriteLibrary = window.SpriteLibrary || { };
    // First, a selection of "drawing functions" from which we
    // can choose.  Their common trait: they all accept a single
    // renderingContext argument.
    var renderingContext = canvas.getContext("2d");
    var smallestScreenLength = (window.innerWidth < window.innerHeight) ? window.innerWidth: window.innerHeight;
    console.log(smallestScreenLength);
    renderingContext.save();
    renderingContext.scale(smallestScreenLength / 1000, smallestScreenLength / 1000);

    var board = function(specs) {
        SpriteLibrary.drawBoard({
            renderingContext: specs.renderingContext,
            border: specs.border,
            degradation: specs.degradation,
            waveFrequency: specs.waveFrequency
        }); 
    };

    var sprites = [
    // The CheckerBoard...
        {
        draw: board,
        keyframes: [
            {
                frame: 0,
                ease: KeyframeTweener.linear,
                parameters: {
                    waveFrequency: 0.03,
                    degradation: 0.000001
                }
            },

            {
                frame: 1000,
                parameters: {
                    waveFrequency: 0.1,
                    degradation: 100 
                }
                
            }
        ]
        }
    // // Black Piece 1
    //     {
    //         limbAngleDefault: 90,
    //         facialExpressionDefault: 1,
    //         elbowAngleDefault: 90,
    //         draw: function (renderingContext) {
    //             renderingContext.save();
    //             renderingContext.scale(0.48, 0.48);
    //             SpriteLibrary.drawPiece({
    //                 renderingContext: renderingContext,
    //                 color: "black",
    //                 limbAngle: this.limbAngleDefault,
    //                 facialExpression: this.facialExpressionDefault,
    //                 elbowAngle: this.elbowAngleDefault
    //             })
    //             renderingContext.restore();
    //         },
    //         parameterize: function(ease, startKeyFrame, endKeyframe, currentTweenFrame, duration) {
    //             this.limbAngleDefault = parameterUpdate(this.limbAngleDefault, "limbAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.elbowAngleDefault = parameterUpdate(this.elbowAngleDefault, "elbowAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.facialExpressionDefault = parameterUpdate(this.facialExpressionDefault, "facialExpression", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);
    //         },
    //         keyframes: [
    //             {
    //                 frame: 0,
    //                 tx: getTileLocations(2)[0],
    //                 ty: getTileLocations(2)[1],
    //                 limbAngle: 120,
    //                 elbowAngle: 90,
    //                 facialExpression: 1,
    //                 ease: KeyframeTweener.quadEaseOut
    //             },

    //             {
    //                 frame: 125,
    //                 tx: getTileLocations(11)[0],
    //                 ty: getTileLocations(11)[1],
    //                 limbAngle: 190,
    //                 elbowAngle: 360,
    //                 ease: KeyframeTweener.quadEaseOut
    //             }
    //         ]
    //     },
    // // Black Piece 2
    //     {
    //         limbAngleDefault: 90,
    //         facialExpressionDefault: 1,
    //         elbowAngleDefault: 90,
    //         draw: function (renderingContext) {
    //             renderingContext.save();
    //             renderingContext.scale(0.48, 0.48);
    //             SpriteLibrary.drawPiece({
    //                 renderingContext: renderingContext,
    //                 color: "black",
    //                 limbAngle: this.limbAngleDefault,
    //                 facialExpression: this.facialExpressionDefault,
    //                 elbowAngle: this.elbowAngleDefault
    //             })
    //             renderingContext.restore();
    //         },
    //         parameterize: function(ease, startKeyFrame, endKeyframe, currentTweenFrame, duration) {
    //             this.limbAngleDefault = parameterUpdate(this.limbAngleDefault, "limbAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.elbowAngleDefault = parameterUpdate(this.elbowAngleDefault, "elbowAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.facialExpressionDefault = parameterUpdate(this.facialExpressionDefault, "facialExpression", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);
    //         },
    //         keyframes: [
    //             {
    //                 frame: 0,
    //                 tx: getTileLocations(4)[0],
    //                 ty: getTileLocations(4)[1],
    //                 limbAngle: 120,
    //                 elbowAngle: 90,
    //                 facialExpression: 1,
    //                 ease: KeyframeTweener.quadEaseOut
    //             },

    //             {
    //                 frame: 101,
    //                 tx: getTileLocations(12)[0],
    //                 ty: getTileLocations(12)[1],
    //                 limbAngle: 190,
    //                 elbowAngle: 360,
    //                 ease: KeyframeTweener.quadEaseOut
    //             }
    //         ]
    //     },
    // // Black Piece 3
    //     {
    //         limbAngleDefault: 90,
    //         facialExpressionDefault: 1,
    //         elbowAngleDefault: 90,
    //         draw: function (renderingContext) {
    //             renderingContext.save();
    //             renderingContext.scale(0.48, 0.48);
    //             SpriteLibrary.drawPiece({
    //                 renderingContext: renderingContext,
    //                 color: "black",
    //                 limbAngle: this.limbAngleDefault,
    //                 facialExpression: this.facialExpressionDefault,
    //                 elbowAngle: this.elbowAngleDefault
    //             })
    //             renderingContext.restore();
    //         },
    //         parameterize: function(ease, startKeyFrame, endKeyframe, currentTweenFrame, duration) {
    //             this.limbAngleDefault = parameterUpdate(this.limbAngleDefault, "limbAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.elbowAngleDefault = parameterUpdate(this.elbowAngleDefault, "elbowAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.facialExpressionDefault = parameterUpdate(this.facialExpressionDefault, "facialExpression", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);
    //         },
    //         keyframes: [
    //             {
    //                 frame: 0,
    //                 tx: getTileLocations(6)[0],
    //                 ty: getTileLocations(6)[1],
    //                 limbAngle: 120,
    //                 elbowAngle: 90,
    //                 facialExpression: 1,
    //                 ease: KeyframeTweener.quadEaseOut
    //             },

    //             {
    //                 frame: 101,
    //                 tx: getTileLocations(14)[0],
    //                 ty: getTileLocations(14)[1],
    //                 limbAngle: 190,
    //                 elbowAngle: 360,
    //                 ease: KeyframeTweener.quadEaseOut
    //             },

    //         ]
    //     },
    // // Black Piece 4
    //     {
    //         limbAngleDefault: 90,
    //         facialExpressionDefault: 1,
    //         elbowAngleDefault: 90,
    //         draw: function (renderingContext) {
    //             renderingContext.save();
    //             renderingContext.scale(0.48, 0.48);
    //             SpriteLibrary.drawPiece({
    //                 renderingContext: renderingContext,
    //                 color: "black",
    //                 limbAngle: this.limbAngleDefault,
    //                 facialExpression: this.facialExpressionDefault,
    //                 elbowAngle: this.elbowAngleDefault
    //             })
    //             renderingContext.restore();
    //         },
    //         parameterize: function(ease, startKeyFrame, endKeyframe, currentTweenFrame, duration) {
    //             this.limbAngleDefault = parameterUpdate(this.limbAngleDefault, "limbAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.elbowAngleDefault = parameterUpdate(this.elbowAngleDefault, "elbowAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.facialExpressionDefault = parameterUpdate(this.facialExpressionDefault, "facialExpression", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);
    //         },
    //         keyframes: [
    //             {
    //                 frame: 0,
    //                 tx: getTileLocations(8)[0],
    //                 ty: getTileLocations(8)[1],
    //                 limbAngle: 120,
    //                 elbowAngle: 90,
    //                 facialExpression: 1,
    //                 ease: KeyframeTweener.quadEaseOut
    //             },

    //             {
    //                 frame: 125,
    //                 tx: getTileLocations(15)[0],
    //                 ty: getTileLocations(15)[1],
    //                 limbAngle: 190,
    //                 elbowAngle: 360,
    //                 ease: KeyframeTweener.quadEaseOut
    //             }
    //         ]
    //     },
    // // Red Piece 1
    //     {
    //         limbAngleDefault: 90,
    //         facialExpressionDefault: 1,
    //         elbowAngleDefault: 90,
    //         draw: function (renderingContext) {
    //             renderingContext.save();
    //             renderingContext.scale(0.48, 0.48);
    //             SpriteLibrary.drawPiece({
    //                 renderingContext: renderingContext,
    //                 color: "red",
    //                 limbAngle: this.limbAngleDefault,
    //                 facialExpression: this.facialExpressionDefault,
    //                 elbowAngle: this.elbowAngleDefault
    //             })
    //             renderingContext.restore();
    //         },
    //         parameterize: function(ease, startKeyFrame, endKeyframe, currentTweenFrame, duration) {
    //             this.limbAngleDefault = parameterUpdate(this.limbAngleDefault, "limbAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.elbowAngleDefault = parameterUpdate(this.elbowAngleDefault, "elbowAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.facialExpressionDefault = parameterUpdate(this.facialExpressionDefault, "facialExpression", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);
    //         },
    //         keyframes: [
    //             {
    //                 frame: 0,
    //                 tx: getTileLocations(57)[0],
    //                 ty: getTileLocations(57)[1],
    //                 ease: KeyframeTweener.backwardsAndPast
    //             },

    //             {
    //                 frame: 101,
    //                 tx: getTileLocations(50)[0],
    //                 ty: getTileLocations(50)[1],
    //                 ease: KeyframeTweener.backwardsAndPast
    //             }
    //         ]
    //     },
    // // Red Piece 2
    //     {
    //         limbAngleDefault: 90,
    //         facialExpressionDefault: 1,
    //         elbowAngleDefault: 90,
    //         draw: function (renderingContext) {
    //             renderingContext.save();
    //             renderingContext.scale(0.48, 0.48);
    //             SpriteLibrary.drawPiece({
    //                 renderingContext: renderingContext,
    //                 color: "red",
    //                 limbAngle: this.limbAngleDefault,
    //                 facialExpression: this.facialExpressionDefault,
    //                 elbowAngle: this.elbowAngleDefault
    //             })
    //             renderingContext.restore();
    //         },
    //         parameterize: function(ease, startKeyFrame, endKeyframe, currentTweenFrame, duration) {
    //             this.limbAngleDefault = parameterUpdate(this.limbAngleDefault, "limbAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.elbowAngleDefault = parameterUpdate(this.elbowAngleDefault, "elbowAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.facialExpressionDefault = parameterUpdate(this.facialExpressionDefault, "facialExpression", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);
    //         },
    //         keyframes: [
    //             {
    //                 frame: 0,
    //                 tx: getTileLocations(59)[0],
    //                 ty: getTileLocations(59)[1],
    //                 ease: KeyframeTweener.backwardsAndPast
    //             },

    //             {
    //                 frame: 125,
    //                 tx: getTileLocations(51)[0],
    //                 ty: getTileLocations(51)[1],
    //                 ease: KeyframeTweener.backwardsAndPast
    //             }
    //         ]
    //     },
    // // Red Piece 3
    //     {
    //         limbAngleDefault: 90,
    //         facialExpressionDefault: 1,
    //         elbowAngleDefault: 90,
    //         draw: function (renderingContext) {
    //             renderingContext.save();
    //             renderingContext.scale(0.48, 0.48);
    //             SpriteLibrary.drawPiece({
    //                 renderingContext: renderingContext,
    //                 color: "red",
    //                 limbAngle: this.limbAngleDefault,
    //                 facialExpression: this.facialExpressionDefault,
    //                 elbowAngle: this.elbowAngleDefault
    //             })
    //             renderingContext.restore();
    //         },
    //         parameterize: function(ease, startKeyFrame, endKeyframe, currentTweenFrame, duration) {
    //             this.limbAngleDefault = parameterUpdate(this.limbAngleDefault, "limbAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.elbowAngleDefault = parameterUpdate(this.elbowAngleDefault, "elbowAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.facialExpressionDefault = parameterUpdate(this.facialExpressionDefault, "facialExpression", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);
    //         },
    //         keyframes: [
    //             {
    //                 frame: 0,
    //                 tx: getTileLocations(61)[0],
    //                 ty: getTileLocations(61)[1],
    //                 ease: KeyframeTweener.backwardsAndPast
    //             },

    //             {
    //                 frame: 125,
    //                 tx: getTileLocations(53)[0],
    //                 ty: getTileLocations(53)[1],
    //                 ease: KeyframeTweener.backwardsAndPast
    //             }
    //         ]
    //     },
    // // Red Piece 4
    //     {
    //         limbAngleDefault: 90,
    //         facialExpressionDefault: 1,
    //         elbowAngleDefault: 90,
    //         draw: function (renderingContext) {
    //             renderingContext.save();
    //             renderingContext.scale(0.48, 0.48);
    //             SpriteLibrary.drawPiece({
    //                 renderingContext: renderingContext,
    //                 color: "red",
    //                 limbAngle: this.limbAngleDefault,
    //                 facialExpression: this.facialExpressionDefault,
    //                 elbowAngle: this.elbowAngleDefault
    //             })
    //             renderingContext.restore();
    //         },
    //         parameterize: function(ease, startKeyFrame, endKeyframe, currentTweenFrame, duration) {
    //             this.limbAngleDefault = parameterUpdate(this.limbAngleDefault, "limbAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.elbowAngleDefault = parameterUpdate(this.elbowAngleDefault, "elbowAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

    //             this.facialExpressionDefault = parameterUpdate(this.facialExpressionDefault, "facialExpression", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);
    //         },
    //         keyframes: [
    //             {
    //                 frame: 0,
    //                 tx: getTileLocations(63)[0],
    //                 ty: getTileLocations(63)[1],
    //                 ease: KeyframeTweener.backwardsAndPast
    //             },

    //             {
    //                 frame: 101,
    //                 tx: getTileLocations(54)[0],
    //                 ty: getTileLocations(54)[1],
    //                 ease: KeyframeTweener.backwardsAndPast
    //             }
    //         ]
    //     }
    ];

    // Will add keyframes to sprites (starting from their last keyframe)
    // Accepts a list of tiles that the sprites will move to (evenly spaced over the frame number)
    // var pieceMover = function(specs) {
    //     var parameterHolder = {
    //         limbAngle: 120,
    //         limbUpdater: -5,
    //         elbowAngle: 90,
    //         elbowUpdater: -2,
    //         facialExpression: 1,
    //         faceUpdater: 0.25
    //     }
    //     for (var sprite = 0; sprite < specs.sprites.length; sprite++) {
    //         var previousKeyframeLength = sprites[sprite + 1].keyframes.length;
    //         console.log(previousKeyframeLength);
    //         console.log(1);
    //         for (var i = 0; i < specs.frames; i += specs.frameUpdate) {

    //             // Update parameters based on parameter holder...
    //             parameterHolder.limbUpdater *= (parameterHolder.limbAngle - parameterHolder.limbUpdater < 50) ?
    //             -1 : 1;
    //             parameterHolder.elbowAngle += parameterHolder.elbowUpdater;
    //             parameterHolder.facialExpression += parameterHolder.faceUpdater;
    //             if (parameterHolder.facialExpression >= 5 || parameterHolder.facialExpression <= -5) {
    //                 parameterHolder.faceUpdater *= -1;
    //             }
                    
    //             var moveBy = Math.floor(specs.frames / specs.tiles[sprite].length);

    //             console.log(previousKeyframeLength + (i / specs.frameUpdate));
    //             sprites[sprite + 1].keyframes[previousKeyframeLength + (i / specs.frameUpdate)] = {
    //                 frame: i,
    //                 tx: getTileLocations(specs.tiles[sprite][Math.floor(i / moveBy)])[0],
    //                 ty: getTileLocations(specs.tiles[sprite][Math.floor(i / moveBy)])[1],
    //                 limbAngle: parameterHolder.limbAngle,
    //                 elbowAngle: parameterHolder.elbowAngle,
    //                 facialExpression: parameterHolder.facialExpression,
    //                 ease: specs.easer[sprite]
    //             }  
    //         }
            
    //     }
    // }
    // pieceMover({
    //     sprites: [1,2],
    //     tiles: [[1,2,10,11,12,20,21,22,30,29], [43,44,45,46,38,30,28]],
    //     easer: [KeyframeTweener.inOutCirc, KeyframeTweener.backwardsAndPast],
    //     frames: 500,
    //     frameUpdate: 5
    // })
    

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



