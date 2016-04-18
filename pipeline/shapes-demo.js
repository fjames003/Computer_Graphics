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
    const aSphere =  new Sphere (35, gl.TRIANGLES, { r: 1.0, g: 0.5, b: 0.0 }).translate(0, -1, -10);
    // const aSphereKid = aSphere.createChild().translate(0, 2, 5).scale(0.5, 0.5, 0.5);
    const cube = aSphere.createChild(new Cube(gl.TRIANGLES, { r: 0.5, g: 0.5, b: 0.5 })).translate(3, 3, 0).scale(0.5, 0.5, 0.5);

    // 2 Spheres...
    aSphere.split(2, 'x');
    // 4 Spheres
    aSphere.split(2, 'x');
    // 8 Spheres
    // aSphere.split(2, 'x');
    // 16 Spheres
    // aSphere.split(2, 'y');

    const objectsToDraw = [
       aSphere,
    //    aSphereKid
        cube
   ];

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
    const vertexDiffuseColor = gl.getAttribLocation(shaderProgram, "vertexDiffuseColor");
    gl.enableVertexAttribArray(vertexDiffuseColor);
    const vertexSpecularColor = gl.getAttribLocation(shaderProgram, "vertexSpecularColor");
    gl.enableVertexAttribArray(vertexSpecularColor);
    const normalVector = gl.getAttribLocation(shaderProgram, "normalVector");
    gl.enableVertexAttribArray(normalVector);

    const transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    const projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    const uniRotationMatrix = gl.getUniformLocation(shaderProgram, "uniRotationMatrix");

    const lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    const lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    const lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    const shininess = gl.getUniformLocation(shaderProgram, "shininess");

    /*
     * Displays the scene.
     */
    const newRandomXYZ = () => {
      let result = {};
      result.x = Math.random() * 2 - 1;
      result.y = Math.random() * 2 - 1;
      result.z = Math.random() * 2 - 1;
      return result;
    }
    const rands = [];
    const rotationRands = newRandomXYZ();
    const drawScene = () => {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Display the objects.
        for (let i = 0; i < objectsToDraw.length; i += 1) {
            if (rands.length < (i + 1)) {
              rands[i] = newRandomXYZ();
            }
            objectsToDraw[i].rotate(rotationStep, rands[i].x, rands[i].y, rands[i].z);

            let mat = new Matrix().rotation(currentRotation, 0,0, 1).toWebGL();
            gl.uniformMatrix4fv(uniRotationMatrix, gl.FALSE, mat);

            objectsToDraw[i].draw(gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix);
        }

        // All done.
        gl.flush();
    };

    /*
     * Animates the scene.
     */
    const minNear = 5;
    const maxFar = 100;
    const aspect = canvas.width / canvas.height;
    gl.uniformMatrix4fv(
        projectionMatrix,
        gl.FALSE,
        new Matrix().perspective(-2 * aspect, 2 * aspect, -2, 2, minNear, maxFar).toWebGL()
    );
    gl.uniform4fv(lightPosition, [-500, 0, -500, 1.0]);
    gl.uniform3fv(lightDiffuse, [1.0, 1.0, 1.0]);
    gl.uniform3fv(lightSpecular, [0.5, 0.5, 0.5]);

    let animationActive = false;
    var rotationStep = 2;
    let previousTimestamp = null;
    let currentRotation = 0;

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
        currentRotation += 2;
        if (currentRotation >= 360) {
          currentRotation = 0;
        }
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
