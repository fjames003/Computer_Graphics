var Shape = (function () {
    // Constructor
    var shape = function (colors, vertices, mode) {
        this.parent = null;
        this.children = [];
        this.vertices = vertices;
        this.mode = mode;
        this.matrix = new Matrix();
        if (colors.r || colors.g || colors.b) {
            colors = colors || {r: 0.0, g: 0.0, b: 0.0};
            this.colors = [].concat(fillColors(vertices.length / 3, colors.r, colors.g, colors.b));
        } else {
            colors = (colors && colors.length >= 3) ? colors : [0.0, 0.0, 0.0];
            this.colors = colors;
            if (colors.length !== vertices.length) {
                this.colors = this.colors.concat(
                                            fillColors(vertices.length / 3 - colors.length / 3,
                                            this.colors[0],
                                            this.colors[1],
                                            this.colors[2])
                                          );
            }
        }
    };
    var fillColors = function (number, r, g, b) {
        var result = [];
        for (var i = 0; i < number; i += 1) {
            result = result.concat(
                r,
                g,
                b
            );
        }
        return result;
    };

    shape.prototype.initVertexBuffer = function (gl) {
        this.buffer = initBuffer(gl, this.vertices);
        return this;
    };

    shape.prototype.initColorBuffer = function (gl) {
        this.colorBuffer = initBuffer(gl, this.colors);
        return this;
    };

    shape.prototype.createChild = function (child) {
        if (arguments.length === 0) {
            var child = new Shape(this.colors, this.vertices, this.mode);
        }
        child.parent = this;
        child.matrix = this.matrix;
        this.children.push(child);
        return child;

    };

    shape.prototype.removeChild = function () {
        this.children.pop();
    }

    shape.prototype.scale = function(x, y, z) {
        this.matrix = this.matrix.multiply(new Matrix().scale(x, y, z));
        this.children.map(function (child) {
            child.scale(x, y, z);
        });
        return this;
    };

    shape.prototype.rotate = function(theta, x, y, z) {
        this.matrix = this.matrix.multiply(new Matrix().rotation(theta, x, y, z));
        this.children.map(function (child) {
            child.rotate(theta, x, y, z);
        });
        return this;
    };

    shape.prototype.translate = function(x, y, z) {
        this.matrix = this.matrix.multiply(new Matrix().translate(x, y, z));
        this.children.map(function (child) {
            child.translate(x, y, z);
        });
        return this;
    };

    shape.prototype.saveState = function() {
        this.savedMatrix = this.matrix.copy();
        //console.log(this, this.children)
        this.children.map(function (child) {
            child.saveState();
        });
    };

    shape.prototype.restoreState = function() {
        this.matrix = this.savedMatrix.copy();
        this.savedMatrix = null;
        this.children.map(function (child) {
            child.restoreState();
        });
    }

    shape.prototype.draw = function (gl, vertexColor, vertexPosition) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(this.mode, 0, this.vertices.length / 3);
    };

    var initBuffer = function (gl, sequence) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sequence),
                gl.STATIC_DRAW);

        return buffer;
    };
    return shape;
})();

var ShapeLibrary = { 
    sphere: (
        function () {

            var sphere = function (n, colors, mode) {
                var vertices = [];
                var indices = [];
                for (var i = 0.0; i < n; i += 1) {
                    for (var j = 0.0; j < n; j += 1) {
                        vertices = vertices.concat(
                            Math.sin(Math.PI * i/n) * Math.cos(2 * Math.PI * j/n),
                            Math.cos(Math.PI * i/n),
                            Math.sin(Math.PI * i/n) * Math.sin(2 * Math.PI * j/n) 
                        );
                    }
                }

                // for (var i = 0.0; i < n - 1; i += 1) {
                //     for (var j = 0.0; j < n - 1; j += 1) {
                //         var minimum = (i * (n + 1)) + j;
                //         var maximum = minimum + n + 1;

                //         indices.push(
                //             [minimum,
                //             maximum,
                //             minimum + 1]
                //         );
                //         indices.push(
                //             [maximum,
                //             maximum + 1,
                //             minimum + 1]
                //         );
                //     }
                // }

                // var result = [];
                // for (var i = 0, maxi = indices.length; i < maxi; i += 1) {
                //     for (var j = 0, maxj = indices[i].length; j < maxj; j += 1) {
                //         result = result.concat(
                //             vertices[
                //                 indices[i][j]
                //             ]
                //         );
                //     }
                // }
                // console.log(vertices)
                Shape.call(this, colors, vertices, mode);
            };

            sphere.prototype = Object.create(Shape.prototype);
            sphere.prototype.constructor = Shape;

            return sphere;
        }
    )(),
    cube: (
        function () {

            var cube = function (colors) {
                var vertices = [];
                // X / Z - y
                vertices = vertices.concat(-1, -1, -1);
                vertices = vertices.concat(-1, -1, 1);
                vertices = vertices.concat(1, -1, -1);
                vertices = vertices.concat(1, -1, 1);

                // X / Z + y

                vertices = vertices.concat(-1, 1, -1);
                vertices = vertices.concat(-1, 1, 1);
                vertices = vertices.concat(1, 1, -1);
                vertices = vertices.concat(1, 1, 1);

                // X / Y - z
                vertices = vertices.concat(-1, -1, -1);
                vertices = vertices.concat(-1, 1, -1);
                vertices = vertices.concat(1, -1, -1);
                vertices = vertices.concat(1, 1, -1);

                // X / Y + z
                vertices = vertices.concat(-1, -1, 1);
                vertices = vertices.concat(-1, 1, 1);
                vertices = vertices.concat(1, -1, 1);
                vertices = vertices.concat(1, 1, 1);

                // Y / Z + x
                vertices = vertices.concat(1, -1, -1);
                vertices = vertices.concat(1, 1, -1);
                vertices = vertices.concat(1, -1, 1);
                vertices = vertices.concat(1, 1, 1);

                // Y / Z - x
                vertices = vertices.concat(-1, -1, -1);
                vertices = vertices.concat(-1, 1, -1);
                vertices = vertices.concat(-1, -1, 1);
                vertices = vertices.concat(-1, 1, 1);

                Shape.call(this, colors, vertices, 5);
            };

            cube.prototype = Object.create(Shape.prototype);
            cube.prototype.constructor = Shape;

            return cube;
        }
    )(),
    pyramid: function () {
        var pyramid = function (colors) {
            var vertices = [];
            // Face 1
            vertices = vertices.concat(0, 1, 0);
            vertices = vertices.concat(-1, -1, -1);
            vertices = vertices.concat(-1, -1, 1);
            // Face 2
            vertices = vertices.concat(0, 1, 0);
            vertices = vertices.concat(-1, -1, 1);
            vertices = vertices.concat(1, -1, 1);
            // Face 3
            vertices = vertices.concat(0, 1, 0);
            vertices = vertices.concat(1, -1, 1);
            vertices = vertices.concat(1, -1, -1);  
            // Face 4
            vertices = vertices.concat(0, 1, 0);
            vertices = vertices.concat(1, -1, -1);      
            vertices = vertices.concat(-1, -1, -1);
            // Bottom - 1st half
            vertices = vertices.concat(-1, -1, -1);
            vertices = vertices.concat(1, -1, -1);
            vertices = vertices.concat(1, -1, 1);
            // Bottom - 2nd half
            vertices = vertices.concat(1, -1, 1);
            vertices = vertices.concat(-1, -1, 1);
            vertices = vertices.concat(-1, -1, -1);

            Shape.call(this, colors, vertices, 4);

        };

        pyramid.prototype = Object.create(Shape.prototype);
        pyramid.prototype.constructor = Shape;

        return pyramid;
    }(),
    icosohedron: function () {
        // Complements of Dondi...
        var icosohedron = function (colors, fill) {
            // These variables are actually "constants" for icosahedron coordinates.
            var X = 0.525731112119133606;
            var Z = 0.850650808352039932;

            var result =  {
                vertices: [
                    [ -X, 0.0, Z ],
                    [ X, 0.0, Z ],
                    [ -X, 0.0, -Z ],
                    [ X, 0.0, -Z ],
                    [ 0.0, Z, X ],
                    [ 0.0, Z, -X ],
                    [ 0.0, -Z, X ],
                    [ 0.0, -Z, -X ],
                    [ Z, X, 0.0 ],
                    [ -Z, X, 0.0 ],
                    [ Z, -X, 0.0 ],
                    [ -Z, -X, 0.0 ]
                ],

                indices: [
                    [ 1, 4, 0 ],
                    [ 4, 9, 0 ],
                    [ 4, 5, 9 ],
                    [ 8, 5, 4 ],
                    [ 1, 8, 4 ],
                    [ 1, 10, 8 ],
                    [ 10, 3, 8 ],
                    [ 8, 3, 5 ],
                    [ 3, 2, 5 ],
                    [ 3, 7, 2 ],
                    [ 3, 10, 7 ],
                    [ 10, 6, 7 ],
                    [ 6, 11, 7 ],
                    [ 6, 0, 11 ],
                    [ 6, 1, 0 ],
                    [ 10, 1, 6 ],
                    [ 11, 0, 9 ],
                    [ 2, 11, 9 ],
                    [ 5, 2, 9 ],
                    [ 11, 2, 7 ]
                ]
            };
            var newResult = [];
            if (fill) {

                for (var i = 0, maxi = result.indices.length; i < maxi; i += 1) {
                    for (var j = 0, maxj = result.indices[i].length; j < maxj; j += 1) {
                        newResult = newResult.concat(
                            result.vertices[
                                result.indices[i][j]
                            ]
                        );
                    }
                }
                Shape.call(this, colors, newResult, 4)
            } else {
                for (var i = 0, maxi = result.indices.length; i < maxi; i += 1) {
                    for (var j = 0, maxj = result.indices[i].length; j < maxj; j += 1) {
                        newResult = newResult.concat(
                            result.vertices[
                                result.indices[i][j]
                            ],

                            result.vertices[
                                result.indices[i][(j + 1) % maxj]
                            ]
                        );
                    }
                }
                Shape.call(this, colors, newResult, 1)
            }
            icosohedron.prototype = Object.create(Shape.prototype);
            icosohedron.prototype.constructor = Shape;
            return icosohedron; 
        }
    }()
};
