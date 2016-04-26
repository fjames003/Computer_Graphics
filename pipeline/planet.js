const Planet = ((() => {
    // m^3kg^-1s^-2
    // const gravitationalConstant = 6.67408 * Math.pow(10, -11);
    // AU^3 * yr^-2 * SolarMasses^-1 -->Smaller units...
    const gravitationalConstant = 4 * Math.PI * Math.PI;
    let previousTimestamp = 0;
    class planet extends Sphere {
        constructor (specs) {
            specs.n = 25;
            specs.mode = 4;
            super(specs);
            // Planets must obey one plane... Thus z will always be 0...
            this.location = specs.location || {x: 0, y: 0, z: 0};
            //Default to something here...
            if (!specs.mass || !specs.radius) {
                throw "A planet must have a mass and a radius";
            }
            this.mass = specs.mass;
            // Will be used for scale to resemble more realistic sizes...
            this.radius = specs.radius;
            this.orbitOf = specs.orbitOf;

            // This is a simplification that will same me some calculating since I know how I will start the scene.
            if (specs.orbitOf) {
                this.orbiterLoc = new Vector(this.orbitOf.location.x, this.orbitOf.location.y);
                if (this.location.x !== this.orbitOf.location.x && this.location.y < this.orbitOf.location.y) {
                    throw "Planets must be created in the XY plane below (in the y) the planet they orbit";
                }
            }

            // If I restrict the user to only creating planets below the one they orbit this cuts down on the calculation
            // for distance to the orbiter... Thus this one can be commented out... (Just in case planets can be arbitray)
            // let distanceToOrbiter = Math.sqrt(
            //     (this.location.x - this.orbitOf.location.x) * (this.location.x - this.orbitOf.location.x) +
            //     (this.location.y - this.orbitOf.location.y) * (this.location.y - this.orbitOf.location.y)
            // );
            if (specs.orbitOf) {
                let distanceToOrbiter = this.orbitOf.location.y - this.location.y;
                console.log("Distance to Orbiter: " + distanceToOrbiter);

                // Now using these values we can calculate the starting velocity of the planet...
                    // calculate velocity
                    // We set the velocity in the x direction so that it is perpendicular to acceleration later.
                    // v^2 = G*Ms / d
                let velocitySquared = (gravitationalConstant * this.orbitOf.mass) / distanceToOrbiter;
                // console.log(velocitySquared);
                this.velocity = new Vector(Math.sqrt(velocitySquared), 0);
                console.log(`Velocity: (${this.velocity.x()}, ${this.velocity.y()})`);
                // Now compute the acceleration
                // Set acceleration in the y direction... since that is where the orbiter is...
                // This is starting the planet with a acceleration pointing directly up at the planet it orbits...
                // a = G*Ms / d^2
                this.acceleration = new Vector(0, velocitySquared / distanceToOrbiter);
                console.log(`Acceleration: (${this.acceleration.x()}, ${this.acceleration.y()})`);
                this.forceOfGravity = this.acceleration.magnitude();

            }

        }


        update (time) {
            time /= 1000;
            // time = time - previousTimestamp;
            // previousTimestamp = time;
            // Update location based on velocity
            this.updatePosistion(time);
            // Update the direction of the acceleration vector...
            this.updateAccleration();
            // Update velocity to be current velocity plus acceleration
            this.updateVelocity(time);
        }

        // Golden rule of this function should be: Vf = Vo + a*t
        // Need to remember to keep the x and y directions seperate...
        updateVelocity (time) {

            // console.log(this.acceleration);
            this.velocity = new Vector(
                this.velocity.x() + this.acceleration.x() * time,
                this.velocity.y() + this.acceleration.y() * time
            );
            console.log(time);
            // this.velocity = this.velocity.add(this.acceleration.multiply(time));
            console.log(`Updated Velocity: (${this.velocity.x()}, ${this.velocity.y()})`);
        }

        updatePosistion (time) {
            this.location = {
                x: this.location.x + this.velocity.x() * time,
                y: this.location.y + this.velocity.y() * time,
                z: 0
            };
            console.log(`Updated location: (${this.location.x}, ${this.location.y})`);
        }

        // Angle of acceleration can be calulated by finding the angle to the body we are orbiting,
        // which can be found using the distance to that body... Using arcTan of our Y distance (sin) divided by
        // our X distance (cos). This angle can then be passed to cos and sin to find the amount of gravity in
        // each direction...
        updateAccleration () {
            let myLoc = new Vector(this.location.x, this.location.y);
            let direction = this.orbiterLoc.subtract(myLoc);
            let angleToOrbiter = Math.atan(direction.y() / direction.x());
            this.acceleration = new Vector(
                this.forceOfGravity * Math.cos(angleToOrbiter),
                this.forceOfGravity * Math.sin(angleToOrbiter)
            );
            console.log(`Updated Acceleration: (${this.acceleration.x()}, ${this.acceleration.y()})`);
        }

        // set velocity (s) {
        //     this._velocity = {x: s.x, y: s.y, z: s.z};
        // }
        // get velocity () {
        //     return this._velocity;
        // }

        draw (gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix, textureCoordinate, time) {
            super.draw(gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix, textureCoordinate, time);
            if (this.orbitOf) {
                this.update(time);
            }
        }
    }
    return planet;
}))();
