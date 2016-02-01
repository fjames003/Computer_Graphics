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
    // var canvas = document.getElementById("canvas");
    // var renderingContext = canvas.getContext("2d");
    window.SpriteLibrary = window.SpriteLibrary || { };
    SpriteLibrary.drawBoard = function (boardSpecification) {
        var canvas = boardSpecification.canvas;
        var renderingContext = canvas.getContext("2d");
        renderingContext.canvas.width = window.innerWidth;
        renderingContext.canvas.height = window.innerHeight;
        var canvasSize = (canvas.width <= canvas.height) ? canvas.width : canvas.height;
        var borderWidth = boardSpecification.border || 24;
        var tileSize = ((canvasSize - borderWidth * 2) / 8);
        var isBlack = true;
        var newRowCount = 1;
        for (var rows = borderWidth; rows <= canvasSize - tileSize - borderWidth; rows += tileSize) {
            for (var columns = borderWidth; columns <= canvasSize - tileSize - borderWidth; columns += tileSize) {

                if (isBlack) {
                    renderingContext.fillStyle = "rgb(150, 82, 1)"; 
                } else {
                    renderingContext.fillStyle = "rgb(192, 155, 76)";
                }

                renderingContext.fillRect(columns, rows, tileSize - 5, tileSize - 5);
                if (newRowCount % 8 !== 0) {
                isBlack = !isBlack;                    
                }
                newRowCount++;
            }
        }
    }
    
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
    
}());

 