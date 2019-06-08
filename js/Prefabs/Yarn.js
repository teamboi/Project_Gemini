// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Yarn
function Yarn(game, gameplay, key, player1, player2, surrogate){
	Phaser.Sprite.call(this, game, 0, 0, key);
	game.add.existing(this);

	this.gameplay = gameplay; // Obtains the reference to the gameplay state
	this.z = layerYarn;
	this.gameplay.group.add(this);

	this.alpha = 0; // Makes this invisible

	// Get references to the player objects
	this.player1 = player1;
	this.player2 = player2;
	this.surrogate = surrogate;

	//this.player1.yarn = gameplay.yarn;
	//this.player2.yarn = gameplay.yarn;

	// Obtain the players' anchor keys
	this.p1Key = this.player1.controls[3];
	this.p2Key = this.player2.controls[3];

	// Define some variables for the constraint
	this.isYarn = false; // boolean for if the yarn is active
	this.wasYarnJustReleased = false;
	this.tautLength = 0; // the max length players can be if the yarn is active
	this.playerDist = 0;
	this.anchored = 0; // Create a variable that tracks the status of who is anchored; 0 = null, 1 = player1, 2 = player2
	this.isOnRoof = false; // boolean for if otherCat is on the roof
	this.isTaut = false; // boolean for if the yarn is at its taut length // Currently unused
	this.yarnAngle = 0; // Angle of the yarn relative to the anchorCat

	this.player1BAnchor = game.add.sprite(0, 100, "point");
	this.player2BAnchor = game.add.sprite(100, 0, "point");
	this.player1BAnchor.alpha = 0;
	this.player2BAnchor.alpha = 0;
	this.bezierGraphics = game.add.graphics(0, 0);
	this.bezierGraphics.z = layerYarn;
	this.neutralColor = 0x9D00FF;

	this.gameplay.group.add(this.bezierGraphics);

	this.midPoint = new YarnMidPoint(game, gameplay, key, player1, player2);

    this.modifyAnchor = function(anchorCat,otherCat){
		anchorCat.anchorState = "isAnchor";
		otherCat.anchorState = "beingAnchored";
    }

	// Creates the constraint between the players
	this.createYarn = function(anchorCat,otherCat){ // First cat will be the anchor
		this.isYarn = true; // yarn is active

		this.playerDist = Phaser.Math.distance(anchorCat.x, anchorCat.y, otherCat.x, otherCat.y); // Obtains distance between players
		this.tautLength = this.playerDist; // Sets the taut length

		this.modifyAnchor(anchorCat,otherCat);
		this.surrogate.activateSurrogate(anchorCat.whichPlayer); // activates the surrogate with reference to which cat is anchorCat
	}

	// Updates the yarn if it is active
	this.updateYarn = function(){
		// Only checks if the yarn is active
		if(this.isYarn != true){
			this.drawYarn("2", this.neutralColor, 'slack'); // Draw it as the inactive state
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

		this.drawYarn("4", anchorCat.yarnColor, 'taut'); // Draw it in the active state

		var tautDeadband = 1; // the margin of error to check beyond the taut length
		var velDeadband = 10; // the margin of error to check for the velocity differences
		this.playerDist = Phaser.Math.distance(anchorCat.x, anchorCat.y, otherCat.x, otherCat.y); // Obtains the distance between the players
		this.yarnAngle = Phaser.Math.angleBetween(anchorCat.x, anchorCat.y, otherCat.x, otherCat.y); // Obtain the angle of the yarn

		// If the otherCat was not previously on the roof and is on the roof and the anchorCat is not on the ground
		if(this.isOnRoof == false && otherCat.checkIfOnRoof() && !anchorCat.checkIfCanJump()){
			this.modifyAnchor(otherCat,anchorCat);
			otherCat.body.data.gravityScale *= -1;

			this.surrogate.activateSurrogate(otherCat.whichPlayer); // activates the surrogate with reference to which cat is otherCat

			this.isOnRoof = true;
		}
		else if( this.isOnRoof == true && ( !otherCat.checkIfOnRoof() || anchorCat.checkIfCanJump() ) ){
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

		if(this.playerDist >= this.tautLength + tautDeadband){ // If the player distance is greater than the taut length, create a constraint
			this.isTaut = true;
			if(constraint == null){ // if the constraint doesn't exist already, create a constraint
				constraint = game.physics.p2.createDistanceConstraint(this.player1.body, this.player2.body, this.tautLength, [0.5,0.5], [0.5,0.5]);
				//constraint = game.physics.p2.createSpring(this.player1.body, this.player2.body, this.tautLength, 100, 0);
			}
		}
		else{ // If the player distance is less than or equal to the taut length
			var anchorVel = Phaser.Math.distanceSq(0,0, anchorCat.body.velocity.x, anchorCat.body.velocity.y);
			var otherVel = Phaser.Math.distanceSq(0,0, otherCat.body.velocity.x, otherCat.body.velocity.y);
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

	// Removes the constraint between the players
	this.removeYarn = function(){
		this.isYarn = false; // yarn is inactive
		this.isOnRoof = false; // in case this is true, the cat is no longer on the roof

		this.tautLength = 0; // Resets the visual for the yarn

		//If constraint does exist, remove it
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

		this.surrogate.deactivateSurrogate();
	}

	// Draw yarn function taken from:
	// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
	this.drawYarn = function(width, color, anchored){
		if(anchored === 'taut'){
			var playerXDiff = (this.player2.body.x - this.player1.body.x)*.35;
	    	var playerYDiff = (this.player2.body.y - this.player1.body.y)*.35;

	    	var slackLength = this.tautLength - this.playerDist;

	    	var tautThreshold = 5;
	    	var slackThreshold = .45*this.tautLength;
	    	var slackMaxValue = 75;

	    	if(slackLength < tautThreshold){
	    		var handleOffsetMult = 0
	    	}
	    	else if(slackLength < slackThreshold){
	    		var handleOffsetMult = 0 + ( ( (slackMaxValue) / (slackThreshold - tautThreshold) ) * ( slackLength - tautThreshold ) );
	    	}
	    	else{
	    		var handleOffsetMult = slackMaxValue;
	    	}

	    	var handleXOffset = Math.sin(this.yarnAngle)*handleOffsetMult;
	    	var handleYOffset = Math.cos(this.yarnAngle)*handleOffsetMult;

	    	this.player1BAnchor.position.setTo(this.player1.x+playerXDiff+handleXOffset, this.player1.y+playerYDiff+handleYOffset);
	    	this.player2BAnchor.position.setTo(this.player2.x-playerXDiff-handleXOffset, this.player2.y-playerYDiff-handleYOffset);

	    	this.bezierGraphics.clear();
	    	this.bezierGraphics.lineStyle(width, color, 1);
	    	this.bezierGraphics.moveTo(this.player1.x,this.player1.y);
	    	this.bezierGraphics.bezierCurveTo(this.player1BAnchor.x, this.player1BAnchor.y, this.player2BAnchor.x, this.player2BAnchor.y, this.player2.x, this.player2.y);
		}
		else if(anchored === 'slack'){
			if(this.wasYarnJustReleased === true){
				this.wasYarnJustReleased = false;

				this.midPoint.midAnchor.x = this.midPoint.x;
				this.midPoint.midAnchor.y = this.midPoint.y;

				this.midPoint.tweenMidPoint();
			}
			this.player1BAnchor.position.setTo(this.midPoint.midAnchor.x, this.midPoint.midAnchor.y);
	    	this.player2BAnchor.position.setTo(this.midPoint.midAnchor.x, this.midPoint.midAnchor.y);

			this.bezierGraphics.clear();
	    	this.bezierGraphics.lineStyle(width, color, 1);
	    	this.bezierGraphics.moveTo(this.player1.x,this.player1.y);
	    	this.bezierGraphics.bezierCurveTo(this.player1BAnchor.x, this.player1BAnchor.y, this.player2BAnchor.x, this.player2BAnchor.y, this.player2.x, this.player2.y);
		}
		else{
			console.log(anchored + " is not a valid state. taut or slack");
		}
	}
}

// inherit prototype from Phaser.Sprite and set constructor to Yarn
Yarn.prototype = Object.create(Phaser.Sprite.prototype);
Yarn.prototype.constructor = Yarn;

Yarn.prototype.update = function(){
	// Update the yarn every frame
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
			this.wasYarnJustReleased = true;
			this.midPoint.changeMidAnchorYMult(this.player1);
			this.removeYarn();
			//this.player1.body.data.gravityScale = 1;
			this.anchored = 0;
		}
	}
	else if(this.anchored == 2){ // If player2 is anchoring
		// Now check if player2 is continueing to anchor
		if( !game.input.keyboard.isDown(Phaser.KeyCode[this.p2Key]) ){
			this.wasYarnJustReleased = true;
			this.midPoint.changeMidAnchorYMult(this.player2);
			this.removeYarn();
			//this.player2.body.data.gravityScale = -1;
			this.anchored = 0;
		}
	}
}