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

        var thisRowMax = this.rowDimensions();
        var thisColMax = this.colDimensions();
        var sColMax = s.colDimensions();
        var identityCounter = 0
        // for (var i = 0; i < thisRowMax; i += 1) {
        //     result.elements[i][identityCounter] = 0;
        //     identityCounter += 1;
        //     for (var j = 0; j < sColMax; j +=1) {
        //         for (var k = 0; k < thisColMax; k += 1) {
        //             result.elements[i][j] += this.elements[i][k] * s.elements[k][j];
        //         }
        //     }
        // }
        // Not sure if this code will work for arbitrary matrices, will leave code above here for now...
        this.forEach(function(value, index, matrix) {
            result.elements[index[0]][index[1]] = 0;
            for (var i = 0; i < matrix.colDimensions(); i += 1) {
                result.elements[index[0]][index[1]] += matrix.elements[index[0]][i] * s.elements[i][index[1]];
            }
        });
        return result;
    };

    matrix.prototype.translate = function (dx, dy, dz) {
        var result = new Matrix();

        result.elements[0][3] = dx;
        result.elements[1][3] = dy;
        result.elements[2][3] = dz;

        return result;
    };

    matrix.prototype.scale = function (sx, sy, sz) {
        var result = new Matrix();

        result.elements[0][0] = sx;
        result.elements[1][1] = sy;
        result.elements[2][2] = sz;

        return result;
    };

    matrix.prototype.rotation = function (theta, x, y, z) {
        var result = new Matrix();

        var axisLength = Math.sqrt(x * x + y * y + z * z);
        var sine   = Math.sin(angle * Math.PI / 180.0);
        var cosine = Math.cos(angle * Math.PI / 180.0);
        var oneMinusCosine = 1.0 - cosine;

        x /= axisLength;
        y /= axisLength;
        z /= axisLength;

        var x2 = x * x;
        var y2 = y * y;
        var z2 = z * z;
        var xy = x * y;
        var yz = y * z;
        var xz = x * z;
        var xs = x * sine;
        var ys = y * sine;
        var zs = z * sine;

        result.elements[0][0] = x2 * oneMinusCosine + cosine;
        result.elements[0][1] = xy * oneMinusCosine - zs;
        result.elements[0][2] = xz * oneMinusCosine + ys;

        result.elements[1][0] = xy * oneMinusCosine + zs;
        result.elements[1][1] = y2 * oneMinusCosine + cosine;
        result.elements[1][2] = yz * oneMinusCosine - xs

        result.elements[2][0] = xz * oneMinusCosine - ys;
        result.elements[2][1] = yz * oneMinusCosine + xs;
        result.elements[2][2] = z2 * oneMinusCosine + cosine;
        
        return result;
    };

    matrix.prototype.orthographic = function (left, right, bottom, top, near, far) {
        var result = new Matrix();

        result.elements[0][0] = 2.0 / (right - left);
        result.elements[1][1] = 2.0 / (top - bottom);
        result.elements[2][2] = -2.0 / (far - near);
        result.elements[0][3] = -(right + left) / (right - left);
        result.elements[1][3] = -(top + bottom) / (top - bottom);
        result.elements[2][3] = -(far + near) / (far - near);

        return result;
    };

    matrix.prototype.perspective = function (left, right, bottom, top, near, far) {
        var result = new Matrix();

        result.elements[0][0] = (2.0 * near) / (right - left);
        result.elements[1][1] = (2.0 * near) / (top - bottom);
        result.elements[2][2] = -(far + near) / (far - near);

        result.elements[0][2] = (right + left) / (right - left);
        result.elements[1][2] = (top + bottom) / (top - bottom);
        result.elements[2][3] = -(2.0 * near * far) / (far - near);

        result.elements[3][2] = -1;
        result.elements[3][3] = 0;

        return result;
    };

    matrix.prototype.toWebGL = function () {
        var result = [];

        this.forEach(function(value, index, matrix) {
            result.push(matrix.elements[index[1]][index[0]]);
        });
        return new Float32Array(result);
    };

    matrix.prototype.forEach = function(func) {
        var row;
        var col;
        var rowMax = this.rowDimensions();
        var colMax = this.colDimensions();
        for(var row = 0; row < rowMax; row += 1) {
            for (var col = 0; col < colMax; col += 1) {
                func(this.elements[row][col], [row, col], this);
            }
        }
    };

    return matrix;
})();
