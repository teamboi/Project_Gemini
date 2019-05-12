// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Yarn
function Yarn(game, gameplay, key, player1, player2, surrogate){
	Phaser.Sprite.call(this, game, 0, 0, key); // Dunno if we want to keep the sprite constructor

	this.gameplay = gameplay;

	this.alpha = 0;

	// Get references to the player objects
	this.player1 = player1;
	this.player2 = player2;
	this.surrogate = surrogate;

	// Obtain the players' anchor keys
	this.p1Key = this.player1.controls[3];
	this.p2Key = this.player2.controls[3];

	// Define some variables for the constraint
	this.isYarn = false; // boolean for if the yarn is active
	this.tautLength = 0; // the max length players can be if the yarn is active
	// Create a variable that tracks the status of who is anchored
	this.anchored = 0; // 0 = null, 1 = player1, 2 = player2

	var me = this;

    // Add bitmap data to draw the rope // https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
    me.ropeBitmapData = game.add.bitmapData(me.game.world.width, me.game.world.height);

    me.ropeBitmapData.ctx.beginPath();
    me.ropeBitmapData.ctx.lineWidth = "4";
    me.ropeBitmapData.ctx.strokeStyle = "#FF7070";
    me.ropeBitmapData.ctx.stroke();

    // Create a new sprite using the bitmap data
    me.line = game.add.sprite(0, 0, me.ropeBitmapData);

	// Creates the constraint between the players
	this.createYarn = function(anchorCat,cat2){ // First cat will be the anchor
		this.isYarn = true; // yarn is active

		var dist = Phaser.Math.distance(anchorCat.x, anchorCat.y, cat2.x, cat2.y);
		this.tautLength = dist; // Sets the taut length
		//anchorCat.body.data.gravityScale *= 2;

		//this.surrogate = new Player(game, anchorCat.x, anchorCat.y, "ball", anchorCat.whichPlayer, true);
		//game.add.existing(this.surrogate);

		anchorCat.isAnchor = true;
		this.surrogate.activateSurrogate(anchorCat.whichPlayer);
		//anchorCat.body.kinematic = true;
	}

	// Updates the yarn if it is active
	this.updateYarn = function(){
		// Only checks if the yarn is active
		if(this.isYarn != true){
			this.drawYarn("2", "#FF7070");
			return;
		}
		this.drawYarn("4", "#FF3232");

		var deadband = 3; // the margin of error to check beyond the taut length
		var dist = Phaser.Math.distance(this.player1.x, this.player1.y, this.player2.x, this.player2.y);

		if(this.anchored == 1){
			var anchorCat = this.player1;
			var otherCat = this.player2;
		}
		else{
			var anchorCat = this.player2;
			var otherCat = this.player1;
		}

		if(dist >= this.tautLength + deadband){ // If the player distance is greater than the taut length, create a constraint
			if(constraint == null){ // if the constraint doesn't exist already, create a constraint
				constraint = game.physics.p2.createDistanceConstraint(this.player1.body, this.player2.body, this.tautLength, [0.5,0.5], [0.5,0.5]);
				//constraint = game.physics.p2.createSpring(this.player1.body, this.player2.body, this.tautLength, 100, 0);
				
			}
		}
		else{ // If the player distance is less than the taut length
			if(otherCat.checkIfCanJump() || otherCat.body.velocity.y*-1*otherCat.body.data.gravityScale > 0 || otherCat.body.velocity.y == anchorCat.body.velocity.y){ // If the player can jump OR is being pulled up
				if(constraint != null){ // If the constraint does exist, remove the constraint
					game.physics.p2.removeConstraint(constraint);
					//game.physics.p2.removeSpring(constraint);
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
			//game.physics.p2.removeSpring(constraint);
			constraint = null;
		}

		//this.surrogate.destroy();

		// Reset gravity
		this.player2.body.data.gravityScale = -1;
		this.player1.body.data.gravityScale = 1;

		//this.player1.body.dynamic = true;
		//this.player2.body.dynamic = true;

		this.player1.isAnchor = false;
		this.player2.isAnchor = false;
	}

	// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
	this.drawYarn = function(width, color){
		var me = this;

	    // Change the bitmap data to reflect the new rope position
	    me.ropeBitmapData.clear();
	    me.ropeBitmapData.ctx.lineWidth = width;
	    me.ropeBitmapData.ctx.strokeStyle = color;
	    me.ropeBitmapData.ctx.beginPath();
	    me.ropeBitmapData.ctx.beginPath();
	    me.ropeBitmapData.ctx.moveTo(this.player1.x, this.player1.y);
	    me.ropeBitmapData.ctx.lineTo(this.player2.x, this.player2.y);
	    me.ropeBitmapData.ctx.lineWidth = 4;
	    me.ropeBitmapData.ctx.stroke();
	    me.ropeBitmapData.ctx.closePath();
	    me.ropeBitmapData.render();
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