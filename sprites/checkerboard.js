// Frankie James
// CMSI371

(function () {
    window.SpriteLibrary = window.SpriteLibrary || { };
    window.SpriteLibrary.drawBoard = function (boardSpecification) {
        var renderingContext = boardSpecification.renderingContext;
        var borderWidth = boardSpecification.border || 12;

        // Set-up Ideal board using constants, rely on scale and translate to adjust if necessary...
        // Board size is actually 'boardSize' - 'betweenPieceSize' aka 995 pixels in this default case...
        var boardSize = 1000;
        var initialPieceNumber = 8;
        var tileSize = ((boardSize - borderWidth * 2) / initialPieceNumber);
        var isDark = true;
        var darkTile = "rgb(150, 82, 1)";
        var lightTile = "rgb(192, 155, 76)";
        var newRowCount = 1;
        var betweenPieceSize = 5;
        var percentDegraded = boardSpecification.degradation || 0;
        var waveFrequency = boardSpecification.waveFrequency || 0.08;
        
        var darkWater = "rgb(0,191,255)";
        var lightWater = "rgb(0,0,205)";
        var currentColor = darkWater;
        var backgroundColor = renderingContext.createRadialGradient(500, 500, 1000, 500, 500, 100);
        for (var stopper = 0.0; stopper <= 1.0; stopper += waveFrequency) {
            backgroundColor.addColorStop(stopper, currentColor);
            currentColor = (currentColor === darkWater) ? lightWater : darkWater;
         }

        // add background to facilitate 'blinking'...
        renderingContext.fillStyle = backgroundColor;
        renderingContext.fillRect(0, 0, boardSize - betweenPieceSize, boardSize - betweenPieceSize);

        // draw board...
        for (var rows = borderWidth; rows <= boardSize - tileSize - borderWidth; rows += tileSize) {
            for (var columns = borderWidth; columns <= boardSize - tileSize - borderWidth; columns += tileSize) {

                renderingContext.fillStyle = (isDark) ? darkTile : lightTile;
                renderingContext.fillRect(columns, rows, tileSize - betweenPieceSize, tileSize - betweenPieceSize);

                if (newRowCount % initialPieceNumber !== 0) {
                    isDark = !isDark;                    
                }

                newRowCount++;
            }
        }

        // window.SpriteLibrary.getTileLocations = function(tileNumber) {
        //     var tileXLocation = (tileNumber % 8) ? (tileNumber % 8) - 1 : 7;
        //     var tileYLocation = Math.ceil(tileNumber / 8) - 1;
        //     tileOne = (borderWidth + tileSize / 2);
        //     return [tileOne + (tileSize * tileXLocation), tileOne + (tileSize * tileYLocation)];
        // };
        var coverUp = function (percentage) {
            var distanceToCover = (boardSize * (percentage / 100)) / 2;
            var startofBoardLocation = borderWidth + distanceToCover / 2;
            var endOfBoardLocation = boardSize - borderWidth - betweenPieceSize - distanceToCover / 2;

            renderingContext.strokeStyle = backgroundColor;
            renderingContext.lineWidth = distanceToCover;
            renderingContext.beginPath();
            // ones added to get rid of a 1 pixel border...
            renderingContext.moveTo(startofBoardLocation - 1, startofBoardLocation - 1);
            renderingContext.lineTo(startofBoardLocation - 1, endOfBoardLocation + 1);
            renderingContext.lineTo(endOfBoardLocation + 1, endOfBoardLocation + 1);
            renderingContext.lineTo(endOfBoardLocation + 1, startofBoardLocation - 1)
            renderingContext.closePath();
            renderingContext.stroke();
        };
        coverUp(percentDegraded);
    };
    
}());

 