// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Yarn
function Yarn(game, gameplay, player1, player2, surrogate){
	Phaser.Sprite.call(this, game, 0, 0, null);
	game.add.existing(this); // Adds to display list

	this.gameplay = gameplay; // Obtains the reference to the gameplay state
	this.zOrder = layerYarn; // Sets z order for layer sorting
	this.gameplay.group.add(this); // Adds self to the gameplay's group for layer sorting

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
	this.playerDist = 0; // The distance of the players
	this.anchored = 0; // Create a variable that tracks the status of who is anchored; 0 = null, 1 = player1, 2 = player2
	this.isOnRoof = false; // boolean for if otherCat is on the roof
	this.isTaut = false; // boolean for if the yarn is at its taut length // Currently unused
	this.yarnAngle = 0; // Angle of the yarn relative to the anchorCat

	// Creates a midpoint to the yarn so we can have nice curves
	this.yarnVisual = new YarnVisual(game, gameplay, this, player1, player2);
}

// inherit prototype from Phaser.Sprite and set constructor to Yarn
Yarn.prototype = Object.create(Phaser.Sprite.prototype);
Yarn.prototype.constructor = Yarn;

Yarn.prototype.update = function(){
	// Update the yarn every frame
	this.updateYarn();

	// Detect whether to create or destroy the yarn
	if(this.anchored == 0){ // If no one is anchoring
		// Check if player1 is anchoring
		if( game.input.keyboard.isDown(Phaser.KeyCode[this.p1Key]) ){
			// Then create the yarn and mark who is anchoring
			this.createYarn(this.player1, this.player2);
			this.anchored = 1;
		}
		// Check if player2 is anchoring
		else if( game.input.keyboard.isDown(Phaser.KeyCode[this.p2Key]) ){
			// Then create the yarn and mark who is anchoring
			this.createYarn(this.player2, this.player1);
			this.anchored = 2;
		}
	}
	else if(this.anchored == 1){ // If player1 is currently anchoring
		// Now check if player1 is continueing to anchor
		if( !game.input.keyboard.isDown(Phaser.KeyCode[this.p1Key]) ){
			// Then destroy the yarn
			this.yarnVisual.changePlayerGravDir(this.player1);
			this.removeYarn();
			//this.player1.body.data.gravityScale = 1;
			this.anchored = 0;
		}
	}
	else if(this.anchored == 2){ // If player2 is currently anchoring
		// Now check if player2 is continueing to anchor
		if( !game.input.keyboard.isDown(Phaser.KeyCode[this.p2Key]) ){
			// Then destroy the yarn
			this.yarnVisual.changePlayerGravDir(this.player2);
			this.removeYarn();
			//this.player2.body.data.gravityScale = -1;
			this.anchored = 0;
		}
	}
}

// Updates the yarn if it is active
Yarn.prototype.updateYarn = function(){
	var tautDeadband = 1; // the margin of error to check beyond the taut length
	var velDeadband = 10; // the margin of error to check for the velocity differences

	// Only checks if the yarn is active
	if(this.isYarn != true){
		return;
	}

	// Obtains correct references to both cats
	if(this.anchored == 1){
		var anchorCat = this.player1;
		var otherCat = this.player2;
	}
	else{
		var anchorCat = this.player2;
		var otherCat = this.player1;
	}

	this.playerDist = Phaser.Math.distance(anchorCat.x, anchorCat.y, otherCat.x, otherCat.y); // Obtains the distance between the players
	this.yarnAngle = Phaser.Math.angleBetween(anchorCat.x, anchorCat.y, otherCat.x, otherCat.y); // Obtain the angle of the yarn

	// Now we handle if the non-anchored (otherCat) cat is on a roof, thus becoming the anchor
	// If the otherCat was not previously on the roof and is on the roof and the anchorCat is not on the ground
	if(this.isOnRoof == false && otherCat.checkIfOnRoof() && !anchorCat.checkIfCanJump()){
		// Change otherCat to be anchoring upside down
		this.modifyAnchor(otherCat,anchorCat);
		otherCat.body.data.gravityScale *= -1;

		this.surrogate.activateSurrogate(otherCat.whichPlayer); // activates the surrogate with reference to which cat is otherCat

		this.isOnRoof = true;
	}
	// else if the otherCat was previously marked as on the roof and if the otherCat is no longer on the roof or if the anchorCat is on the ground
	else if( this.isOnRoof == true && ( !otherCat.checkIfOnRoof() || anchorCat.checkIfCanJump() ) ){
		// Change it so anchorCat is anchoring back, reversing the previous conditions
		this.modifyAnchor(anchorCat,otherCat);
		otherCat.body.data.gravityScale *= -1;

		this.surrogate.activateSurrogate(anchorCat.whichPlayer); // activates the surrogate with reference to which cat is anchorCat

		this.isOnRoof = false;
	}

	// Reset the references if the isOnRoof condition is true
	if(this.isOnRoof == true){
		if(this.anchored == 1){
			var anchorCat = this.player2;
			var otherCat = this.player1;
		}
		else{
			var anchorCat = this.player1;
			var otherCat = this.player2;
		}
	}

	// Handle the yarn mechanic
	if(this.playerDist >= this.tautLength + tautDeadband){ // If the player distance is greater than the taut length, create a constraint
		this.isTaut = true;
		if(constraint == null){ // if the constraint doesn't exist already, create a constraint
			constraint = game.physics.p2.createDistanceConstraint(this.player1.body, this.player2.body, this.tautLength, [this.player1.yarnAnchorScaleX,this.player1.yarnAnchorScaleY], [this.player2.yarnAnchorScaleX,this.player2.yarnAnchorScaleY]);
			//constraint = game.physics.p2.createSpring(this.player1.body, this.player2.body, this.tautLength, 100, 0);
		}
	}
	else{ // If the player distance is less than or equal to the taut length
		var anchorVel = Phaser.Math.distanceSq(0,0, anchorCat.body.velocity.x, anchorCat.body.velocity.y);
		var otherVel = Phaser.Math.distanceSq(0,0, otherCat.body.velocity.x, otherCat.body.velocity.y);
		// Conditions for destroying the constraint
		// If the non anchored cat can jump
		// If the non anchored cat is falling upwards
		// If the non anchored cat's velocity matches the anchor cat's velocity so long as they are greater than 0
		if(otherCat.checkIfCanJump() || otherCat.body.velocity.y*-1*otherCat.body.data.gravityScale > 0 || (anchorVel > velDeadband && otherVel > velDeadband && Math.abs(anchorVel - otherVel) < Math.pow(velDeadband, 2) ) ){ // If the player can jump OR is being pulled up
			this.isTaut = false;
			if(constraint != null){ // If the constraint does exist, remove the constraint
				game.physics.p2.removeConstraint(constraint);
				//game.physics.p2.removeSpring(constraint);
				constraint = null;
			}
		}
	}
}

// Creates the constraint between the players
Yarn.prototype.createYarn = function(anchorCat,otherCat){ // anchorCat will be the anchor
	this.isYarn = true; // yarn is active

	this.playerDist = Phaser.Math.distance(anchorCat.x, anchorCat.y, otherCat.x, otherCat.y); // Obtains distance between players
	this.tautLength = this.playerDist; // Sets the taut length

	this.modifyAnchor(anchorCat,otherCat); // Tells cats which one is anchoring
	this.surrogate.activateSurrogate(anchorCat.whichPlayer); // activates the surrogate with reference to which cat is anchorCat

	this.yarnVisual.setYarnState("taut", anchorCat.yarnColor);
}

// Modify the anchorState of each cat appropriately
Yarn.prototype.modifyAnchor = function(anchorCat,otherCat){
	anchorCat.anchorState = "isAnchor";
	otherCat.anchorState = "beingAnchored";
}

// Removes the constraint between the players
Yarn.prototype.removeYarn = function(){
	this.isYarn = false; // yarn is inactive
	this.isOnRoof = false; // in case this is true, the cat is no longer on the roof

	this.tautLength = 0; // Resets the taut length for the yarn

	// If constraint does exist, remove it
	if(constraint != null){
		game.physics.p2.removeConstraint(constraint);
		//game.physics.p2.removeSpring(constraint);
		constraint = null;
	}

	// Reset gravity
	this.player2.body.data.gravityScale = -1;
	this.player1.body.data.gravityScale = 1;

	// None of the players are anchoring
	this.player1.anchorState = "none";
	this.player2.anchorState = "none";

	// Tells the surrogate to stop
	this.surrogate.deactivateSurrogate();

	this.yarnVisual.setYarnState("slack");
}