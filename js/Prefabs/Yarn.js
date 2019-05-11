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
	this.isYarn = false; // boolean for if the yarn is active
	this.tautLength = 0; // the max length players can be if the yarn is active
	// Create a variable that tracks the status of who is anchored
	this.anchored = 0; // 0 = null, 1 = player1, 2 = player2

	// Creates the constraint between the players
	this.createYarn = function(cat1,cat2){ // First cat will be the anchor
		this.isYarn = true; // yarn is active

		var dist = Phaser.Math.distance(cat1.x, cat1.y, cat2.x, cat2.y);
		this.tautLength = dist; // Sets the taut length
		cat1.body.data.gravityScale *= 2;
	}

	// Updates the yarn if it is active
	this.updateYarn = function(){
		// Only checks if the yarn is active
		if(this.isYarn == true){
			var deadband = 3; // the margin of error to check beyond the taut length
			var dist = Phaser.Math.distance(this.player1.x, this.player1.y, this.player2.x, this.player2.y);

			if(dist >= this.tautLength + deadband){ // If the player distance is greater than the taut length, create a constraint
				if(constraint == null){ // if the constraint doesn't exist already, create a constraint
					constraint = game.physics.p2.createDistanceConstraint(this.player1.body, this.player2.body, this.tautLength, [0.5,0.5], [0.5,0.5]);
				}
			}
			else{ // If the player distance is less than the taut length
				if(constraint != null){ // If the constraint does exist, remove the constraint
					game.physics.p2.removeConstraint(constraint);
					constraint = null;
				}
			}
		}
	}

	// Removes the constraint between the players
	this.removeYarn = function(){
		this.isYarn = false; // yarn is inactive

		//If constraint does exist, remove it
		if(constraint != null){
			game.physics.p2.removeConstraint(constraint);
			constraint = null;
		}

		// Reset gravity
		this.player2.body.data.gravityScale = -1;
		this.player1.body.data.gravityScale = 1;
	}
}

// inherit prototype from Phaser.Sprite and set constructor to Yarn
Yarn.prototype = Object.create(Phaser.Sprite.prototype);
Yarn.prototype.constructor = Yarn;

Yarn.prototype.update = function(){
	
	this.updateYarn();

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