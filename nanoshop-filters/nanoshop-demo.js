/*
 * This demo script uses the Nanoshop module to apply a simple
 * filter on a canvas drawing.
 */
(function () {
    var canvas = $("#picture")[0];
    var renderingContext = canvas.getContext("2d");

    renderingContext.save();
    renderingContext.scale(0.5, 0.5);
    SpriteLibrary.drawBoard({renderingContext: renderingContext});
    renderingContext.restore();

    renderingContext.save();
    renderingContext.translate(125, 75);
    SpriteLibrary.drawPiece({
        renderingContext: renderingContext,
        limbAngle: 1,
        elbowAngle: 225,
        color: "red"
    });
    renderingContext.restore();

    renderingContext.save();
    renderingContext.translate(512 - 150, 512 - 125);
    SpriteLibrary.drawPiece({
        renderingContext: renderingContext,
        limbAngle: 90,
        elbowAngle: -90,
        facialExpression: -1
    });
    renderingContext.restore();


    // Set a little event handler to apply the filter.
    $("#apply-filter-button").click(function () {
        // Filter time.
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                // Nanoshop.darkener
                // Nanoshop.grayScale
                // Nanoshop.brighten
                Nanoshop.inverse
            ),
            0, 0
        );
    });

    $("#apply-neighborhood-filter-button").click(function () {
        // Filter time.
        renderingContext.putImageData(
            NanoshopNeighborhood.applyFilter(
                renderingContext,
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                // NanoshopNeighborhood.darkener
                // NanoshopNeighborhood.averager // Convenience comment for easy switching.
                NanoshopNeighborhood.basicEdgeDetector
            ),
            0, 0
        );
    });
}());
