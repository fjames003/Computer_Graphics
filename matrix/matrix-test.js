/*
 * Unit tests for our mector object.
 */
$(function () {

    // This suite checks instantiation basics.
    test("Creation and Data Access", function () {
        var count;
        var mat = new Matrix([[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]);

        equal(mat.rowDimensions(), 4, "Matrix row size");
        equal(mat.colDimensions(), 4, "Matrix column size");
        deepEqual(mat.size(), [4,4], "Matrix size");
        count = 1;
        for (var i = 0; i < 4; i += 1) {
            for (var j = 0; j < 4; j += 1) {
                equal(mat.elements[i][j], count, "Element " + count + " by index");
                count += 1;
            }
        };

        // By default the matrix object should intialize to the identity matrix
        mat = new Matrix();

        equal(mat.rowDimensions(), 4, "Matrix row size");
        equal(mat.colDimensions(), 4, "Matrix column size");
        deepEqual(mat.size(), [4,4], "Matrix size");
        for (var i = 0; i < 4; i += 1) {
            equal(mat.elements[i][i], 1, "Diagonals of identity matrix should be 1")
        };
        for (var i = 0; i < 4; i += 1) {
            for (var j = 0; j < 4; j += 1) {
                if (i !== j) {
                    equal(mat.elements[i][j], 0, "Non-Diagonal elements should be 0");
                }
            }
        };

    });
});
