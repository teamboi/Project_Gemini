// https://phaser.io/examples/v2/p2-physics/platformer-material
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Player
function Player(game, x, y, key, whichPlayer){
	Phaser.Sprite.call(this, game, x, y, key);

	// Obtains whether this is player1 or player2
	// Which affects controls and gravity
	this.whichPlayer = whichPlayer

	// Define player constants
	this.xVelocity = 400; // Velocity for left and right movement
	this.jumpVelocity = 1500; // Velocity for jumping

	// Enable physics
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.enable(this);
	this.body.fixedRotation = true;
	this.body.damping = 0.5;

	// controls for:
	// left, right, jump, anchor
	if(whichPlayer == 1){
		this.controls = ['A','S','D','F'];
		this.jumpDirection = 'up';
	}
	else{
		this.body.data.gravityScale = -1; // player2 will be on the roof
		this.controls = ['J','K','L','COLON'];
		this.jumpDirection = 'down';
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
}

// inherit prototype from Phaser.Sprite and set constructor to Player
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
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