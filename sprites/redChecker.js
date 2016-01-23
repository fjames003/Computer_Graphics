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

    var radialGradient = renderingContext.createRadialGradient(100, 100, 55, 100, 100, 35);


    currentColor = "red";
    for (var stopper = 0.0; stopper <= 1.0; stopper += 0.1) {
        radialGradient.addColorStop(stopper, currentColor);
        currentColor = (currentColor === "red") ? "black" : "red";
    }

    renderingContext.fillStyle = radialGradient;
    renderingContext.beginPath();
    renderingContext.arc(100, 100, 55, 0, Math.PI * 2, true);
    renderingContext.fill();

}());