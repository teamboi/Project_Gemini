// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for PlayerFSM
function PlayerFSM(game, gameplay, player, x, y, whichPlayer){
	if(whichPlayer === 1){
		var key = "cat1";
		var scale = 1;
	}
	else{
		var key = "cat2";
		var scale = 0.14;
		scale = 1;
		// temporary fix until more animations are added
	}

	Phaser.Sprite.call(this, game, x, y, key);
	game.add.existing(this); // Adds to display list
	this.zOrder = layerPlayer; // sets z order for layer sorting
	this.scale.setTo(scale, scale); // Scales the sprite
	this.anchor.setTo(0.45,0.6); // Sets the anchor so the FSM isn't offset on the player

	this.gameplay = gameplay; // Obtain reference to gameplay state
	this.player = player; // Obtain reference to player object
	this.gameplay.group.add(this); // Adds self to the gameplay group for layer sorting

	this.isMoving = false; // var for if the player is moving left/right
	this.isJumping = false; // var for if the player just jumped

	// Add in the animations
	// generateFrameNames(prefix, start, stop, suffix, howManyDigitsForIndices)
	var file = "PG Cat 6";
	this.animations.add('fall', Phaser.Animation.generateFrameNames(file + '-Fall-',0,9,'',2),30, true);
	this.animations.add('idle', Phaser.Animation.generateFrameNames(file + '-Idle-',0,19,'',2),30, true);
	this.animations.add('jump', Phaser.Animation.generateFrameNames(file + '-Jump-',0,9,'',2),30, true);
	this.animations.add('walk', Phaser.Animation.generateFrameNames(file + '-Walk-',0,19,'',2),30, true);

	this.animations.add('jumpToFall', Phaser.Animation.generateFrameNames(file + '-JumpToFall-',0,19,'',2),30, true);
	this.jumpToFallEnd = 162; // Index of the end of the jumpToFall animation

	this.animations.add('land', Phaser.Animation.generateFrameNames(file + '-Land-',0,4,'',2),30, true);
	this.landEnd = 167; // Index of the end of the land animation

	this.animations.add('landToWalk', Phaser.Animation.generateFrameNames(file + '-LandToWalk-',0,14,'',2),30, true);
	this.landToWalkEnd = 195; // Index of the end of the land animation

	this.animations.add('landToIdle', Phaser.Animation.generateFrameNames(file + '-LandToIdle-',0,11,'',2),30, true);
	this.landToIdleEnd = 180; // Index of the end of the land animation

	this.animations.add('idleToWalk', Phaser.Animation.generateFrameNames(file + '-IdleToWalk-',0,3,'',2),30, true);
	this.idleToWalkEnd = 132; // Index of the end of the land animation

	this.animations.add('walkToIdle', Phaser.Animation.generateFrameNames(file + '-WalkToIdle-',0,3,'',2),30, true);
	this.walkToIdleEnd = 224; // Index of the end of the land animation

	this.animations.add('ceilingCollide', Phaser.Animation.generateFrameNames(file + '-CeilingCollide-',0,14,'',2),30, true);
	this.ceilingCollideEnd = 14; // Index of the end of the land animation

	this.animations.add('fidgetStretch', Phaser.Animation.generateFrameNames(file + '-FidgetStretch-',0,44,'',2),30, true);
	this.fidgetStretchEnd = 69; // Index of the end of the land animation

	this.animations.add('fidgetYawn', Phaser.Animation.generateFrameNames(file + '-FidgetYawn-',0,39,'',2),30, true);
	this.fidgetYawnEnd = 109; // Index of the end of the land animation

	// Creates a new FSM
	if(whichPlayer === 1){
		this.fsm = new StateMachine(this, {debug: true});
	}
	else{
		this.fsm = new StateMachine(this, {debug: false});
	}	

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

	this.fsm.state('landToWalk', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	this.fsm.state('landToIdle', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	this.fsm.state('idleToWalk', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	this.fsm.state('walkToIdle', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	this.fsm.state('ceilingCollide', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	this.fsm.state('fidgetStretch', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	this.fsm.state('fidgetYawn', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	// Create transitions
	// If the player is moving when idle
	this.fsm.transition('idle_to_idleToWalk', 'idle', 'idleToWalk', function(){
		return ( self.isMoving === true );
	});
	// If the player is pulled up by the anchorCat when idling
	this.fsm.transition('idle_to_fall', 'idle', 'fall', function(){
		return ( self.checkIfFalling() );
	});
	// If the player jumps when idle
	this.fsm.transition('idle_to_jump', 'idle', 'jump', function(){
		return ( self.checkIfJumping() );
	});

	this.fsm.transition('idleToWalk_to_walk', 'idleToWalk', 'walk', function(){
		return ( self.animations.frame === self.idleToWalkEnd );
	});
	this.fsm.transition('idleToWalk_to_fall', 'idleToWalk', 'fall', function(){
		return ( self.checkIfFalling() );
	});
	this.fsm.transition('idleToWalk_to_jump', 'idleToWalk', 'jump', function(){
		return ( self.checkIfJumping() );
	});

	// If the player stops moving when walking
	this.fsm.transition('walk_to_walkToIdle', 'walk', 'walkToIdle', function(){
		return ( self.isMoving === false );
	});
	// If the player begins to fall when walking or pulled up by the anchorCat
	this.fsm.transition('walk_to_fall', 'walk', 'fall', function(){
		return ( self.checkIfFalling() );
	});
	// If the player jumps when walking
	this.fsm.transition('walk_to_jump', 'walk', 'jump', function(){
		return ( self.checkIfJumping() );
	});

	this.fsm.transition('walkToIdle_to_idle', 'walkToIdle', 'idle', function(){
		return ( self.animations.frame === self.walkToIdleEnd );
	});
	this.fsm.transition('walkToIdle_to_fall', 'walkToIdle', 'fall', function(){
		return ( self.checkIfFalling() );
	});
	this.fsm.transition('walkToIdle_to_jump', 'walkToIdle', 'jump', function(){
		return ( self.checkIfJumping() );
	});

	// If the player reaches the peak of their jump when jumping
	this.fsm.transition('jump_to_jumpToFall', 'jump', 'jumpToFall', function(){
		return ( self.player.body.velocity.y*-1*self.player.body.data.gravityScale < 25 && self.player.body.velocity.y*-1*self.player.body.data.gravityScale > 5 );
	});
	this.fsm.transition('jump_to_ceilingCollide', 'jump', 'ceilingCollide', function(){
		return ( self.player.body.velocity.y*-1*self.player.body.data.gravityScale <= 5 );
	});

	this.fsm.transition('ceilingCollide_to_fall', 'ceilingCollide', 'fall', function(){
		return ( self.animations.frame === self.ceilingCollideEnd );
	});
	this.fsm.transition('ceilingCollide_to_land', 'ceilingCollide', 'land', function(){
		return ( self.checkIfLanded() );
	});

	// If the player reaches the end of the jumpToFall animation
	this.fsm.transition('jumpToFall_to_fall', 'jumpToFall', 'fall', function(){
		return ( self.animations.frame === self.jumpToFallEnd );
	});
	// If the player touches the ground before the end of the jumpToFall animation
	this.fsm.transition('jumpToFall_to_land', 'jumpToFall', 'land', function(){
		return ( self.checkIfLanded() );
	});

	// If the player touches the ground when falling
	this.fsm.transition('fall_to_land', 'fall', 'land', function(){
		return ( self.checkIfLanded() ); //self.checkIfCanJump()
	});

	// If the player jumps before the end of the land animation
	this.fsm.transition('land_to_jump', 'land', 'jump', function(){
		return ( self.checkIfJumping() );
	});
	// If the player reaches the end of the land animation and doesn't provide keyboard input
	this.fsm.transition('land_to_landToIdle', 'land', 'landToIdle', function(){
		return ( self.animations.frame === self.landEnd && self.isMoving === false );
	});
	// If the player reaches the end of the land animation and does provide keyboard input
	this.fsm.transition('land_to_landToWalk', 'land', 'landToWalk', function(){
		return ( self.animations.frame === self.landEnd && self.isMoving === true );
	});

	this.fsm.transition('landToIdle_to_idle', 'landToIdle', 'idle', function(){
		return ( self.animations.frame === self.landToIdleEnd );
	});
	this.fsm.transition('landToIdle_to_jump', 'landToIdle', 'jump', function(){
		return ( self.checkIfJumping() );
	});
	this.fsm.transition('landToIdle_to_fall', 'landToIdle', 'fall', function(){
		return ( self.checkIfFalling() );
	});

	this.fsm.transition('landToWalk_to_walk', 'landToWalk', 'walk', function(){
		return ( self.animations.frame === self.landToWalkEnd );
	});
	this.fsm.transition('landToWalk_to_jump', 'landToWalk', 'jump', function(){
		return ( self.checkIfJumping() );
	});
	this.fsm.transition('landToWalk_to_fall', 'landToWalk', 'fall', function(){
		return ( self.checkIfFalling() );
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

PlayerFSM.prototype.checkIfFalling = function(){
	if(Math.abs( this.player.body.velocity.y ) > 15 && this.isJumping === false){
		return true;
	}
	return false;
}

PlayerFSM.prototype.checkIfJumping = function(){
	if(this.isJumping === true){
		this.isJumping = false;
		return true;
	}
	return false;
}

PlayerFSM.prototype.checkIfLanded = function(){
	if( this.player.checkIfCanJump() ){
		return true;
	}
	return false;
}