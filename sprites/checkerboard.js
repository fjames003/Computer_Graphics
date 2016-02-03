// Frankie James
// CMSI371

(function () {
    window.SpriteLibrary = window.SpriteLibrary || { };
    SpriteLibrary.drawBoard = function (boardSpecification) {
        var renderingContext = boardSpecification.renderingContext;
        var borderWidth = boardSpecification.border || 12;

        // Set-up Ideal board using constants, rely on scale and translate to adjust if necessary...
        // Board size is actually 'boardSize' - 'betweenPieceSize' aka 995 pixels in this default case...
        var boardSize = 1000,
            initialPieceNumber = 8,
            tileSize = ((boardSize - borderWidth * 2) / initialPieceNumber),
            isDark = true,
            darkColor = "rgb(150, 82, 1)",
            lightColor = "rgb(192, 155, 76)",
            backgroundColor = "black",
            newRowCount = 1,
            betweenPieceSize = 5,
            percentDegraded = boardSpecification.degradation;

        // add background to facilitate 'blinking'...
        renderingContext.fillStyle = backgroundColor;
        renderingContext.fillRect(0, 0, boardSize - betweenPieceSize, boardSize - betweenPieceSize);

        // draw board...
        for (var rows = borderWidth; rows <= boardSize - tileSize - borderWidth; rows += tileSize) {
            for (var columns = borderWidth; columns <= boardSize - tileSize - borderWidth; columns += tileSize) {

                renderingContext.fillStyle = (isDark) ? darkColor : lightColor;
                renderingContext.fillRect(columns, rows, tileSize - betweenPieceSize, tileSize - betweenPieceSize);

                if (newRowCount % initialPieceNumber !== 0) {
                    isDark = !isDark;                    
                }

                newRowCount++;
            }
        }
        var coverUp = function (percentage) {
            var distanceToCover = (boardSize * (percentage / 100)) / 2,
                startofBoardLocation = borderWidth + distanceToCover / 2,
                endOfBoardLocation = boardSize - borderWidth - betweenPieceSize - distanceToCover / 2;

            renderingContext.strokeStyle = backgroundColor;
            renderingContext.lineWidth = distanceToCover;
            renderingContext.beginPath();
            renderingContext.moveTo(startofBoardLocation, startofBoardLocation);
            renderingContext.lineTo(startofBoardLocation, endOfBoardLocation);
            renderingContext.lineTo(endOfBoardLocation, endOfBoardLocation);
            renderingContext.lineTo(endOfBoardLocation, startofBoardLocation)
            renderingContext.closePath();
            renderingContext.stroke();
        };
        coverUp(percentDegraded);
    };
    
}());

 