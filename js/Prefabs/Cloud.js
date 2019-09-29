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
function Cloud(game, gameplay, x, y, key, firstY, secondY, gravityDir){
	Phaser.Sprite.call(this, game, x, y, null);
	game.add.existing(this); // Add to display list

	this.gameplay = gameplay; // Obtain reference to gameplay state

	this.cloud = new MovePlatform(game, gameplay, x, y, key, firstY, secondY, gravityDir, 'poof'); // Creates the actual cloud that will be pushed

	this.cloud.alpha = 0.80; // Cloud's initial alpha will be a little transparent

	this.hasBeganTween = false; // Boolean for if tween has begun, so it only fires once
}

// inherit prototype from Phaser.Sprite and set constructor to Cloud
Cloud.prototype = Object.create(Phaser.Sprite.prototype);
Cloud.prototype.constructor = Cloud;

Cloud.prototype.update = function(){
	if(this.cloud.isMoving === "locked" && this.hasBeganTween === false){ // checks if the cloud is locked and hasn't begun the tween
		this.hasBeganTween === true; // Makes tween only happen once
		game.add.tween(this.cloud).to( { alpha: 1 }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false); // The actual tween
	}
}