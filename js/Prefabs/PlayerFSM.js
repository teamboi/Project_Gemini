// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for PlayerFSM
function PlayerFSM(game, gameplay, player, x, y, whichPlayer){

	this.animationEndFrames = {
		// looping animations
		fall: "09",
		idle: 19,
		jump: "09",
		walk: 19,

		// single-cycle animations
		jumpToFall: 19,
		land: "03",
		landToWalk: 14,
		landToIdle: 11,
		idleToWalk: "03",
		idleToFall: "03",
		walkToIdle1: "09",
		ceilingCollide: "09",
		fidgetStretch: 44,
		fidgetYawn: 39
	}

	var key, debugBool;
	if(whichPlayer === 1){
		key = "cat1";
		if(debugAnimation === true){
			debugBool = true;
			this.debugPrintAnimationIndices(this.animationEndFrames);
		}
		else{
			debugBool = false;
		}
	}
	else{
		key = "cat2";
		debugBool = false;
	}

	Phaser.Sprite.call(this, game, x, y, key);
	game.add.existing(this); // Adds to display list
	this.zOrder = layerPlayer; // sets z order for layer sorting
	//this.scale.setTo(0.14, 0.14); // Scales the sprite
	this.anchor.setTo(0.45,0.6); // Sets the anchor so the FSM isn't offset on the player

	this.gameplay = gameplay; // Obtain reference to gameplay state
	this.player = player; // Obtain reference to player object
	this.gameplay.group.add(this); // Adds self to the gameplay group for layer sorting

	this.isMoving = false; // var for if the player is moving left/right
	this.isJumping = false; // var for if the player just jumped
	this.idleTimer = 0; // var for the timer for being idle to trigger fidget animations

	// Add in the animations
	// generateFrameNames(prefix, start, stop, suffix, howManyDigitsForIndices)
	var file = "PG Cat 6";
	this.animations.add('fall', Phaser.Animation.generateFrameNames(file + '-Fall-',0,this.animationEndFrames.fall,'',2),30, true);
	this.animations.add('idle', Phaser.Animation.generateFrameNames(file + '-Idle-',0,this.animationEndFrames.idle,'',2),30, true);
	this.animations.add('jump', Phaser.Animation.generateFrameNames(file + '-Jump-',0,this.animationEndFrames.jump,'',2),30, true);
	this.animations.add('walk', Phaser.Animation.generateFrameNames(file + '-Walk-',0,this.animationEndFrames.walk,'',2),30, true);

	this.animations.add('jumpToFall', Phaser.Animation.generateFrameNames(file + '-JumpToFall-',0,this.animationEndFrames.jumpToFall,'',2),30, true);
	this.jumpToFallEnd = 197; // Index of the end of the jumpToFall animation

	this.animations.add('land', Phaser.Animation.generateFrameNames(file + '-Land-',0,this.animationEndFrames.land,'',2),30, true);
	this.landEnd = 201; // Index of the end of the land animation

	this.animations.add('landToWalk', Phaser.Animation.generateFrameNames(file + '-LandToWalk-',0,this.animationEndFrames.landToWalk,'',2),30, true);
	this.landToWalkEnd = 4; // Index of the end of the land animation

	this.animations.add('landToIdle', Phaser.Animation.generateFrameNames(file + '-LandToIdle-',0,this.animationEndFrames.landToIdle,'',2),30, true);
	this.landToIdleEnd = 213; // Index of the end of the land animation

	this.animations.add('idleToWalk', Phaser.Animation.generateFrameNames(file + '-IdleToWalk-',0,this.animationEndFrames.idleToWalk,'',2),30, true);
	this.idleToWalkEnd = 167; // Index of the end of the land animation

	this.animations.add('idleToFall', Phaser.Animation.generateFrameNames(file + '-IdleToFall-',0,this.animationEndFrames.idleToFall,'',2),30, true);
	this.idleToFallEnd = 163; // Index of the end of the land animation

	this.animations.add('walkToIdle1', Phaser.Animation.generateFrameNames(file + '-WalkToIdle1-',0,this.animationEndFrames.walkToIdle1,'',2),30, true);
	this.walkToIdleEnd = 34; // Index of the end of the land animation

	this.animations.add('ceilingCollide', Phaser.Animation.generateFrameNames(file + '-CeilingCollide-',0,this.animationEndFrames.ceilingCollide,'',2),30, true);
	this.ceilingCollideEnd = 44; // Index of the end of the land animation

	this.animations.add('fidgetStretch', Phaser.Animation.generateFrameNames(file + '-FidgetStretch-',0,this.animationEndFrames.fidgetStretch,'',2),30, true);
	this.fidgetStretchEnd = 99; // Index of the end of the land animation

	this.animations.add('fidgetYawn', Phaser.Animation.generateFrameNames(file + '-FidgetYawn-',0,this.animationEndFrames.fidgetYawn,'',2),30, true);
	this.fidgetYawnEnd = 139; // Index of the end of the land animation

	// Creates a new FSM
	this.fsm = new StateMachine(this, {debug: debugBool});

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

	this.fsm.state('idleToFall', {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});

	this.fsm.state('walkToIdle1', {
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
		return ( self.checkIfMoving() );
	});
	// If the player is pulled up by the anchorCat when idling
	this.fsm.transition('idle_to_idleToFall', 'idle', 'idleToFall', function(){
		return ( self.checkIfFalling() );
	});
	// If the player jumps when idle
	this.fsm.transition('idle_to_jump', 'idle', 'jump', function(){
		return ( self.checkIfJumping() );
	});

	this.fsm.transition('idleToFall_to_fall', 'idleToFall', 'fall', function(){
		return ( self.animations.frame === self.idleToFallEnd );
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
	this.fsm.transition('walk_to_walkToIdle1', 'walk', 'walkToIdle1', function(){
		return ( self.checkIfStopMoving() );
	});
	// If the player begins to fall when walking or pulled up by the anchorCat
	this.fsm.transition('walk_to_fall', 'walk', 'fall', function(){
		return ( self.checkIfFalling() );
	});
	// If the player jumps when walking
	this.fsm.transition('walk_to_jump', 'walk', 'jump', function(){
		return ( self.checkIfJumping() );
	});

	this.fsm.transition('walkToIdle1_to_idle', 'walkToIdle1', 'idle', function(){
		return ( self.animations.frame === self.walkToIdleEnd );
	});
	this.fsm.transition('walkToIdle1_to_fall', 'walkToIdle1', 'fall', function(){
		return ( self.checkIfFalling() );
	});
	this.fsm.transition('walkToIdle1_to_jump', 'walkToIdle1', 'jump', function(){
		return ( self.checkIfJumping() );
	});

	// If the player reaches the peak of their jump when jumping
	this.fsm.transition('jump_to_jumpToFall', 'jump', 'jumpToFall', function(){
		return ( self.player.body.velocity.y*-1*self.player.body.data.gravityScale < 40 && self.player.body.velocity.y*-1*self.player.body.data.gravityScale > 5 );
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
		return ( self.animations.frame === self.landEnd && self.checkIfStopMoving() );
	});
	// If the player reaches the end of the land animation and does provide keyboard input
	this.fsm.transition('land_to_landToWalk', 'land', 'landToWalk', function(){
		return ( self.animations.frame === self.landEnd && self.checkIfMoving() );
	});

	this.fsm.transition('landToIdle_to_idle', 'landToIdle', 'idle', function(){
		return ( self.animations.frame === self.landToIdleEnd );
	});
	this.fsm.transition('landToIdle_to_idleToWalk', 'landToIdle', 'idleToWalk', function(){
		return ( self.checkIfMoving() );
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



	this.idleTimer++;
}

PlayerFSM.prototype.checkIfFalling = function(){
	if(Math.abs( this.player.body.velocity.y ) > 15 && this.isJumping === false){
		this.resetIdleTimer();
		return true;
	}
	return false;
}

PlayerFSM.prototype.checkIfJumping = function(){
	if(this.isJumping === true){
		this.isJumping = false;
		this.resetIdleTimer();
		return true;
	}
	return false;
}

PlayerFSM.prototype.checkIfLanded = function(){
	if( this.player.checkIfCanJump() ){
		this.resetIdleTimer();
		return true;
	}
	return false;
}

PlayerFSM.prototype.checkIfMoving = function(){
	if( this.isMoving === true ){
		this.resetIdleTimer();
		return true;
	}
	return false;
}

PlayerFSM.prototype.checkIfStopMoving = function(){
	if( this.isMoving === false ){
		this.resetIdleTimer();
		return true;
	}
	return false;
}

PlayerFSM.prototype.debugPrintAnimationIndices = function(animationEndFrames){
    var atlas = game.cache.getJSON('playerAnimations');

    var jumpToFallIndex, landIndex, landToWalkIndex, landToIdleIndex, idleToWalkIndex, idleToFallIndex, walkToIdle1Index, ceilingCollideIndex, fidgetStretchIndex, fidgetYawnIndex;

	var frames = atlas.frames;
	var file = "PG Cat 6";
	for(let i = 0; i < frames.length; i++){
		if(frames[i].filename === file + "-JumpToFall-" + animationEndFrames.jumpToFall){
			var jumpToFallIndex = i;
		}
		else if(frames[i].filename === file + "-Land-" + animationEndFrames.land){
			var landIndex = i;
		}
		else if(frames[i].filename === file + "-LandToWalk-" + animationEndFrames.landToWalk){
			var landToWalkIndex = i;
		}
		else if(frames[i].filename === file + "-LandToIdle-" + animationEndFrames.landToIdle){
			var landToIdleIndex = i;
		}
		else if(frames[i].filename === file + "-IdleToWalk-" + animationEndFrames.idleToWalk){
			var idleToWalkIndex = i;
		}
		else if(frames[i].filename === file + "-IdleToFall-" + animationEndFrames.idleToFall){
			var idleToFallIndex = i;
		}
		else if(frames[i].filename === file + "-WalkToIdle1-" + animationEndFrames.walkToIdle1){
			var walkToIdle1Index = i;
		}
		else if(frames[i].filename === file + "-CeilingCollide-" + animationEndFrames.ceilingCollide){
			var ceilingCollideIndex = i;
		}
		else if(frames[i].filename === file + "-FidgetStretch-" + animationEndFrames.fidgetStretch){
			var fidgetStretchIndex = i;
		}
		else if(frames[i].filename === file + "-FidgetYawn-" + animationEndFrames.fidgetYawn){
			var fidgetYawnIndex = i;
		}
	}

	console.log("jumpToFall = " + jumpToFallIndex);
	console.log("land = " + landIndex);
	console.log("landToWalk = " + landToWalkIndex);
	console.log("landToIdle = " + landToIdleIndex);
	console.log("idleToWalk = " + idleToWalkIndex);
	console.log("idleToFall = " + idleToFallIndex);
	console.log("walkToIdle1 = " + walkToIdle1Index);
	console.log("ceilingCollide = " + ceilingCollideIndex);
	console.log("fidgetStretch = " + fidgetStretchIndex);
	console.log("fidgetYawn = " + fidgetYawnIndex);
}

PlayerFSM.prototype.resetIdleTimer = function(){
	this.idleTimer = 0;
}