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

	// Creates the point that the bezier handles point to (midPointModifier)
	this.mpModifier = game.add.sprite(this.x, this.y, null);
	this.mpModifierYDrop = 0;
	this.playerGravDir = 1;

	// Adds in the bezier graphics for the yarn
	// Adds in the bezier handles, respective of the players
	this.player1BAnchor = game.add.sprite(0, 100, null);
	this.player2BAnchor = game.add.sprite(100, 0, null);
	// For debugging, allows to see the bezier handles
	if(debugCollisionsObjects === true){
		this.mpModifier.sprite = "debugNullSprite";
		this.player1BAnchor.sprite = "debugNullSprite";
		this.player2BAnchor.sprite = "debugNullSprite";
	}
	this.bezierGraphics = game.add.graphics(0, 0);
	this.bezierGraphics.zOrder = layerYarn;
	this.neutralColor = 0x8D58DD; // neutral color of the yarn is purple

	this.gameplay.group.add(this.bezierGraphics); // Adds in the yarn for layer sorting

	// Calculates midpoint so other variables are correct
	this.calcMidPoint();
	this.calcPlayerCoords();
	this.setYarnState("slack");
}

// inherit prototype from Phaser.Sprite and set constructor to YarnVisual
YarnVisual.prototype = Object.create(Phaser.Sprite.prototype);
YarnVisual.prototype.constructor = YarnVisual;

YarnVisual.prototype.update = function(){
	// Calculates midpoint so other variables are correct
	this.calcMidPoint();
	// Set the coordinates to draw the strings
	this.calcPlayerCoords();

	// Determines by how much to scale the mpModifier drop height based on player distance
	this.playerDistYMult = Phaser.Math.distance(this.p1X, this.p1Y, this.p2X, this.p2Y) / 400;

	this.mpModifier.x = this.x; // mpModifier matches the midpoint's x
	this.mpModifier.y = this.y + (125 * this.mpModifierYDrop * this.playerGravDir * this.playerDistYMult); // mpModifier will drop from the midpoint and modify itself according to the distance of the players and who last anchored and how much it has dropped

	this.drawYarn();
}

// Draws the yarn
YarnVisual.prototype.drawBezierYarn = function(){
	this.bezierGraphics.clear(); // Clears graphics so we don't see the previous versions of the yarn
	this.bezierGraphics.lineStyle(this.yarnWidth, this.yarnColor, 1); // Sets the style of the line

	this.bezierGraphics.moveTo(this.p1X, this.p1Y); // Sets initial position to player1
	this.bezierGraphics.bezierCurveTo(this.player1BAnchor.x, this.player1BAnchor.y, this.player2BAnchor.x, this.player2BAnchor.y, this.p2X, this.p2Y); // Draws the bezier curve to the other player
}

// Draws the yarn as a bezier curve
YarnVisual.prototype.drawYarn = function(){
	var yp = this.yarnParent;

	// By how far back to scale the bezier handles
	var margin = .2;

	// Obtains the distance of each player to the mpModifier
	var playerXDiff = (this.mpModifier.x - this.p1X) * margin;
	var playerYDiff = (this.mpModifier.y - this.p1Y) * margin;

	if(this.state === 'taut'){ // If the yarn is in its active state
		// Obtains the differences between players and sets them to 35% of the way
		var playerXDiff = (this.p2X - this.p1X) * .35;
    	var playerYDiff = (this.p2Y - this.p1Y) * .35;

    	// Finds the difference between the current length and the length that the yarn was created at
    	var slackLength = yp.tautLength - yp.playerDist;

    	// Creates a linear function to determine how much to offset the bezier handles
    	// Variables for this linear function
    	var tautThreshold = 5;
    	var slackThreshold = .45 * yp.tautLength;
    	var slackMaxValue = 75;

    	// As the slackLength increases, the bezier Handles start moving more to the side
    	// Constructs a linear function slackLength as input and handleOffsetMult as output
    	if(slackLength < tautThreshold){
    		var handleOffsetMult = 0
    	}
    	else if(slackLength < slackThreshold){
    		var handleOffsetMult = 0 + ( ( slackMaxValue / (slackThreshold - tautThreshold) ) * ( slackLength - tautThreshold ) );
    	}
    	else{
    		var handleOffsetMult = slackMaxValue;
    	}

    	// Rotates the bezier handle offsets relative to the string
    	var handleXRotation = Math.sin(yp.yarnAngle) * handleOffsetMult;
    	var handleYRotation = Math.cos(yp.yarnAngle) * handleOffsetMult;

    	// Sets the bezier handles to the modifiers of everything
    	this.player1BAnchor.position.setTo(this.p1X + playerXDiff + handleXRotation, this.p1Y + playerYDiff + handleYRotation);
    	this.player2BAnchor.position.setTo(this.p2X - playerXDiff - handleXRotation, this.p2Y - playerYDiff - handleYRotation);

    	// Draws the yarn
    	this.drawBezierYarn();
	}
	else if(this.state === 'slack'){ // If the yarn is in the inactive state

		// Sets the bezier handles to the correct positions
		this.player1BAnchor.position.setTo(this.mpModifier.x - playerXDiff, this.mpModifier.y - playerYDiff);
    	this.player2BAnchor.position.setTo(this.mpModifier.x + playerXDiff, this.mpModifier.y + playerYDiff);

    	// Draws the yarn
		this.drawBezierYarn();
	}
	else{
		console.log(this.state + " is not a valid state. taut or slack"); // In case I make a typo
	}
}

// Formula used to move this to the midpoint of the players
YarnVisual.prototype.calcMidPoint = function(){
	var xAverage = (this.player1.body.x + this.player2.body.x) / 2;
	var yAverage = (this.player1.body.y + this.player2.body.y) / 2;

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

// Change whether the mpModifier should drop upwards or downwards
YarnVisual.prototype.changePlayerGravDir = function(lastAnchored){
	this.playerGravDir = lastAnchored.body.data.gravityScale;
}

// Causes the mpModifier to drop
YarnVisual.prototype.dropMPModifier = function(){
	if(this.mpModifierTween != null){
		this.mpModifierTween.stop();
	}
	this.mpModifierTween = game.add.tween(this).to( { mpModifierYDrop: 1 }, 1500, Phaser.Easing.Bounce.Out, true, 0, 0, false);
}

// Resets the mpModifier to the mpModifier of the players
YarnVisual.prototype.resetMPModifier = function(){
	this.mpModifierYDrop = 0;
	this.mpModifier.x = this.x;
	this.mpModifier.y = this.y;
}

YarnVisual.prototype.setYarnState = function(state, color){
	if(state === "taut"){
		this.yarnWidth = "4";
		this.yarnColor = color;
		this.state = "taut";

		this.tightenMPModifier();
	}
	else if(state === "slack"){
		this.yarnWidth = "2";
		this.yarnColor = this.neutralColor;
		this.state = "slack";

		this.resetMPModifier();
		this.dropMPModifier();
	}
	else{
		console.log(state + " is not a valid state. taut or slack"); // In case I make a typo
	}
}

// Causes the mpModifier to tighten back to the midPoint
YarnVisual.prototype.tightenMPModifier = function(){
	if(this.mpModifierTween != null){
		this.mpModifierTween.stop();
	}
	this.mpModifierTween = game.add.tween(this).to( { mpModifierYDrop: 0 }, 1500, Phaser.Easing.Elastic.Out, true, 0, 0, false);
}