// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for YarnAnchor
function YarnAnchor(game, gameplay, x, y, key, whichPlayer){
	Phaser.Sprite.call(this, game, x, y, key);

	this.gameplay = gameplay;

	if(whichPlayer === 1){
		this.cat = this.gameplay.player1;
	}
	else{
		this.cat = this.gameplay.player2;
	}

	this.scale.setTo(0.11, 0.11); // Scales the sprite
	//this.alpha = 0;

	game.physics.p2.enable(this, true);
	this.body.fixedRotation = true;
	this.body.damping = 0.5;
	this.body.data.shapes[0].sensor = true;
	this.body.data.gravityScale = 0;
	this.kinematic = true;
}

// inherit prototype from Phaser.Sprite and set constructor to MovePlatformLimiter
YarnAnchor.prototype = Object.create(Phaser.Sprite.prototype);
YarnAnchor.prototype.constructor = YarnAnchor;

YarnAnchor.prototype.update = function(){
	this.body.x = this.cat.body.x;
	this.body.y = this.cat.body.y;
	this.body.velocity.x = this.cat.body.velocity.x;
	this.body.velocity.y = this.cat.body.velocity.y;
}