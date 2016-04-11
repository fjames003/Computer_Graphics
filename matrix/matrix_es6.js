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
const Matrix = ((() => {
    class matrix {
        constructor() {
             this.elements = [];
             if (arguments.length !== 0) {
                 for (let i = 0; i < 4; i +=1) {
                     this.elements[i] = [].slice.call(arguments[0][i]);
                 }
                 checkDimensions(this, new Matrix());
             } else {
                 this.elements = identityMatrix();
             }
         }

        rowDimensions() {
            return this.elements.length;
        }

        colDimensions() {
            return this.elements[0].length;
        }

        size() {
            return [this.rowDimensions(), this.colDimensions()];
        }

        multiply(s) {
            // A check in case arbitrary matrices are added...
            if (this.colDimensions() !== s.rowDimensions()) {
                throw "Cannot multiply matrix (m x n) if the second matrix is not (n x k)";
            }
            const result = new Matrix();

            const thisRowMax = this.rowDimensions();
            const thisColMax = this.colDimensions();
            const sColMax = s.colDimensions();
            const identityCounter = 0;

            this.forEach((value, index, matrix) => {
                result.elements[index[0]][index[1]] = 0;
                for (let i = 0; i < matrix.colDimensions(); i += 1) {
                    result.elements[index[0]][index[1]] += matrix.elements[index[0]][i] * s.elements[i][index[1]];
                }
            });
            return result;
        }

        translate(dx, dy, dz) {
            checkArgs(3, arguments);
            const result = new Matrix();

            result.elements[0][3] = dx;
            result.elements[1][3] = dy;
            result.elements[2][3] = dz;

            return result;
        }

        static translate(dx, dy, dz) {
            return new Matrix().translate(dx, dy, dz);
        }

        scale(sx, sy, sz) {
            checkArgs(3, arguments);
            const result = new Matrix();

            result.elements[0][0] = sx;
            result.elements[1][1] = sy;
            result.elements[2][2] = sz;

            return result;
        }

        static scale(sx, sy, sz) {
            return new Matrix().scale(sx, sy, sz);
        }

        rotation(thetaVal, rx, ry, rz) {
            checkArgs(4, arguments);
            const result = new Matrix();

            const axisLength = Math.sqrt(rx * rx + ry * ry + rz * rz);
            const sine   = Math.sin(thetaVal * Math.PI / 180.0);
            const cosine = Math.cos(thetaVal * Math.PI / 180.0);
            const oneMinusCosine = 1.0 - cosine;

            rx /= axisLength;
            ry /= axisLength;
            rz /= axisLength;

            const x2 = rx * rx;
            const y2 = ry * ry;
            const z2 = rz * rz;
            const xy = rx * ry;
            const yz = ry * rz;
            const xz = rx * rz;
            const xs = rx * sine;
            const ys = ry * sine;
            const zs = rz * sine;

            result.elements[0][0] = x2 * oneMinusCosine + cosine;
            result.elements[0][1] = xy * oneMinusCosine - zs;
            result.elements[0][2] = xz * oneMinusCosine + ys;

            result.elements[1][0] = xy * oneMinusCosine + zs;
            result.elements[1][1] = y2 * oneMinusCosine + cosine;
            result.elements[1][2] = yz * oneMinusCosine - xs;

            result.elements[2][0] = xz * oneMinusCosine - ys;
            result.elements[2][1] = yz * oneMinusCosine + xs;
            result.elements[2][2] = z2 * oneMinusCosine + cosine;

            return result;
        }

        static rotation(thetaVal, rx, ry, rz) {
            return new Matrix().rotation(thetaVal, rx, ry, rz);
        }

        orthographic(left, right, bottom, top, near, far) {
            checkArgs(6, arguments);
            const result = new Matrix();

            result.elements[0][0] = 2.0 / (right - left);
            result.elements[1][1] = 2.0 / (top - bottom);
            result.elements[2][2] = -2.0 / (far - near);
            result.elements[0][3] = -(right + left) / (right - left);
            result.elements[1][3] = -(top + bottom) / (top - bottom);
            result.elements[2][3] = -(far + near) / (far - near);

            return result;
        }

        static orthographic(left, right, bottom, top, near, far) {
            return new Matrix().orthographic(left, right, bottom, top, near, far);
        }

        perspective(left, right, bottom, top, near, far) {
            checkArgs(6, arguments);
            const result = new Matrix();

            result.elements[0][0] = (2.0 * near) / (right - left);
            result.elements[1][1] = (2.0 * near) / (top - bottom);
            result.elements[2][2] = -(far + near) / (far - near);

            result.elements[0][2] = (right + left) / (right - left);
            result.elements[1][2] = (top + bottom) / (top - bottom);
            result.elements[2][3] = -(2.0 * near * far) / (far - near);

            result.elements[3][2] = -1;
            result.elements[3][3] = 0;

            return result;
        }

        static perspective(left, right, bottom, top, near, far) {
            return new Matrix().perspective(left, right, bottom, top, near, far);
        }

        toWebGL() {
            const result = [];

            this.forEach((value, index, matrix) => {
                result.push(matrix.elements[index[1]][index[0]]);
            });
            return new Float32Array(result);
        }

        forEach(func) {
            const rowMax = this.rowDimensions();
            const colMax = this.colDimensions();
            for(let row = 0; row < rowMax; row += 1) {
                for (let col = 0; col < colMax; col += 1) {
                    func(this.elements[row][col], [row, col], this);
                }
            }
        }

        copy() {
            return new Matrix(this.elements);
        }
    }

    // Helper function to create an identity matrix;
    var identityMatrix = () => [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

    // A private method for checking dimensions,
    // throwing an exception when different.
    var checkDimensions = (m1, m2) => {
        if (m1.rowDimensions() !== m2.rowDimensions()) {
            throw "Matrix does not have four rows";
        } else {
            for (let i = 0; i < 4; i += 1) {
                if (m1.elements[i].length !== m2.elements[i].length) {
                    throw "Matrix does not have four columns";
                }
            }
        }
    };

    var checkArgs = (expectedNum, args) => {
        const givenArgs = [].slice.call(args);
        if (givenArgs.length > expectedNum) {
            throw "Too many arguments provided to matrix function";
        }
        for (let i = 0; i < expectedNum; i += 1) {
            if (i >= givenArgs.length || (givenArgs[i] === 0) ? false : !givenArgs[i]) {
                throw "Not enough arguments provided to matrix function";
            }
        }
    };

    return matrix;
}))();
