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
                this.colors = this.colors.concat(fillColors(vertices.length / 3 - colors.length / 3, this.colors[0], this.colors[1], this.colors[2]));
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

    shape.prototype.createChild = function(child) {
        if (arguments.length === 0) {
            var child = new Shape(this.colors, this.vertices, this.mode);
        }
        child.parent = this;
        child.matrix = this.matrix;
        this.children.push(child);
        return child;

    };

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
                for (var i = 0.0; i < n; i += 1) {
                    for (var j = 0.0; j < n; j += 1) {
                        vertices = vertices.concat(
                            Math.cos(Math.PI * i/n),
                            Math.sin(Math.PI * i/n) * Math.cos(2 * Math.PI * j/n),
                            Math.sin(Math.PI * i/n) * Math.sin(2 * Math.PI * j/n) 
                            
                        );
                    }
                }

                Shape.call(this, colors, vertices, mode);
            };

            sphere.prototype = Object.create(Shape.prototype);
            sphere.prototype.constructor = Shape;

            return sphere;
        }
    )(),
    square: (
        function () {
            // BLah...
        }
    )()
};
