const Shape = ((() => {
    class shape {

        constructor (colors={r: 0, g: 0, b:0}, vertices, mode, indices=[]) {
            this.parent = null;
            this.children = [];
            this.indices = indices;
            // Check that point, line, or triangle mode was passed, else default to lines...
            this.mode = (mode === 0 || mode === 4 || mode === 5) ? mode : 1;
            this.matrix = new Matrix();

            var fillColors = function (number, r, g, b) {
                var result = [];
                for (var i = 0; i < number; i += 1) {
                    result = result.concat(r, g, b);
                }
                return result;
            };

            if (this.indices.length !== 0) {
                if (this.mode === 4) {
                    this.vertices = this.toRawTriangleArray({vertices: vertices, indices: indices});
                } else if (this.mode === 1) {
                    this.vertices = this.toRawLineArray({vertices: vertices, indices: indices});
                } else {
                    this.vertices = vertices;
                }
            } else {
                this.vertices = vertices;
            }

            if (colors.r || colors.g || colors.b) {
                this.colors = [].concat(fillColors(this.vertices.length / 3, colors.r, colors.g, colors.b));
            } else {
                colors = (colors && colors.length >= 3) ? colors : [0.0, 0.0, 0.0];
                this.colors = colors;
                if (colors.length !== this.vertices.length) {
                    this.colors = this.colors.concat(
                                                fillColors(this.vertices.length / 3 - this.colors.length / 3,
                                                this.colors[0],
                                                this.colors[1],
                                                this.colors[2])
                                              );
                }
            }
        }

        initVertexBuffer (gl) {
            this.buffer = initBuffer(gl, this.vertices);
            return this;
        }

        initColorBuffer (gl) {
            this.colorBuffer = initBuffer(gl, this.colors);
            return this;
        }

        createChild (child) {
            if (arguments.length === 0) {
                child = new Shape(this.colors, this.vertices, this.mode);
            }
            child.parent = this;
            child.matrix = this.matrix;
            this.children.push(child);
            return child;

        }

        removeChild () {
            this.children.pop();
        }

        scale (x, y, z) {
            this.matrix = this.matrix.multiply(new Matrix().scale(x, y, z));
            this.children.map(child => child.scale(x, y, z));
            return this;
        }

        rotate (theta, x, y, z) {
            this.matrix = this.matrix.multiply(new Matrix().rotation(theta, x, y, z));
            this.children.map(child => child.rotate(theta, x, y, z));
            return this;
        }

        translate (x, y, z) {
            this.matrix = this.matrix.multiply(new Matrix().translate(x, y, z));
            this.children.map(child => child.translate(x, y, z));
            return this;
        }

        saveState () {
            this.savedMatrix = this.matrix.copy();
            this.children.map(child => child.saveState());
        }

        restoreState () {
            this.matrix = this.savedMatrix.copy();
            this.savedMatrix = null;
            this.children.map(child => child.restoreState());
        }

        draw (gl, vertexColor, vertexPosition) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

            // Set the varying vertex coordinates.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(this.mode, 0, this.vertices.length / 3);
        }

        toRawTriangleArray (indexedVertices) {
            var result = [];
            for (var i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
                for (var j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                    result = result.concat(
                        indexedVertices.vertices[
                            indexedVertices.indices[i][j]
                        ]
                    );
                }
            }
            return result;
        }

        toRawLineArray (indexedVertices) {
            var result = [];
            for (var i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
                for (var j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                    result = result.concat(
                        indexedVertices.vertices[
                            indexedVertices.indices[i][j]
                        ],

                        indexedVertices.vertices[
                            indexedVertices.indices[i][(j + 1) % maxj]
                        ]
                    );
                }
            }
            return result;
        }
    }
    var initBuffer = function (gl, sequence) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sequence),
                      gl.STATIC_DRAW);

        return buffer;
    };
    return shape;
}))();



class Sphere extends Shape {
    constructor (n, colors, mode) {
        var vertices = [];
        var indices = [];
        for (let i = 0.0; i < n + 1; i += 1) {
            var theta = Math.PI * i/n;
            var sTheta = Math.sin(theta);
            var cTheta = Math.cos(theta);
            for (let j = 0.0; j < n + 1; j += 1) {
                vertices.push(
                    [
                        sTheta * Math.cos(2 * Math.PI * j/n),
                        cTheta,
                        sTheta * Math.sin(2 * Math.PI * j/n)
                    ]
                );
            }
        }

        for (let i = 0.0; i < n; i += 1) {
            for (let j = 0.0; j < n; j += 1) {
                var minimum = (i * (n + 1)) + j;
                var maximum = minimum + n + 1;

                indices.push(
                    [minimum,
                    maximum,
                    minimum + 1]
                );
                indices.push(
                    [maximum,
                    maximum + 1,
                    minimum + 1]
                );
            }
        }

        super(colors, vertices, mode, indices);
    }
}

class Cube extends Shape {
    // Need to make indices...
    constructor (colors, mode) {

        var vertices = [];
        var indices = [];
        // X / Z - y
        vertices.push([-1, -1, -1]);
        vertices.push([-1, -1, 1]);
        vertices.push([1, -1, -1]);
        vertices.push([1, -1, 1]);

        // X / Z + y
        vertices.push([-1, 1, -1]);
        vertices.push([-1, 1, 1]);
        vertices.push([1, 1, -1]);
        vertices.push([1, 1, 1]);

        // X / Y - z
        vertices.push([-1, -1, -1]);
        vertices.push([-1, 1, -1]);
        vertices.push([1, -1, -1]);
        vertices.push([1, 1, -1]);

        // X / Y + z
        vertices.push([-1, -1, 1]);
        vertices.push([-1, 1, 1]);
        vertices.push([1, -1, 1]);
        vertices.push([1, 1, 1]);

        // Y / Z + x
        vertices.push([1, -1, -1]);
        vertices.push([1, 1, -1]);
        vertices.push([1, -1, 1]);
        vertices.push([1, 1, 1]);

        // Y / Z - x
        vertices.push([-1, -1, -1]);
        vertices.push([-1, 1, -1]);
        vertices.push([-1, -1, 1]);
        vertices.push([-1, 1, 1]);

        indices = [
            [0, 1, 2],
            [3, 1, 2],
            [4, 5, 6],
            [7, 5, 6],
            [8, 9, 10],
            [11, 9, 10],
            [12, 13, 14],
            [15, 13, 14],
            [16, 17, 18],
            [19, 17, 18],
            [20, 21, 22],
            [23, 21, 22]
        ];


        super(colors, vertices, mode, indices);
    }
}

class Pyramid extends Shape {
    // Made of triangles... Thus no need for indices... Just provide the mode...
    constructor (colors, mode) {
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

        // Connect back to beginning
        vertices = vertices.concat(0, 1, 0);

        super(colors, vertices, mode);
    }
}

class Icosohedron extends Shape {
    constructor (colors, mode) {
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

        super (colors, result.vertices, mode, result.indices);
    }
}
