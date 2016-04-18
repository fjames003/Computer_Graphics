const Shape = ((() => {
    class shape {
        constructor (vertices, indices, mode=1, colors={r: 0, g: 0, b: 0}, specularColors={r: 1.0, g: 1.0, b: 1.0}, shininess=16) {
            if (arguments.length < 2) {
                throw "Either the vertex or face array were not provided. Both are required.";
            } else if (vertices.length < 3 || indices.length < vertices.length / 3) {
                throw `Vertices and / or faces provided are not sufficient to make a shape.
                Minimum  3 vertices and a face for every three vertices.`;
            } else if (vertices[0].length !== 3 || indices[0].length !== 3) {
                throw `Vertex and / or face array not in correct format.
                Expected vertices as [[X, Y, Z], [X, Y, Z], [X, Y, Z]...] and
                expected faces as [[V1, V2, V3]...]`;
            } else {
                this.parent = null;
                this.children = [];
                this.states = [];
                this.matrix = new Matrix();
                this._mode = (mode === 0 || mode === 1 || mode === 4) ? mode : 1;
                this.compressedVertices = vertices;

                // Set the vertices array according to the faces provided and the mode...
                this.indices = indices;
                this.indexedVertices = {vertices: this.compressedVertices, indices: this.indices};

                this.setVertices();

                this.colors = this.checkColors(colors);
                this.specularColors = this.checkColors(specularColors);
                this.shininess = shininess;
                this.buffersInitiated = {vertices: false, color: false}
            }
        }

        initVertexBuffer (gl) {
            this.buffer = initBuffer(gl, this.vertices);
            this.normalBuffer = initBuffer(gl, this.normals);
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

        createChild (child) {
            if (arguments.length === 0) {
                child = this.copy();
            }
            if (child instanceof Shape) {
                child.parent = this;
                child.matrix = this.matrix.copy();
                this.children.push(child);
                return child;
            } else {
                throw "Argument provided to createChild was not of type shape";
            }
        }

        copy () {
            return new Shape(this.compressedVertices, this.indices, this._mode, this.colors);
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
            this.states.push(this.matrix.copy());
            this.children.map(child => child.saveState());
        }

        restoreState () {
            if (this.states.length > 0) {
                this.matrix = this.states.pop();
                this.children.map(child => child.restoreState());
            }
        }

        draw (gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix) {
            if (!this.buffersInitiated.vertices || !this.buffersInitiated.color) {
                this.initVertexBuffer(gl);
                this.initColorBuffer(gl);
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.vertexAttribPointer(vertexDiffuseColor, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.specularBuffer);
            gl.vertexAttribPointer(vertexSpecularColor, 3, gl.FLOAT, false, 0, 0);

            gl.uniform1f(shininess, this.shininess);

            gl.uniformMatrix4fv(transformMatrix, gl.FALSE, this.matrix.toWebGL());

            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);

            gl.drawArrays(this._mode, 0, this.vertices.length / 3);

            this.children.map(child => child.draw(gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix));
        }

        split (type=1, direction="x") {
            const finalDirection = {x: 0, y:0, z:0};
            finalDirection[direction] = 1;
            if (type === 1 || this.children.length === 0) {
                // Create Child...
                const splitChild = this.createChild();
                // splitChild.saveState();
                // this.children.map(child => child.saveState());
                // Move parent and child over by half a shape...
                this.matrix = Matrix.translate(finalDirection.x, finalDirection.y, finalDirection.z).multiply(this.matrix);
                // Return child to original location
                // splitChild.restoreState();
                // this.children.map(child => child.restoreState());
                // Move child over another half a shape the other direction...
                splitChild.matrix = Matrix.translate(finalDirection.x, finalDirection.y, finalDirection.z).multiply(splitChild.matrix);

                return splitChild;
            } else {
                this.children.map(child => child.split(2, direction));
                this.split(1, direction);
            }
        }

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
                this.normals = this.toNormalArray(this.indexedVertices, true);
            } else {
                this.vertices = this.toRawArray(this.indexedVertices, false);
                this.normals = this.toNormalArray(this.indexedVertices, false);
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

    return shape;
}))();

class Sphere extends Shape {
    constructor (n, mode, colors, vertices=[], indices=[]) {

        // Gotta be a way to calculate all thetas and sine / cosine thetas on the first loop interation... Just need
        // to store them some how... A map would be nice...
        if (vertices.length === 0 || indices.length === 0) {
            vertices = [];
            indices = [];

            for (let i = 0; i < n + 1; i += 1) {
                var theta = Math.PI * i/n;
                var sTheta = Math.sin(theta);
                var cTheta = Math.cos(theta);
                for (let j = 0; j < n + 1; j += 1) {
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
        }

        super(vertices, indices, mode, colors);
        this.slices = n;
        this.speed = {x: 0, y: 0, z: 0};
        // Just a default... Can always be set later...
        this.viewingVolume = {
            left: -2,
            right: 2,
            bottom: -2,
            top: 2,
            near: 5,
            far: 100
        };
    }

    copy () {
        const result = new Sphere(this.slices, this.mode, this.colors, this.compressedVertices, this.indices);
        result.speed = Object.create(this.speed);
        result.viewingVolume = this.viewingVolume;
        return result;
    }

    checkCollisionwithSphere (s) {
        const transVec = new Vector(0, 0, 0, 1);
        const myCoordVec = this.matrix.multiplyVector(transVec);
        const sCoordVec = s.matrix.multiplyVector(transVec);

        const subtractionVec = myCoordVec.subtract(sCoordVec);

        const distance = Math.sqrt(
            subtractionVec.x() * subtractionVec.x() +
            subtractionVec.y() * subtractionVec.y() +
            subtractionVec.z() * subtractionVec.z()
        );
        return distance < 2;
        /*
            To Do List:
    -------------------
    Done    -->    Detect collisions between spheres... (don't know what to do with it though)
    Done    -->    Detect collisions witht the wall...
    Done    -->    Give spheres (or maybe shapes) a way to have speed (aka auto translate)
    Done    -->    Now enable elastic collisions with bouncing back... (I think... Haha)
    Maybe...-->    Now you have balls flying around bouncing off walls, and you can split them...
        */
    }

    checkWallCollisions (viewingVolume) {
        const transVec = new Vector(0, 0, 0, 1);
        const myCoordVec = this.matrix.multiplyVector(transVec);
        const xCol = myCoordVec.x() < viewingVolume.left || myCoordVec.x() > viewingVolume.right;
        const yCol = myCoordVec.y() < viewingVolume.bottom || myCoordVec.y() > viewingVolume.top;
        const zCol = myCoordVec.z() > -viewingVolume.near || myCoordVec.z() < -viewingVolume.far;

        return {x: xCol, y: yCol, z: zCol};
    }

    // QUESTION >> If I translate, then I will have translated my children as well... Should I?
    updateLocation () {
        const transVec = new Vector(0, 0, 0, 1);
        const myCoordVec = this.matrix.multiplyVector(transVec);
        const mySpeed = this.speed;
        const xDist = myCoordVec.x() + mySpeed.x;
        const yDist = myCoordVec.y() + mySpeed.y;
        const zDist = myCoordVec.z() + mySpeed.z;
        // For now I will avoid updating children... aka no translate
        this.matrix = Matrix.translate(
            myCoordVec.x() - xDist,
            myCoordVec.y() - yDist,
            myCoordVec.z() - zDist
        ).multiply(this.matrix);

        const wallCollisions = this.checkWallCollisions(this.viewingVolume);
        const xMultp = (wallCollisions.x) ? -1 : 1;
        const yMultp = (wallCollisions.y) ? -1 : 1;
        const zMultp = (wallCollisions.z) ? -1 : 1;
        this.speed = {
            x: mySpeed.x * xMultp,
            y: mySpeed.y * yMultp,
            z: mySpeed.z * zMultp
        };

        for (let i = 0; i < this.children.length; i += 1) {
            const collided = this.checkCollisionwithSphere(this.children[i]);
            if (collided) {
                const colliderSpeed = this.children[i].speed;
                const myNewVelX = colliderSpeed.x;
                const myNewVelY = colliderSpeed.y;
                const myNewVelZ = colliderSpeed.z;
                const colliderNewVelX = mySpeed.x;
                const colliderNewVelY = mySpeed.y;
                const colliderNewVelZ = mySpeed.z;
                this.speed = {x: myNewVelX, y: myNewVelY, z: myNewVelZ};
                this.children[i].speed = {x: colliderNewVelX, y: colliderNewVelY, z: colliderNewVelZ};

                const myNewCoordVec = this.matrix.multiplyVector(transVec);
                const myNewSpeed = this.speed;
                this.matrix = this.matrix.multiply(Matrix.translate(
                    myNewCoordVec.x() + myNewSpeed.x,
                    myNewCoordVec.y() + myNewSpeed.y,
                    myNewCoordVec.z() + myNewSpeed.z
                ));
            } else {
                // No collision detected, thus updated location was successful...
            }
        }
    }

    set speed (s) {
        this._speed = {x: s.x, y: s.y, z: s.z};
    }
    get speed () {
        return this._speed;
    }

    draw (gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix) {
        super.draw(gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix);
        this.updateLocation();
    }
}

class Cube extends Shape {
    constructor (mode, colors) {

        var vertices = [];
        var indices = [];
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

        super(vertices, indices, mode, colors);
    }
}

class Pyramid extends Shape {
    // Made of triangles... Thus no need for indices... Just provide the mode...
    constructor (mode, colors) {
        var vertices = [];

        vertices.push([ 0,  1,  0]);
        vertices.push([-1, -1, -1]);
        vertices.push([-1, -1,  1]);
        vertices.push([ 1, -1,  1]);
        vertices.push([ 1, -1, -1]);

        var indices = [
            [0, 1, 2],
            [0, 2, 3],
            [0, 3, 4],
            [0, 4, 1],
            [1, 4, 3],
            [3, 2, 1]
        ];

        super(vertices, indices, mode, colors);
    }
}

class Icosohedron extends Shape {
    constructor (mode, colors) {
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

        super (result.vertices, result.indices, mode, colors);
    }
}
