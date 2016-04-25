const Shape = ((() => {
    class shape {
        // vertices, indices, mode=1, colors={r: 0, g: 0, b: 0}, specularColors={r: 1.0, g: 1.0, b: 1.0}, shininess=16
        constructor (specs) {
            if (!specs.vertices || !specs.indices) {
                throw "Either the vertex or face array were not provided. Both are required.";
            } else if (specs.vertices.length < 3 || specs.indices.length < specs.vertices.length / 3) {
                throw `Vertices and / or faces provided are not sufficient to make a shape.
                Minimum  3 vertices and a face for every three vertices.`;
            } else if (specs.vertices[0].length !== 3 || specs.indices[0].length !== 3) {
                throw `Vertex and / or face array not in correct format.
                Expected vertices as [[X, Y, Z], [X, Y, Z], [X, Y, Z]...] and
                expected faces as [[V1, V2, V3]...]`;
            } else {
                this.specs = specs;
                this.parent = null;
                this.children = [];
                this.states = [];
                this.matrix = new Matrix();
                this._mode = (specs.mode === 0 || specs.mode === 1 || specs.mode === 4) ? specs.mode : 1;
                this.compressedVertices = specs.vertices;
                this.textureCoord = specs.textureCoord;
                this.normals = specs.normals || [];

                this.textureId = specs.textureId;
                this.glTexture = specs.glTexture;
                this.textureSrc = specs.textureSrc;

                if (this.textureSrc && this.textureId && this.glTexture) {
                    this.setUpTexture(specs.gl);
                }

                // Set the vertices array according to the faces provided and the mode...
                this.indices = specs.indices;
                this.indexedVertices = {vertices: this.compressedVertices, indices: this.indices};

                this.setVertices();

                this.colors = this.checkColors((specs.colors) ? specs.colors : {r: 0, g: 0, b: 0});
                this.specularColors = this.checkColors(
                    (specs.specularColors) ? specs.specularColors : {r: 1.0, g: 1.0, b: 1.0}
                );
                this.shininess = specs.shininess || 1.0;
                this.buffersInitiated = {vertices: false, color: false}
            }
        }

        initVertexBuffer (gl) {
            this.buffer = initBuffer(gl, this.vertices);
            this.normalBuffer = initBuffer(gl, this.normals);
            this.textureCoordinateBuffer = initBuffer(gl, this.textureCoord);
            this.buffersInitiated.vertices = true;
            this.children.map(child => child.initVertexBuffer(gl));
            return this;
        }

        initColorBuffer (gl) {
            this.colorBuffer = initBuffer(gl, this.colors);
            this.specularBuffer = initBuffer(gl, this.specularColors);
            this.buffersInitiated.color = true;
            this.children.map(child => child.initColorBuffer(gl));
            return this;
        }

        addChild (child) {
            if (arguments.length === 0) {
                child = this.copy();
            }
            if (child instanceof Shape) {
                child.parent = this;
                child.matrix = this.matrix.copy();
                this.children.push(child);
                return child;
            } else {
                throw "Argument provided to addChild was not of type shape";
            }
        }

        copy () {
            return new Shape(this.specs);
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
            // this.matrix = new Matrix().rotation(theta, x, y, z).multiply(this.matrix);
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
            this.states.push(this.matrix.copy());
            this.children.map(child => child.saveState());
        }

        restoreState () {
            if (this.states.length > 0) {
                this.matrix = this.states.pop();
                this.children.map(child => child.restoreState());
            }
        }

        draw (gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix, textureCoordinate) {
            // if (this.parent && !this.multipiedAlready) {
            //     console.log(this.matrix, this.parent.matrix);
            //     this.matrix = this.parent.matrix.multiply(this.matrix);
            //     this.multipiedAlready = true;
            //     console.log(this.matrix, this.parent.matrix);
            // }
            if (!this.buffersInitiated.vertices || !this.buffersInitiated.color) {
                this.initVertexBuffer(gl);
                this.initColorBuffer(gl);
            }

            if (this.textureId && !this.textureReady) {
                return;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.vertexAttribPointer(vertexDiffuseColor, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.specularBuffer);
            gl.vertexAttribPointer(vertexSpecularColor, 3, gl.FLOAT, false, 0, 0);

            gl.uniform1f(shininess, this.shininess);

            gl.uniformMatrix4fv(transformMatrix, gl.FALSE, this.matrix.toWebGL());

            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);

            if (this.textureId && this.textureReady) {
                gl.enableVertexAttribArray(textureCoordinate);
                gl.activeTexture(this.textureId);
                gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinateBuffer);
                gl.vertexAttribPointer(textureCoordinate, 2, gl.FLOAT, false, 0, 0);
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);

            gl.drawArrays(this._mode, 0, this.vertices.length / 3);

            this.children.map(child => child.draw(gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix, textureCoordinate));
        }

        // JD: See below.
        //
        // TODO This is a quick and dirty fix to the texture coordinate issue. The key is that
        //      the number of texture coordinates must exactly match the number of *final* vertices,
        //      not the number of mesh vertices (which the code calls the "compressedVertices").
        //      Just to get things going, the texture coordinates are "unrolled" here. A more
        //      general solution that accommodates a wide range of possibilities, like different
        //      modes, whether there is even a texture, etc., will be needed.
        toRawArray (indexedVertices, isLines) {
            var result = [];

            for (var i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
                for (var j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                    result = result.concat(
                        indexedVertices.vertices[
                            indexedVertices.indices[i][j]
                        ]
                    );

                    if (isLines) {
                        result = result.concat(
                            indexedVertices.vertices[
                                indexedVertices.indices[i][(j + 1) % maxj]
                            ]
                        );
                    }
                }
            }
            // console.log(result.length);
            return result;
        }

        toNormalArray (indexedVertices, isLines) {
            var result = [];

            // For each face...
            for (var i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
                // We form vectors from the first and second then second and third vertices.
                var p0 = indexedVertices.vertices[indexedVertices.indices[i][0]];
                var p1 = indexedVertices.vertices[indexedVertices.indices[i][1]];
                var p2 = indexedVertices.vertices[indexedVertices.indices[i][2]];

                var v0 = new Vector(p0[0], p0[1], p0[2]);
                var v1 = new Vector(p1[0], p1[1], p1[2]).subtract(v0);
                var v2 = new Vector(p2[0], p2[1], p2[2]).subtract(v0);

                var normal = v1.cross(v2).unit();

                if (isLines) {
                    var p3 = indexedVertices.vertices[indexedVertices.indices[i][1]];
                    var p4 = indexedVertices.vertices[indexedVertices.indices[i][2]];
                    var p5 = indexedVertices.vertices[indexedVertices.indices[i][0]];

                    var v3 = new Vector(p3[0], p3[1], p3[2]);
                    var v4 = new Vector(p4[0], p4[1], p4[2]).subtract(v3);
                    var v5 = new Vector(p5[0], p5[1], p5[2]).subtract(v3);

                    var normal1 = v4.cross(v5).unit();
                }

                // We then use this same normal for every vertex in this face.
                for (var j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                    result = result.concat(
                        [ normal.x(), normal.y(), normal.z() ]
                    );
                    if(isLines) {
                        result = result.concat(
                            [ normal1.x(), normal1.y(), normal1.z() ]
                        )
                    }
                }
            }

            return result;
        }

        // Works if slices on sphere is very large...
        // toTextureArray(normals) {
        //     let result = []
        //     for (let i = 0; i < normals.length; i += 3) {
        //         result = result.concat(
        //             [Math.asin(normals[i]) / Math.PI + 0.5, Math.asin(normals[i + 1]) / Math.PI + 0.5]
        //         );
        //     }
        //     return result;
        // }

        toTextureArray(vertices) {
            let result = []
            for (let i = 0; i < vertices.length; i += 3) {
                let dHat = new Vector(vertices[i], vertices[i + 1], vertices[i + 2]).unit();
                result = result.concat(
                    [0.5 + Math.atan2(dHat.z(), dHat.x()) / (Math.PI * 2), 0.5 - Math.asin(dHat.y())/ Math.PI]
                );
            }
            return result;
        }

        set mode (newMode) {
            this._mode = newMode;
            this.setVertices();

        }
        get mode () {
            return this._mode;
        }
        setVertices () {
            if (this._mode === 0) {
                this.vertices = this.toRawPointArray(vertices);
            } else if (this._mode === 1) {
                this.vertices = this.toRawArray(this.indexedVertices, true);
                if (this.normals.length === 0) {
                    this.normals = this.toNormalArray(this.indexedVertices, true);
                }
            } else {
                this.vertices = this.toRawArray(this.indexedVertices, false);
                if (this.normals.length === 0) {
                    this.normals = this.toNormalArray(this.indexedVertices, false);
                }
            }
            if (this.textureId) {
                this.textureCoord = this.toTextureArray(this.vertices);
            }
        }
        checkColors (colors) {
            if (colors.r || colors.g || colors.b) {
                return [].concat(fillColors(this.vertices.length / 3, colors.r, colors.g, colors.b));
            } else {
                // Colors provided as an array... Make sure the array is long enough...
                colors = (colors && colors.length >= 3) ? colors : [0.0, 0.0, 0.0];
                if (colors.length !== this.vertices.length) {
                    return colors.concat(
                                                fillColors(this.vertices.length / 3 - colors.length / 3,
                                                colors[0],
                                                colors[1],
                                                colors[2])
                                              );
                } else {
                    return colors;
                }
            }
        }
        setUpTexture (gl) {
            this.image = new Image();
            this.image.onload = loadHandlerFor(gl, this.glTexture, this.image, this.textureId, this);
            this.image.src = this.textureSrc;
        }
    }
    var initBuffer = function (gl, sequence) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sequence),
                      gl.STATIC_DRAW);

        return buffer;
    };
    var fillColors = function (number, r, g, b) {
        var result = [];
        for (var i = 0; i < number; i += 1) {
            result = result.concat(r, g, b);
        }
        return result;
    };

    const loadHandlerFor = (gl, texture, textureImage, textureId, shape) => () => {
        gl.activeTexture(textureId);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        shape.textureReady = true;
    };

    return shape;
}))();

class Sphere extends Shape {
    // n, mode, colors, vertices=[], indices=[]
    constructor (specs) {

        // Gotta be a way to calculate all thetas and sine / cosine thetas on the first loop interation... Just need
        // to store them some how... A map would be nice...
        if (!specs.vertices || !specs.indices || specs.vertices.length === 0 || specs.indices.length === 0) {
            let vertices = [];
            let indices = [];
            // In fact, the easiest way to calculate the vertex position and the normal
            // is just to do the calculations above but not multiply them by the radius,
            // store the results as the normal, and then to multiply the normal values
            // by the radius to get the vertex positions.
            for (let i = 0; i <= specs.n; i += 1) {
                let theta = Math.PI * i/specs.n;
                let sTheta = Math.sin(theta);
                let cTheta = Math.cos(theta);
                for (let j = 0; j <= specs.n; j += 1) {
                    vertices.push(
                        [
                            sTheta * Math.cos(2 * Math.PI * j/specs.n),
                            cTheta,
                            sTheta * Math.sin(2 * Math.PI * j/specs.n)
                        ]
                    );
                }
            }

            for (let i = 0; i < specs.n; i += 1) {
                for (let j = 0; j < specs.n; j += 1) {
                    let minimum = (i * (specs.n + 1)) + j;
                    let maximum = minimum + specs.n + 1;

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
            specs.vertices = vertices;
            specs.indices = indices;
        }
        super(specs);
        this.slices = specs.n;
    }
}

class Cube extends Shape {
    constructor (specs) {

        let vertices = [];
        let indices = [];
        // X / Z - y
        vertices.push([1, 1, 1]);
        vertices.push([1, 1, -1]);
        vertices.push([-1, 1, -1]);
        vertices.push([-1, 1, 1]);
        vertices.push([1, -1, 1]);
        vertices.push([1, -1, -1]);
        vertices.push([-1, -1, -1]);
        vertices.push([-1, -1, 1]);

        // X / Z + y

        indices = [
            [ 0, 1, 3 ],
            [ 2, 3, 1 ],
            [ 0, 3, 4 ],
            [ 7, 4, 3 ],
            [ 0, 4, 1 ],
            [ 5, 1, 4 ],
            [ 1, 5, 6 ],
            [ 2, 1, 6 ],
            [ 2, 7, 3 ],
            [ 6, 7, 2 ],
            [ 4, 7, 6 ],
            [ 5, 4, 6 ]
        ];

        specs.vertices = vertices;
        specs.indices = indices;
        super(specs);
    }
}

class Pyramid extends Shape {
    // Made of triangles... Thus no need for indices... Just provide the mode...
    constructor (specs) {
        let vertices = [];

        vertices.push([ 0,  1,  0]);
        vertices.push([-1, -1, -1]);
        vertices.push([-1, -1,  1]);
        vertices.push([ 1, -1,  1]);
        vertices.push([ 1, -1, -1]);

        let indices = [
            [0, 1, 2],
            [0, 2, 3],
            [0, 3, 4],
            [0, 4, 1],
            [1, 4, 3],
            [3, 2, 1]
        ];

        specs.vertices = vertices;
        specs.indices = indices;
        super(specs);
    }
}

class Icosohedron extends Shape {
    constructor (specs) {
        let X = 0.525731112119133606;
        let Z = 0.850650808352039932;

        let result =  {
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

        specs.vertices = result.vertices;
        specs.indices = result.indices;
        super (specs);
    }
}
