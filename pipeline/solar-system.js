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

    // Not technically, but we can pretend...
    const sun = new Planet({
        mass: 4.385 * Math.pow(10, 30),
        radius: 432168.6,
        colors: { r: 1.0, g: 1.0, b: 0.0 },
        specularColors: { r: 0.5, g: 0.5, b: 0.5 },
        shininess: 256
    }).translate(1, 1, -10)

    const earthTexture = gl.createTexture();

    const earth = new Planet({
        vertices: sun.compressedVertices,
        indices: sun.indices,
        textureId: gl.TEXTURE0,
        textureSrc: "earth.jpg",
        glTexture: earthTexture,
        mass: 1.317 * Math.pow(10, 25),
        radius: 3958.8,
        colors: { r: 0.0, g: 0.0, b: 0.5 },
        shininess: 128
    }).translate(0, 0, -7);

    const minNear = 5;
    const maxFar = 100;
    const aspect = canvas.width / canvas.height;
    const viewingVolume = {
        left: -2 * aspect,
        right: 2 * aspect,
        bottom: -2,
        top: 2,
        near: minNear,
        far: maxFar
    };


    const objectsToDraw = [
        sun,
        earth
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
    const textureCoordinate = gl.getAttribLocation(shaderProgram, "textureCoordinate");
    // gl.enableVertexAttribArray(textureCoordinate);

    const transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    const projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    const uniRotationMatrix = gl.getUniformLocation(shaderProgram, "uniRotationMatrix");

    const lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    const lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    const lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    const shininess = gl.getUniformLocation(shaderProgram, "shininess");

    const alpha = gl.getUniformLocation(shaderProgram, "alpha");

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

            gl.uniform1i(gl.getUniformLocation(shaderProgram, "sampler"), 0);

            objectsToDraw[i].draw(gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix, textureCoordinate);
        }

        // All done.
        gl.flush();
    };

    /*
     * Animates the scene.
     */
     gl.uniformMatrix4fv(
         projectionMatrix,
         gl.FALSE,
         new Matrix().perspective(
             viewingVolume.left,
             viewingVolume.right,
             viewingVolume.bottom,
             viewingVolume.top,
             viewingVolume.near,
             viewingVolume.far
         ).toWebGL()
     );

    gl.uniform4fv(lightPosition, [0, 0, -500, 1.0]);
    gl.uniform3fv(lightDiffuse, [0.5, 0.5, 0.5]);
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
