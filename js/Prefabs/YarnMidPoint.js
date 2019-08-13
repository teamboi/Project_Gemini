// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for YarnMidPoint
// For nice curves in the yarn
function YarnMidPoint(game, gameplay, player1, player2){
	Phaser.Sprite.call(this, game, 0, 0, null);
	game.add.existing(this); //Adds to display list

	this.alpha = 0; // Sets invisible

	this.player1 = player1; // Obtain references to both players
	this.player2 = player2;

	// When first created, drop the anchor
	this.dropTween = game.add.tween(this).to( { midAnchorYOffset: 1 }, 1500, Phaser.Easing.Bounce.Out, true, 0, 0, false);

	// Formula used to move this to the midpoint of the players
	this.calcMidPoint = function(){
		var xAverage = (this.player1.body.x + this.player2.body.x) / 2;
		var yAverage = (this.player1.body.y + this.player2.body.y) / 2;

		this.x = xAverage;
		this.y = yAverage;
	}

	// Resets the anchor to the midPoint of the players
	this.resetMidPoint = function(){
		this.midAnchorYOffset = 0;
		this.midAnchor.y = this.y;
	}

	// Causes the anchor to drop
	this.tweenMidPoint = function(){
		this.resetMidPoint();
		this.dropTween.stop();
		this.dropTween = game.add.tween(this).to( { midAnchorYOffset: 1 }, 1500, Phaser.Easing.Bounce.Out, true, 0, 0, false);
	}

	// Change whether the anchor should drop upwards or downwards
	this.changeMidAnchorYMult = function(lastAnchored){
		if(lastAnchored === this.player1){ // Drop down
			this.midAnchorYMult = 1;
		}
		else if(lastAnchored === this.player2){ //Drop up
			this.midAnchorYMult = -1;
		}
		else{
			console.log(lastAnchored + " is not a valid player"); // In case of typos
		}
	}

	// Calculates midpoint so other variables are correct
	this.calcMidPoint();

	// Creates the anchor with appropriate variables
	this.midAnchor = game.add.sprite(this.x, this.y, "point");
	this.midAnchor.alpha = 0;
	this.midAnchorYOffset = 0;
	this.midAnchorYMult = 1;
}

// inherit prototype from Phaser.Sprite and set constructor to YarnMidPoint
YarnMidPoint.prototype = Object.create(Phaser.Sprite.prototype);
YarnMidPoint.prototype.constructor = YarnMidPoint;

YarnMidPoint.prototype.update = function(){
	// Calculates midpoint so other variables are correct
	this.calcMidPoint();
	// Determines by how much to scale the anchor drop height
	this.midAnchorYScalar = Phaser.Math.distance(this.player1.x, this.player1.y, this.player2.x, this.player2.y)/400;

	this.midAnchor.x = this.x; // anchor matches the midpoint's x
	this.midAnchor.y = this.y + (125 * this.midAnchorYOffset * this.midAnchorYMult * this.midAnchorYScalar); // acnhor will drop from the midpoint and modify itself according to the distance of the players and who last anchored and how much it has dropped
}