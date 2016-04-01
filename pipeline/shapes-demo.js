/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
(function (canvas) {
    /*
     * This code does not really belong here: it should live
     * in a separate library of matrix and transformation
     * functions.  It is here only to show you how matrices
     * can be used with GLSL.
     *
     * Based on the original glRotate reference:
     *     http://www.opengl.org/sdk/docs/man/xhtml/glRotate.xml
     */

    // Grab the WebGL rendering context.
    var gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Build the objects to display.
    var aSphere =  new ShapeLibrary.sphere(40, { r: 1.0, g: 0.5, b: 0.0 }, gl.TRIANGLES).scale(0.5, 0.5, 0.5).translate(0.75, -0.75, 0.5);
    var aSphereKid = aSphere.createChild();
    var objectsToDraw = [
        new Shape([].concat(
                [ 1.0, 0.0, 0.0 ],
                [ 0.0, 1.0, 0.0 ],
                [ 0.0, 0.0, 1.0 ]
            ), [].concat(
                [ 0.0, 0.0, 0.0 ],
                [ 0.5, 0.0, -0.75 ],
                [ 0.0, 0.5, 0.0 ]
            ), gl.TRIANGLES),

        new Shape({ r: 0.0, g: 1.0, b: 0 }, [].concat(
                [ 0.25, 0.0, -0.5 ],
                [ 0.75, 0.0, -0.5 ],
                [ 0.25, 0.5, -0.5 ]), gl.TRIANGLES),

        new Shape({ r: 0.0, g: 0.0, b: 1.0 }, [].concat(
                [ -0.25, 0.0, 0.5 ],
                [ 0.5, 0.0, 0.5 ],
                [ -0.25, 0.5, 0.5 ]), gl.TRIANGLES),

        new Shape({ r: 0.0, g: 0.0, b: 1.0 }, [].concat(
                [ -1.0, -1.0, 0.75 ],
                [ -1.0, -0.1, -1.0 ],
                [ -0.1, -0.1, -1.0 ],
                [ -0.1, -1.0, 0.75 ]), gl.LINE_LOOP),

        new Shape({ r: 0.0, g: 0.5, b: 0.0 }, Shapes.toRawLineArray(Shapes.icosahedron()), gl.LINES),
        aSphere,
        aSphereKid.scale(0.5, 0.5, 0.5).translate(1.0, 3, -0.75),
        new ShapeLibrary.sphere(4, { r: 0.0, g: 0.5, b: 1.0 }, gl.TRIANGLE_FAN).scale(0.5, 0.5, 0.5).translate(-0.75, 0.75, 0.5),
        aSphereKid.createChild(new Shape({ r: 0.5, g: 0.5, b: 0.5 }, [].concat(
                [ 0.25, 0.0, -0.5 ],
                [ -0.5, 0.0, -0.5 ],
                [ 0.25, -0.5, -0.5 ]), gl.TRIANGLES))

    ];

    // Pass the vertices to WebGL.
    for (var i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {

        objectsToDraw[i].initVertexBuffer(gl);

        objectsToDraw[i].initColorBuffer(gl);
    }

    // Initialize the shaders.
    var abort = false;
    var shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        // Very cursory error-checking here...
        function (shader) {
            abort = true;
            alert("Shader problem: " + gl.getShaderInfoLog(shader));
        },

        // Another simplistic error check: we don't even access the faulty
        // shader program.
        function (shaderProgram) {
            abort = true;
            alert("Could not link shaders...sorry.");
        }
    );

    // If the abort variable is true here, we can't continue.
    if (abort) {
        alert("Fatal errors encountered; we cannot continue.");
        return;
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram);

    // Hold on to the important variables within the shaders.
    var vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    var vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(vertexColor);
    var transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");


    /*
     * Displays the scene.
     */

     var random = {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 2 - 1
     };
    var drawScene = function () {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        // Display the objects.
        for (var i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {

            objectsToDraw[i].rotate(rotationStep, random.x, random.y, random.z);

            objectsToDraw[i].saveState();
            objectsToDraw[i].scale(0.9, 0.9, 0.9);

            gl.uniformMatrix4fv(transformMatrix, gl.FALSE, objectsToDraw[i].matrix.toWebGL());

            objectsToDraw[i].draw(gl, vertexColor, vertexPosition);

            objectsToDraw[i].restoreState();
        }

        // All done.
        gl.flush();
    };

    /*
     * Animates the scene.
     */
    var animationActive = false;
    var rotationStep = 2;
    var previousTimestamp = null;

    var advanceScene = function (timestamp) {
        // Check if the user has turned things off.
        if (!animationActive) {
            return;
        }

        // Initialize the timestamp.
        if (!previousTimestamp) {
            previousTimestamp = timestamp;
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // Check if it's time to advance.
        var progress = timestamp - previousTimestamp;
        if (progress < 30) {
            // Do nothing if it's too soon.
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // All clear.
        drawScene();

        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(advanceScene);
    };

    // Draw the initial scene.
    drawScene();

    // Set up the rotation toggle: clicking on the canvas does it.
    $(canvas).click(function () {
        animationActive = !animationActive;
        if (animationActive) {
            previousTimestamp = null;
            window.requestAnimationFrame(advanceScene);
        }
    });

}(document.getElementById("canvas")));
