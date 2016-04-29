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
            this.startLocation = specs.location || {x: 0, y: 0, z: 0};
            this.locationVec = new Vector(this.startLocation.x, this.startLocation.y, this.startLocation.z);
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
                this.orbiterLoc = new Vector(this.orbitOf.startLocation.x, this.orbitOf.startLocation.y, this.orbitOf.startLocation.z);
                if (this.startLocation.x !== this.orbitOf.startLocation.x && this.startLocation.z < this.orbitOf.startLocation.z) {
                    throw "Planets must be created in the XZ plane behind (in the z) the planet they orbit";
                }
            }

            // If I restrict the user to only creating planets below the one they orbit this cuts down on the calculation
            // for distance to the orbiter... Thus this one can be commented out... (Just in case planets can be arbitray)
            // let distanceToOrbiter = Math.sqrt(
            //     (this.startLocation.x - this.orbitOf.startLocation.x) * (this.startLocation.x - this.orbitOf.startLocation.x) +
            //     (this.startLocation.y - this.orbitOf.startLocation.y) * (this.startLocation.y - this.orbitOf.startLocation.y)
            // );
            if (specs.orbitOf) {
                let distanceToOrbiter = this.orbitOf.startLocation.z - this.startLocation.z;
                console.log("Distance to Orbiter: " + distanceToOrbiter);

                // Now using these values we can calculate the starting velocity of the planet...
                    // calculate velocity
                    // We set the velocity in the x direction so that it is perpendicular to acceleration later.
                    // v^2 = G*Ms / d
                let velocitySquared = (gravitationalConstant * this.orbitOf.mass) / distanceToOrbiter;
                // console.log(velocitySquared);
                // Moving left, aka negative x velocity...
                this.velocity = new Vector(Math.sqrt(velocitySquared), 0, 0);
                console.log(`Velocity: (${this.velocity.x()}, ${this.velocity.y()}, ${this.velocity.z()})`);
                // Now compute the acceleration
                // Set acceleration in the y direction... since that is where the orbiter is...
                // This is starting the planet with a acceleration pointing directly up at the planet it orbits...
                // a = G*Ms / d^2
                // Moving forward in the z toward orbiter...
                console.log(velocitySquared / distanceToOrbiter);
                this.acceleration = new Vector(0, 0, (velocitySquared / distanceToOrbiter));
                console.log(`Acceleration: (${this.acceleration.x()}, ${this.acceleration.y()}, ${this.acceleration.z()})`);
                this.forceOfGravity = this.acceleration.magnitude();

            }

        }


        update (time) {
            time /= 1000000;
            // time = time - previousTimestamp;
            // previousTimestamp = time;
            // Update velocity to be current velocity plus acceleration
            this.updateVelocity(time);
            // Update location based on velocity
            this.updatePosistion(time);
            // Update the direction of the acceleration vector...
            this.updateAccleration();
        }

        // Golden rule of this function should be: Vf = Vo + a*t
        // Need to remember to keep the x and y directions seperate...
        updateVelocity (time) {

            // console.log(this.acceleration);
            // this.velocity = new Vector(
            //     this.velocity.x() + this.acceleration.x() * time,
            //     0,
            //     this.velocity.z() + this.acceleration.z() * time
            // );
            // console.log(time);
            this.velocity = this.velocity.add(this.acceleration.multiply(time));
            // console.log(`Updated Velocity: (${this.velocity.x()}, ${this.velocity.y()}, ${this.velocity.z()})`);
        }

        updatePosistion (time) {
            // this.location = {
            //     x: this.location.x + this.velocity.x() * time,
            //     y: this.location.y + this.velocity.y() * time,
            //     z: 0
            // };
            this.locationVec = this.locationVec.add(this.velocity.multiply(time));
            console.log(`Updated location: (${this.locationVec.x()}, ${this.locationVec.y()}, ${this.locationVec.z()})`);
            this.translate(
                -this.locationVec.x() - this.startLocation.x,
                this.locationVec.y() - this.startLocation.y,
                this.locationVec.z() - this.startLocation.z
            );
        }

        // Angle of acceleration can be calulated by finding the angle to the body we are orbiting,
        // which can be found using the distance to that body... Using arcTan of our Y distance (sin) divided by
        // our X distance (cos). This angle can then be passed to cos and sin to find the amount of gravity in
        // each direction...
        updateAccleration () {
            let direction = this.orbiterLoc.subtract(this.locationVec);
            let angleToOrbiter = Math.atan(direction.z() / direction.x());

            // angleToOrbiter = (angleToOrbiter < 0) ? (2 * Math.PI + angleToOrbiter) : angleToOrbiter;
            console.log("Degrees to Sun: "+ (angleToOrbiter * (180 / Math.PI)));
            let cosineCorrection = (angleToOrbiter > 0) ? -1 : 1;
            let sineCorrection = (direction.z() < 0) ? 1 : -1;
            this.acceleration = new Vector(
                this.forceOfGravity * Math.cos(angleToOrbiter) * cosineCorrection,
                0,
                this.forceOfGravity * Math.sin(angleToOrbiter) * sineCorrection
            );
            // console.log(`Updated Acceleration: (${this.acceleration.x()}, ${this.acceleration.y()}, ${this.acceleration.z()})`);
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
                // this.update(time);
            }
        }
    }
    return planet;
}))();
