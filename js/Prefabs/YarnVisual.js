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

	this.justTightened = false; // Variable used to store if the yarn was just tightened; used in mpAngle
	this.mpAngleDir = 0; // Variable used to track where mpAngle should point, left or right
	this.mpAngleScalar = 0; // Variable used to control the influence of mpAngle
	this.mpDrop = 0; // Variable used to control the vertical drop of midpoint
	this.playerGravDir = 1; // Variable used to control which direction midpoint drops, up or down

	// Adds in the bezier graphics for the yarn
	// Adds in the bezier handles, respective of the players
	this.player1BAnchor = game.add.sprite(0, 100, key);
	this.player2BAnchor = game.add.sprite(100, 0, key);

	this.bezierGraphics = game.add.graphics(0, 0);
	this.bezierGraphics.zOrder = layerYarn;
	this.neutralColor = 0x8D58DD; // neutral color of the yarn is purple

	this.gameplay.group.add(this.bezierGraphics); // Adds in the yarn for layer sorting

	// Calculates midpoint so other variables are correct
	this.calcPlayerCoords();
	this.setMidpoint();
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
	this.setMidpoint();

	this.updateMidpoint();

	this.drawYarn();
}

YarnVisual.prototype.updateMidpoint = function(){
	let yp = this.yarnParent;

	// Determines by how much to scale the midpoint drop height based on player distance
	let playerDistYMult = Phaser.Math.distance(this.p1X, this.p1Y, this.p2X, this.p2Y) / 400;

	// How much to offset the midpoint;
	// midpoint will drop from the midpoint and modify itself according to the distance of the players and who last anchored and how much it has dropped
	let mpDistVar = 125 * playerDistYMult * this.playerGravDir * this.mpDrop;

	// mpAngle is perpendicular to yarnAngle, and the angle is controlled by mpAngleDir
	let mpAngle = yp.yarnAngle + (Math.PI / 2 * this.mpAngleDir);

	// 
	let outputtedAngle = (mpAngle - (1.5 * Math.PI * this.playerGravDir)) * this.mpAngleScalar + (1.5 * Math.PI);

	// If the yarn is just tightened, update the tighten animation
	if(this.justTightened === true){
		this.midpoint.x = this.x + Math.cos(outputtedAngle) * mpDistVar;
		this.midpoint.y = this.y + Math.sin(outputtedAngle) * mpDistVar;
	}
	else{
		this.midpoint.x = this.x; // midpoint matches the midpoint's x
		this.midpoint.y = this.y + mpDistVar;
	}

	this.mpSlack.x = this.x;
	this.mpSlack.y = this.y + mpDistVar;

	this.mpTaut.x = this.x;
	this.mpTaut.y = this.y;
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

	if(this.state === 'taut'){ // If the yarn is in its active state

		// TODO: get slackLength / tautLength and make that the max of the offset
		// Use angle and use that map that to how much to offset both handles

		// Finds the difference between the current length and the length that the yarn was created at
		var slackLength = yp.tautLength - yp.playerDist;

		// As the slackLength increases, the bezier Handles start moving more to the side
		// Constructs a linear function slackLength as input and handleOffsetMult as output
		// slackThreshold = slackMaxValue
		// tautThreshold = 0
		// handleOffsetMult is the horizontal magnitude of the offset
		var tautThreshold = 5;
		var slackThreshold = .8 * yp.tautLength;
		var slackMaxValue = 150;

		var handleOffsetMult = Phaser.Math.mapLinear(slackLength, slackThreshold, tautThreshold, slackMaxValue, 0);
		handleOffsetMult = Phaser.Math.clamp(handleOffsetMult,0,slackMaxValue);

		// Rotates the bezier handle offsets relative to the string
		var yarnCos = Math.cos(yp.yarnAngle + (1.5 * Math.PI));
		var yarnSin = Math.sin(yp.yarnAngle + (1.5 * Math.PI));
		var handleXRotation = yarnCos * handleOffsetMult;
		var handleYRotation = yarnSin * handleOffsetMult;

		// for slackLength, 0 is taut, yp.tautLength means players are close to each other
		var mpHorizOffset = Phaser.Math.mapLinear(slackLength, 0, yp.tautLength, 0, 100);
		var mpHorizInfluence = Math.abs( Phaser.Math.mapLinear( yp.yarnAngle, 0, Math.PI, -1, 1));

		// Sets the bezier handles to the modifiers of everything
		this.player1BAnchor.position.setTo(this.midpoint.x - player1XDiff + handleXRotation, this.midpoint.y - player1YDiff + handleYRotation);
		this.player2BAnchor.position.setTo(this.midpoint.x - player2XDiff - handleXRotation, this.midpoint.y - player2YDiff - handleYRotation);
	}
	else if(this.state === 'slack'){ // If the yarn is in the inactive state
		// Sets the bezier handles to the correct positions
		this.player1BAnchor.position.setTo(this.midpoint.x - player1XDiff, this.midpoint.y - player1YDiff);
		this.player2BAnchor.position.setTo(this.midpoint.x - player2XDiff, this.midpoint.y - player2YDiff);
	}
	else{
		console.log(this.state + " is not a valid state. taut or slack"); // In case I make a typo
	}

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
YarnVisual.prototype.setMidpoint = function(){
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

// Prevents the tighten animation from updating
YarnVisual.prototype.disableMPAngle = function(){
	this.justTightened = false;
}

// Causes the midpoint to drop
YarnVisual.prototype.dropMidpoint = function(){
	if(this.mpAngleTween != null){
		this.mpAngleTween.stop();
	}
	this.disableMPAngle();

	if(this.mpTween != null){
		this.mpTween.stop();
	}
	this.mpTween = game.add.tween(this).to( { mpDrop: 1 }, 1500, Phaser.Easing.Bounce.Out, true, 0, 0, false);
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

	if(this.mpTween != null){
		this.mpTween.stop();
	}
	this.mpTween = game.add.tween(this).to( { mpDrop: 0 }, 500, "Custom.elasticOut", true, 0, 0, false);

	// Introduces an X component to the tween so it can be seen when the yarn is vertical
	this.justTightened = true;

	if(yp.player1.x < yp.player2.x){
		this.mpAngleDir = 1;
	}
	else{
		this.mpAngleDir = -1;
	}
	this.mpAngleDir *= this.playerGravDir;

	// Tweens the angle of the midpoint
	if(this.mpAngleTween != null){
		this.mpAngleTween.stop();
	}

	// Tweens the magnitude of the midpoint // Does it?
	this.mpAngleScalar = 0;
	this.mpAngleTween = game.add.tween(this).to( { mpAngleScalar: 1 }, 50, Phaser.Easing.Linear.In, true, 0, 0, false);

	this.mpTween.onComplete.add(this.disableMPAngle, this);
}