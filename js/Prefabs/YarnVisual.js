// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for YarnVisual
// For nice curves in the yarn when not anchoring
function YarnVisual(game, gameplay, yarn, player1, player2){
	Phaser.Sprite.call(this, game, 0, 0, null);
	game.add.existing(this); //Adds to display list

	this.gameplay = gameplay;
	this.yarnParent = yarn;
	this.player1 = player1; // Obtain references to both players
	this.player2 = player2;

	this.wasYarnJustReleased = false; // boolean to detect if yarn was just released

	// When first created, drop the anchor
	this.dropTween = game.add.tween(this).to( { midAnchorYDrop: 1 }, 1500, Phaser.Easing.Bounce.Out, true, 0, 0, false);

	// Calculates midpoint so other variables are correct
	this.calcMidPoint();

	// Creates the anchor that drops when slack with appropriate variables
	this.midAnchor = game.add.sprite(this.x, this.y, null);
	this.midAnchorYDrop = 0;
	this.playerGravDir = 1;

	// Adds in the bezier graphics for the yarn
	// Adds in the bezier handles, respective of the players
	this.player1BAnchor = game.add.sprite(0, 100, null);
	this.player2BAnchor = game.add.sprite(100, 0, null);
	// For debugging, allows to see the bezier handles
	if(debugCollisionsObjects === true){
		this.player1BAnchor.sprite = "ball";
		this.player2BAnchor.sprite = "ball";
	}
	this.bezierGraphics = game.add.graphics(0, 0);
	this.bezierGraphics.zOrder = layerYarn;
	this.neutralColor = 0x8D58DD; // neutral color of the yarn is purple

	this.gameplay.group.add(this.bezierGraphics); // Adds in the yarn for layer sorting
}

// inherit prototype from Phaser.Sprite and set constructor to YarnVisual
YarnVisual.prototype = Object.create(Phaser.Sprite.prototype);
YarnVisual.prototype.constructor = YarnVisual;

YarnVisual.prototype.update = function(){
	// Calculates midpoint so other variables are correct
	this.calcMidPoint();
	// Determines by how much to scale the anchor drop height based on player distance
	this.playerDistYMult = Phaser.Math.distance(this.player1.x, this.player1.y, this.player2.x, this.player2.y)/400;

	this.midAnchor.x = this.x; // anchor matches the midpoint's x
	this.midAnchor.y = this.y + (125 * this.midAnchorYDrop * this.playerGravDir * this.playerDistYMult); // acnhor will drop from the midpoint and modify itself according to the distance of the players and who last anchored and how much it has dropped
}

// Draws the yarn
YarnVisual.prototype.drawBezierYarn = function(width, color, p1X, p1Y, p2X, p2Y){
	this.bezierGraphics.clear(); // Clears graphics so we don't see the previous versions of the yarn
	this.bezierGraphics.lineStyle(width, color, 1); // Sets the style of the line

	this.bezierGraphics.moveTo(p1X,p1Y); // Sets initial position to player1
	this.bezierGraphics.bezierCurveTo(this.player1BAnchor.x, this.player1BAnchor.y, this.player2BAnchor.x, this.player2BAnchor.y, p2X, p2Y); // Draws the bezier curve to the other player
}

// Draws the yarn as a bezier curve
YarnVisual.prototype.drawYarn = function(width, color, anchored){
	var yp = this.yarnParent;

	// Set the coordinates to draw the strings
	var p1X = this.player1.x + this.player1.yarnAnchorOffsetX;
	var p1Y = this.player1.y - this.player1.yarnAnchorOffsetY;
	var p2X = this.player2.x + this.player2.yarnAnchorOffsetX;
	var p2Y = this.player2.y + this.player2.yarnAnchorOffsetY;

	if(anchored === 'taut'){ // If the yarn is in its active state
		// Obtains the differences between players and sets them to 35% of the way
		var playerXDiff = (p2X - p1X)*.35;
    	var playerYDiff = (p2Y - p1Y)*.35;

    	// Finds the difference between the current length and the length that the yarn was created at
    	var slackLength = yp.tautLength - yp.playerDist;

    	// Creates a linear function to determine how much to offset the bezier handles
    	// Variables for this linear function
    	var tautThreshold = 5;
    	var slackThreshold = .45*yp.tautLength;
    	var slackMaxValue = 75;

    	// As the slackLength increases, the bezier Handles start moving more to the side
    	if(slackLength < tautThreshold){
    		var handleOffsetMult = 0
    	}
    	else if(slackLength < slackThreshold){
    		var handleOffsetMult = 0 + ( ( (slackMaxValue) / (slackThreshold - tautThreshold) ) * ( slackLength - tautThreshold ) );
    	}
    	else{
    		var handleOffsetMult = slackMaxValue;
    	}

    	// Rotates the bezier handle offsets relative to the string
    	var handleXRotation = Math.sin(yp.yarnAngle)*handleOffsetMult;
    	var handleYRotation = Math.cos(yp.yarnAngle)*handleOffsetMult;

    	// Sets the bezier handles to the modifiers of everything
    	this.player1BAnchor.position.setTo(p1X+playerXDiff+handleXRotation, p1Y+playerYDiff+handleYRotation);
    	this.player2BAnchor.position.setTo(p2X-playerXDiff-handleXRotation, p2Y-playerYDiff-handleYRotation);

    	// Draws the yarn
    	this.drawBezierYarn(width, color, p1X, p1Y, p2X, p2Y);
	}
	else if(anchored === 'slack'){ // If the yarn is in the inactive state
		if(this.wasYarnJustReleased === true){ // If the yarn was just released
			// Then have the yarn drop
			this.wasYarnJustReleased = false;

			this.midAnchor.x = this.x; // Tells the anchor to go back to the midPoint
			this.midAnchor.y = this.y;

			this.tweenMidPoint(); // Tells the anchor to drop
		}
		// Obtains the distance of each player to the midpoint's anchor
		var player1XDist = this.midAnchor.x - p1X;
		var player1YDist = this.midAnchor.y - p1Y;
		var player2XDist = this.midAnchor.x - p2X;
		var player2YDist = this.midAnchor.y - p2Y;

		// By how far back to scale the bezier handles
		var margin = .2;

		// Sets the bezier handles to the correct positions
		this.player1BAnchor.position.setTo(this.midAnchor.x - player1XDist*margin, this.midAnchor.y - player1YDist*margin);
    	this.player2BAnchor.position.setTo(this.midAnchor.x - player2XDist*margin, this.midAnchor.y - player2YDist*margin);

    	// Draws the yarn
		this.drawBezierYarn(width, color, p1X, p1Y, p2X, p2Y);
	}
	else{
		console.log(anchored + " is not a valid state. taut or slack"); // In case I make a typo
	}
}

// Formula used to move this to the midpoint of the players
YarnVisual.prototype.calcMidPoint = function(){
	var xAverage = (this.player1.body.x + this.player2.body.x) / 2;
	var yAverage = (this.player1.body.y + this.player2.body.y) / 2;

	this.x = xAverage;
	this.y = yAverage;
}

// Change whether the anchor should drop upwards or downwards
YarnVisual.prototype.changePlayerGravDir = function(lastAnchored){
	this.playerGravDir = lastAnchored.body.data.gravityScale;
}

// Resets the anchor to the midPoint of the players
YarnVisual.prototype.resetMidPoint = function(){
	this.midAnchorYDrop = 0;
	this.midAnchor.y = this.y;
}

// Causes the anchor to drop
YarnVisual.prototype.tweenMidPoint = function(){
	this.resetMidPoint();
	this.dropTween.stop();
	this.dropTween = game.add.tween(this).to( { midAnchorYDrop: 1 }, 1500, Phaser.Easing.Bounce.Out, true, 0, 0, false);
}