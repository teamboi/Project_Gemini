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
function Cloud(game, gameplay, x, y, key, firstY, secondY, gravityDir){
	Phaser.Sprite.call(this, game, x, y, key);
	game.add.existing(this); // Add to display list
	this.alpha = 0; // Make current sprite invisible

	this.gameplay = gameplay; // Obtain reference to gameplay state

	this.cloud = new MovePlatform(game, gameplay, x, y, key, firstY, secondY, gravityDir, 'poof'); // Creates the actual cloud that will be pushed

	this.cloud.alpha = 0.80; // Cloud's initial alpha will be a little transparent

	if(gravityDir == "down"){ // Empty ifs just in case we want something

	}
	else if(gravityDir == "up"){

	}
	else{
		console.log(gravityDir + " is not a valid direction. 'up' or 'down'"); // In case we make a typo
	}
}

// inherit prototype from Phaser.Sprite and set constructor to MovePlatform
Cloud.prototype = Object.create(Phaser.Sprite.prototype);
Cloud.prototype.constructor = Cloud;

Cloud.prototype.update = function(){
	if(this.cloud.isMoving === "locked"){
		game.add.tween(this.cloud).to( { alpha: 1 }, 300, Phaser.Easing.Linear.InOut, true, 0, 0, false);
	}
}