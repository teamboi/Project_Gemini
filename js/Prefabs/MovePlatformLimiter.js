// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for MovePlatformLimiter
function MovePlatformLimiter(game, x, y, key){
	Phaser.Sprite.call(this, game, x, y, key);
	game.add.existing(this);

	//this.scale.setTo(0.22, 0.11); // Scales the sprite
	this.alpha = 0;

	game.physics.p2.enable(this);
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

// inherit prototype from Phaser.Sprite and set constructor to MovePlatformLimiter
MovePlatformLimiter.prototype = Object.create(Phaser.Sprite.prototype);
MovePlatformLimiter.prototype.constructor = MovePlatformLimiter;