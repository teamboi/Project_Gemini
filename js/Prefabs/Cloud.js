// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Yarn
function Cloud(game, x, y, key, minY, maxY, direction, cloudCollision, limiterCollision){
	Phaser.Sprite.call(this, game, x, y, key);

	this.direction = direction;
	this.min = new CloudLimiter();
	game.add.existing(this.min);

	this.xCoord = x;
	this.isMoving = false;
	//this.max = new CLoudLimiter();
	//game.add.existing(this.max);

	// Enable physics
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.enable(this);
	this.body.fixedRotation = true; // Cloud cannot rotate
	this.body.damping = 0.5;
	this.body.dynamic = true;

	this.body.setCollisionGroup(cloudCollision);
    this.body.collides([limiterCollision, this.gameplay.playerCollisionGroup, this.gameplay.yarnBallCollisionGroup]);
}

// inherit prototype from Phaser.Sprite and set constructor to Yarn
Cloud.prototype = Object.create(Phaser.Sprite.prototype);
CLoud.prototype.constructor = Cloud;

Cloud.prototype.update = function(){
	this.x = this.xCoord;
	if(this.body.velocity.y > 0){
		this.isMoving = true;
	}
	if(this.isMoving === true){
		if(this.body.velocity.y <= 0){
			this.isMoving = false;

			this.min.updatePosition();
		}
	}
}