var Shape = (function () {
    // Constructor
    var shape = function (colors, vertices, mode) {
        this.parent = null;
        this.children = [];
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
    };

    shape.prototype.createChild = function() {
        var newChild = new Shape(this.colors, this.vertices, this.mode);
        newChild.parent = this;
        this.children.push(newChild);
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

var ShapeLibrary = (function () {
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
    var sphereColors = {r: 0.0, g: 0.0, b: 0.0};
    var vertices = [];
    var sphereMode;
    var sphere = function (n, colors, mode) {
        
        this.mode = mode;
        vertices = [];
        for (var i = 0.0; i < n; i += 1) {
            for (var j = 0.0; j < n - 1; j += 1) {
                vertices = vertices.concat(
                    Math.sin(Math.PI * i/n) * Math.cos(2 * Math.PI * j/n),
                    Math.sin(Math.PI * i/n) * Math.sin(2 * Math.PI * j/n), 
                    Math.cos(Math.PI * i/n)
                );
            }
        }
        this.vertices = vertices;
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
    
    function surrogateConstructor() {};
    surrogateConstructor.prototype = Shape.prototype;
    var prototypeObject = new surrogateConstructor();
    prototypeObject.constructor = sphere.constructor;
    sphere.prototype = prototypeObject;
    return sphere;
    // return new Shape(sphereColors, vertices, sphereMode);

})();
