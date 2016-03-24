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

        // One row is short a column...
        throws(
            function () {
                var mat = new Matrix([[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15]])
            },
            "Check for same size columns"
        );
        // Only a 3 x 3 matrix
        throws(
            function () {
                var mat = new Matrix([[1,2,3], [5,6,7], [9,10,11]])
            },
            "Check for four rows without four columns"
        );
        // One column short...
        throws(
            function () {
                var mat = new Matrix([[1,2,3], [5,6,7], [9,10,11], [13,14,15]])
            },
            "Check for four columns with four rows"
        );
    });
    test("Multiplication", function () {
        var mat1 = new Matrix();
        var mat2 = new Matrix();
        deepEqual(mat1.multiply(mat2), new Matrix(), "Multiply two identity matrices should produce a new identity matrix");

        var mat1 = new Matrix([[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]);
        var mat2 = new Matrix([[16,15,14,13], [12,11,10,9], [8,7,6,5], [4,3,2,1]]);

        deepEqual(mat1.multiply(mat2), new Matrix([[80 ,70 ,60 ,50 ],
                                                   [240,214,188,162],
                                                   [400,358,316,274],
                                                   [560,502,444,386]]), "Multiply two 4 x 4 matrix with all positive integers");
    });

    test("3D Translation Matrix", function () {
        var mat1 = new Matrix();
        deepEqual(mat1.translate(5, -3, 1.2), new Matrix([[1, 0, 0, 5],
                                                          [0, 1, 0, -3],
                                                          [0, 0, 1, 1.2],
                                                          [0, 0, 0, 1]]), "Creating a 3D translation matrix");
    });

    test("3D Scale Matrix", function () {
        var mat1 = new Matrix();
        deepEqual(mat1.scale(5.2, 2, -4), new Matrix([[5.2, 0, 0, 0],
                                                      [0, 2, 0, 0],
                                                      [0, 0, -4, 0],
                                                      [0, 0, 0, 1 ]]), "Creating a 3D scale matrix");
    });

    test("Orthographic projection matrices", function () {
        var mat1 = new Matrix();
        deepEqual(mat1.orthographic(0.5, 1.5, 2, 2.5, 1, 0), new Matrix([[2, 0, 0, -2],
                                                                         [0, 4, 0, -9],
                                                                         [0, 0, 2, 1],
                                                                         [0, 0, 0, 1]]), "Creating a 3D orthographic projection matrix");
    });
    test("Perspective projection matrices", function () {
        var mat1 = new Matrix();
        deepEqual(mat1.perspective(0.5, 1.5, 2, 2.5, 1, 0), new Matrix([[2, 0, 2, 0],
                                                                         [0, 4, 9, 0],
                                                                         [0, 0, 1, 0],
                                                                         [0, 0, -1, 0]]), "Creating a 3D orthographic projection matrix");
    });
});
