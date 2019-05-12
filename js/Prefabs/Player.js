// https://phaser.io/examples/v2/p2-physics/platformer-material
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Player
function Player(game, gameplay, x, y, key, whichPlayer){
	Phaser.Sprite.call(this, game, x, y, key);
	this.gameplay = gameplay;
	this.scale.setTo(0.11, 0.11);
	// Obtains whether this is player1 or player2
	// Which affects controls and gravity
	this.whichPlayer = whichPlayer
	this.meow = game.add.audio('meow');

	// Enable physics
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.enable(this);
	this.body.fixedRotation = true;
	this.body.damping = 0.5;
	this.body.dynamic = true;

	// Define player constants
	this.xVelocity = 200; // Velocity for left and right movement
	this.jumpVelocity = 500; // Velocity for jumping

	this.isAnchor = false;

	// controls for:
	// left, right, jump, anchor
	if(whichPlayer == 1){
		this.controls = ['A','S','D','F'];
		this.jumpDirection = 'up';
	}
	else if(whichPlayer == 2){
		this.body.data.gravityScale = -1; // player2 will be on the roof
		this.controls = ['J','K','L','COLON'];
		this.jumpDirection = 'down';
	}
	else{
		this.controls = ['J','K','L','COLON'];
		this.jumpDirection = 'down';
		this.alpha = 0;
	}

	// Checks if the ground is under the player
	// Taken from https://phaser.io/examples/v2/p2-physics/platformer-material
	this.checkIfCanJump = function(direction) {
		var yAxis = p2.vec2.fromValues(0, 1);
		
	    for (let i=0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++){
	        var cE = game.physics.p2.world.narrowphase.contactEquations[i];

	        if (cE.bodyA === this.body.data || cE.bodyB === this.body.data){
	            var d = p2.vec2.dot(cE.normalA, yAxis);

	            if (cE.bodyA === this.body.data){
	                d *= -1;
	            }

	            if(direction == 'down'){
	            	d *= -1;
	            }

	            if (d > 0.5){
	                return true;
	            }
	        }
	    }
	    return false;
	}

	this.activateSurrogate = function(anchor){
		var cat;
		if(anchor == 1){
			cat = this.gameplay.player1;
		}
		else{
			cat = this.gameplay.player2;
		}

		this.key = cat.key;

		this.body.x = cat.body.x;
		this.body.y = cat.body.y;
		this.body.velocity.x = cat.body.velocity.x;
		this.body.velocity.y = cat.body.velocity.y;
		this.body.data.gravityScale = cat.body.data.gravityScale;
		
		this.body.angularForce = cat.body.angularForce;
		this.body.angularVelocity = cat.body.angularVelocity;
		this.body.damping = cat.body.damping;
		this.body.force = cat.body.force;
		this.body.inertia = cat.body.inertia;

		this.controls = cat.controls;
		this.jumpDirection = cat.jumpDirection;
		this.whichPlayer = cat.whichPlayer;
	}

	this.deactivateSurrogate = function(){

	}

	this.puppetSurrogate = function(){
		var surrogate = this.gameplay.surrogate;
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
	if(this.isAnchor == false){
		// Check for left and right movements
		if (game.input.keyboard.isDown(Phaser.KeyCode[this.controls[0]])) {
			this.body.moveLeft(this.xVelocity);
	    }
	    else if (game.input.keyboard.isDown(Phaser.KeyCode[this.controls[1]])) {
	    	this.body.moveRight(this.xVelocity);
	    }

	    // Check for jumping
	    if(game.input.keyboard.justPressed(Phaser.KeyCode[this.controls[2]]) && this.checkIfCanJump(this.jumpDirection) ){ //
	    	if(this.whichPlayer == 1){
				this.body.moveUp(this.jumpVelocity);
			}
			else{
				this.body.moveDown(this.jumpVelocity);
			}
	    }
	}
	else{
		this.puppetSurrogate();
	}
}