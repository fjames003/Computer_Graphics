class Planet extends Sphere {
    // m^3kg^-1s^-2
    const gravitationalConstant = 6.67408 * Math.pow(10, -11);
    constructor (specs) {
        // Planets must obey one plane... Thus z will always be 0...
        this.location = specs.location || {x: 0, y: 0, z: 0};
        this.texture = specs.texture; //Default to something here...
        if (!spec.mass || !specs.radius) {
            throw "A planet must have a mass and a radius";
        }
        this.mass = spec.mass;
        // Will be used for scale to resemble more realistic sizes...
        this.radius = specs.radius;
        this.orbitOf = specs.orbitOf;

        // This is a simplification that will same me some calculating since I know how I will start the scene.
        if (specs.orbitOf && this.location.x !== this.orbitOf.location.x && this.location.y < this.orbitOf.location.y) {
            throw "Planets must be created in the XY plane below (in the y) the planet they orbit";
        }

        // If I restrict the user to only creating planets below the one they orbit this cuts down on the calculation
        // for distance to the orbiter... Thus this one can be commented out... (Just in case planets can be arbitray)
        // let distanceToOrbiter = Math.sqrt(
        //     (this.location.x - this.orbitOf.location.x) * (this.location.x - this.orbitOf.location.x) +
        //     (this.location.y - this.orbitOf.location.y) * (this.location.y - this.orbitOf.location.y)
        // );
        let distanceToOrbiter = this.orbitOf.location.y - this.location.y;

        // Now using these values we can calculate the starting velocity of the planet...
            // calculate velocity
            // We set the velocity in the x direction so that it is perpendicular to acceleration later.
            // v^2 = G*Ms / d
        let velocitySquared = (gravitationalConstant * this.orbitOf.mass) / distanceToOrbiter;
        this.velocity = new Vector(Math.sqrt(velocitySquared), 0);

        // Now compute the acceleration
        // Set acceleration in the y direction... since that is where the orbiter is...
        // This is starting the planet with a acceleration pointing directly up at the planet it orbits...
        // a = G*Ms / d^2
        this.acceleration = new Vector(0, velocitySquared / distanceToOrbiter);
    }

    // Golden rule of this function should be: Vf = Vo + a*t
    updateLocation () {
        // Update velocity to be current velocity plus acceleration
        // Update location based on velocity
        // Update the direction of the acceleration vector...
    }

    set velocity (s) {
        this._velocity = {x: s.x, y: s.y, z: s.z};
    }
    get velocity () {
        return this._velocity;
    }

    draw (gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix) {
        super.draw(gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix);
        this.updateLocation();
    }
}
