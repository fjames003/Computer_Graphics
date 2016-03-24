/*
 * This JavaScript file defines a Matrix object and associated functions.
 * The object itself is returned as the result of a function, allowing us
 * to encapsulate its code and module variables.
 *
 * This module's approach is non-destructive: methods always return new
 * Matrix objects, and never modify the operands.  This is a design choice.
 *
 * This module is designed for matrices of any number of dimensions.  The
 * implementations are generalized but not optimal for certain sizes of
 * matrices.
 */
var Matrix = (function () {
   var matrix = function () {
        this.elements = [];
        if (arguments.length !== 0) {
            for (var i = 0; i < 4; i +=1) {
                this.elements[i] = [].slice.call(arguments[0][i]);
            }
            checkDimensions(this, new Matrix());
        } else {
            this.elements = identityMatrix();
        }
    };

    // Helper function to create an identity matrix;
    var identityMatrix = function() {
        return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    };

    // A private method for checking dimensions,
    // throwing an exception when different.
    var checkDimensions = function (m1, m2) {
        if (m1.rowDimensions() !== m2.rowDimensions()) {
            throw "Matrix does not have four rows";
        } else {
            for (var i = 0; i < 4; i += 1) {
                if (m1.elements[i].length !== m2.elements[i].length) {
                    throw "Matrix does not have four columns";
                }
            }
        }
    };

    matrix.prototype.rowDimensions = function () {
        return this.elements.length;
    };

    matrix.prototype.colDimensions = function () {
        return this.elements[0].length;
    };

    matrix.prototype.size = function () {
        return [this.rowDimensions(), this.colDimensions()];
    };

    matrix.prototype.multiply = function (s) {
        // A check in case arbitrary matrices are added...
        if (this.colDimensions() !== s.rowDimensions()) {
            throw "Cannot multiply matrix (m x n) if the second matrix is not (n x k)"
        }
        var result = new Matrix();

        var rowMax = this.rowDimensions();
        var colMax = this.colDimensions();
        var identityCounter = 0
        for (var i = 0; i < rowMax; i += 1) {
            result.elements[i][identityCounter] = 0;
            identityCounter += 1;
            for (var j = 0; j < colMax; j +=1) {
                for (var k = 0; k < colMax; k += 1) {
                    result.elements[i][j] += this.elements[i][k] * s.elements[k][j];
                }
            }
        }
        return result;
    };

    // vector.prototype.add = function (v) {
    //     var result = new Vector();

    //     checkDimensions(this, v);

    //     for (var i = 0, max = this.dimensions(); i < max; i += 1) {
    //         result.elements[i] = this.elements[i] + v.elements[i];
    //     }

    //     return result;
    // };

    // vector.prototype.subtract = function (v) {
    //     var result = new Vector();

    //     checkDimensions(this, v);

    //     for (var i = 0, max = this.dimensions(); i < max; i += 1) {
    //         result.elements[i] = this.elements[i] - v.elements[i];
    //     }

    //     return result;
    // };

    // vector.prototype.divide = function (s) {
    //     var result = new Vector();

    //     for (var i = 0, max = this.dimensions(); i < max; i += 1) {
    //         result.elements[i] = this.elements[i] / s;
    //     }

    //     return result;
    // };

    // vector.prototype.dot = function (v) {
    //     var result = 0;

    //     checkDimensions(this, v);

    //     for (var i = 0, max = this.dimensions(); i < max; i += 1) {
    //         result += this.elements[i] * v.elements[i];
    //     }

    //     return result;
    // };

    // vector.prototype.cross = function (v) {
    //     if (this.dimensions() !== 3 || v.dimensions() !== 3) {
    //         throw "Cross product is for 3D vectors only.";
    //     }

    //     // With 3D vectors, we can just return the result directly.
    //     return new Vector(
    //         (this.y() * v.z()) - (this.z() * v.y()),
    //         (this.z() * v.x()) - (this.x() * v.z()),
    //         (this.x() * v.y()) - (this.y() * v.x())
    //     );
    // };

    // vector.prototype.magnitude = function () {
    //     return Math.sqrt(this.dot(this));
    // };

    // vector.prototype.unit = function () {
    //     // At this point, we can leverage our more "primitive" methods.
    //     return this.divide(this.magnitude());
    // };

    // vector.prototype.projection = function (v) {
    //     checkDimensions(this, v);

    //     // Plug and chug :)
    //     // The projection of u onto v is u dot the unit vector of v
    //     // times the unit vector of v.
    //     var unitv = v.unit();
    //     return unitv.multiply(this.dot(unitv));
    // };

    return matrix;
})();
