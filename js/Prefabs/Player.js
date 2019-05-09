// https://phaser.io/examples/v2/p2-physics/platformer-material
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Player
function Player(game, x, y, key, whichPlayer){
	Phaser.Sprite.call(this, game, x, y, key);

	// Obtains whether this is player1 or player2
	// Which affects controls and gravity
	this.whichPlayer = whichPlayer

	// Enable physics
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.enable(this);
	this.body.fixedRotation = true;
	this.body.damping = 0.5;

	// controls for:
	// left, right, jump, anchor
	if(whichPlayer == 1){
		this.controls = ['A','S','D','F'];
	}
	else{
		this.body.data.gravityScale = -1; // player2 will be on the roof
		this.controls = ['J','K','L','COLON'];
	}
}

// inherit prototype from Phaser.Sprite and set constructor to Player
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
	// Check for left and right movements
	if (game.input.keyboard.isDown(Phaser.KeyCode[this.controls[0]])) {
    	this.body.moveLeft(400);
    }
    else if (game.input.keyboard.isDown(Phaser.KeyCode[this.controls[1]])) {
    	this.body.moveRight(400);
    }

    // Check for jumping
    if(game.input.keyboard.justPressed(Phaser.KeyCode[this.controls[2]])){
    	if(this.whichPlayer == 1){
			this.body.moveUp(300);
		}
		else{
			this.body.moveUp(-300);
		}
    }
}