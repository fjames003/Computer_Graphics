
((canvas => {

    const gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Not technically, but we can pretend...
    const sunTexture = gl.createTexture();

    // If is use AU for distance, years for time, and solar masses as mass my numbers are smaller...
    const sun = new Planet({
        location: {x: 0, y: 0, z: 0},
        // mass: 4.385 * Math.pow(10, 30),
        mass: 1.0,
        colors: { r: 1.0, g: 1.0, b: 1.0 },
        specularColors: { r: 1.0, g: 1.0, b: 0.0 },
        shininess: 64,
        gl: gl,
        textureId: gl.TEXTURE0,
        textureSrc: "./textures/sun_512.jpg",
        glTexture: sunTexture
    }).translate(0,0,0).scale(10.9, 10.9, 10.9);

    const mercuryTexture = gl.createTexture();

    const mercury = new Planet({
        location: {x: 0, y: 0, z: -12.48},
        vertices: sun.compressedVertices,
        indices: sun.indices,
        textureCoord: sun.textureCoord,
        textureId: gl.TEXTURE0,
        textureSrc: "./textures/mercury_512.jpg",
        glTexture: mercuryTexture,
        mass: 2.450 * Math.pow(10, -6),
        colors: { r: 1.0, g: 1.0, b: 1.0 },
        specularColor: { r: 1.0, g: 1.0, b: 1.0 },
        shininess: 16,
        orbitOf: sun,
        gl: gl
    }).translate(0, 0, -12.48);

    const venusTexture = gl.createTexture();

    const venus = new Planet({
        location: {x: 0, y: 0, z: -23.04},
        vertices: sun.compressedVertices,
        indices: sun.indices,
        textureCoord: sun.textureCoord,
        textureId: gl.TEXTURE0,
        textureSrc: "./textures/venus_512.jpg",
        glTexture: venusTexture,
        mass: 2.450 * Math.pow(10, -6),
        colors: { r: 1.0, g: 1.0, b: 1.0 },
        specularColor: { r: 1.0, g: 1.0, b: 1.0 },
        shininess: 16,
        orbitOf: sun,
        gl: gl
    }).translate(0, 0, -23.04);

    const earthTexture = gl.createTexture();

    const earth = new Planet({
        // location: {x: 0, y: -1.4960 * Math.pow(10, 11), z: 0},
        location: {x: 0.0, y: 0.0, z: -32.0},
        vertices: sun.compressedVertices,
        indices: sun.indices,
        textureCoord: sun.textureCoord,
        textureId: gl.TEXTURE0,
        textureSrc: "./textures/earth_512.jpg",
        glTexture: earthTexture,
        // mass: 1.317 * Math.pow(10, 25),
        mass: 3.003 * Math.pow(10, -6),
        colors: { r: 1.0, g: 1.0, b: 1.0 },
        specularColor: { r: 1.0, g: 1.0, b: 1.0 },
        shininess: 32,
        orbitOf: sun,
        gl: gl
    }).translate(0, 0, -32);

    const marsTexture = gl.createTexture();

    const mars = new Planet({
        location: {x: 0, y: 0, z: -48.64},
        vertices: sun.compressedVertices,
        indices: sun.indices,
        textureCoord: sun.textureCoord,
        textureId: gl.TEXTURE0,
        textureSrc: "./textures/mars_512.png",
        glTexture: marsTexture,
        mass: 3.227 * Math.pow(10, -7),
        colors: { r: 1.0, g: 1.0, b: 1.0 },
        specularColor: { r: 1.0, g: 1.0, b: 1.0 },
        shininess: 16,
        orbitOf: sun,
        gl: gl
    }).translate(0, 0, -48.64);

    const jupiterTexture = gl.createTexture();

    const jupiter = new Planet({
        location: {x: 0, y: 0, z: -166.4},
        vertices: sun.compressedVertices,
        indices: sun.indices,
        textureCoord: sun.textureCoord,
        textureId: gl.TEXTURE0,
        textureSrc: "./textures/jupiter_512.jpg",
        glTexture: jupiterTexture,
        mass: 2.450 * Math.pow(10, -6),
        colors: { r: 1.0, g: 1.0, b: 1.0 },
        specularColor: { r: 1.0, g: 1.0, b: 1.0 },
        shininess: 16,
        orbitOf: sun,
        gl: gl
    }).translate(0, 0, -166.4);

    const minNear = 5;
    const maxFar = 500;
    const aspect = canvas.width / canvas.height;
    const viewingVolume = {
        left: -2 * aspect,
        right: 2 * aspect,
        bottom: -2,
        top: 2,
        near: minNear,
        far: maxFar
    };

    const building = earth.addChild(new Cube({
        colors: {r: 1, g: 0, b: 0},
        shininess: 128,
        mode: gl.TRIANGLES
    })).translate(0, 1, 0).scale(0.07, 0.3, 0.07);

    const objectsToDraw = [
        sun,
        mercury,
        venus,
        earth,
        mars,
        jupiter
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

    const transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    const projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    const cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");

    const lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    const lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    const lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    const shininess = gl.getUniformLocation(shaderProgram, "shininess");

    let cameraPositionP = new Vector(0, 0, 75);
    let eyePosistionQ   = new Vector(0, 0, 1);
    const upVector      = new Vector(0, 1, 0);

    const drawScene = (time) => {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        objectsToDraw[0].rotate(rotationStep, 0, 1, 0);
        // Display the objects.
        for (let i = 0; i < objectsToDraw.length; i += 1) {

            let camera = new Matrix().camera(
                cameraPositionP.x(), cameraPositionP.y(), -cameraPositionP.z(),
                eyePosistionQ.x(), eyePosistionQ.y(), eyePosistionQ.z(),
                upVector.x(), upVector.y(), upVector.z()
            ).toWebGL();

            gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, camera);

            gl.uniform1i(gl.getUniformLocation(shaderProgram, "sampler"), 0);

            objectsToDraw[i].draw(gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix, textureCoordinate, time);
        }

        // All done.
        gl.flush();
    };

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
    var rotationStep = -2;
    let previousTimestamp = null;
    let zMovement = 0;
    let xMovement = 0;

    const advanceScene = timestamp => {

        let texturesReady = () => {
            let numberReady = 0;
            for (let i = 0; i < objectsToDraw.length; i += 1) {
                if (objectsToDraw[i].texturesReady) {
                    numberReady += 1;
                }
            }
            return numberReady;
        }

        let drawWhenReady = setInterval(function () {
            if (texturesReady() === objectsToDraw.length) {
                drawScene(progress);
                clearInterval(drawWhenReady);
            }
        }, 10);

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
        progress = timestamp - previousTimestamp;
        if (progress < 100) {
            // Do nothing if it's too soon.
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // All clear.
        drawScene(progress);

        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(advanceScene);
    };

    // Set up the rotation toggle: clicking on the canvas does it.
    $(canvas).click(() => {
        animationActive = !animationActive;
        window.requestAnimationFrame(advanceScene);
    });

    const updateForwardBackwardPosition = (direction, progress) => {
        let whereCameraIsLooking = eyePosistionQ.subtract(cameraPositionP).unit();
        cameraPositionP = new Vector(
            cameraPositionP.x() + (direction * whereCameraIsLooking.x() * 0.1),
            cameraPositionP.y() + (direction * whereCameraIsLooking.y() * 0.1),
            cameraPositionP.z() + (direction * whereCameraIsLooking.z() * 0.1)
        );
    }

    const updateLeftRightPosition = (direction, progress) => {
        let tempVec;
        let whereCameraIsLooking = eyePosistionQ.subtract(cameraPositionP).unit();
        if (whereCameraIsLooking.x() !== 0 || whereCameraIsLooking.z() !== 0) {
            tempVec = new Vector(0, 1, 0);
        } else {
            tempVec = new Vector(1, 0, 0);
        }
        let perpendicularToLooking = whereCameraIsLooking.cross(tempVec).unit();
        let x = (direction * perpendicularToLooking.x() * 0.1);
        let y = (direction * perpendicularToLooking.y() * 0.1);
        let z = (direction * perpendicularToLooking.z() * 0.1);
        cameraPositionP = new Vector(
            cameraPositionP.x() + x,
            cameraPositionP.y() + y,
            cameraPositionP.z() + z
        );
        eyePosistionQ = new Vector(
            eyePosistionQ.x() + x,
            eyePosistionQ.y() + y,
            eyePosistionQ.z() + z
        );
    }

    $(document).keydown(function(e) {
        if (animationActive) {
            switch(e.which) {
                case 37: // left
                    updateLeftRightPosition(-1);
                    break;
                case 38: // up
                    updateForwardBackwardPosition(-1);
                    break;
                case 39: // right
                    updateLeftRightPosition(1);
                    break;
                case 40: // down
                    updateForwardBackwardPosition(1);
                    break;
                default:
                    return;
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        }
    });

    window.requestAnimationFrame(advanceScene);
})(document.getElementById("canvas")));
