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

    // // Declare other variables here.
    // var radialGradient = renderingContext.createRadialGradient(160, 160, 1, 180, 180, 320);

    // // Put your canvas drawing code (and any other code) here.
    // radialGradient.addColorStop(0, "white");
    // radialGradient.addColorStop(1, "blue");

    var canvasSize = 1024;
    var borderWidth = 24;
    var isBlack = true;
    for (var rows = borderWidth; rows <= canvasSize; rows += ((canvasSize - borderWidth) / 8)) {
        for (var columns = borderWidth; columns <= canvasSize; columns += ((canvasSize - borderWidth) / 8)) {

            if (isBlack) {
                renderingContext.fillStyle = "black";
                renderingContext.fillRect(columns, rows, 120, 120);  
            } else {
                renderingContext.fillStyle = "red";
                renderingContext.fillRect(columns, rows, 120, 120);
            }

            isBlack = !isBlack;   
        }
    }

    
}());