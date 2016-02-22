/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {

    var getTileLocations = function(tileNumber) {
        var tileSize = 122;
            var tileXLocation = (tileNumber % 8) ? (tileNumber % 8) - 1 : 7;
            var tileYLocation = Math.ceil(tileNumber / 8) - 1;
            tileOne = (12 + tileSize / 2);
            // console.log("I just returned (cuz of " + tileNumber + "): " + (tileOne + (tileSize * tileXLocation)) + " and " + (tileOne + (tileSize * tileYLocation)));
            return [tileOne + (tileSize * tileXLocation), tileOne + (tileSize * tileYLocation)];
    };

    var canvas = document.getElementById("canvas");
    window.SpriteLibrary = window.SpriteLibrary || { };
    // First, a selection of "drawing functions" from which we
    // can choose.  Their common trait: they all accept a single
    // renderingContext argument.
    var renderingContext = canvas.getContext("2d");
    renderingContext.save();
    renderingContext.scale(0.6, 0.6);

    var sprites = [
        {
        wavesDefault: 0.03,
        degradationDefault: 0,
        draw: function (renderingContext) {
            SpriteLibrary.drawBoard({
                renderingContext: renderingContext, 
                border: 12,
                degradation: this.degradationDefault,
                waveFrequency: this.wavesDefault
            })
        },
        parameterize: function(ease, startKeyFrame, endKeyframe, currentTweenFrame, duration) {
            this.wavesDefault = parameterUpdate(this.wavesDefault, "waveFrequency", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);
            this.degradationDefault = parameterUpdate(this.degradationDefault, "degradation", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);
        },
        keyframes: [
            {
                frame: 0,
                ease: KeyframeTweener.linear,
                waveFrequency: 0.03,
                degradation: 0.000001
            },

            {
                frame: 1000,
                waveFrequency: 0.1,
                degradation: 100
            }
        ]
        },

        {
            limbAngleDefault: 90,
            facialExpressionDefault: 5,
            elbowAngleDefault: 90,
            draw: function (renderingContext) {
                renderingContext.save();
                renderingContext.scale(0.48, 0.48);
                SpriteLibrary.drawPiece({
                    renderingContext: renderingContext,
                    color: "black",
                    limbAngle: this.limbAngleDefault,
                    facialExpression: this.facialExpressionDefault,
                    elbowAngle: this.elbowAngleDefault
                })
                renderingContext.restore();
            },
            parameterize: function(ease, startKeyFrame, endKeyframe, currentTweenFrame, duration) {
                this.limbAngleDefault = parameterUpdate(this.limbAngleDefault, "limbAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

                this.elbowAngleDefault = parameterUpdate(this.elbowAngleDefault, "elbowAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

                this.facialExpressionDefault = parameterUpdate(this.facialExpressionDefault, "facialExpression", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);
            },
            keyframes: [
                // {
                //     frame: 0,
                //     tx: getTileLocations(1)[0],
                //     ty: getTileLocations(1)[1],
                //     limbAngle: 120,
                //     elbowAngle: 90,
                //     facialExpression: 1,
                //     ease: KeyframeTweener.quadEaseOut
                // },

                // {
                //     frame: 24,
                //     tx: getTileLocations(64)[0],
                //     ty: getTileLocations(64)[1],
                //     limbAngle: 190,
                //     elbowAngle: 360,
                //     ease: KeyframeTweener.quadEaseOut
                // },

                // {
                //     frame: 48,
                //     tx: getTileLocations(32)[0],
                //     ty: getTileLocations(32)[1],
                //     limbAngle: 90,
                //     elbowAngle: 90
                // }
            ]
        },

        {
            limbAngleDefault: 90,
            facialExpressionDefault: 5,
            elbowAngleDefault: 90,
            draw: function (renderingContext) {
                renderingContext.save();
                renderingContext.scale(0.48, 0.48);
                SpriteLibrary.drawPiece({
                    renderingContext: renderingContext,
                    color: "red",
                    limbAngle: this.limbAngleDefault,
                    facialExpression: this.facialExpressionDefault,
                    elbowAngle: this.elbowAngleDefault
                })
                renderingContext.restore();
            },
            parameterize: function(ease, startKeyFrame, endKeyframe, currentTweenFrame, duration) {
                this.limbAngleDefault = parameterUpdate(this.limbAngleDefault, "limbAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

                this.elbowAngleDefault = parameterUpdate(this.elbowAngleDefault, "elbowAngle", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);

                this.facialExpressionDefault = parameterUpdate(this.facialExpressionDefault, "facialExpression", ease, startKeyFrame, endKeyframe, currentTweenFrame, duration);
            },
            keyframes: [
                // {
                //     frame: 0,
                //     tx: getTileLocations(43)[0],
                //     ty: getTileLocations(43)[1],
                //     ease: KeyframeTweener.backwardsAndPast
                // },

                // {
                //     frame: 125,
                //     tx: getTileLocations(15)[0],
                //     ty: getTileLocations(15)[1],
                //     ease: KeyframeTweener.backwardsAndPast
                // },

                // {
                //     frame: 195,
                //     tx: getTileLocations(28)[0],
                //     ty: getTileLocations(28)[1],
                //     ease: KeyframeTweener.backwardsAndPast
                // },

                // {
                //     frame: 500,
                //     tx: getTileLocations(29)[0],
                //     ty: getTileLocations(29)[1],
                // }
            ]
        }
    ];

    var pieceMover = function(specs) {
        var parameterHolder = {
            limbAngle: 120,
            limbUpdater: -5,
            elbowAngle: 90,
            elbowUpdater: -2,
            facialExpression: 1,
            faceUpdater: 0.25
        }
        for (var i = 0; i < specs.frames; i += specs.frameUpdate) {
            parameterHolder.limbUpdater *= (parameterHolder.limbAngle - parameterHolder.limbUpdater < 50) ?
            -1 : 1;
            parameterHolder.elbowAngle += parameterHolder.elbowUpdater;
            parameterHolder.facialExpression += parameterHolder.faceUpdater;
            if (parameterHolder.facialExpression >= 5 || parameterHolder.facialExpression <= -5) {
                parameterHolder.faceUpdater *= -1;
            }

            for (var sprite = 0; sprite < specs.sprites.length; sprite++) {
                var moveBy = Math.floor(specs.frames / specs.tiles[sprite].length);
                console.log(moveBy);
                sprites[sprite + 1].keyframes[i / specs.frameUpdate] = {
                    frame: i,
                    tx: getTileLocations(specs.tiles[sprite][Math.floor(i / moveBy)])[0],
                    ty: getTileLocations(specs.tiles[sprite][Math.floor(i / moveBy)])[1],
                    limbAngle: parameterHolder.limbAngle,
                    elbowAngle: parameterHolder.elbowAngle,
                    facialExpression: parameterHolder.facialExpression,
                    ease: specs.easer[sprite]
                }  
            }
            
        }
    }
    pieceMover({
        sprites: [1,2],
        tiles: [[1,2,10,11,12,20,21,22,30,29], [43,44,45,46,38,30,28]],
        easer: [KeyframeTweener.inOutCirc, KeyframeTweener.backwardsAndPast],
        frames: 200,
        frameUpdate: 5
    })
    

    // Finally, we initialize the engine.  Mainly, it needs
    // to know the rendering context to use.  And the animations
    // to display, of course.
    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        width: canvas.width,
        height: canvas.height,
        sprites: sprites
    });
    var parameterUpdate = function(propDefault, property, ease, startKeyFrame, endKeyframe, currentTweenFrame, duration) {
                var start_property = startKeyFrame[property] || propDefault
                var property_distance = (endKeyframe[property] || propDefault) - start_property;
                propDefault = ease(currentTweenFrame, start_property, property_distance, duration);
                return propDefault;
    };
}());



