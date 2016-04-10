// Testing Suite for Shape Library

$(() => {
    const gl = GLSLUtilities.getGL(document.getElementById("hello-webgl"));
    const triangleArray = [[ 0.0, 0.0, 0.0 ], [ 0.5, 0.0, -0.75 ], [ 0.0, 0.5, 0.0 ]];

    // This suite checks instantiation basics.
    test("Creation and Data Access (Constructor)", () => {
        // Basic one color triangle...
        // A shape must be passed vertices and indices... the color can be defaulted...
        // Additionally, the mode can default to LINES per say if not provided...
        // Thus the following tests will test our creation and data accessing...

        throws(() => {
            const fail2 = new Shape();
        }, "Should throw exception for no provided indices or vertices");

        throws(() => {
            const fail1 = new Shape(triangleArray);
        }, "Should throw and exception for no provided indices");

        // Should default to a mode of LINES and produce a triangle
        // Color should default to black...
        var triangle = new Shape(triangleArray, [[0, 1, 2]]);
        equal(
            triangle.colors.length,
            triangle.vertices.length,
            "Make sure there is a color for every vertices"
        );
        deepEqual(
            [triangle.colors[0], triangle.colors[1], triangle.colors[2]],
            [0, 0, 0],
            "Make sure that the default color is black"
        );
        equal(triangle.mode, 1, "Make sure the defualt mode is LINES (1)");

        var triangle = new Shape(triangleArray, [[0, 1, 2]], {r: 1.0, g: 0.5, b: 0.0});
        equal(
            triangle.colors.length,
            triangle.vertices.length,
            "Make sure that colors are expanded from object"
        );

        var triangle = new Shape(triangleArray, [[0, 1, 2]], [1.0, 0.5, 0.0]);
        equal(
            triangle.colors.length,
            triangle.vertices.length,
            "Make sure colors array is expanded if necessary."
        );
    });

    test("Methods of Shape", () => {
        var triangle = new Shape(triangleArray, [[0, 1, 2]], [1.0, 0.5, 0.0]);
        equal(
            triangle.buffer,
            undefined,
            "Make sure that a shape doesn't start with a buffer"
        );
        triangle.initVertexBuffer(gl);
        notEqual (
            triangle.buffer,
            undefined,
            "Make sure that a buffer was created"
        );

        equal(
            triangle.colorBuffer,
            undefined,
            "Make sure that a shape doesn't start with a color buffer"
        );
        triangle.initColorBuffer(gl);
        notEqual(
            triangle.colorBuffer,
            undefined,
            "Make sure that a color buffer was created"
        );
    });
});
