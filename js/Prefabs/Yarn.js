// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Yarn
function Yarn(game, key, player1, player2){
	Phaser.Sprite.call(this, game, 0, 0, key); // Dunno if we want to keep the sprite constructor

	// Get references to the player objects
	this.player1 = player1;
	this.player2 = player2;

	// Obtain the players' anchor keys
	this.p1Key = this.player1.controls[3];
	this.p2Key = this.player2.controls[3];

	// Define some variables for the constraint
	// Create a variable that tracks the status of who is anchored
	this.anchored = 0; // 0 = null, 1 = player1, 2 = player2

	// Creates the constraint between the players
	this.createYarn = function(cat1,cat2){ // First cat will be the anchor
		var dist = Phaser.Math.distance(cat1.x, cat1.y, cat2.x, cat2.y);
		console.log(dist);
		//var dist = Phaser.Math.difference(cat1.body.y, cat2.body.y);
		cat1.body.data.gravityScale *= 2;
		//this.constraint = game.physics.p2.createDistanceConstraint(cat1.body, cat2.body, dist, [0.5,0], [0.5,0]); // Lock the player's x difference
		spring = game.physics.p2.createSpring(cat1.body, cat2.body, dist, 20, 1);
	}

	// Removes the constraint between the players
	this.removeYarn = function(){
		//game.physics.p2.removeConstraint(this.constraint); // Unlock the player's x difference
		game.physics.p2.removeSpring(spring); // Unlock the player's x difference
		console.log("here0");
		this.player2.body.data.gravityScale = -1;
		this.player1.body.data.gravityScale = 1;
	}
}

// inherit prototype from Phaser.Sprite and set constructor to Yarn
Yarn.prototype = Object.create(Phaser.Sprite.prototype);
Yarn.prototype.constructor = Yarn;

Yarn.prototype.update = function(){
	//console.log(Phaser.Math.difference(this.player1.x, this.player1.y, this.player2.x, this.player2.y));
	if(this.anchored == 0){ // If no one is anchoring
		// Check if player1 is anchoring
		if( game.input.keyboard.isDown(Phaser.KeyCode[this.p1Key]) ){
			this.createYarn(this.player1, this.player2);
			this.anchored = 1;
		}
		// Check if player2 is anchoring
		else if( game.input.keyboard.isDown(Phaser.KeyCode[this.p2Key]) ){
			this.createYarn(this.player2, this.player1);
			this.anchored = 2;
		}
	}
	else if(this.anchored == 1){ // If player1 is anchoring
		// Now check if player1 is continueing to anchor
		if( !game.input.keyboard.isDown(Phaser.KeyCode[this.p1Key]) ){
			this.removeYarn();
			//this.player1.body.data.gravityScale = 1;
			this.anchored = 0;
		}
	}
	else if(this.anchored == 2){ // If player2 is anchoring
		// Now check if player2 is continueing to anchor
		if( !game.input.keyboard.isDown(Phaser.KeyCode[this.p2Key]) ){
			this.removeYarn();
			//this.player2.body.data.gravityScale = -1;
			this.anchored = 0;
		}
	}
}