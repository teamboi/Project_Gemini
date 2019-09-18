// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Player
function Player(game, gameplay, x, y, whichPlayer){
	Phaser.Sprite.call(this, game, x, y, 'cat1Hitbox');
	game.add.existing(this); // Adds to the Display List
	this.gameplay = gameplay; // Obtain reference to gameplay state
	//this.scale.setTo(0.11, 0.11); // Scales the sprite
	this.alpha = 0; // Hides the hitbox
	this.whichPlayer = whichPlayer // Obtains whether this is player1, player2, or the surrogate, which affects controls and gravity

	// If the player isn't the surrogate, then create an animation state machine
	if(whichPlayer === 1 || whichPlayer === 2){
		this.catSprite = new PlayerFSM(game, gameplay, this, x, y, whichPlayer);
	}
	else{ // Else, create a dummy variable so nothing breaks
		this.catSprite = game.add.sprite(x,y,'cat1Hitbox');
		this.catSprite.alpha = 0;
	}

	// Enable physics
	game.physics.p2.enable(this, debugCollisionsObjects);
	this.body.fixedRotation = true; // Player cannot rotate
	this.body.damping = 0.5;
	this.body.dynamic = true; // Player has collisions with other objects

	// Define player constants
	this.xVelocity = 200; // Velocity for left and right movement
	this.jumpVelocity = 500; // Velocity for jumping
	this.vertCollision = 0 // Constant for what direction the collision is vertically

	this.facing = "left"; // where the cat is facing

	this.yarnAnchorScaleX = .14; // Constants for where the yarn anchor point should be held
	this.yarnAnchorScaleY = .41;
	this.yarnAnchorOffsetX = this.yarnAnchorScaleX*this.width; // Calculate how many pixels to offset
	this.yarnAnchorOffsetY = this.yarnAnchorScaleY*this.height;
	this.yarnAnchorOffsetXInit = this.yarnAnchorOffsetX; // Storing initial value for tweening use

	this.anchorState = "none"; // What state the anchor is; Possible states: none, isAnchor, beingAnchored

	// Create references to the gameplay's collision groups
	var playerCG = this.gameplay.playerCollisionGroup;
	var platformCG = this.gameplay.platformCollisionGroup;
	var objectCG = this.gameplay.objectCollisionGroup;
	var cloudCG = this.gameplay.cloudCollisionGroup;
	var surrogateCG = this.gameplay.surrogateCollisionGroup;

	// Sets specific variables for the players and surrogate
	if(whichPlayer == 1){
		this.controls = ['A','D','W','S']; // Controls for: left, right, jump, anchor
		this.jumpDirection = 'up'; // Direction that jump will push the player towards

		this.yarnColor = 0xE4784E; // Sets yarn color to an orange

		this.meow1 = game.add.audio('short_meow1'); // Adds in meow sfx
		//this.meow2 = game.add.audio('long_meow1');

		// Sets collision group stuff
		this.body.setCollisionGroup(playerCG);
        this.body.collides([playerCG, platformCG, objectCG, cloudCG]);
	}
	else if(whichPlayer == 2){
		this.body.data.gravityScale = -1; // player2 will be on the roof and reverse gravity
		this.catSprite.scale.y *= -1 // Flips the FSM upside down

		this.controls = ['LEFT','RIGHT','DOWN','UP'];//,'COLON'];
		this.jumpDirection = 'down'; // Direction that jump will push the player towards

		this.yarnColor = 0x799FCE; // Sets yarn color to a blue

		this.meow1 = game.add.audio('short_meow2'); // Adds in meow sfx
		//this.meow2 = game.add.audio('long_meow2');

		// Sets collision group stuff
		this.body.setCollisionGroup(playerCG);
        this.body.collides([playerCG, platformCG, objectCG, cloudCG]);
	}
	else{
		this.controls = ['LEFT','RIGHT','DOWN','UP']; // Populates the controls for the surrogate so it can be read
		this.jumpDirection = 'down'; // Populates the jumpDirection for the surrogate so it can be read
		this.alpha = 0; // Makes the surrogate invisible
		//http://www.html5gamedevs.com/topic/10454-how-to-disable-collision-for-body/
		this.body.data.shapes[0].sensor = true; // Surrogate does not collide

		// Sets collision group stuff
		this.body.setCollisionGroup(surrogateCG);
        this.body.collides([platformCG, objectCG, cloudCG]);
	}
}

// inherit prototype from Phaser.Sprite and set constructor to Player
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
	// Moves the FSM to the same position as the player
	if(this.catSprite){
		this.catSprite.x = this.body.x;
		this.catSprite.y = this.body.y;
	}

	// Check if the player is colliding with the roof or ground
	this.checkVertCollision();

	// If this player isn't anchoring, move the player around
	if(this.anchorState != "isAnchor"){
		// Check for left and right movements
		if (game.input.keyboard.isDown(Phaser.KeyCode[this.controls[0]])) {
			this.faceLeft();
			this.move(this.facing, this.xVelocity);
			this.catSprite.isMoving = true;
	    }
	    else if (game.input.keyboard.isDown(Phaser.KeyCode[this.controls[1]])) {
	    	this.faceRight();
	    	this.move(this.facing, this.xVelocity);
	    	this.catSprite.isMoving = true;
	    }
	    else{
	    	this.catSprite.isMoving = false;
	    }

	    // Check for jumping
	    if(game.input.keyboard.justPressed(Phaser.KeyCode[this.controls[2]]) && this.checkIfCanJump() ){
	    	// Check for if the player is not the surrogate, then play a sound
	    	if(this.whichPlayer == 1 || this.whichPlayer == 2) {
	    		if(typeof this.meow1 !== 'undefined') {
	    			this.meow1.play('', 0, 1, false);
	    		}
	    	}
	    	// Makes the player jump in the appropriate direction
	    	if(this.whichPlayer == 1){
				this.body.moveUp(this.jumpVelocity);
			}
			else{
				this.body.moveDown(this.jumpVelocity);
			}
			// Tells the FSM that the player is jumping
			// Reset in this.resetFsmVars(), so it acts as an "impulse"
			this.catSprite.isJumping = true;
	    }
	}
	// If this player is anchoring, copy the surrogate, which will be reading the appropriate controls
	else{
		this.puppetSurrogate();
		// Properly sets the correct animation variables and scaling based on input if the player is anchoring
		// If the player is moving to the left
		if (game.input.keyboard.isDown(Phaser.KeyCode[this.controls[0]])) {
			this.catSprite.isMoving = true;
			this.faceLeft();
	    }
	    // If the player is moving to the right
	    else if (game.input.keyboard.isDown(Phaser.KeyCode[this.controls[1]])) {
	    	this.catSprite.isMoving = true;
	    	this.faceRight();
	    }
	    else{
	    	this.catSprite.isMoving = false;
	    }
	}
}

// Moves the player left or right
Player.prototype.move = function(direction, velocity){
	var moveDist = velocity;
	if(direction == "left"){ // Modifies the distance moved appropriately based on direction
		moveDist *= -1;
	}
	if(this.anchorState == "beingAnchored"){ // If the player is being anchored
		if(!this.checkIfCanJump()){ // ... and the player is hanging in the air
			moveDist *= Math.abs(Math.sin(this.gameplay.yarn.yarnAngle)); // Scales how much the player can move based on the angle of the yarn
		}
		this.body.moveRight(moveDist); // Moves the player
	}
	else{ // else just move the player normally
		this.body.moveRight(moveDist);
	}
}

// Makes the player face left
Player.prototype.faceLeft = function(){
	if(this.facing === "right"){
		this.facing = "left";
		//this.yarnAnchorOffsetX = Math.abs(this.yarnAnchorOffsetX);
		this.catSprite.scale.x = -1*this.catSprite.scale.x;
		if(this.yarnAnchorTween != null){
			this.yarnAnchorTween.stop();
		}
		this.yarnAnchorOffsetX = -1*this.yarnAnchorOffsetXInit;
		this.yarnAnchorTween = game.add.tween(this).to( { yarnAnchorOffsetX: -1*this.yarnAnchorOffsetX }, 150, Phaser.Easing.Linear.In, true, 0, 0, false);
	}
}

// Makes the player face right
Player.prototype.faceRight = function(){
	if(this.facing === "left"){
		this.facing = "right";
		//this.yarnAnchorOffsetX = -1*Math.abs(this.yarnAnchorOffsetX);
		this.catSprite.scale.x = -1*this.catSprite.scale.x;

		if(this.yarnAnchorTween != null){
			this.yarnAnchorTween.stop();
		}
		this.yarnAnchorOffsetX = this.yarnAnchorOffsetXInit;
		this.yarnAnchorTween = game.add.tween(this).to( { yarnAnchorOffsetX: -1*this.yarnAnchorOffsetX }, 150, Phaser.Easing.Linear.In, true, 0, 0, false);
	}
}

// Checks if the ground is under the player
// Can be reversed if checking for roof
// Modified from https://phaser.io/examples/v2/p2-physics/platformer-material
Player.prototype.checkVertCollision = function(){
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
Player.prototype.checkIfCanJump = function() {
	if (this.vertCollision > 0.5){
        return true;
    }
    return false;
}

// Checks if a platform is above the player
// returns true if the player is on the roof
Player.prototype.checkIfOnRoof = function() {
	var vert = -1*this.vertCollision;
	if (vert > 0.5){
        return true;
    }
    return false;
}

// surrogate player begins to copy the movement of a player
Player.prototype.activateSurrogate = function(anchor){
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

// surrogate player will stop doing collisions
Player.prototype.deactivateSurrogate = function(){
	//this.body.x = 2000;
	//this.body.y = 2000;
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
	this.body.data.gravityScale = 0;
	this.body.data.shapes[0].sensor = true;
}

// Called every frame when the yarn is active for the player to copy the surrogate's variables
Player.prototype.puppetSurrogate = function(){
	var surrogate = this.gameplay.surrogate; // Obtains reference to the surrogate
	this.body.x = surrogate.body.x;
	this.body.y = surrogate.body.y;
	this.body.velocity.x = surrogate.body.velocity.x;
	this.body.velocity.y = surrogate.body.velocity.y;
}