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
	this.zOrder = layerMovePlatform; // Sets z order for layer sorting
	this.gameplay = gameplay; // Obtains reference to gameplay state
	this.gameplay.group.add(this); // Adds self to gameplay's group for layer sorting
	this.y = Phaser.Math.clamp(this.y,firstY,secondY); // clamps the y coord to the given range

	this.gameplay = gameplay; // Obtain reference to gameplay state
	this.player = player; // Obtain reference to the correct player

	this.cloud = new MovePlatform(game, gameplay, x, y, key, firstY, secondY, gravityDir, 'poof'); // Creates the actual cloud that will be pushed

	// These are reversed from MovePlatform because coords are weird
	let gravDirMultiplier;
	if(gravityDir === "down"){ // If the gravity is down
		gravDirMultiplier = -1;
	}
	else if(gravityDir === "up"){ // If the gravity is up
		gravDirMultiplier = 1;
	}
	else{
		console.log("Invalid gravity direction"); // In case I make a typo
	}

	// Detects which y coordinate in the movement range is first
	// And sets the references accordingly
	this.y = gravDirMultiplier*Phaser.Math.max(gravDirMultiplier * firstY, gravDirMultiplier * secondY) - (gravDirMultiplier*this.height);

	this.anchor.setTo(0.5,0.5);
	this.cloud.alpha = 0.80; // Cloud's initial alpha will be a little transparent
	this.alpha = 0; // Goal Cloud will be transparent
	// Move platform line 103 does not like this haha
	this.cloud.scale.setTo(1.6);
	//this.cloud.body.scale.setTo(0.6);
	//this.cloud.MovePlatform.scale.setTo(0.6);
	//this.cloud.anchor.setTo(0.5,0.5);	

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
			game.add.tween(this.cloud).to( { alpha: 1 }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false); // Make the actual cloud more opaque
			game.add.tween(this).to( { alpha: -.1 }, 150, Phaser.Easing.Linear.In, true, 0, 0, false); // Make the goal cloud fade to transparent
			game.add.tween(this.scale).to( { x: 2, y: 2 }, 200, Phaser.Easing.Cubic.Out, true, 0, 0, false); // Make the goal cloud bigger
		}
	}
	else if(distance < distanceThresh){
		this.alpha = Phaser.Math.mapLinear(distance, 0, distanceThresh, .7, 0);
	}
}