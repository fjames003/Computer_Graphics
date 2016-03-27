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
});
