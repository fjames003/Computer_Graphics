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
    var checkDimensions = function (v1, v2) {
        if (v1.dimensions() !== v2.dimensions()) {
            throw "Vectors have different dimensions";
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

    // vector.prototype.multiply = function (s) {
    //     var result = new Vector();

    //     for (var i = 0, max = this.dimensions(); i < max; i += 1) {
    //         result.elements[i] = this.elements[i] * s;
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