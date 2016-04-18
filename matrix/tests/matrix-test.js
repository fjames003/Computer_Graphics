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
        deepEqual(mat1.multiply(mat2), new Matrix(),
                 "Multiply two identity matrices should produce a new identity matrix");

        var mat1 = new Matrix([[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]);
        var mat2 = new Matrix([[16,15,14,13], [12,11,10,9], [8,7,6,5], [4,3,2,1]]);

        deepEqual(mat1.multiply(mat2), new Matrix([[80 ,70 ,60 ,50 ],
                                                   [240,214,188,162],
                                                   [400,358,316,274],
                                                   [560,502,444,386]]),
                                                   "Multiply two 4 x 4 matrix with all positive integers");
    });

    test("3D Translation Matrix", function () {
        var mat1 = new Matrix();
        deepEqual(mat1.translate(5, -3, 1.2), new Matrix([[1, 0, 0, 5],
                                                          [0, 1, 0, -3],
                                                          [0, 0, 1, 1.2],
                                                          [0, 0, 0, 1]]),
                                                          "Creating a 3D translation matrix from existing matrix");

        deepEqual(Matrix.translate(5, -3, 1.2), new Matrix([[1, 0, 0, 5],
                                                          [0, 1, 0, -3],
                                                          [0, 0, 1, 1.2],
                                                          [0, 0, 0, 1]]),
                                                          "Creating a 3D translation matrix from class");

        throws(
            function () {
                var mat = new Matrix(1, -1);
            },
            "Check translate function missing one arg"
        );
        throws(
            function () {
                Matrix.translate();
            },
            "Check translate function with no args"
        );
    });

    test("3D Scale Matrix", function () {
        var mat1 = new Matrix();
        deepEqual(mat1.scale(5.2, 2, -4), new Matrix([[5.2, 0, 0, 0],
                                                      [0, 2, 0, 0],
                                                      [0, 0, -4, 0],
                                                      [0, 0, 0, 1 ]]),
                                                      "Creating a 3D scale matrix from existing matrix");

        deepEqual(Matrix.scale(-4, 5.2, 2), new Matrix([[-4, 0, 0, 0],
                                                      [0, 5.2, 0, 0],
                                                      [0, 0, 2, 0],
                                                      [0, 0, 0, 1 ]]), "Creating a 3D scale matrix from class");

        throws(
            function () {
                Matrix.scale(-0.5, 0.5);
            },
            "Check scale function missing one arg"
        );
        throws(
            function () {
                Matrix.scale();
            },
            "Check scale function with no args"
        );
    });

    test("Orthographic projection matrices", function () {
        var mat1 = new Matrix();

        // Weird looking line because of length...
        deepEqual(mat1.orthographic(0.5, 1.5, 2, 2.5, 1, 0), new Matrix([[2, 0, 0, -2],
                                                                         [0, 4, 0, -9],
                                                                         [0, 0, 2, 1],
                                                                         [0, 0, 0, 1]]),
            "Creating a 3D orthographic projection matrix from existing matrix");

        var mat1 = Matrix.orthographic(-0.4, 0.6, -0.75, 0.9, -0.5, 1);
        var tester = new Matrix([[2 / 1.0, 0, 0, -0.2 / 1.0],
                                 [0, 2 / 1.65, 0, -0.15 / 1.65],
                                 [0, 0, -2 / 1.5, -0.5 / 1.5],
                                 [0, 0, 0, 1]]);
        mat1.forEach(function(value, index, matrix) {
            QUnit.close(value, tester.elements[index[0]][index[1]], 0.000001,
                        "Creating a 3D orthographic projection matrix from class");
        });

        throws(
            function () {
                Matrix.orthographic(2, 2.5, 0.5, 1.5, 1);
            },
            "Check orthographic function missing one arg"
        );
        throws(
            function () {
                Matrix.orthographic();
            },
            "Check orthographic function with no args"
        );
    });

    test("Perspective projection matrices", function () {
        var mat1 = new Matrix();
        deepEqual(mat1.perspective(0.5, 1.5, 2, 2.5, 1, 0), new Matrix([[2, 0, 2, 0],
                                                                         [0, 4, 9, 0],
                                                                         [0, 0, 1, 0],
                                                                         [0, 0, -1, 0]]),
            "Creating a 3D perspective matrix from existing matrix");

        deepEqual(Matrix.perspective(2, 2.5, 0.5, 1.5, 1, 0), new Matrix([[4, 0, 9, 0],
                                                                          [0, 2, 2, 0],
                                                                          [0, 0, 1, 0],
                                                                          [0, 0, -1, 0]]),
            "Creating a 3D perspective matrix from class");
        throws(
            function () {
                Matrix.perspective(-0.4, 0.6, -0.75, 0.9, -0.5);
            },
            "Check perspective function missing one arg"
        );
        throws(
            function () {
                Matrix.perspective();
            },
            "Check perspective function with no args"
        );
    });

    // All tested to within 1 * 10 ^ -6 (one millionth)
    test("3D Rotation matrix", function () {
        var mat1 = new Matrix();
        var tester = mat1.rotation(90, 0.0, 1.0, 0.0);
        var yRot = new Matrix([[0, 0, 1, 0],
                               [0, 1, 0, 0],
                               [-1, 0, 0, 0],
                               [0, 0, 0, 1]]);
        tester.forEach(function(value, index, matrix) {
            QUnit.close(value, yRot.elements[index[0]][index[1]], 0.000001,
                        "Creating a 3D rotation matrix about the y axis");
        });

        tester = mat1.rotation(270, 1.0, 0.0, 0.0);
        var xRot = new Matrix([[1, 0, 0, 0],
                               [0, 0, 1, 0],
                               [0, -1, 0, 0],
                               [0, 0, 0, 1]]);
        tester.forEach(function(value, index, marix) {
            QUnit.close(value, xRot.elements[index[0]][index[1]], 0.000001,
                        "Creating a 3D rotation matrix about the x axis");
        });

        tester = mat1.rotation(180, 0.0, 0.0, 1.0);
        var zRot = new Matrix([[-1, 0, 0, 0],
                               [0, -1, 0, 0],
                               [0, 0, 1, 0],
                               [0, 0, 0, 1]]);
        tester.forEach(function(value, index, marix) {
            QUnit.close(value, zRot.elements[index[0]][index[1]], 0.000001,
                        "Creating a 3D rotation matrix about the z axis");
        });

        tester = mat1.rotation(30, 0.75, -0.5, 0.3);
        var axisLength = Math.sqrt(0.75 * 0.75 + -0.5 * -0.5 + 0.3 * 0.3);
        var cosine = Math.sqrt(3) / 2;
        var oneMinusC = 1 - cosine;
        var sine = 0.5;
        var x = 0.75 / axisLength;
        var y = -0.5 / axisLength;
        var z = 0.30 / axisLength;
        var xyzRot = new Matrix([[(x * x) * oneMinusC + cosine,
                                  (x * y) * oneMinusC - (z * sine),
                                  (x * z) * oneMinusC + (y * sine), 0],
                                 [(x * y) * oneMinusC + (z * sine),
                                  (y * y) * oneMinusC + cosine,
                                  (y * z) * oneMinusC - (x * sine), 0],
                                 [(x * z) * oneMinusC - (y * sine),
                                  (y * z) * oneMinusC + (x * sine),
                                  (z * z) * oneMinusC + cosine, 0],
                                 [0, 0, 0, 1]]);
        tester.forEach(function(value, index, marix) {
            QUnit.close(value, xyzRot.elements[index[0]][index[1]], 0.000001,
                        "Creating a 3D rotation matrix about an arbitray axis from existing matrix, index: " + index);
        });

        tester = Matrix.rotation(30, 0.75, -0.5, 0.3);
        tester.forEach(function(value, index, marix) {
            QUnit.close(value, xyzRot.elements[index[0]][index[1]], 0.000001,
                        "Creating a 3D rotation matrix about an arbitray axis from class, index: " + index);
        });

        throws(
            function () {
                Matrix.rotation(-0.4, 0.6, -0.75);
            },
            "Check rotation function missing one arg"
        );
        throws(
            function () {
                Matrix.rotation();
            },
            "Check rotation function with no args"
        );
    });

    test("Conversion to WebGL and GLSL format", function () {
        var mat1 = new Matrix([[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]);
        deepEqual(mat1.toWebGL(), new Float32Array([1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,16]),
                  "Converting a matrix to WebGL format");
    });

    test("ForEach function", function () {
        var mat1 = new Matrix([[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]);
        var count = 1;
        mat1.forEach(function(value, index, matrix) {
            equal(value, count, "Testing value retrieval of forEach");
            count += 1;
        });
    });

    test("Vector Multiplication", function () {
        var mat1 = new Matrix([[1,0,-3,4], [0,6,7,-8], [3,10,0,12], [0,0,0,1]]);
        var vec1 = new Vector(0, 0, 0, 1);
        deepEqual(mat1.multiplyVector(vec1), new Vector(4, -8, 12, 1), "Testing matrix multiplied to a vector");
    })
});
