/*
 * This is a very simple module that demonstrates rudimentary,
 * pixel-level image processing using a pixel's "neighborhood."
 */
var neighborTotals = function (includeMiddle, rgbaNeighborhood) {
    var neighborTotal = {
            "r": 0,
            "g": 0,
            "b": 0,
            "a": 0
    };
        
    for (var i = 0; i < 9; i += 1) {
        if (i !== 4 || includeMiddle) {
            neighborTotal.r += rgbaNeighborhood[i].r;
            neighborTotal.g += rgbaNeighborhood[i].g;
            neighborTotal.b += rgbaNeighborhood[i].b;
            neighborTotal.a += rgbaNeighborhood[i].a;
        }
    }
    return neighborTotal;
};

var NanoshopNeighborhood = {
    /*
     * A basic "darkener"---this one does not even use the entire pixel neighborhood;
     * just the exact current pixel like the original Nanoshop.
     */
    darkener: function (x, y, rgbaNeighborhood) {
        return [
            rgbaNeighborhood[4].r / 2,
            rgbaNeighborhood[4].g / 2,
            rgbaNeighborhood[4].b / 2,
            rgbaNeighborhood[4].a
        ];
    },

    /*
     * A basic "averager"---this one returns the average of all the pixels in the
     * given neighborhood.
     */
    averager: function (x, y, rgbaNeighborhood) {
        var neighborTotal = neighborTotals(true, rgbaNeighborhood);

        return [ neighborTotal.r / 9, neighborTotal.g / 9, neighborTotal.b / 9, neighborTotal.a / 9 ];
    },

    /*
     * This is a rudimentary edge dector---another filter that would not be possible
     * without knowing about the other pixels in our neighborhood.
     */
    basicEdgeDetector: function (x, y, rgbaNeighborhood) {
        var neighborTotal = neighborTotals(false, rgbaNeighborhood);

        var myAverage = (rgbaNeighborhood[4].r + rgbaNeighborhood[4].g + rgbaNeighborhood[4].b) / 3;
        var neighborAverage = (neighborTotal.r + neighborTotal.g + neighborTotal.b) / 3 / 8; // Three components, eight neighbors.

        return myAverage < neighborAverage ? [ 0, 0, 0, rgbaNeighborhood[4].a ] :
                [ 255, 255, 255, rgbaNeighborhood[4].a ];
    },

    // Will make sure that all RGB values are above 128...
    lowerThresholdAverager: function (x, y, rgbaNeighborhood) {
        var neighborTotal = neighborTotals(true, rgbaNeighborhood);

        var rResult = (neighborTotal.r / 9 < 128) ? 255 - rgbaNeighborhood[4].r : rgbaNeighborhood[4].r;
        var gResult = (neighborTotal.g / 9 < 128) ? 255 - rgbaNeighborhood[4].g : rgbaNeighborhood[4].g;
        var bResult = (neighborTotal.b / 9 < 128) ? 255 - rgbaNeighborhood[4].b : rgbaNeighborhood[4].b;

        return [rResult, gResult, bResult, rgbaNeighborhood[4].a];
    },

    // Will make sure that all RGB values are below 128...
    upperThresholdAverager: function (x, y, rgbaNeighborhood) {
        var neighborTotal = neighborTotals(true, rgbaNeighborhood);

        var rResult = (neighborTotal.r / 9 > 128) ? 255 - rgbaNeighborhood[4].r : rgbaNeighborhood[4].r;
        var gResult = (neighborTotal.g / 9 > 128) ? 255 - rgbaNeighborhood[4].g : rgbaNeighborhood[4].g;
        var bResult = (neighborTotal.b / 9 > 128) ? 255 - rgbaNeighborhood[4].b : rgbaNeighborhood[4].b;

        return [rResult, gResult, bResult, rgbaNeighborhood[4].a];
    },

    nonConformer: function (x, y, rgbaNeighborhood) {
        var neighborTotal = neighborTotals(false, rgbaNeighborhood);

        var neighborAverage = {
            "r": 0,
            "g": 0,
            "b": 0
        };

        neighborAverage.r = neighborTotal.r / 8;
        neighborAverage.g = neighborTotal.g / 8;
        neighborAverage.b = neighborTotal.b / 8; // Three components, eight neighbors.

        var result = {};
        for (var colorPart in neighborAverage) {
            result[colorPart] = (rgbaNeighborhood[4][colorPart] > neighborAverage[colorPart]) ? 
                rgbaNeighborhood[4][colorPart] + (255 - rgbaNeighborhood[4][colorPart]) / 2 :
                rgbaNeighborhood[4][colorPart] / 2;
        }
        return [result.r, result.g, result.b, rgbaNeighborhood[4].a];
    },

    /*
     * Applies the given filter to the given ImageData object,
     * then modifies its pixels according to the given filter.
     *
     * A filter is a function ({r, g, b, a}[9]) that returns another
     * color as a 4-element array representing the new RGBA value
     * that should go in the center pixel.
     */
    applyFilter: function (renderingContext, imageData, filter) {
        // For every pixel, replace with something determined by the filter.
        var result = renderingContext.createImageData(imageData.width, imageData.height);
        var rowWidth = imageData.width * 4;
        var sourceArray = imageData.data;
        var destinationArray = result.data;

        // A convenience function for creating an rgba object.
        var rgba = function (startIndex) {
            return {
                r: sourceArray[startIndex],
                g: sourceArray[startIndex + 1],
                b: sourceArray[startIndex + 2],
                a: sourceArray[startIndex + 3]
            };
        };

        for (var i = 0, max = imageData.width * imageData.height * 4; i < max; i += 4) {
            // The 9-color array that we build must factor in image boundaries.
            // If a particular location is out of range, the color supplied is that
            // of the extant pixel that is adjacent to it.
            var iAbove = i - rowWidth;
            var iBelow = i + rowWidth;
            var pixelColumn = i % rowWidth;
            var firstRow = sourceArray[iAbove] === undefined;
            var lastRow = sourceArray[iBelow] === undefined;

            var pixelIndex = i / 4;
            var pixel = filter(pixelIndex % imageData.width, Math.floor(pixelIndex / imageData.height),
                [
                    // The row of pixels above the current one.
                    firstRow ?
                        (pixelColumn ? rgba(i - 4) : rgba(i)) :
                        (pixelColumn ? rgba(iAbove - 4) : rgba(iAbove)),

                    firstRow ? rgba(i) : rgba(iAbove),

                    firstRow ?
                        ((pixelColumn < rowWidth - 4) ? rgba(i + 4) : rgba(i)) :
                        ((pixelColumn < rowWidth - 4) ? rgba(iAbove + 4) : rgba(iAbove)),

                    // The current row of pixels.
                    pixelColumn ? rgba(i - 4) : rgba(i),

                    // The center pixel: the filter's returned color goes here
                    // (based on the loop, we are at least sure to have this).
                    rgba(i),

                    (pixelColumn < rowWidth - 4) ? rgba(i + 4) : rgba(i),

                    // The row of pixels below the current one.
                    lastRow ?
                        (pixelColumn ? rgba(i - 4) : rgba(i)) :
                        (pixelColumn ? rgba(iBelow - 4) : rgba(iBelow)),

                    lastRow ? rgba(i) : rgba(iBelow),

                    lastRow ?
                        ((pixelColumn < rowWidth - 4) ? rgba(i + 4) : rgba(i)) :
                        ((pixelColumn < rowWidth - 4) ? rgba(iBelow + 4) : rgba(iBelow))
                ]
            );

            // Apply the color that is returned by the filter.
            for (var j = 0; j < 4; j += 1) {
                destinationArray[i + j] = pixel[j];
            }
        }

        return result;
    }
};
