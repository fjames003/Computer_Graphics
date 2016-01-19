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
    var canvas = document.getElementById("canvas");
    var renderingContext = canvas.getContext("2d");

    defineTrapezoid(100, 100, 125, 100, 75);
    function defineTrapezoid(x, y, bottomSize, topSize, height) {
        var difference = (topSize - bottomSize) / 2;
        renderingContext.fillStyle = "black"
        renderingContext.beginPath();
        renderingContext.moveTo(x, y);
        renderingContext.lineTo(x + topSize, y);
        renderingContext.lineTo(x + bottomSize + difference, y + height);
        renderingContext.lineTo(x + difference, y + height);
        renderingContext.closePath();
        renderingContext.fill();
    }

    
}());