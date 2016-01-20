(function () {

	window.SpriteLibrary = window.SpriteLibrary || { };

	SpriteLibrary.bouncingBall = function () {
		// Declare other variables here.
	    var radialGradient = renderingContext.createRadialGradient(160, 160, 1, 180, 180, 320);

	    // Put your canvas drawing code (and any other code) here.
	    radialGradient.addColorStop(0, "white");
	    radialGradient.addColorStop(0.333, "red");
	    radialGradient.addColorStop(1, "blue");

	    renderingContext.fillStyle = radialGradient;
	    renderingContext.beginPath();
	    renderingContext.arc(256, 256, 200, 0, Math.PI * 2, true);
	    renderingContext.fill();
	};

}());