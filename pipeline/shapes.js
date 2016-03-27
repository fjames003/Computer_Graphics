var Shape = (function () {
    // Constructor
    var shape = function (colors, vertices, mode) {
        this.vertices = vertices;
        this.mode = mode;
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
    };

    shape.prototype.initColorBuffer = function (gl) {
        this.colorBuffer = initBuffer(gl, this.colors);
    }

    var initBuffer = function (gl, sequence) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sequence),
                gl.STATIC_DRAW);

        return buffer;
    }
    return shape;
})();
