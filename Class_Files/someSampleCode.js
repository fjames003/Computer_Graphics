    // This is to make an attempt at a more "woody" look... Doesn't even get close
    // var radialGradient = renderingContext.createRadialGradient(0, 0, 500, 0, 0, 1000);
    // radialGradient.addColorStop(0, "rgb(150, 82, 1)");
    // radialGradient.addColorStop(1, "rgb(192, 155, 76)");
    // renderingContext.fillStyle = radialGradient;

    // renderingContext.globalAlpha = 0.2;
    // for (i=0;i<15;i++){
    //     renderingContext.beginPath();
    //     renderingContext.arc(75,75,10+10*i,0,Math.PI*2,true);
    //     renderingContext.fill();
    // }


    // defineTrapezoid(100, 100, 125, 100, 75, "black");
    // function defineTrapezoid(x, y, bottomSize, topSize, height, color) {
    //     var difference = (topSize - bottomSize) / 2;
    //     renderingContext.fillStyle = color;
    //     renderingContext.beginPath();
    //     renderingContext.moveTo(x, y);
    //     renderingContext.lineTo(x + topSize, y);
    //     renderingContext.lineTo(x + bottomSize + difference, y + height);
    //     renderingContext.lineTo(x + difference, y + height);
    //     renderingContext.closePath();
    //     renderingContext.fill();
    // }


    // var keyframeCopier = function(sprite, oldFrame, newFrame, updates) {
    //     var previousKeyframeLength = sprites[sprite].keyframes.length;
    //     for (var keyframe = 0; keyframe < previousKeyframeLength; keyframe++) {
    //         if (sprites[sprite].keyframes[keyframe].frame === oldFrame) {

    //             sprites[sprite].keyframes[previousKeyframeLength] = {};
    //             for (var property in sprites[sprite].keyframes[keyframe]) {
    //                 if (sprites[sprite].keyframes[keyframe].hasOwnProperty(property)) {
    //                     sprites[sprite].keyframes[previousKeyframeLength][property] = 
    //                     sprites[sprite].keyframes[keyframe][property];
    //                 }
    //             }

    //             console.log(sprites[sprite].keyframes[previousKeyframeLength]);
    //             sprites[sprite].keyframes[previousKeyframeLength].frame = newFrame;
    //             for (var update in updates) {
    //                 if (update === "parameters") {
    //                     for (var paramUpdate in updates[update]) {
    //                         console.log(sprites[sprite].keyframes[previousKeyframeLength][update]);
    //                         console.log(!sprites[sprite].keyframes[previousKeyframeLength][update]);
    //                         if (!sprites[sprite].keyframes[previousKeyframeLength][update]) {
    //                             sprites[sprite].keyframes[previousKeyframeLength][update] = {};
    //                         }
    //                         sprites[sprite].keyframes[previousKeyframeLength][update][paramUpdate] = updates[update][paramUpdate];
    //                     }
    //                 } else {
    //                 sprites[sprite].keyframes[previousKeyframeLength][update] = updates[update];                       
    //                 }
    //             }
    //             console.log(sprites[sprite].keyframes[previousKeyframeLength]);
    //         }
    //     }
    // }
