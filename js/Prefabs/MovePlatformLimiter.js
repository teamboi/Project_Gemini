// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for MovePlatformLimiter
// To prevent the MovePlatform prefab from deviating from its selected path
function MovePlatformLimiter(game, x, y, key){
	Phaser.Sprite.call(this, game, x, y, key);
	game.add.existing(this); // Adds to the display list

	//this.scale.setTo(0.22, 0.11); // Scales the sprite
	this.alpha = 0;

	game.physics.p2.enable(this, debugCollisionsObjects); // Enables physics
	this.body.fixedRotation = true; // Cloud cannot rotate
	this.body.damping = 0.5;
	this.body.kinematic = true; // Cannot be moved

	// Updates the y position to the specified position
	this.updateYPosition = function(newPosition){
		this.body.y = newPosition;
	}

	// Updates the x position to the specified position
	this.updateXPosition = function(newPosition){
		this.body.x = newPosition;
	}
}

// inherit prototype from Phaser.Sprite and set constructor to MovePlatformLimiter
MovePlatformLimiter.prototype = Object.create(Phaser.Sprite.prototype);
MovePlatformLimiter.prototype.constructor = MovePlatformLimiter;