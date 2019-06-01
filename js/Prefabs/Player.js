// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://phaser.io/examples/v2/p2-physics/platformer-material
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Player
function Player(game, gameplay, x, y, key, whichPlayer){
	Phaser.Sprite.call(this, game, x, y, key);
	this.gameplay = gameplay; // Obtain reference to gameplay state
	this.scale.setTo(0.11, 0.11); // Scales the sprite
	this.whichPlayer = whichPlayer // Obtains whether this is player1, player2, or the surrogate, which affects controls and gravity
	this.meow = game.add.audio('meow'); // Adds in meow sfx

	// Enable physics
	game.physics.p2.enable(this, true);
	this.body.fixedRotation = true; // Player cannot rotate
	this.body.damping = 0.5;
	this.body.dynamic = true;

	// Define player constants
	this.xVelocity = 200; // Velocity for left and right movement
	this.jumpVelocity = 500; // Velocity for jumping
	this.vertCollision = 0 // Constant for what direction the collision is vertically

	this.anchorState = "none"; // What state the anchor is; Possible states: none, isAnchor, beingAnchored

	var playerCG = this.gameplay.playerCollisionGroup;
	var platformCG = this.gameplay.platformCollisionGroup;
	var objectCG = this.gameplay.objectCollisionGroup;
	var cloudCG = this.gameplay.cloudCollisionGroup;
	var surrogateCG = this.gameplay.surrogateCollisionGroup;

	// Sets specific variables for the players and surrogate
	if(whichPlayer == 1){
		this.controls = ['A','D','W','S']; // Controls for: left, right, jump, anchor
		this.jumpDirection = 'up'; // Direction that jump will push the player towards
		this.yarnColor = 0xFF0400;

		this.body.setCollisionGroup(playerCG);
        this.body.collides([playerCG, platformCG, objectCG, cloudCG]);
	}
	else if(whichPlayer == 2){
		this.body.data.gravityScale = -1; // player2 will be on the roof and reverse gravity
		this.controls = ['LEFT','RIGHT','DOWN','UP'];//,'COLON'];
		this.jumpDirection = 'down';
		this.yarnColor = 0x0008FF;

		this.body.setCollisionGroup(playerCG);
        this.body.collides([playerCG, platformCG, objectCG, cloudCG]);
	}
	else{
		this.controls = ['LEFT','RIGHT','DOWN','UP']; // Populates the controls for the surrogate so it can be read
		this.jumpDirection = 'down'; // Populates the jumpDirection for the surrogate so it can be read
		this.alpha = 0; // Makes the surrogate invisible
		//http://www.html5gamedevs.com/topic/10454-how-to-disable-collision-for-body/
		this.body.data.shapes[0].sensor = true; // Surrogate does not collide

		this.body.setCollisionGroup(surrogateCG);
        this.body.collides([platformCG, objectCG, cloudCG]);
	}

	this.move = function(direction, velocity){
		var moveDist = velocity;
		if(direction == "left"){
			moveDist *= -1;
		}
		if(this.anchorState == "beingAnchored"){
			if(!this.checkIfCanJump()){
				moveDist *= Math.abs(Math.sin(this.gameplay.yarn.yarnAngle)); //this.yarn.yarnAngle
			}
			this.body.moveRight(moveDist);
		}
		else{
			this.body.moveRight(moveDist);
		}
	}

	// Checks if the ground is under the player
	// Can be reversed if checking for roof
	// Taken from https://phaser.io/examples/v2/p2-physics/platformer-material
	this.checkVertCollision = function(){
		var yAxis = p2.vec2.fromValues(0, 1);
		
	    for (let i=0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++){
	        var cE = game.physics.p2.world.narrowphase.contactEquations[i];

	        if (cE.bodyA === this.body.data || cE.bodyB === this.body.data){
	            var d = p2.vec2.dot(cE.normalA, yAxis);

	            if (cE.bodyA === this.body.data){
	                d *= -1;
	            }

	            if(this.jumpDirection == 'down'){ // If player2, then reverse the vector
	            	d *= -1;
	            }

	            this.vertCollision = d;
	            return;
	        }
	    }
	    this.vertCollision = 0;
	}

	// Checks if the ground is under the player
	// Returns true if the player is on the ground
	this.checkIfCanJump = function() {
		if (this.vertCollision > 0.5){
            return true;
        }
        return false;
	}

	// Checks if a platform is above the player
	// returns true if the player is on the roof
	this.checkIfOnRoof = function() {
		var vert = -1*this.vertCollision;
		if (vert > 0.5){
            return true;
        }
        return false;
	}

	// surrogate player begins to copy the movement of a player
	this.activateSurrogate = function(anchor){
		// Obtains which cat to copy as the anchor cat
		var cat;
		if(anchor == 1){
			cat = this.gameplay.player1;
		}
		else{
			cat = this.gameplay.player2;
		}

		this.key = cat.key; // Changes hitbox to match the cat

		// Copies the x, y, velocity, and gravity variables
		this.body.x = cat.body.x;
		this.body.y = cat.body.y;
		this.body.velocity.x = cat.body.velocity.x;
		this.body.velocity.y = cat.body.velocity.y;
		this.body.data.gravityScale = cat.body.data.gravityScale;
		
		// Copies additional physics forces
		this.body.angularForce = cat.body.angularForce;
		this.body.angularVelocity = cat.body.angularVelocity;
		this.body.damping = cat.body.damping;
		this.body.force = cat.body.force;
		this.body.inertia = cat.body.inertia;

		// Copies controls, jumpDirection, and whichPlayer correctly
		this.controls = cat.controls;
		this.jumpDirection = cat.jumpDirection;
		this.whichPlayer = cat.whichPlayer;
		this.body.data.shapes[0].sensor = false;
	}

	this.deactivateSurrogate = function(){
		//this.body.x = 2000;
		//this.body.y = 2000;
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
		this.body.data.gravityScale = 0;
		this.body.data.shapes[0].sensor = true;
	}

	// Called every frame when the yarn is active for the player to copy the surrogate's variables
	this.puppetSurrogate = function(){
		var surrogate = this.gameplay.surrogate; // Obtains reference to the surrogate
		this.body.x = surrogate.body.x;
		this.body.y = surrogate.body.y;
		this.body.velocity.x = surrogate.body.velocity.x;
		this.body.velocity.y = surrogate.body.velocity.y;
	}
}

// inherit prototype from Phaser.Sprite and set constructor to Player
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
	this.checkVertCollision();

	// If this player isn't anchoring, move the player around
	if(this.anchorState != "isAnchor"){
		// Check for left and right movements
		if (game.input.keyboard.isDown(Phaser.KeyCode[this.controls[0]])) {
			this.move("left", this.xVelocity);
			//this.body.moveLeft(this.xVelocity);
	    }
	    else if (game.input.keyboard.isDown(Phaser.KeyCode[this.controls[1]])) {
	    	this.move("right", this.xVelocity);
	    	//this.body.moveRight(this.xVelocity);
	    }

	    // Check for jumping
	    if(game.input.keyboard.justPressed(Phaser.KeyCode[this.controls[2]]) && this.checkIfCanJump() ){
	    	this.meow.play('', 0, 1, false);
	    	if(this.whichPlayer == 1){
				this.body.moveUp(this.jumpVelocity);
			}
			else{
				this.body.moveDown(this.jumpVelocity);
			}
	    }
	}
	// If this player is anchoring, copy the surrogate, which will be reading the appropriate controls
	else{
		this.puppetSurrogate();
	}
}