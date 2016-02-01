// Frankie James
// CMSI371

(function () {
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

        // add background to facilitate 'blinking'...
        renderingContext.fillStyle = "black";
        renderingContext.fillRect(0, 0, canvasSize, canvasSize);

        // draw board...
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
    
}());

 