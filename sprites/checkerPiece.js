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
    }


}());