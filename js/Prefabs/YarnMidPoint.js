// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for movePlatform
// game = reference to game
// gameplay = reference to gameplay state
// x, y = starting coordinates
// key = sprite
// firstY, secondY = range in which the moving platform can move
// gravityDir = direction of gravity imposed on platform
// platformType = window or cloud
function YarnMidPoint(game, gameplay, key, player1, player2){
	Phaser.Sprite.call(this, game, 0, 0, key);
	game.add.existing(this);

	this.alpha = 0;

	this.player1 = player1;
	this.player2 = player2;

	this.dropTween = game.add.tween(this).to( { midAnchorYOffset: 1 }, 1500, Phaser.Easing.Bounce.Out, true, 0, 0, false);

	this.calcMidPoint = function(){
		var xAverage = (this.player1.body.x + this.player2.body.x) / 2;
		var yAverage = (this.player1.body.y + this.player2.body.y) / 2;

		this.x = xAverage;
		this.y = yAverage;
	}

	this.tweenMidPoint = function(){
		this.resetMidPoint();
		this.dropTween.stop();
		this.dropTween = game.add.tween(this).to( { midAnchorYOffset: 1 }, 1500, Phaser.Easing.Bounce.Out, true, 0, 0, false);
	}

	this.changeMidAnchorYMult = function(lastAnchored){
		if(lastAnchored === this.player1){
			this.midAnchorYMult = 1;
		}
		else if(lastAnchored === this.player2){
			this.midAnchorYMult = -1;
		}
		else{
			console.log(lastAnchored + " is not a valid player");
		}
	}

	this.resetMidPoint = function(){
		this.midAnchorYOffset = 0;
		this.midAnchor.y = this.y;
	}

	this.calcMidPoint();

	this.midAnchor = game.add.sprite(this.x, this.y, "point");
	this.midAnchor.alpha = 0;
	this.midAnchorYOffset = 0;
	this.midAnchorYMult = 1;
}

// inherit prototype from Phaser.Sprite and set constructor to MovePlatform
YarnMidPoint.prototype = Object.create(Phaser.Sprite.prototype);
YarnMidPoint.prototype.constructor = YarnMidPoint;

YarnMidPoint.prototype.update = function(){
	this.calcMidPoint();

	this.midAnchor.x = this.x;
	this.midAnchor.y = this.y + (125 * this.midAnchorYOffset * this.midAnchorYMult);
}