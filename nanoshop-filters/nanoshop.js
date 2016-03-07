/*
 * This is a very simple module that demonstrates rudimentary,
 * pixel-level image processing.
 */
var Nanoshop = {
    /*
     * A basic "darkener."
     */
    darkener: function (x, y, r, g, b, a) {
        return [ r / 2, g / 2, b / 2, a ];
    },

    // Simple conversion to gray scale i.e. black and white...
    grayScale: function (x, y, r, g, b, a) {
        var average = (r + g + b) / 3;
        return [average, average, average, a];
    },

    brighten: function (x, y, r, g, b, a) {
        return [(r * 2) % 255, (g * 2) % 255, (b * 2) % 255, a];
    },

    inverse: function (x, y, r, g, b, a) {
        return [255 - r, 255 - g, 255 - b, a];
    },

    /*
     * Applies the given filter to the given ImageData object,
     * then modifies its pixels according to the given filter.
     *
     * A filter is a function (x, y, r, g, b, a) that returns another
     * pixel as a 4-element array representing an RGBA value.
     */
    applyFilter: function (imageData, filter) {
        // For every pixel, replace with something determined by the filter.
        var pixelArray = imageData.data;

        for (var i = 0, max = imageData.width * imageData.height * 4; i < max; i += 4) {
            var pixelIndex = i / 4;

            var pixel = filter(
                pixelIndex % imageData.width, Math.floor(pixelIndex / imageData.height),
                pixelArray[i], pixelArray[i + 1], pixelArray[i + 2], pixelArray[i + 3]
            );

            for (var j = 0; j < 4; j += 1) {
                pixelArray[i + j] = pixel[j];
            }
        }

        return imageData;
    }
};
