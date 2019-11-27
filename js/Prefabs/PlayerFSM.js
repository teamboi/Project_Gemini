// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for PlayerFSM
function PlayerFSM(game, gameplay, player, x, y, whichPlayer){

	// Names of animation states
	this.animNames = [
	"walk",
	"jump",
	"idle",
	"fall",
	"idleToFall",
	"jumpToFall",
	"land",
	"landToIdle",
	"landToWalk",
	"idleToWalk",
	"walkToIdle1",
	"walkToIdle2",
	"walkToIdle3",
	"walkToIdle4",
	"ceilingCollide",
	"fidgetStretch",
	"fidgetYawn"
	];

	// Not actual animation states
	// breakpoints within other animation states
	this.extraAnimPointNames = [
	"walk1",
	"walk2",
	"walk3",
	"walk4"
	]

	// Object storing various data on animation states
	// Single digit numbers for length need to be formatted in "0#"
	// for frame name data
	this.animData = {
		// looping animations
		walk:			{length: 19,	end: 202,	fps: 50},
		jump:			{length: "09",	end: 140,	fps: 30},
		idle:			{length: 19,	end: 122,	fps: 30},
		fall:			{length: "09",	end: 17,	fps: 30},

		// single=cycle animations
		idleToFall:		{length: "03",	end: 126,	fps: 30},
		jumpToFall:		{length: 19,	end: 160,	fps: 30},
		land:			{length: "03",	end: 164,	fps: 30},
		landToIdle:		{length: 11,	end: 176,	fps: 30},
		landToWalk:		{length: "05",	end: 182,	fps: 30},
		idleToWalk:		{length: "03",	end: 130,	fps: 30},
		walkToIdle1:	{length: 25,	end: 228,	fps: 30},
		walkToIdle2:	{length: 25,	end: 249,	fps: 30},
		walkToIdle3:	{length: 25,	end: 267,	fps: 30},
		walkToIdle4:	{length: 25,	end: 305,	fps: 30},
		ceilingCollide:	{length: "07",	end: 7,		fps: 30},
		fidgetStretch:	{length: 44,	end: 62,	fps: 30},
		fidgetYawn:		{length: 39,	end: 102,	fps: 30},

		// walkToIdle beginning frames; these aren't actual states
		walk1:			{begin: "00",	end: 183, 	anim: "walk"},
		walk2:			{begin: "05",	end: 188, 	anim: "walk"},
		walk3:			{begin: 10,		end: 193, 	anim: "walk"},
		walk4:			{begin: 15,		end: 198, 	anim: "walk"}
	}

	var key;
	var debugBool = false;
	if(whichPlayer === 1){
		key = "cat1";
		if(debugAnimation === true){
			debugBool = true;
			this.debugPrintAnimationIndices();
		}
	}
	else{
		key = "cat2";
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
	this.idleAnimPicked = 0; // var for which idle animation to play; 0 is none

	// Add in the animation frames by name
	var file = "PG Cat 6";
	for(let i = 0; i < this.animNames.length; i++){
		var anim = this.animNames[i];
		var data = this.animData[anim];
		
		// generateFrameNames(prefix, start, stop, suffix, howManyDigitsForIndices)
		this.animations.add(anim, Phaser.Animation.generateFrameNames(file + '-' + anim + '-',0, data.length,'',2), data.fps, true);
	}

	// Creates a new FSM
	this.fsm = new StateMachine(this, {debug: debugBool});

	// Reference to self that can be referenced in FSM
	var self = this;

	// Create states
	for(let i = 0; i < this.animNames.length; i++){
		self.createAnimState(this.animNames[i]);
	}

	// create shorthand for this.animData
	var data = this.animData;

	// Create transitions
	// If the player is moving when idle
	self.createMoveAnimTransition('idle');
	self.createJumpAnimTransition("idle");
	this.fsm.transition('idle_to_idleToFall', 'idle', 'idleToFall', function(){
		return ( self.checkIfFalling() );
	});

	self.createNextAnimTransition('idleToFall', 'fall');

	self.createNextAnimTransition('idleToWalk', 'walk');
	self.createJumpAnimTransition("idleToWalk");
	self.createFallAnimTransition("idleToWalk");

	// If the player stops moving when walking
	this.fsm.transition('walk_to_walkToIdle1', 'walk', 'walkToIdle1', function(){
		return ( self.checkIfStopMoving() &&  self.animations.frame === data.walk1.end );
	});
	this.fsm.transition('walk_to_walkToIdle2', 'walk', 'walkToIdle2', function(){
		return ( self.checkIfStopMoving() &&  self.animations.frame === data.walk2.end );
	});
	this.fsm.transition('walk_to_walkToIdle3', 'walk', 'walkToIdle3', function(){
		return ( self.checkIfStopMoving() &&  self.animations.frame === data.walk3.end );
	});
	this.fsm.transition('walk_to_walkToIdle4', 'walk', 'walkToIdle4', function(){
		return ( self.checkIfStopMoving() &&  self.animations.frame === data.walk4.end );
	});
	self.createJumpAnimTransition("walk");
	self.createFallAnimTransition("walk");

	self.createNextAnimTransition('walkToIdle1', 'idle');
	self.createMoveAnimTransition('walkToIdle1');
	self.createJumpAnimTransition("walkToIdle1");
	self.createFallAnimTransition("walkToIdle1");

	self.createNextAnimTransition('walkToIdle2', 'idle');
	self.createMoveAnimTransition('walkToIdle2');
	self.createJumpAnimTransition("walkToIdle2");
	self.createFallAnimTransition("walkToIdle2");

	self.createNextAnimTransition('walkToIdle3', 'idle');
	self.createMoveAnimTransition('walkToIdle3');
	self.createJumpAnimTransition("walkToIdle3");
	self.createFallAnimTransition("walkToIdle3");

	self.createNextAnimTransition('walkToIdle4', 'idle');
	self.createMoveAnimTransition('walkToIdle4');
	self.createJumpAnimTransition("walkToIdle4");
	self.createFallAnimTransition("walkToIdle4");

	// If the player reaches the peak of their jump when jumping
	this.fsm.transition('jump_to_jumpToFall', 'jump', 'jumpToFall', function(){
		return ( self.player.body.velocity.y*-1*self.player.body.data.gravityScale < 40
			&& self.player.body.velocity.y*-1*self.player.body.data.gravityScale > 5 );
	});
	this.fsm.transition('jump_to_ceilingCollide', 'jump', 'ceilingCollide', function(){
		return ( self.player.body.velocity.y*-1*self.player.body.data.gravityScale <= 5 );
	});

	self.createJumpAnimTransition("ceilingCollide");
	self.createNextAnimTransition("ceilingCollide", "fall");
	self.createLandAnimTransition("ceilingCollide");

	// If the player reaches the end of the jumpToFall animation
	self.createNextAnimTransition('jumpToFall', 'fall');
	// If the player touches the ground before the end of the jumpToFall animation
	self.createLandAnimTransition("jumpToFall");

	// If the player touches the ground when falling
	self.createLandAnimTransition("fall");

	// If the player jumps before the end of the land animation
	self.createJumpAnimTransition("land");
	// If the player reaches the end of the land animation and doesn't provide keyboard input
	this.fsm.transition('land_to_landToIdle', 'land', 'landToIdle', function(){
		return ( self.animations.frame === data.land.end && self.checkIfStopMoving() );
	});
	// If the player reaches the end of the land animation and does provide keyboard input
	this.fsm.transition('land_to_landToWalk', 'land', 'landToWalk', function(){
		return ( self.animations.frame === data.land.end && self.checkIfMoving() );
	});

	self.createNextAnimTransition('landToIdle', 'idle')
	self.createMoveAnimTransition("landToIdle");
	self.createJumpAnimTransition("landToIdle");
	self.createFallAnimTransition("landToIdle");

	self.createNextAnimTransition('landToWalk', 'walk')
	self.createJumpAnimTransition("landToWalk");
	self.createFallAnimTransition("landToWalk");

	self.createFidgetAnimTransitions("fidgetStretch", 1);
	self.createFidgetAnimTransitions("fidgetYawn", 2);

	// Plays the initial state
	this.animations.play(self.fsm.initialState);
}

// inherit prototype from Phaser.Sprite and set constructor to PlayerFSM
PlayerFSM.prototype = Object.create(Phaser.Sprite.prototype);
PlayerFSM.prototype.constructor = PlayerFSM;

// Updates the FSM
PlayerFSM.prototype.update = function(){
	this.fsm.update();

	this.updateIdleTimer();
}

// If condition for if the player is falling
PlayerFSM.prototype.checkIfFalling = function(){
	if(Math.abs( this.player.body.velocity.y ) > 80 && this.isJumping === false){
		this.resetIdleTimer();
		return true;
	}
	return false;
}

// If condition for if the idle animation is done
PlayerFSM.prototype.checkIfIdleDone = function(endFrame){
	if( this.animations.frame === endFrame ){
		this.resetIdleTimer();
		return true;
	}
	return false;
}

// If condition for if it's a valid time to play the idle animation
PlayerFSM.prototype.checkToPlayIdleAnim = function(animNum){
	if(this.idleAnimPicked === animNum  && this.animations.frame === this.animData.idle.end){
		this.idleAnimPicked = 0;
		return true;
	}
	return false;
}

// If condition for if the player is jumping
PlayerFSM.prototype.checkIfJumping = function(){
	if(this.isJumping === true){
		this.isJumping = false;
		this.resetIdleTimer();
		return true;
	}
	return false;
}

// If condition for if the player has landed on the ground
PlayerFSM.prototype.checkIfLanded = function(){
	if( this.player.checkIfCanJump() ){
		this.resetIdleTimer();
		return true;
	}
	return false;
}

// If condition for if the player is moving
PlayerFSM.prototype.checkIfMoving = function(){
	if( this.isMoving === true ){
		this.resetIdleTimer();
		return true;
	}
	return false;
}

// If condition for if the player has stopped moving
PlayerFSM.prototype.checkIfStopMoving = function(){
	if( this.isMoving === false ){
		this.resetIdleTimer();
		return true;
	}
	return false;
}

// Creates the animation state for the FSM
PlayerFSM.prototype.createAnimState = function(animState){
	this.fsm.state(animState, {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});
}

// Creates the fidget animation transitions
// animID is an arbitrary number for choosing random numbers
PlayerFSM.prototype.createFidgetAnimTransitions = function(animName, animID){
	var self = this;

	this.fsm.transition('idle_to_' + animName, 'idle', animName, function(){
		return ( self.checkToPlayIdleAnim(animID) );
	});
	this.fsm.transition(animName + '_to_idle', animName, 'idle', function(){
		return ( self.checkIfIdleDone(self.animData[animName].end) );
	});
	this.fsm.transition(animName + '_to_idleToWalk', animName, 'idleToWalk', function(){
		return ( self.checkIfMoving() );
	});
	this.fsm.transition(animName + '_to_jump', animName, 'jump', function(){
		return ( self.checkIfJumping() );
	});
	this.fsm.transition(animName + '_to_idleToFall', animName, 'idleToFall', function(){
		return ( self.checkIfFalling() );
	});
}

// Creates the animation transition from animName to fall
PlayerFSM.prototype.createFallAnimTransition = function(animName){
	var self = this;

	this.fsm.transition(animName + '_to_fall', animName, 'fall', function(){
		return ( self.checkIfFalling() );
	});
}

// Creates the animation transition from animName to jump
PlayerFSM.prototype.createJumpAnimTransition = function(animName){
	var self = this;

	this.fsm.transition(animName + '_to_jump', animName, 'jump', function(){
		return ( self.checkIfJumping() );
	});
}

// Creates the animation transition from animName to land
PlayerFSM.prototype.createLandAnimTransition = function(animName){
	var self = this;

	this.fsm.transition(animName + '_to_land', animName, 'land', function(){
		return ( self.checkIfLanded() );
	});
}

// Creates the animation transition from animName to idleToWalk
PlayerFSM.prototype.createMoveAnimTransition = function(animName){
	var self = this;

	this.fsm.transition(animName + '_to_idleToWalk', animName, 'idleToWalk', function(){
		return ( self.checkIfMoving() );
	});
}

// Creates the animation transition for single-cycle animations to progress to the next animation
PlayerFSM.prototype.createNextAnimTransition = function(firstAnimName, nextAnimName){
	var self = this;

	this.fsm.transition(firstAnimName + '_to_' + nextAnimName, firstAnimName, nextAnimName, function(){
		return ( self.animations.frame === self.animData[firstAnimName].end );
	});
}

// Prints out the indices of the end of animation states
PlayerFSM.prototype.debugPrintAnimationIndices = function(){
    var atlas = game.cache.getJSON('playerAnimations');
	var frames = atlas.frames;

	var file = "PG Cat 6";
	var anyChanges = false;
	for(let i = 0; i < frames.length; i++){
		for(let j = 0; j < this.animNames.length; j++){
			var anim = this.animNames[j];
			var data = this.animData[anim];
			if(frames[i].filename === file + "-" + anim + "-" + data.length){
				var oldData = data.end;
				data.end = i;

				if(oldData != data.end){
					console.log("changed " + anim + " from " + oldData + " to " + data.end);
					anyChanges = true;
				}

				break;
			}
		}
		for(let j = 0; j < this.extraAnimPointNames.length; j++){
			var anim = this.extraAnimPointNames[j];
			var data = this.animData[anim];
			if(frames[i].filename === file + "-" + data.anim + "-" + data.begin){
				var oldData = data.end;
				data.end = i;

				if(oldData != data.end){
					console.log("changed " + anim + " from " + oldData + " to " + data.end);
					anyChanges = true;
				}

				break;
			}
		}
	}

	if(anyChanges === false){
		console.log("All end indices up to date");
		return;
	}

	for(let i = 0; i < this.animNames.length; i++){
		var anim = this.animNames[i];
		var data = this.animData[anim];
		
		console.log(anim + " = " + data.end);
	}

	for(let i = 0; i < this.extraAnimPointNames.length; i++){
		var anim = this.extraAnimPointNames[i];
		var data = this.animData[anim];
		
		console.log(anim + " = " + data.end);
	}
}

// Resets the timer for idle animations
PlayerFSM.prototype.resetIdleTimer = function(){
	this.idleTimer = 0;
	this.idleAnimPicked = 0;
}

// Updates the timer for idle animations
PlayerFSM.prototype.updateIdleTimer = function(){
	if(this.isMoving === true){
		return;
	}

	var idleAnimTotal = 2;
	if(this.idleTimer > 200){
		this.idleAnimPicked = Math.ceil( Math.random() * idleAnimTotal );
		this.idleTimer = 0;
	}

	this.idleTimer++;
}