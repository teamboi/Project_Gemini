// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for movePlatform
// game = reference to game
// gameplay = reference to gameplay state
// x, y = starting coordinates
// key = sprite
// firstY, secondY = range in which the moving platform can move
// gravityDir = direction of gravity imposed on platform
// sound = sound when the platform becomes locked
function MovePlatform(game, gameplay, x, y, key, firstY, secondY, gravityDir, sound){
	Phaser.Sprite.call(this, game, x, y, key);
	game.add.existing(this); // Adds to display list
	this.zOrder = layerMovePlatform; // Sets z layer for depth sorting

	//this.scale.setTo(0.22, 0.11); // Scales the sprite

	this.isMoving = false; // Boolean for if the platform is moving

	this.gameplay = gameplay; // Obtains reference to the gameplay state
	this.lockNoise = game.add.audio(sound); // Adds in the sounds for when the platform is locked

	this.gameplay.group.add(this); // Adds into group for layer sorting

	// Enable physics
	game.physics.p2.enable(this, debugCollisionsObjects); //  Enables physics
	this.body.fixedRotation = true; // Cloud cannot rotate
	this.body.damping = 0.5;
	this.body.dynamic = true; // Makes it dynamic so can be collided with player

	if(gravityDir === "down"){ // If the gravity is down
		this.gravDirMultiplier = 1;
	}
	else if(gravityDir === "up"){ // If the gravity is up
		this.body.data.gravityScale = -1;
		this.gravDirMultiplier = -1;
	}
	else{
		console.log("Invalid gravity direction"); // In case I make a typo
	}

	// Detects which y coordinate in the movement range is first
	// And sets the references accordingly
	if(this.gravDirMultiplier*firstY < this.gravDirMultiplier*secondY){
		var maxY = firstY;
		var minY = secondY;
	}
	else{
		var maxY = secondY;
		var minY = firstY;
	}

	var minHeight = y + (this.gravDirMultiplier*this.height); // height of the min limiter platform
	this.min = new MovePlatformLimiter(game, x, minHeight, key); // Creates the limiter body that will be below the platform

	this.max = new MovePlatformLimiter(game, x, maxY, key); // Creates the limiter body that will be above the platform

	this.leftLimit = new MovePlatformLimiter(game, x-this.width, y, key); // Creates the limiter body that will be to the left of the platform

	this.rightLimit = new MovePlatformLimiter(game, x+this.width, y, key); // Creates the limiter body that will be to the right of the platform

	// Create references to the gameplay collision groups
	var cloudCG = this.gameplay.cloudCollisionGroup;
	var limiterCG = this.gameplay.limiterCollisionGroup;
	var playerCG = this.gameplay.playerCollisionGroup;
	var surrogateCG = this.gameplay.surrogateCollisionGroup;
	var objectCG = this.gameplay.objectCollisionGroup

	// Sets the collision groups per body
	this.body.setCollisionGroup(cloudCG);
    this.body.collides([limiterCG, playerCG, surrogateCG, objectCG]);

    this.min.body.setCollisionGroup(limiterCG);
    this.min.body.collides([cloudCG]);

    this.max.body.setCollisionGroup(limiterCG);
    this.max.body.collides([cloudCG]);

    this.leftLimit.body.setCollisionGroup(limiterCG);
    this.leftLimit.body.collides([cloudCG]);

    this.rightLimit.body.setCollisionGroup(limiterCG);
    this.rightLimit.body.collides([cloudCG]);
}

// inherit prototype from Phaser.Sprite and set constructor to MovePlatform
MovePlatform.prototype = Object.create(Phaser.Sprite.prototype);
MovePlatform.prototype.constructor = MovePlatform;

MovePlatform.prototype.update = function(){
	if(this.isMoving === "locked"){ // If the platform is locked, don't check anything
		return;
	}
	else if(this.isMoving === false){ // If the platform isn't moving...
		if(this.body.velocity.y != 0){ // ... then check if the y velocity is moving
			this.isMoving = true; // ... then say that it is moving
		}
	}
	else{ // If the platform is moving
		this.leftLimit.updateYPosition(this.body.y); // Adjust the left and right bodies to be the same height as the platform
		this.rightLimit.updateYPosition(this.body.y);
		if((this.gravDirMultiplier*this.body.y) - this.height < this.gravDirMultiplier*this.max.body.y){ // If the platform is at the max height
			this.min.updateYPosition(this.body.y + (this.gravDirMultiplier*this.height)); // Update the position of the min body to "lock" the platform in place
			this.isMoving = "locked"; // Explicitly say this platform is locked
			this.static = true; // Make the body static to stop checking for collisions

			if(typeof this.lockNoise !== 'undefined') { // Plays the lock noise
    			this.lockNoise.play('', 0, 1, false);
    		}
		}
	}
}

// Function for deleting all platforms correctly
MovePlatform.prototype.deletePlatform = function(){
	this.min.destroy();
	this.max.destroy();
	this.leftLimit.destroy();
	this.rightLimit.destroy();
	this.destroy();
}