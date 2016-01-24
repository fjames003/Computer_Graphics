/*
 * This template file is meant to be a template for canvas-based
 * web page code.  Nothing here is set in stone; it is mainly
 * intended to save you some typing.
 */
// Yes, we can use jQuery here, but avoid it just in case you
// really don't want to use it.  We do still keep things away
// from the global namespace.
(function () {
    // Ditto on using jQuery here.
    window.SpriteLibrary = window.SpriteLibrary || { };
    SpriteLibrary.drawPiece = function (pieceSpecification) {
        var renderingContext = pieceSpecification.renderingContext;
        var currentColor = (pieceSpecification.color === "black" || pieceSpecification.color === "red") ? pieceSpecification.color : "black";
        var x = pieceSpecification.x || 0;
        var y = pieceSpecification.y || 0;
        var size = pieceSpecification.size || 50;

        var radialGradient = renderingContext.createRadialGradient(x, y, size, x, y, size - 20);

        for (var stopper = 0.0; stopper <= 1.0; stopper += 0.1) {
            radialGradient.addColorStop(stopper, currentColor);
            currentColor = (currentColor === "black") ? "red" : "black";
        }

        renderingContext.fillStyle = radialGradient;
        renderingContext.beginPath();
        renderingContext.arc(x, y, size, 0, Math.PI * 2, true);
        renderingContext.fill();

        // time for limbs...
        var drawLimb = function (limbAngle, leftLimb) {
            
            renderingContext.save();
            renderingContext.translate(x,y);
            renderingContext.rotate(limbAngle);
            renderingContext.translate(size, 0);

            renderingContext.strokeStyle = "black";
            renderingContext.lineCap = "round";
            // width of primary limb
            var primaryLimb = {
                width: size / 6,
                length: size / 4 * 3,
                isHorizontal: true
            };
            var secondaryLimb = {
                width: size / 7,
                length: size / 2,
                isHorizontal: false

            };
            var tertiaryLimb = {
                width: size / 12,
                length: size / 4,
                isHorizontal: false

            };

            var additionalLimbs = function (objectSpecs) {
                renderingContext.lineWidth = objectSpecs.width;
                renderingContext.beginPath();
                renderingContext.moveTo(0,0);
                if (objectSpecs.isHorizontal) {
                    renderingContext.lineTo(objectSpecs.length, 0);
                    renderingContext.translate(objectSpecs.length, 0);
                } else {
                    if (leftLimb) {
                        renderingContext.lineTo(0, objectSpecs.length);
                        renderingContext.translate(0, objectSpecs.length);

                    } else {
                        renderingContext.lineTo(0, -objectSpecs.length);
                        renderingContext.translate(0, -objectSpecs.length);
                    }
                    
                }
                renderingContext.stroke();
            };

            additionalLimbs(primaryLimb);

            renderingContext.save();
            additionalLimbs(secondaryLimb);

            renderingContext.save();
            additionalLimbs(tertiaryLimb); 


            renderingContext.restore();
            renderingContext.restore();
            renderingContext.restore();
        }
        // drawLimb(Math.PI / 4);
        // drawLimb(-Math.PI / 4);
        // drawLimb(0);
        // drawLimb(Math.PI);
        // drawLimb(Math.PI / 4 * 3);
        // drawLimb(Math.PI / 4 * 5);

        leftLimb = true;
        limbAngle = -45;
        while(limbAngle < 300) {
            drawLimb(limbAngle * Math.PI / 180, leftLimb);
            limbAngle += (limbAngle !== 45 && limbAngle !== 225) ? 45 : 90;
            if (limbAngle > 45) {
                leftLimb = false;
            }
        }

    }


}());