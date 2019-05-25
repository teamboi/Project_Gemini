// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Yarn
function Cloud(game, gameplay, x, y, key, minY, maxY, direction, cloudCollision){
	Phaser.Sprite.call(this, game, x, y, key);

	this.direction = direction;
	this.gameplay = gameplay;
	//this.min = new CloudLimiter();
	//game.add.existing(this.min);

	this.xCoord = x;
	this.isMoving = false;
	this.maxY = maxY;
	//this.max = new CLoudLimiter();
	//game.add.existing(this.max);

	// Enable physics
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.enable(this, true);
	this.body.fixedRotation = true; // Cloud cannot rotate
	this.body.damping = 0.5;
	this.body.dynamic = true;

	//this.body.setCollisionGroup(cloudCollision);
    //this.body.collides([this.gameplay.playerCollisionGroup, this.gameplay.yarnBallCollisionGroup]);
}

// inherit prototype from Phaser.Sprite and set constructor to Yarn
Cloud.prototype = Object.create(Phaser.Sprite.prototype);
Cloud.prototype.constructor = Cloud;

Cloud.prototype.update = function(){
	//this.x = this.xCoord;
	//Phaser.Math.clamp(this.y,this.maxY,this.y);
	/*if(this.body.velocity.y > 0){
		this.isMoving = true;
	}
	if(this.isMoving === true){
		if(this.body.velocity.y <= 0){
			this.isMoving = false;

			this.min.updatePosition();
		}
	}*/
}