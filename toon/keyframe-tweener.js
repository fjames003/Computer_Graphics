/*
 * A simple keyframe-tweening animation module for 2D
 * canvas elements.
 */
(function () {
    // The big one: animation initialization.  The settings parameter
    // is expected to be a JavaScript object with the following
    // properties:
    //
    // - renderingContext: the 2D canvas rendering context to use
    // - width: the width of the canvas element
    // - height: the height of the canvas element
    // - sprites: the array of sprites to animate
    // - frameRate: number of frames per second (default 24)
    //
    // In turn, each sprite is a JavaScript object with the following
    // properties:
    //
    // - draw: the function that draws the sprite
    // - keyframes: the array of keyframes that the sprite should follow
    //
    // Finally, each keyframe is a JavaScript object with the following
    // properties.  Unlike the other objects, defaults are provided in
    // case a property is not present:
    //
    // - frame: the global animation frame number in which this keyframe
    //          it to appear
    // - ease: the easing function to use (default is KeyframeTweener.linear)
    // - tx, ty: the location of the sprite (default is 0, 0)
    // - sx, sy: the scale factor of the sprite (default is 1, 1)
    // - rotate: the rotation angle of the sprite (default is 0)
    var contains = function (a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }
    var initializeAnimation = function (settings) {
        // We need to keep track of the current frame.
        var currentFrame = 0;

        // Avoid having to go through settings to get to the
        // rendering context and sprites.
        var renderingContext = settings.renderingContext;
        var width = settings.width;
        var height = settings.height;
        var sprites = settings.sprites;

        // This function will prevent the spacebar from scrolling the page...
        window.onkeydown = function(e) {
            if(e.keyCode == 32 && e.target == document.body) {
                e.preventDefault();
                return false;
            }
        };

        // This will make 'shouldPause' = true in the event that spacebar is pushed...
        var shouldPause = false;
        document.body.onkeyup = function(e){
            if(e.keyCode == 32){
                shouldPause = !shouldPause;
            }
            return false;
         };

        var previousTimestamp = null;
        var nextFrame = function (timestamp) {

            // Manual Bail-out that allows user to pause animation...
            if (shouldPause) {
                window.requestAnimationFrame(nextFrame);
                return;
            }
            
            // Bail-out #1: We just started.
            if (!previousTimestamp) {
                previousTimestamp = timestamp;
                window.requestAnimationFrame(nextFrame);
                return;
            }

            // Bail-out #2: Too soon.
            if (timestamp - previousTimestamp < (1000 / (settings.frameRate || 24))) {
                window.requestAnimationFrame(nextFrame);
                return;
            }

            // Clear the canvas.
            renderingContext.clearRect(0, 0, width, height);

            // For every sprite, go to the current pair of keyframes.
            // Then, draw the sprite based on the current frame.
            for (var i = 0, maxI = sprites.length; i < maxI; i += 1) {
                for (var j = 0, maxJ = sprites[i].keyframes.length - 1; j < maxJ; j += 1) {
                    // We look for keyframe pairs such that the current
                    // frame is between their frame numbers.
                    if ((sprites[i].keyframes[j].frame <= currentFrame) &&
                            (currentFrame <= sprites[i].keyframes[j + 1].frame)) {
                        // Point to the start and end keyframes.
                        var startKeyframe = sprites[i].keyframes[j];
                        var endKeyframe = sprites[i].keyframes[j + 1];

                        // Save the rendering context state.
                        renderingContext.save();

                        var ease = startKeyframe.ease || KeyframeTweener.linear;
                        var easingFunctions = {
                            tx: ease,
                            sx: ease,
                            ty: ease,
                            sy: ease,
                            rotate: ease
                        };
                        var easingParameterAdjustments = {};
                        for (var change in startKeyframe.easeAdjust) {
                            var newEase = startKeyframe.easeAdjust[change];
                            if (change in easingFunctions) {
                                easingFunctions[change] = newEase;
                            } else {
                                easingParameterAdjustments[change] = newEase; 
                            }
                        }

                        var txStart = startKeyframe.tx || 0;
                        var txDistance = (endKeyframe.tx || 0) - txStart;

                        var tyStart = startKeyframe.ty || 0;
                        var tyDistance = (endKeyframe.ty || 0) - tyStart;

                        var sxStart = startKeyframe.sx || 1;
                        var sxDistance = (endKeyframe.sx || 1) - sxStart;

                        var syStart = startKeyframe.sy || 1;
                        var syDistance = (endKeyframe.sy || 1) - syStart;

                        var rotateStart = (startKeyframe.rotate || 0) * Math.PI / 180;
                        var rotateDistance = (endKeyframe.rotate || 0) * Math.PI / 180 - rotateStart;

                        var currentTweenFrame = currentFrame - startKeyframe.frame;
                        var duration = endKeyframe.frame - startKeyframe.frame + 1;

                        // Build our transform according to where we should be.
                        renderingContext.translate(
                            easingFunctions.tx(currentTweenFrame, txStart, txDistance, duration),
                            easingFunctions.ty(currentTweenFrame, tyStart, tyDistance, duration)
                        );
                        renderingContext.scale(
                            easingFunctions.sx(currentTweenFrame, sxStart, sxDistance, duration),
                            easingFunctions.sy(currentTweenFrame, syStart, syDistance, duration)
                        );
                        renderingContext.rotate(
                            easingFunctions.rotate(currentTweenFrame, rotateStart, rotateDistance, duration)
                        );

                        // Update any parameters the sprites may have...
                        var updatedDrawObject = {
                            renderingContext: renderingContext
                        };
                        var startingParameters = (startKeyframe.parameters) ?
                                                Object.keys(startKeyframe.parameters) : [];
                        var endingParameters = (endKeyframe.parameters) ?
                                                Object.keys(endKeyframe.parameters) : [];
                        //var startingOrEndingParameters = [...new Set(startingParameters.concat(endingParameters))];
                        var startingOrEndingParameters = startingParameters;
                        for (var param in endingParameters) {
                            if (! contains(startingOrEndingParameters, endingParameters[param])) {
                                startingOrEndingParameters[startingOrEndingParameters.length] = endingParameters[param]
                            }
                        };

                        // By Looping over the union of the two, I can obtain defaults by simply grabbing,
                        // the starting or ending parameter if the other is missing... 
                        // This ensures that all parameters are taken care of and defaults provided if not in start
                        // but in end or vice versa
                        for (var index in startingOrEndingParameters) {
                            var property = startingOrEndingParameters[index];

                            // var start_property = (typeof startKeyframe.parameters === "undefined") ? 
                            // endKeyframe.parameters[property] : startKeyframe.parameters[property];
                            
                            // var property_distance = (typeof endKeyframe.parameters === "undefined") ?
                            // startKeyframe.parameters[property] : endKeyframe.parameters[property];

                            if (!startKeyframe.parameters) {
                                startKeyframe.parameters = {};
                            } else if (!endKeyframe.parameters) {
                                endKeyframe.parameters = {};
                            }
                             var start_property = (startKeyframe.parameters[property] === 0) ? 
                                 startKeyframe.parameters[property] : startKeyframe.parameters[property] ||
                                 sprites[i].defaulter[property];
                                             
                            var property_distance = ((endKeyframe.parameters[property] === 0) ?
                                endKeyframe.parameters[property] : endKeyframe.parameters[property] ||
                                sprites[i].defaulter[property]) - start_property;   

                            updatedDrawObject[property] = (easingParameterAdjustments[property]) ? 
                            easingParameterAdjustments[property](currentTweenFrame, start_property,
                            property_distance, duration) : ease(currentTweenFrame, start_property,
                            property_distance, duration);

                        }

                        // Draw the sprite.
                        sprites[i].draw(updatedDrawObject);

                        // Clean up.
                        renderingContext.restore();
                    }
                }
            }

            // Move to the next frame.
            currentFrame += 1;
            previousTimestamp = timestamp;
            window.requestAnimationFrame(nextFrame);
        };

        window.requestAnimationFrame(nextFrame);
    };

    window.KeyframeTweener = {
        // The module comes with a library of common easing functions.
        linear: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            return distance * percentComplete + start;
        },

        quadEaseIn: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            return distance * percentComplete * percentComplete + start;
        },

        quadEaseOut: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            return -distance * percentComplete * (percentComplete - 2) + start;
        },

        quadEaseInAndOut: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / (duration / 2);
            return (percentComplete < 1) ?
                    (distance / 2) * percentComplete * percentComplete + start :
                    (-distance / 2) * ((percentComplete - 1) * (percentComplete - 3) - 1) + start;
        },

        inOutCirc: function (currentTime, start, distance, duration) {
            if ((currentTime /= duration / 2) < 1) {
                return -distance / 2 * (Math.sqrt(1 - currentTime * currentTime) - 1) + start;
            } else {
                return distance / 2 * (Math.sqrt(1 - (currentTime -= 2) * currentTime) + 1) + start;
            }
        },

        backAndForth: function(currentTime, start, distance, duration) {
            var ts = (currentTime /= duration) * currentTime;
            var tc = ts * currentTime;
            return start + distance * (-8.7 * tc * ts + 37.3 * ts * ts + -41 * tc + 11.4 * ts + 2 * currentTime);
        },

        backwardsAndPast: function(currentTime, start, distance, duration) {
            var ts = (currentTime /= duration) * currentTime;
            var tc = ts * currentTime;
            return start + distance * (57.205*tc*ts + -132.15*ts*ts + 93.285*tc + -16.075*ts + -1.265*currentTime);
        },

        initialize: initializeAnimation
    };
}());
