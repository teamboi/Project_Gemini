// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for PlayerFSM
function PlayerFSM(game, gameplay, player, x, y, whichPlayer){
	if(whichPlayer === 1){
		var key = "cat1";
	}
	else{
		var key = "cat2";
	}

	Phaser.Sprite.call(this, game, x, y, key);
	game.add.existing(this); // Adds to display list
	this.zOrder = layerPlayer; // sets z order for layer sorting
	this.scale.setTo(0.14, 0.14); // Scales the sprite
	this.anchor.setTo(0.45,0.6); // Sets the anchor so the FSM isn't offset on the player

	this.gameplay = gameplay; // Obtain reference to gameplay state
	this.player = player; // Obtain reference to player object
	this.gameplay.group.add(this); // Adds self to the gameplay group for layer sorting

	this.isMoving = false; // var for if the player is moving left/right
	this.isJumping = false; // var for if the player just jumped

	// Add in the animations
	// generateFrameNames(prefix, start, stop, suffix, howManyDigitsForIndices)
	this.animations.add('fall', Phaser.Animation.generateFrameNames('PG Cat 5-Fall-',0,9,'',2),30, true);
	this.animations.add('idle', Phaser.Animation.generateFrameNames('PG Cat 5-Idle-',0,19,'',2),30, true);
	this.animations.add('jump', Phaser.Animation.generateFrameNames('PG Cat 5-Jump-',0,9,'',2),30, true);
	this.animations.add('walk', Phaser.Animation.generateFrameNames('PG Cat 5-Walk-',0,19,'',2),30, true);

	this.animations.add('jumpToFall', Phaser.Animation.generateFrameNames('PG Cat 5-JumpToFall-',0,6,'',2),30, true);
	this.jumpToFallEnd = 46; // Index of the end of the jumpToFall animation

	this.animations.add('land', Phaser.Animation.generateFrameNames('PG Cat 5-Land-',0,4,'',2),30, true);
	this.landEnd = 51; // Index of the end of the land animation

	// Creates a new FSM
	this.fsm = new StateMachine(this, {debug: true});

	// Reference to self that can be referenced in FSM
	var self = this;

	// Create states
	this.fsm.state('idle', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	this.fsm.state('walk', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	this.fsm.state('jump', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	this.fsm.state('jumpToFall', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	this.fsm.state('fall', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	this.fsm.state('land', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	// Create transitions
	// If the player is moving when idle
	this.fsm.transition('idle_to_walk', 'idle', 'walk', function(){
		return ( self.isMoving === true );
	});
	// If the player stops moving when walking
	this.fsm.transition('walk_to_idle', 'walk', 'idle', function(){
		return ( self.isMoving === false );
	});
	// If the player begins to fall when walking or pulled up by the anchorCat
	this.fsm.transition('walk_to_fall', 'walk', 'fall', function(){
		return ( Math.abs( self.player.body.velocity.y ) > 15 && self.isJumping === false); //self.player.body.velocity.y*-1*self.player.body.data.gravityScale < -15
	});
	// If the player is pulled up by the anchorCat when idling
	this.fsm.transition('idle_to_fall', 'idle', 'fall', function(){
		return ( Math.abs( self.player.body.velocity.y ) > 15 && self.isJumping === false);
	});
	// If the player jumps when idle
	this.fsm.transition('idle_to_jump', 'idle', 'jump', function(){
		return ( self.checkIfJumping() );
	});
	// If the player jumps when walking
	this.fsm.transition('walk_to_jump', 'walk', 'jump', function(){
		return ( self.checkIfJumping() );
	});
	// If the player reaches the peak of their jump when jumping
	this.fsm.transition('jump_to_jumpToFall', 'jump', 'jumpToFall', function(){
		return ( self.player.body.velocity.y*-1*self.player.body.data.gravityScale < 5);
	});
	// If the player reaches the end of the jumpToFall animation
	this.fsm.transition('jumpToFall_to_fall', 'jumpToFall', 'fall', function(){
		return ( self.animations.frame === self.jumpToFallEnd );
	});
	// If the player touches the ground before the end of the jumpToFall animation
	this.fsm.transition('jumpToFall_to_land', 'jumpToFall', 'land', function(){
		return ( self.player.checkIfCanJump() );
	});
	// If the player touches the ground when falling
	this.fsm.transition('fall_to_land', 'fall', 'land', function(){
		return ( self.player.checkIfCanJump() ); //self.checkIfCanJump()
	});
	// If the player jumps before the end of the land animation
	this.fsm.transition('land_to_jump', 'land', 'jump', function(){
		return ( self.checkIfJumping() ); //self.animations.loopCount > 0
	});
	// If the player reaches the end of the land animation and doesn't provide keyboard input
	this.fsm.transition('land_to_idle', 'land', 'idle', function(){
		return ( self.animations.frame === self.landEnd && self.isMoving === false ); //self.animations.loopCount > 0
	});
	// If the player reaches the end of the land animation and does provide keyboard input
	this.fsm.transition('land_to_walk', 'land', 'walk', function(){
		return ( self.animations.frame === self.landEnd && self.isMoving === true ); //self.animations.loopCount > 0
	});
	// Plays the initial state
	this.animations.play(self.fsm.initialState);
}

// inherit prototype from Phaser.Sprite and set constructor to PlayerFSM
PlayerFSM.prototype = Object.create(Phaser.Sprite.prototype);
PlayerFSM.prototype.constructor = PlayerFSM;

// Updates the FSM
PlayerFSM.prototype.update = function(){
	this.fsm.update();
}

PlayerFSM.prototype.checkIfJumping = function(){
	if(this.isJumping === true){
		this.isJumping = false;
		return true;
	}
	return false;
}