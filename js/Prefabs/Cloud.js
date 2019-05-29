// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Yarn
function Cloud(game, gameplay, x, y, key, minY, maxY, direction, cloudCollision, limiterCollision){
	Phaser.Sprite.call(this, game, x, y, key);

	this.scale.setTo(0.11, 0.11); // Scales the sprite

	this.xCoord = x;
	this.isMoving = false;

	this.direction = direction;
	this.gameplay = gameplay;
	this.min = new CloudLimiter(game, x, y+this.height, key);
	game.add.existing(this.min);

	this.max = new CloudLimiter(game, x, maxY, key);
	game.add.existing(this.max);

	this.leftLimit = new CloudLimiter(game, x-this.width, y, key);
	game.add.existing(this.leftLimit);

	this.rightLimit = new CloudLimiter(game, x+this.width, y, key);
	game.add.existing(this.rightLimit);

	// Enable physics
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.enable(this, true);
	this.body.fixedRotation = true; // Cloud cannot rotate
	this.body.damping = 0.5;
	this.body.dynamic = true;

	this.body.setCollisionGroup(cloudCollision);
    this.body.collides([limiterCollision, this.gameplay.playerCollisionGroup, this.gameplay.surrogateCollisionGroup, this.gameplay.yarnBallCollisionGroup]);

    this.min.body.setCollisionGroup(limiterCollision);
    this.min.body.collides([cloudCollision]);

    this.max.body.setCollisionGroup(limiterCollision);
    this.max.body.collides([cloudCollision]);

    this.leftLimit.body.setCollisionGroup(limiterCollision);
    this.leftLimit.body.collides([cloudCollision]);

    this.rightLimit.body.setCollisionGroup(limiterCollision);
    this.rightLimit.body.collides([cloudCollision]);

    this.deleteCloud(){
    	this.min.destroy();
    	this.max.destroy();
    	this.leftLimit.destroy();
    	this.rightLimit.destroy();
    	this.destroy();
    }

    this.cloudUpdate(){
    	if(this.body.velocity.y < 0){
			this.isMoving = true;
		}
		if(this.isMoving === true){
			this.leftLimit.updateYPosition(this.body.y);
			this.rightLimit.updateYPosition(this.body.y);
			if(this.body.velocity.y <= 0){
				this.isMoving = false;

				this.min.updateYPosition(this.body.y+this.height);
			}
		}
    }

    this.windowUpdate(){
    	if(this.body.velocity.y != 0){
			this.isMoving = true;
		}
		if(this.isMoving === true){
			this.leftLimit.updateYPosition(this.body.y);
			this.rightLimit.updateYPosition(this.body.y);
		}
    }
}

// inherit prototype from Phaser.Sprite and set constructor to Yarn
Cloud.prototype = Object.create(Phaser.Sprite.prototype);
Cloud.prototype.constructor = Cloud;

Cloud.prototype.update = function(){
	
}