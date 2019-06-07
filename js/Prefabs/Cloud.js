// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for movePlatform
// game = reference to game
// gameplay = reference to gameplay state
// x, y = starting coordinates
// key = sprite
// firstY, secondY = range in which the moving platform can move
// gravityDir = direction of gravity imposed on platform
// platformType = window or cloud
function Cloud(game, gameplay, x, y, key, firstY, secondY, gravityDir){
	Phaser.Sprite.call(this, game, x, y, key);
	this.alpha = 0;

	this.gameplay = gameplay;

	this.cloud = new MovePlatform(game, gameplay, x, y, key, firstY, secondY, gravityDir);
	game.add.existing(this.cloud);

	this.cloud.alpha = 0.95;

	if(gravityDir == "down"){

	}
	else if(gravityDir == "up"){
		this.scale.y *= -1;
	}
	else{
		console.log(gravityDir + " is not a valid direction. 'up' or 'down'");
	}
}

// inherit prototype from Phaser.Sprite and set constructor to MovePlatform
Cloud.prototype = Object.create(Phaser.Sprite.prototype);
Cloud.prototype.constructor = Cloud;

Cloud.prototype.update = function(){
	if(this.cloud.isMoving === "locked"){
		game.add.tween(this.cloud).to( { alpha: 1 }, 500, Phaser.Easing.Linear.InOut, true, 0, 0, false);
	}
}