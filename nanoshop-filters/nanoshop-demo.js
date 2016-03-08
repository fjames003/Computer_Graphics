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

    var setUpLists = function (library, idName) {
        var htmlSpot = document.getElementById(idName);
        var optionList = document.createElement("select");
        optionList.id = idName + "-select";
        htmlSpot.appendChild(optionList);
        for (var filter in library) {
            if (filter !== "applyFilter") {
                var option = document.createElement("option");
                option.value = filter;
                option.text = filter;
                optionList.appendChild(option);
            }
        }
    };

    setUpLists(Nanoshop, "nanoshop-options");
    // Set a little event handler to apply the filter.
    $("#apply-filter-button").click(function () {
        var filter = $("#nanoshop-options-select").val();
        var filterFunc = Nanoshop[filter];

        // Filter time.
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                // Nanoshop.darkener
                // Nanoshop.grayScale
                // Nanoshop.brighten
                // Nanoshop.inverse
                filterFunc
            ),
            0, 0
        );
    });

    setUpLists(NanoshopNeighborhood, "neighborhood-options"); 
    $("#apply-neighborhood-filter-button").click(function () {
        var filter = $("#neighborhood-options-select").val();
        var filterFunc = NanoshopNeighborhood[filter];

        // Filter time.
        renderingContext.putImageData(
            NanoshopNeighborhood.applyFilter(
                renderingContext,
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                // NanoshopNeighborhood.darkener
                // NanoshopNeighborhood.averager // Convenience comment for easy switching.
                // NanoshopNeighborhood.basicEdgeDetector
                // NanoshopNeighborhood.lowerThresholdAverager
                filterFunc
            ),
            0, 0
        );
    });
}());
