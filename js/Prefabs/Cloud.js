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
// player = reference to the player
function Cloud(game, gameplay, x, y, key, firstY, secondY, gravityDir, player){
	Phaser.Sprite.call(this, game, x, y, key);
	game.add.existing(this); // Add to display list

	this.gameplay = gameplay; // Obtain reference to gameplay state
	this.player = player; // Obtain reference to the correct player

	this.cloud = new MovePlatform(game, gameplay, x, y, key, firstY, secondY, gravityDir, 'poof'); // Creates the actual cloud that will be pushed

	/*if(gravityDir === "down"){ // If the gravity is down
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
	}*/

	this.cloud.alpha = 0.80; // Cloud's initial alpha will be a little transparent
	this.alpha = 0; // Goal Cloud will be transparent

	this.hasBeganTween = false; // Boolean for if tween has begun, so it only fires once
}

// inherit prototype from Phaser.Sprite and set constructor to Cloud
Cloud.prototype = Object.create(Phaser.Sprite.prototype);
Cloud.prototype.constructor = Cloud;

Cloud.prototype.update = function(){
	var distance = Phaser.Math.distance(this.player.x, this.player.y, this.cloud.x, this.cloud.y);
	var distanceThresh = 200;

	if(this.cloud.isMoving === "locked"){ // checks if the cloud is locked
		if(this.hasBeganTween === false){ // ... if it has then check if we need to tween the alpha
			this.hasBeganTween === true; // Makes tween only happen once
			game.add.tween(this.cloud).to( { alpha: 1 }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false); // The actual tween
		}
	}
	else if(distance < distanceThresh){
		this.alpha = Phaser.Math.mapLinear(distance, 0, distanceThresh, 1, 0);
	}
}