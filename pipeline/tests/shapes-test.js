// Testing Suite for Shape Library

$(() => {
    const gl = GLSLUtilities.getGL(document.getElementById("hello-webgl"));
    const triangleArray = [[ 0.0, 0.0, 0.0 ], [ 0.5, 0.0, -0.75 ], [ 0.0, 0.5, 0.0 ]];
    
    // This suite checks instantiation basics.
    test("Creation and Data Access", () => {
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

    // test("Child creation and Data Access", function () {
    //     var tri = new Shape({r: 1.0, g: 0.3, b: 0.6}, [].concat(
    //                                                     [ 0.0, 0.0, 0.0 ],
    //                                                     [ 0.5, 0.0, -0.75 ],
    //                                                     [ 0.0, 0.5, 0.0 ]
    //                                                    ), gl.TRIANGLES);
    //     var triChild = tri.createChild();
    //     equal(tri.children[0], triChild, "Make sure the child shape was added to children");
    //
    // });
    //
    // test("Functions of shapes (and their children)", function () {
    //     // Translate child...
    //     var tri = new Shape({r: 1.0, g: 0.3, b: 0.6}, [].concat(
    //                                                     [ 0.0, 0.0, 0.0 ],
    //                                                     [ 0.5, 0.0, -0.75 ],
    //                                                     [ 0.0, 0.5, 0.0 ]
    //                                                    ), gl.TRIANGLES);
    //     var triChild = tri.createChild();
    //
    //     triChild.translate(0.5, 0.5, 0.5);
    //     deepEqual(new Matrix().translate(0.5, 0.5, 0.5), triChild.matrix,
    //              "Make sure that child updates matrix on own");
    //
    //     var tri = new Shape({r: 1.0, g: 0.3, b: 0.6}, [].concat(
    //                                                     [ 0.0, 0.0, 0.0 ],
    //                                                     [ 0.5, 0.0, -0.75 ],
    //                                                     [ 0.0, 0.5, 0.0 ]
    //                                                    ), gl.TRIANGLES);
    //     var triChild = tri.createChild();
    //
    //     tri.translate(0.5, 0.5, 0.5);
    //     deepEqual(new Matrix().translate(0.5, 0.5, 0.5), triChild.matrix,
    //              "Make sure that parent updates childs matrix");
    //
    //     var tri = new Shape({r: 1.0, g: 0.3, b: 0.6}, [].concat(
    //                                                     [ 0.0, 0.0, 0.0 ],
    //                                                     [ 0.5, 0.0, -0.75 ],
    //                                                     [ 0.0, 0.5, 0.0 ]
    //                                                    ), gl.TRIANGLES);
    //     var triChild = tri.createChild();
    //     var triGrand = triChild.createChild();
    //     tri.translate(0.5, 0.5, 0.5);
    //     deepEqual(new Matrix().translate(0.5, 0.5, 0.5), triGrand.matrix,
    //              "Make sure that parent updates children's children matrix");
    //
    //     triChild.removeChild();
    //
    //     tri.translate(0,0,0);
    //     deepEqual(new Matrix().translate(0.5, 0.5, 0.5), triGrand.matrix,
    //              "Make sure that parent stops updating once removed");
    // });
});
