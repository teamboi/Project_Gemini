// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for YarnVisual
// Draws the yarn and handles all of the bezier curves
function YarnVisual(game, gameplay, yarn, player1, player2){
	Phaser.Sprite.call(this, game, 0, 0, null);
	game.add.existing(this); //Adds to display list

	this.gameplay = gameplay;
	this.yarnParent = yarn;
	this.player1 = player1; // Obtain references to both players
	this.player2 = player2;

	// https://samme.github.io/phaser-examples-mirror/tweens/custom%20ease.html
	game.tweens.easeMap['Custom.elasticOut'] = function (k) {
		var s,
		a = 1,
		p = 0.1;
		if (k === 0) { return 0; }
		if (k === 1) { return 1; }
		s = p / 4;
		return (a * Math.pow(2, - 10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
	};

	// For debugging, allows to see the bezier handles
	var key = null;
	if(debugCollisionsObjects === true){ key = "__missing"; }

	// Creates the point that the bezier handles point to
	// It changes the influence between pointing to Taut or Slack
	this.midpoint = game.add.sprite(this.x, this.y, key);
	this.mpTaut = game.add.sprite(this.x, this.y, key);
	this.mpSlack = game.add.sprite(this.x, this.y, key);
	this.midpoint.scale.setTo(.1);

	this.mpTension = 0;
	this.mpBezierInfluence = 0;

	this.mpTautToSlackTransitionTime = 200;
	this.mpSlackToTautTransitionTime = 50;

	this.mpDropTransitionTime = 1500;
	this.mpTightenTransitionTime = 500;

	this.mpBezierDropTransitionTime = 1500;
	this.mpBezierTightenTransitionTime = 200;

	this.justTightened = false; // Variable used to store if the yarn was just tightened; used in mpAngle
	this.mpAngleLeftRight = 0; // Variable used to track where mpAngle should point, left or right
	this.mpAngleInfluence = 0; // Variable used to control the influence of mpAngle
	this.mpDrop = 0; // Variable used to control the vertical drop of midpoint
	this.mpTighten = 0; // Variable used to control the offset magnitude of the midpoint when tightening
	this.playerGravDir = 1; // Variable used to control which direction midpoint drops, up or down

	// Adds in the bezier graphics for the yarn
	// Adds in the bezier handles, respective of the players
	this.player1BAnchor = game.add.sprite(0, 100, key);
	this.player2BAnchor = game.add.sprite(100, 0, key);
	this.player1BAnchor.scale.setTo(.4);
	this.player2BAnchor.scale.setTo(.4);

	this.bezierGraphics = game.add.graphics(0, 0);
	this.bezierGraphics.zOrder = layerYarn;
	this.neutralColor = 0x8D58DD; // neutral color of the yarn is purple

	this.gameplay.group.add(this.bezierGraphics); // Adds in the yarn for layer sorting

	// Calculates midpoint so other variables are correct
	this.calcPlayerCoords();
	this.setToMidpoint();
	this.setYarnState("slack");
}

// inherit prototype from Phaser.Sprite and set constructor to YarnVisual
YarnVisual.prototype = Object.create(Phaser.Sprite.prototype);
YarnVisual.prototype.constructor = YarnVisual;

YarnVisual.prototype.update = function(){
	var yp = this.yarnParent;
	// Set the coordinates to draw the strings
	this.calcPlayerCoords();
	// Calculates midpoint so other variables are correct
	this.setToMidpoint();

	this.slackLength = yp.tautLength - yp.playerDist;

	// Adds offset to the midpoint
	this.updateMidpoint();

	this.drawYarn();
}

YarnVisual.prototype.updateMidpoint = function(){
	// TODO: See if I have to use disableMPModifier()
	let yp = this.yarnParent;

	// Determines by how much to scale the midpoint offset magnitude based on player distance (125 / 400) and who last anchored
	let mpOffsetMagnitude = Phaser.Math.distance(this.p1X, this.p1Y, this.p2X, this.p2Y) * .3125 * this.playerGravDir;

	// mpTension 0 = Slack; 1 = Taut
	// Updating mpSlack
	if(this.mpTension != 1){
		this.mpSlack.x = this.x;
		this.mpSlack.y = this.y + (mpOffsetMagnitude * this.mpDrop);
	}
	// Updating mpTaut
	if(this.mpTension != 0){
		if(yp.player1.x < yp.player2.x) this.mpAngleLeftRight = 1;
		else this.mpAngleLeftRight = -1;
		this.mpAngleLeftRight *= this.playerGravDir;

		// mpAngle is perpendicular to yarnAngle, and the angle is controlled by mpAngleLeftRight
		let mpAngle = yp.yarnAngle + (Math.PI / 2 * this.mpAngleLeftRight);

		// subtract the downward angle from the desired angle, multiply by influence, and add back downward angle
		let outputtedAngle = (mpAngle - (1.5 * Math.PI * this.playerGravDir)) * this.mpAngleInfluence + (1.5 * Math.PI * this.playerGravDir);

		// Finds the difference between the current length and the length that the yarn was created at
		let slackInfluence = (this.slackLength / yp.tautLength); // = 1, yarn is taut; = 0, yarn is slack; More prominent the closer the cats are
		let yarnAngleInfluence = Math.abs(Math.cos(yp.yarnAngle)); // It's less noticeable the more vertical the yarn is

		let slackOffset = 0.5*yp.tautLength * slackInfluence * yarnAngleInfluence;

		// Set coords to the actual midpoint, then add on the tighten variables + slackness variables, all offset by outputtedAngle
		let outputtedOffset = mpOffsetMagnitude * this.mpTighten;
		this.mpTaut.x = this.x + Math.cos(outputtedAngle) * outputtedOffset + Math.cos(mpAngle) * slackOffset;
		this.mpTaut.y = this.y + Math.sin(outputtedAngle) * outputtedOffset + Math.sin(mpAngle) * slackOffset;
	}

	let mpSlackInfluence = 1 - this.mpTension;
	let mpTautInfluence = this.mpTension;

	this.midpoint.x = this.mpSlack.x*mpSlackInfluence + this.mpTaut.x*mpTautInfluence;
	this.midpoint.y = this.mpSlack.y*mpSlackInfluence + this.mpTaut.y*mpTautInfluence;
}

// Draws the yarn as a bezier curve
YarnVisual.prototype.drawYarn = function(){
	var yp = this.yarnParent;

	// By how far back to scale the bezier handles
	var margin = .35;

	// Obtains the distance of each player to the midpoint
	var player1XDiff = (this.midpoint.x - this.p1X) * margin;
	var player1YDiff = (this.midpoint.y - this.p1Y) * margin;
	var player2XDiff = (this.midpoint.x - this.p2X) * margin;
	var player2YDiff = (this.midpoint.y - this.p2Y) * margin;

	// As the slackLength increases, the bezier Handles start moving more to the side
	// Constructs a linear function slackLength as input and handleOffsetMult as output
	// slackThreshold = slackMaxValue
	// tautThreshold = 0
	// handleOffsetMult is the horizontal magnitude of the offset
	var tautThreshold = 5;
	var slackThreshold = .8 * yp.tautLength;
	var slackMaxValue = .5 * yp.tautLength;

	var handleOffsetMult = Phaser.Math.mapLinear(this.slackLength, slackThreshold, tautThreshold, slackMaxValue, 0);
	handleOffsetMult = Phaser.Math.clamp(handleOffsetMult,0,slackMaxValue);

	// Rotates the bezier handle offsets relative to the string
	var yarnCos = Math.cos(yp.yarnAngle + (1.5 * Math.PI));
	var yarnSin = Math.sin(yp.yarnAngle + (1.5 * Math.PI));
	var handleXRotation = yarnCos * handleOffsetMult * this.mpBezierInfluence;
	var handleYRotation = yarnSin * handleOffsetMult * this.mpBezierInfluence;

	// Sets the bezier handles to the modifiers of everything
	this.player1BAnchor.position.setTo(this.midpoint.x - player1XDiff + handleXRotation, this.midpoint.y - player1YDiff + handleYRotation);
	this.player2BAnchor.position.setTo(this.midpoint.x - player2XDiff - handleXRotation, this.midpoint.y - player2YDiff - handleYRotation);

	// Draws the yarn
	this.drawBezierYarn();
}

// Draws the yarn
YarnVisual.prototype.drawBezierYarn = function(){
	this.bezierGraphics.clear(); // Clears graphics so we don't see the previous versions of the yarn
	this.bezierGraphics.lineStyle(this.yarnWidth, this.yarnColor, 1); // Sets the style of the line

	this.bezierGraphics.moveTo(this.p1X, this.p1Y); // Sets initial position to player1
	// Draws the bezier curve to the other player
	this.bezierGraphics.bezierCurveTo(this.player1BAnchor.x, this.player1BAnchor.y, this.player2BAnchor.x, this.player2BAnchor.y, this.p2X, this.p2Y);
}

// Formula used to move this to the midpoint of the players
YarnVisual.prototype.setToMidpoint = function(){
	let xAverage = (this.p1X + this.p2X) / 2;
	let yAverage = (this.p1Y + this.p2Y) / 2;

	this.x = xAverage;
	this.y = yAverage;
}

// Calculates and sets the endpoints of the yarn
YarnVisual.prototype.calcPlayerCoords = function(){
	this.p1X = this.player1.x + this.player1.yarnAnchorOffsetX;
	this.p1Y = this.player1.y - this.player1.yarnAnchorOffsetY;
	this.p2X = this.player2.x + this.player2.yarnAnchorOffsetX;
	this.p2Y = this.player2.y + this.player2.yarnAnchorOffsetY;
}

// Change whether the midpoint should drop upwards or downwards
YarnVisual.prototype.changePlayerGravDir = function(lastAnchored){
	this.playerGravDir = lastAnchored.body.data.gravityScale;
}

// Causes the midpoint to drop
YarnVisual.prototype.dropMidpoint = function(){
	if(this.mpAngleTween != null) this.mpAngleTween.stop();
	this.mpAngleTween = game.add.tween(this).to( { mpAngleInfluence: 0 }, 50, Phaser.Easing.Linear.In, true, 0, 0, false);

	if(this.mpDropTween != null) this.mpDropTween.stop();
	this.mpDrop = this.mpTighten;
	this.mpDropTween = game.add.tween(this).to( { mpDrop: 1 }, this.mpDropTransitionTime, Phaser.Easing.Bounce.Out, true, 0, 0, false);

	if(this.mpTightenTween != null) this.mpTightenTween.stop();

	if(this.mpTensionTween != null) this.mpTensionTween.stop();
	this.mpTensionTween = game.add.tween(this).to( { mpTension: 0 }, this.mpTautToSlackTransitionTime, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);

	if(this.mpBezierTween != null) this.mpBezierTween.stop();
	this.mpBezierTween = game.add.tween(this).to( { mpBezierInfluence: 0 }, this.mpBezierTransitionTime, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
}

// Sets appropriate variables for the state of the yarn
YarnVisual.prototype.setYarnState = function(state, color){
	// If the yarn is taut, display it as such
	if(state === "taut"){
		this.yarnWidth = "4";
		this.yarnColor = color;
		this.state = "taut";

		// Then begin the tighten animation
		this.tightenMidpoint();
	}
	// If the yarn is slack, display it as such
	else if(state === "slack"){
		this.yarnWidth = "2";
		this.yarnColor = this.neutralColor;
		this.state = "slack";

		// Then begin the drop animation
		this.dropMidpoint();
	}
	else{
		console.log(state + " is not a valid state. taut or slack"); // In case I make a typo
	}
}

// Causes the midpoint to tighten back to the midpoint
// mpAngle is an angle that is perpendicular to the yarnAngle and changes the midpoint to follow this line
YarnVisual.prototype.tightenMidpoint = function(){
	var yp = this.yarnParent;

	if(this.mpDropTween != null) this.mpDropTween.stop();

	if(this.mpTightenTween != null) this.mpTightenTween.stop();
	this.mpTighten = this.mpDrop;
	this.mpTightenTween = game.add.tween(this).to( { mpTighten: 0 }, this.mpTightenTransitionTime, "Custom.elasticOut", true, 0, 0, false);

	if(this.mpTensionTween != null) this.mpTensionTween.stop();
	this.mpTensionTween = game.add.tween(this).to( { mpTension: 1 }, this.mpSlackToTautTransitionTime, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);

	if(this.mpBezierTween != null) this.mpBezierTween.stop();
	this.mpBezierTween = game.add.tween(this).to( { mpBezierInfluence: 1 }, this.mpBezierTransitionTime, "Custom.elasticOut", true, 0, 0, false);

	// Tweens the angle of the midpoint
	if(this.mpAngleTween != null) this.mpAngleTween.stop();

	// Tweens the magnitude of the midpoint // Does it?
	this.mpAngleInfluence = 0;
	this.mpAngleTween = game.add.tween(this).to( { mpAngleInfluence: 1 }, 50, Phaser.Easing.Linear.In, true, 0, 0, false);
}