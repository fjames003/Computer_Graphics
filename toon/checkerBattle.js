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
            return [tileOne + (tileSize * tileXLocation), tileOne + (tileSize * tileYLocation)];
    };

    var canvas = document.getElementById("canvas");
    window.SpriteLibrary = window.SpriteLibrary || { };
    // First, a selection of "drawing functions" from which we
    // can choose.  Their common trait: they all accept a single
    // renderingContext argument.
    var renderingContext = canvas.getContext("2d");
    renderingContext.save();
    renderingContext.scale(0.7, 0.7);

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
                frame: 200,
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
                {
                    frame: 0,
                    tx: getTileLocations(1)[0],
                    ty: getTileLocations(1)[1],
                    limbAngle: 50,
                    elbowAngle: 0,
                    ease: KeyframeTweener.quadEaseOut
                },

                {
                    frame: 100,
                    tx: getTileLocations(64)[0],
                    ty: getTileLocations(64)[1],
                    limbAngle: 190,
                    elbowAngle: 360,
                    ease: KeyframeTweener.quadEaseOut
                },

                {
                    frame: 150,
                    tx: getTileLocations(32)[0],
                    ty: getTileLocations(32)[1],
                    limbAngle: 90,
                    elbowAngle: 90
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
                {
                    frame: 0,
                    tx: getTileLocations(57)[0],
                    ty: getTileLocations(57)[1],
                    ease: KeyframeTweener.quadEaseOut
                },

                {
                    frame: 125,
                    tx: getTileLocations(8)[0],
                    ty: getTileLocations(8)[1]
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
    var parameterUpdate = function(propDefault, property, ease, startKeyFrame, endKeyframe, currentTweenFrame, duration) {
                var start_property = startKeyFrame[property] || propDefault
                var property_distance = (endKeyframe[property] || propDefault) - start_property;
                propDefault = ease(currentTweenFrame, start_property, property_distance, duration);
                return propDefault;
    };
}());



