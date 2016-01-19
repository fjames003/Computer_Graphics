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

    var canvasSize = 1024;
    var borderWidth = 24;
    var tileSize = ((canvasSize - borderWidth) / 8);
    var isBlack = true;
    for (var rows = canvasSize - borderWidth - tileSize; rows >= borderWidth; rows -= tileSize) {
        for (var columns = canvasSize - borderWidth - tileSize; columns >= borderWidth; columns -= tileSize) {

            if (isBlack) {
                renderingContext.fillStyle = "rgb(150, 82, 1)";
                renderingContext.fillRect(columns, rows, tileSize - 5, tileSize - 15);  

            } else {
                renderingContext.fillStyle = "rgb(192, 155, 76)";
                renderingContext.fillRect(columns, rows, tileSize - 5, tileSize - 15);
            }

            tileSize = tileSize - 0.5;
            isBlack = !isBlack;   
        }
    }
    // defineTrapezoid(100, 100, 125, 100, 75, "black");
    function defineTrapezoid(x, y, bottomSize, topSize, height, color) {
        var difference = (topSize - bottomSize) / 2;
        renderingContext.fillStyle = color
        renderingContext.beginPath();
        renderingContext.moveTo(x, y);
        renderingContext.lineTo(x + topSize, y);
        renderingContext.lineTo(x + bottomSize + difference, y + height);
        renderingContext.lineTo(x + difference, y + height);
        renderingContext.closePath();
        renderingContext.fill();
    }
    
}());

 