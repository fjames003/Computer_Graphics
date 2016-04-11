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

        var triangle = new Shape(triangleArray, [[0, 1, 2]], 1, {r: 1.0, g: 0.5, b: 0.0});
        equal(
            triangle.colors.length,
            triangle.vertices.length,
            "Make sure that colors are expanded from object"
        );

        var triangle = new Shape(triangleArray, [[0, 1, 2]], 1, [1.0, 0.5, 0.0]);
        equal(
            triangle.colors.length,
            triangle.vertices.length,
            "Make sure colors array is expanded if necessary"
        );
    });

    test("Methods: Buffer", () => {
        let triangle = new Shape(triangleArray, [[0, 1, 2]], 1, [1.0, 0.5, 0.0]);
        equal(
            triangle.buffer,
            undefined,
            "Make sure that a shape doesn't start with a buffer"
        );
        triangle.initVertexBuffer(gl);
        notEqual(
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

    test("Methods: Child (Create and Remove)", () => {
        let triangle = new Shape(triangleArray, [[0, 1, 2]]);
        let triChild = triangle.createChild();
        equal(
            triChild.parent,
            triangle,
            "Make sure the child is aware of parent"
        );
        equal(
            triangle.children[0],
            triChild,
            "Make sure the parent is aware of child"
        );
        triangle.removeChild();
        equal(
            triangle.children.length,
            0,
            "Make sure that the child was properly removed"
        );
        triangle.scale(0.2, 0.4, 0.5);
        let hourGlass = triangle.createChild(new Shape([
            [-1, 1, 0],
            [1, 1, 0],
            [1, -1, 0],
            [-1, -1, 0],
            [0, 0, 0]
        ], [[4, 3, 2], [4, 2, 1], [4, 1, 0]]));
        deepEqual(
            hourGlass.matrix,
            triangle.matrix,
            "Make sure the black sheep shape inherited the matrix of parent"
        );
        equal(
            triangle.children[0],
            hourGlass,
            "Make sure the parent is aware of black sheep"
        );
        let sqPacMan = triangle.createChild(new Shape([
            [-1, 1, 0],
            [1, 1, 0],
            [1, -1, 0],
            [-1, -1, 0],
            [0, 0, 0]
        ], [[0, 4, 1], [4, 3, 2]]));
        equal(
            triangle.children[1],
            sqPacMan,
            "Make sure that more than one black sheep (children) are allowed"
        );
        triangle.createChild();
        equal(
            triangle.children.length,
            3,
            "Make sure the parents can count"
        );
        let grandKid = hourGlass.createChild();
        triangle.scale(1, 1, 1);
        deepEqual(
            grandKid.matrix,
            triangle.matrix,
            "Make sure grandkids listen to grandparents"
        );
        sqPacMan.scale(1, 1, 1);
        deepEqual(
            grandKid.matrix,
            triangle.matrix,
            "Make sure grandkids don't listen to uncles"
        );

        throws(() => {
            grandKid.createChild([
                [-1, 1, 0],
                [1, 1, 0],
                [1, -1, 0],
                [-1, -1, 0],
                [0, 0, 0]
            ], [[0, 4, 1], [4, 3, 2]]);
        }, "Make sure that only a shape can be passed to createChild")
    });

    test("Methods: Scale, Rotate, Translate", () => {
        let triangle = new Shape(triangleArray, [[0, 1, 2]]);
        triangle.scale(0.5, 0.5, 0.5);
        let mScale = Matrix.scale(0.5, 0.5, 0.5);
        let mTrans = Matrix.translate(0.75, -0.3, 0.2);
        let mRotat = Matrix.rotation(30, 0.3, 0.4, 0.5);
        deepEqual(
            triangle.matrix,
            mScale,
            "Make sure that the scale method updates the shapes matrix"
        );
        triangle.translate(0.75, -0.3, 0.2);
        deepEqual(
            triangle.matrix,
            mScale.multiply(mTrans),
            "Make sure that translate will update the matrix as well"
        );

        let triangle2 = new Shape(triangleArray, [[0, 1, 2]]);
        triangle2.rotate(30, 0.3, 0.4, 0.5);
        deepEqual(
            triangle2.matrix,
            mRotat,
            "Make sure that rotate will update the matrix"
        );

        let triChild = triangle.createChild();
        deepEqual(
            triChild.matrix,
            mScale.multiply(mTrans),
            "Make sure that the child inherits the transforms too"
        );
        triangle.rotate(30, 0.3, 0.4, 0.5);
        deepEqual(
            triChild.matrix,
            triangle.matrix,
            "Make sure that the child continues listening to parent"
        );
        triChild.rotate(30, 0.3, 0.4, 0.5);
        notDeepEqual(
            triangle.matrix,
            triChild.matrix,
            "Make sure that the childs matrix updates independently"
        );
        triChild.translate(0.75, -0.3, 0.2);
        deepEqual(
            triChild.matrix,
            mScale.multiply(mTrans).multiply(mRotat).multiply(mRotat).multiply(mTrans),
            "Make sure that child can update matrix correctly"
        );
    });

    test("Methods: State", () => {
        let triangle = new Shape(triangleArray, [[0, 1, 2]]);
        triangle.saveState();
        triangle.translate(0.5, 0.6, 0.4);
        deepEqual(
            triangle.matrix,
            Matrix.translate(0.5, 0.6, 0.4),
            "Make sure that matrix is updated when state is saved"
        );
        triangle.restoreState();
        deepEqual(
            triangle.matrix,
            new Matrix(),
            "Make sure that the state of the matrix is restored"
        );

        // Nested save and restore...
        triangle.saveState();
        triangle.translate(0.5, 0.6, 0.4);
        triangle.saveState();
        triangle.scale(0.2, -0.5, 0.6);
        triangle.saveState();
        triangle.rotate(30, 0.3, 0.4, 0.5);

        deepEqual(
            triangle.matrix,
            Matrix.translate(0.5, 0.6, 0.4)
            .multiply(Matrix.scale(0.2, -0.5, 0.6))
            .multiply(Matrix.rotation(30, 0.3, 0.4, 0.5)),
            "Make sure that matrix is correct inside nested saved state"
        );
        triangle.restoreState();
        deepEqual(
            triangle.matrix,
            Matrix.translate(0.5, 0.6, 0.4).multiply(Matrix.scale(0.2, -0.5, 0.6)),
            "Make sure that matrix nested restores correctly"
        );
        triangle.restoreState();
        deepEqual(
            triangle.matrix,
            Matrix.translate(0.5, 0.6, 0.4),
            "Make sure that matrix continues restoring correctly"
        );
        triangle.saveState();
        triangle.translate(0, 0, 0);
        deepEqual(
            triangle.matrix,
            Matrix.translate(0.5, 0.6, 0.4).multiply(Matrix.translate(0, 0, 0)),
            "Make sure that matrix can save in a save"
        );
        triangle.restoreState();
        deepEqual(
            triangle.matrix,
            Matrix.translate(0.5, 0.6, 0.4),
            "Make sure that matrix restores yet again"
        );
        triangle.restoreState();
        deepEqual(
            triangle.matrix,
            new Matrix(),
            "Make sure that shapes matrix is back to starting point"
        );
        triangle.restoreState();
        deepEqual(
            triangle.matrix,
            new Matrix(),
            "Make sure that additional restores don't damage matrix"
        );
    });

    test("Methods: copy", () => {
        let triangle = new Shape(triangleArray, [[0, 1, 2]]);
        triangle.translate(0.5, 0.6, 0.4);
        let triangle2 = triangle.copy();
        notDeepEqual(
            triangle2.parent,
            triangle,
            "Make sure a parent relationship wasn;t formed"
        );
        notDeepEqual(
            triangle.matrix,
            triangle2.matrix,
            "Make sure that no inheritance happened when copying"
        );
    });

    test("Methods: toRawArray", () => {
        // Should be 3 vertices each with an X,Y,Z... thus 9 values...
        let triangle = new Shape(triangleArray, [[0, 1, 2]], gl.TRIANGLES);
        let triangles = triangle.toRawTriangleArray({vertices: triangleArray, indices: [[0, 1, 2]]});
        equal(
            triangle.vertices.length,
            9,
            "Make sure theres an xyz value for each vertex 3*3 = 9"
        );
        deepEqual(
            triangle.vertices,
            triangles,
            "Make sure that the vertices are computed correctly for triangles"
        );
        let linAngle = new Shape(triangleArray, [[0, 1, 2]], gl.LINES);
        let lines = triangle.toRawLineArray({vertices: triangleArray, indices: [[0, 1, 2]]});
        equal(
            linAngle.vertices.length,
            18,
            "Make sure that every vertex was doubled for lines"
        );
        deepEqual(
            linAngle.vertices,
            lines,
            "Make sure that the vertices are computed correctly for lines"
        )
    });
});
