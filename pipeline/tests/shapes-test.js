// Testing Suite for Shape Library

$(function () {
    var gl = GLSLUtilities.getGL(document.getElementById("hello-webgl"));
    // This suite checks instantiation basics.
    test("Creation and Data Access", function () {
        // Basic one color triangle...
        var tri = new Shape({r: 1.0, g: 0.3, b: 0.6}, [].concat(
                                                        [ 0.0, 0.0, 0.0 ],
                                                        [ 0.5, 0.0, -0.75 ],
                                                        [ 0.0, 0.5, 0.0 ]
                                                       ), gl.TRIANGLES);
        equal(tri.colors.length, tri.vertices.length, "Make sure there is a color for every vertices");
    });

    test("Child creation and Data Access", function () {
        var tri = new Shape({r: 1.0, g: 0.3, b: 0.6}, [].concat(
                                                        [ 0.0, 0.0, 0.0 ],
                                                        [ 0.5, 0.0, -0.75 ],
                                                        [ 0.0, 0.5, 0.0 ]
                                                       ), gl.TRIANGLES);
        var triChild = tri.createChild();
        equal(tri.children[0], triChild, "Make sure the child shape was added to children");

    });

    test("Functions of shapes (and their children)", function () {
        // Translate child...
        var tri = new Shape({r: 1.0, g: 0.3, b: 0.6}, [].concat(
                                                        [ 0.0, 0.0, 0.0 ],
                                                        [ 0.5, 0.0, -0.75 ],
                                                        [ 0.0, 0.5, 0.0 ]
                                                       ), gl.TRIANGLES);
        var triChild = tri.createChild();

        triChild.translate(0.5, 0.5, 0.5);
        deepEqual(new Matrix().translate(0.5, 0.5, 0.5), triChild.matrix,
                 "Make sure that child updates matrix on own");

        var tri = new Shape({r: 1.0, g: 0.3, b: 0.6}, [].concat(
                                                        [ 0.0, 0.0, 0.0 ],
                                                        [ 0.5, 0.0, -0.75 ],
                                                        [ 0.0, 0.5, 0.0 ]
                                                       ), gl.TRIANGLES);
        var triChild = tri.createChild();

        tri.translate(0.5, 0.5, 0.5);
        deepEqual(new Matrix().translate(0.5, 0.5, 0.5), triChild.matrix,
                 "Make sure that parent updates childs matrix");

        var tri = new Shape({r: 1.0, g: 0.3, b: 0.6}, [].concat(
                                                        [ 0.0, 0.0, 0.0 ],
                                                        [ 0.5, 0.0, -0.75 ],
                                                        [ 0.0, 0.5, 0.0 ]
                                                       ), gl.TRIANGLES);
        var triChild = tri.createChild();
        var triGrand = triChild.createChild();
        tri.translate(0.5, 0.5, 0.5);
        deepEqual(new Matrix().translate(0.5, 0.5, 0.5), triGrand.matrix,
                 "Make sure that parent updates children's children matrix");

        triChild.removeChild();

        tri.translate(0,0,0);
        deepEqual(new Matrix().translate(0.5, 0.5, 0.5), triGrand.matrix,
                 "Make sure that parent stops updating once removed");        
    });
});
