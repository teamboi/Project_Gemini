// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Yarn
function CloudLimiter(game, x, y, key){
	Phaser.Sprite.call(this, game, x, y, key);

	this.scale.setTo(0.11, 0.11); // Scales the sprite

	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.enable(this, true);
	this.body.fixedRotation = true; // Cloud cannot rotate
	this.body.damping = 0.5;
	this.body.kinematic = true;

	this.updateYPosition = function(newPosition){
		this.body.y = newPosition;
	}

	this.updateXPosition = function(newPosition){
		this.body.x = newPosition;
	}
}

// inherit prototype from Phaser.Sprite and set constructor to Yarn
CloudLimiter.prototype = Object.create(Phaser.Sprite.prototype);
CloudLimiter.prototype.constructor = CloudLimiter;