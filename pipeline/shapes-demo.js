/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */

((canvas => {
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
    const gl = GLSLUtilities.getGL(canvas);
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
    const aSphere =  new Sphere (25, gl.LINES, { r: 1.0, g: 0.5, b: 0.0 }).translate(-0.75, -0.75, 0.5);
    const aSphereKid = aSphere.createChild();
    aSphereKid.mode = gl.TRIANGLES;
    const cube = aSphere.createChild(new Cube(gl.TRIANGLES, { r: 0.5, g: 0.5, b: 0.5 }));
    const objectsToDraw = [
       new Shape([[ 0.0, 0.0, 0.0 ],
                  [ 0.5, 0.0, -0.75 ],
                  [ 0.0, 0.5, 0.0 ]],
                  [[ 0, 1, 2]],
                  gl.TRIANGLES,
                  [].concat(
                     [ 1.0, 0.0, 0.0 ],
                     [ 0.0, 1.0, 0.0 ],
                     [ 0.0, 0.0, 1.0 ]
                  )),

       new Shape([[ 0.25, 0.0, -0.5 ],
                  [ 0.75, 0.0, -0.5 ],
                  [ 0.25, 0.5, -0.5 ]],
                  [[0, 1, 2]],
                  gl.TRIANGLES,
                  { r: 0.0, g: 1.0, b: 0 }),

       new Shape([[ -0.25, 0.0, 0.5 ],
                  [ 0.5, 0.0, 0.5 ],
                  [ -0.25, 0.5, 0.5 ]],
                  [[0, 1, 2]],
                  gl.TRIANGLES,
                  { r: 0.0, g: 1.0, b: 0 }),

       new Icosohedron(gl.LINES, { r: 0.0, g: 1.0, b: 0 }),
       aSphere,
       aSphereKid.scale(0.5, 0.5, 0.5).translate(0, 4, -0.75),
       cube.translate(2, 2, 0).scale(0.5, 0.5, 0.5),
       new Pyramid(gl.TRIANGLES, { r: 1, g: 0, b: 0 }).translate(0.8, -0.8, 0).scale(0.3, 0.3, 0.3)

   ];

    // Pass the vertices to WebGL.
    for (let i = 0; i < objectsToDraw.length; i += 1) {
        objectsToDraw[i].initVertexBuffer(gl);

        objectsToDraw[i].initColorBuffer(gl);
    }

    // Initialize the shaders.
    let abort = false;

    const shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        shader => {
            abort = true;
            alert(`Shader problem: ${gl.getShaderInfoLog(shader)}`);
        },

        shaderProgram => {
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
    const vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    const vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(vertexColor);
    const transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    const projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");

    /*
     * Displays the scene.
     */
    const random = {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 2 - 1
    };
    const drawScene = () => {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Display the objects.
        for (let i = 0; i < objectsToDraw.length; i += 1) {

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
    const aspect = canvas.width / canvas.height;
    gl.uniformMatrix4fv(
        projectionMatrix,
        gl.FALSE,
        new Matrix().orthographic(-2 * aspect, 2 * aspect, -2, 2, -10, 10).toWebGL()
    );
    let animationActive = false;
    var rotationStep = 2;
    let previousTimestamp = null;

    const advanceScene = timestamp => {
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
        const progress = timestamp - previousTimestamp;
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
    $(canvas).click(() => {
        animationActive = !animationActive;
        if (animationActive) {
            previousTimestamp = null;
            window.requestAnimationFrame(advanceScene);
        }
    });

})(document.getElementById("canvas")));
