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

            if (specs.orbitOf) {
                let distanceToOrbiter = this.orbitOf.startLocation.z - this.startLocation.z;
                let velocitySquared = (gravitationalConstant * this.orbitOf.mass) / distanceToOrbiter;

                this.velocity = new Vector(Math.sqrt(velocitySquared), 0, 0);

                this.acceleration = new Vector(0, 0, (velocitySquared / distanceToOrbiter));

                this.forceOfGravity = this.acceleration.magnitude();

            }
        }


        update (time) {
            // Getting passed 1... aka 1 year, thus dividing by the seconds in a week to make each iteration a week...
            time /= 60480;
            this.updateVelocity(time);
            // Update location based on velocity
            this.updatePosistion(time);
            // Update the direction of the acceleration vector...
            this.updateAccleration();
        }

        updateVelocity (time) {
            this.velocity = this.velocity.add(this.acceleration.multiply(time));
        }

        updatePosistion (time) {
            this.translate(
                this.velocity.x() * time,
                this.velocity.y() * time,
                this.velocity.z() * time
            );
        }

        updateAccleration () {
            let transVec = new Vector(0, 0, 0, 1);
            let myCoord = this.matrix.multiplyVector(transVec);
            let orbiterCoord = this.orbitOf.matrix.multiplyVector(transVec);
            let angleToOrbiter = Math.atan2(orbiterCoord.z() - myCoord.z(), orbiterCoord.x() - myCoord.x());

            this.acceleration = new Vector(
                this.forceOfGravity * Math.cos(angleToOrbiter),
                0,
                this.forceOfGravity * Math.sin(angleToOrbiter)
            );

        }

        draw (gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix, textureCoordinate, time) {
            super.draw(gl, vertexDiffuseColor, vertexSpecularColor, shininess, vertexPosition, normalVector, transformMatrix, textureCoordinate, time);
            if (this.orbitOf) {
                this.update(time);
            }
        }
    }
    return planet;
}))();
