/* Frankie James */

(function () {
    window.SpriteLibrary = window.SpriteLibrary || { };
    SpriteLibrary.drawPiece = function (pieceSpecification) {
        var renderingContext = pieceSpecification.renderingContext;
        var currentColor = (pieceSpecification.color === "black" || pieceSpecification.color === "red") 
                            ? pieceSpecification.color : "black";
        var x = pieceSpecification.x || 0;
        var y = pieceSpecification.y || 0;

        // maybe not needed...? Ask...
        var size = pieceSpecification.size || 50;

        var radialGradient = renderingContext.createRadialGradient(x, y, size, x, y, size - size / 3);

        for (var stopper = 0.0; stopper <= 1.0; stopper += 0.1) {
            radialGradient.addColorStop(stopper, currentColor);
            currentColor = (currentColor === "black") ? "red" : "black";
        }

        renderingContext.fillStyle = radialGradient;
        renderingContext.beginPath();
        renderingContext.arc(x, y, size, 0, Math.PI * 2, true);
        renderingContext.fill();

        // time for limbs...
        var drawLimb = function (limbPosition, leftLimb, limbAngle) {
            
            renderingContext.save();
            renderingContext.translate(x,y);
            renderingContext.rotate(limbPosition);
            renderingContext.translate(size, 0);
            var direction = (leftLimb) ? 1 : -1;
            renderingContext.rotate(direction * (90 - limbAngle) * Math.PI / 180)

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
                isHorizontal: false,
                angle: pieceSpecification.elbowAngle

            };
            var tertiaryLimb = {
                width: size / 12,
                length: size / 4,
                isHorizontal: false

            };

            var additionalLimbs = function (objectSpecs) {
                renderingContext.lineWidth = objectSpecs.width;
                var angle = objectSpecs.angle || 90;
                renderingContext.beginPath();
                renderingContext.moveTo(0,0);
                if (objectSpecs.isHorizontal) {
                    renderingContext.lineTo(objectSpecs.length, 0);
                    renderingContext.translate(objectSpecs.length, 0);
                } else {
                    if (leftLimb) {
                        renderingContext.rotate((90 - angle) * Math.PI / 180)
                        renderingContext.lineTo(0, objectSpecs.length);
                        renderingContext.translate(0, objectSpecs.length);

                    } else {
                        renderingContext.rotate(-(90 - angle) * Math.PI / 180)
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
        
        // Angle in relation to body, i.e. 90 degrees is straight out of body...
        // Bounds: Lower = 50 (bottom feet begin to touch), Upper = 190 (limbs touch body)
        var limbAngle = pieceSpecification.limbAngle;
        leftLimb = true;
        var limbPosition = -45;
        while(limbPosition < 300) {
            drawLimb(limbPosition * Math.PI / 180, leftLimb, limbAngle);
            limbPosition += (limbPosition !== 45 && limbPosition !== 225) ? 45 : 90;
            if (limbPosition > 45) {
                leftLimb = false;
            }
        }
        var drawFace = function (expression) {
            var expression = (expression >= -5 && expression <= 5 && expression !== 0) ? expression : 1;
            expression = (expression < 0) ? expression * 2 : expression;
            renderingContext.strokeStyle = "white";
            renderingContext.lineWidth = size / 12;
            renderingContext.save();
            renderingContext.translate(x, y);
            renderingContext.save();
            renderingContext.translate(0, size / 8);
            renderingContext.beginPath();
            renderingContext.moveTo(-size / 3, 0);
            renderingContext.bezierCurveTo(-Math.sqrt(Math.pow(size, 2) / 6), 
                                            Math.sqrt(Math.pow(size, 2) / 7) / expression, 
                                            Math.sqrt(Math.pow(size, 2) / 6), 
                                            Math.sqrt(Math.pow(size, 2) / 7) / expression, 
                                            size / 3, 0);
            renderingContext.stroke();
            renderingContext.restore();

            renderingContext.fillStyle = "white";
            renderingContext.beginPath();
            renderingContext.arc(-size / 5, -size / 6, size / 10, 0, Math.PI * 2, true);
            renderingContext.arc(size / 5, -size / 6, size / 10, 0, Math.PI * 2, true);
            renderingContext.fill();
            renderingContext.restore();
        }
        drawFace(pieceSpecification.facialExpression);
    }
}());