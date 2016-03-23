/*
 * Unit tests for our mector object.
 */
$(function () {

    // This suite checks instantiation basics.
    test("Creation and Data Access", function () {

        var mat = new Matrix([[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]);

        equal(mat.rowDimensions(), 4, "Matrix row size");
        equal(mat.colDimensions(), 4, "Matrix column size");
        equal(mat.size(), [4,4], "Matrix size");
        for (var i = 0; i < 16; i += 1) {
            equal(mat.elements[i], i + 1, "Element " + (i + 1) + " by index");
        };

        // By default the matrix object should intialize to the identity matrix
        mat = new Mector();

        equal(mat.rowDimensions(), 4, "Matrix row size");
        equal(mat.colDimensions(), 4, "Matrix column size");
        equal(mat.size(), [4,4], "Matrix size");
        for (var i = 0; i < 16; i += 1) {
            if (i === 0 || i === 5 || i === 10 || i === 15) {
                equal(mat.elements(i), 1, "Diagonal of ones in identity matrix");
            } else {
                equal(mat.elements(i), 0, "Non-diagonal elements of identity matrix");
            }
        };
    });
});
