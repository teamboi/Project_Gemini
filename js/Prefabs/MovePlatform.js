// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for movePlatform
// gameplay = reference to gameplay state
// x, y = starting coordinates
// key = sprite
// firstY, secondY = range in which the moving platform can move
// gravityDir = direction of gravity imposed on platform
// platformType = window or cloud
function MovePlatform(game, gameplay, x, y, key, firstY, secondY, gravityDir, platformType){
	Phaser.Sprite.call(this, game, x, y, key);

	this.scale.setTo(0.22, 0.11); // Scales the sprite

	this.isMoving = false;

	this.gameplay = gameplay;
	this.platformType = platformType;

	// Enable physics
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.enable(this, true);
	this.body.fixedRotation = true; // Cloud cannot rotate
	this.body.damping = 0.5;
	this.body.dynamic = true;

	if(gravityDir === "down"){
		this.gravDirMultiplier = 1;
	}
	else if(gravityDir === "up"){
		this.body.data.gravityScale = -1;
		this.gravDirMultiplier = -1;
	}
	else{
		console.log("Invalid gravity direction");
	}

	if(this.gravDirMultiplier*firstY < this.gravDirMultiplier*secondY){
		var maxY = firstY;
		var minY = secondY;
	}
	else{
		var maxY = secondY;
		var minY = firstY;
	}

	var minHeight = y + (this.gravDirMultiplier*this.height);
	this.min = new MovePlatformLimiter(game, x, minHeight, key);
	game.add.existing(this.min);

	this.max = new MovePlatformLimiter(game, x, maxY, key);
	game.add.existing(this.max);

	this.leftLimit = new MovePlatformLimiter(game, x-this.width, y, key);
	game.add.existing(this.leftLimit);

	this.rightLimit = new MovePlatformLimiter(game, x+this.width, y, key);
	game.add.existing(this.rightLimit);

	var cloudCG = this.gameplay.cloudCollisionGroup;
	var limiterCG = this.gameplay.limiterCollisionGroup;
	var playerCG = this.gameplay.playerCollisionGroup;
	var surrogateCG = this.gameplay.surrogateCollisionGroup;
	var yarnBallCG = this.gameplay.yarnBallCollisionGroup

	this.body.setCollisionGroup(cloudCG);
    this.body.collides([limiterCG, playerCG, surrogateCG, yarnBallCG]);

    this.min.body.setCollisionGroup(limiterCG);
    this.min.body.collides([cloudCG]);

    this.max.body.setCollisionGroup(limiterCG);
    this.max.body.collides([cloudCG]);

    this.leftLimit.body.setCollisionGroup(limiterCG);
    this.leftLimit.body.collides([cloudCG]);

    this.rightLimit.body.setCollisionGroup(limiterCG);
    this.rightLimit.body.collides([cloudCG]);

    this.deletePlatform = function(){
    	this.min.destroy();
    	this.max.destroy();
    	this.leftLimit.destroy();
    	this.rightLimit.destroy();
    	this.destroy();
    }

    this.cloudUpdate = function(){
    	if(this.isMoving === "locked"){
    		return;
    	}
    	else if(this.isMoving === false){
    		if(this.gravDirMultiplier*this.body.velocity.y < 0){
				this.isMoving = true;
			}
    	}
    	else{
    		this.leftLimit.updateYPosition(this.body.y);
			this.rightLimit.updateYPosition(this.body.y);
			if(this.gravDirMultiplier*this.body.velocity.y <= 0){
				this.isMoving = false;

				this.min.updateYPosition(this.body.y + (this.gravDirMultiplier*this.height));

				if((this.gravDirMultiplier*this.body.y) - this.height < this.gravDirMultiplier*this.max.body.y){
					this.isMoving = "locked";
					this.static = true;
				}
			}
    	}
    }

    this.windowUpdate = function(){
    	if(this.isMoving === "locked"){
    		return;
    	}
    	else if(this.isMoving === false){
    		if(this.body.velocity.y != 0){
				this.isMoving = true;
			}
    	}
    	else{
    		this.leftLimit.updateYPosition(this.body.y);
			this.rightLimit.updateYPosition(this.body.y);
			if((this.gravDirMultiplier*this.body.y) - this.height < this.gravDirMultiplier*this.max.body.y){
				this.min.updateYPosition(this.body.y + (this.gravDirMultiplier*this.height));
				this.isMoving = "locked";
				this.static = true;
			}
    	}
    }
}

// inherit prototype from Phaser.Sprite and set constructor to Yarn
MovePlatform.prototype = Object.create(Phaser.Sprite.prototype);
MovePlatform.prototype.constructor = MovePlatform;

MovePlatform.prototype.update = function(){
	switch(this.platformType){
		case "cloud":
			this.cloudUpdate();
			break;
		case "window":
			this.windowUpdate();
			break;
		default:
			console.log("Invalid platform type");
	}
}