// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for PlayerFSM
function PlayerFSM(game, gameplay, player, x, y, whichPlayer){

	// Name of the file for animations
	this.file = "PG Cat This";

	// Names of animation states
	this.animNames = [
	"walk",
	"jump",
	"idle",
	"fall",
	"idleOnCeiling",
	"walkOnCeiling",
	"idleToFall",
	"jumpToFall",
	"land",
	"landToIdle",
	"landToWalk",
	"idleToWalk",
	"walkToIdleA",
	"walkToIdleB",
	"walkToIdleC",
	"walkToIdleD",
	"idleToWalkOnCeiling",
	"walkToIdleOnCeilingA",
	"walkToIdleOnCeilingB",
	"idleOnCeilingToFall",
	"walkOnCeilingToFall",
	"fallToIdleOnCeiling",
	"fallToWalkOnCeiling",
	"ceilingCollideToIdleOnCeiling",
	"ceilingCollideToWalkOnCeiling",
	"ceilingCollide",
	"fidgetStretch",
	"fidgetYawn",
	"fidgetTippyTaps"
	];

	// Not actual animation states
	// breakpoints within other animation states
	this.extraAnimPointNames = [
	"ceilingCollideA",
	"walkA",
	"walkB",
	"walkC",
	"walkD",
	"walkOnCeilingA",
	"walkOnCeilingB"
	]

	// Object storing various data on animation states
	// Single digit numbers for length need to be formatted in "0#"
	// for frame name data
	this.animData = {
		// looping animations
		walk:							{length: 19,	end: 359,	fps: 50},
		jump:							{length: "09",	end: 223,	fps: 30},
		idle:							{length: 19,	end: 198,	fps: 30},
		fall:							{length: "09",	end: 17,	fps: 30},
		idleOnCeiling:					{length: 29,	end: 231,	fps: 30},
		walkOnCeiling:					{length: 11,	end: 363,	fps: 30},

		// single cycle animations
		idleToFall:						{length: "03",	end: 213,	fps: 30},
		jumpToFall:						{length: 19,	end: 348,	fps: 30},
		land:							{length: "03",	end: 257,	fps: 30},
		landToIdle:						{length: 11,	end: 170,	fps: 30},
		landToWalk:						{length: "05",	end: 177,	fps: 30},
		idleToWalk:						{length: "03",	end: 217,	fps: 30},
		walkToIdleA:					{length: 25,	end: 378,	fps: 30},
		walkToIdleB:					{length: 25,	end: 390,	fps: 30},
		walkToIdleC:					{length: 25,	end: 405,	fps: 30},
		walkToIdleD:					{length: 25,	end: 321,	fps: 30},
		idleToWalkOnCeiling:			{length: "03",	end: 10,	fps: 30},
		walkToIdleOnCeilingA:			{length: 29,	end: 10,	fps: 30},
		walkToIdleOnCeilingB:			{length: 29,	end: 10,	fps: 30},
		idleOnCeilingToFall:			{length: "03",	end: 10,	fps: 30},
		walkOnCeilingToFall:			{length: "03",	end: 10,	fps: 30},
		fallToIdleOnCeiling:			{length: 29,	end: 10,	fps: 30},
		fallToWalkOnCeiling:			{length: "03",	end: 10,	fps: 30},
		ceilingCollideToIdleOnCeiling:	{length: 29,	end: 10,	fps: 30},
		ceilingCollideToWalkOnCeiling:	{length: "03",	end: 10,	fps: 30},
		ceilingCollide:					{length: "07",	end: 7,		fps: 30},
		fidgetStretch:					{length: 44,	end: 162,	fps: 30},
		fidgetYawn:						{length: 39,	end: 166,	fps: 30},
		fidgetTippyTaps:				{length: 59,	end: 166,	fps: 30},

		// cycle animation interuption beginning frames
		// these aren't actual states
		ceilingCollideA:{begin: "02",	end: 207, 	anim: "ceilingCollide"},
		walkA:			{begin: "00",	end: 207, 	anim: "walk"},
		walkB:			{begin: "05",	end: 209, 	anim: "walk"},
		walkC:			{begin: 10,		end: 355, 	anim: "walk"},
		walkD:			{begin: 15,		end: 357, 	anim: "walk"},
		walkOnCeilingA:	{begin: "00",	end: 357, 	anim: "walkOnCeiling"},
		walkOnCeilingB:	{begin: "06",	end: 357, 	anim: "walkOnCeiling"}
	}

	var key, animJson;
	var debugBool = false;
	if(whichPlayer === 1){
		key = "cat1";
		animJson = "redCatAnimations";
		debugBool = debugAnimation;
	}
	else{
		key = "cat2";
		animJson = "blueCatAnimations";
	}
	this.updateAnimationIndices(animJson);

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
	this.blinkTimer = 0; // var for the timer for blinking

	this.fallVelocity = 5; // var for what velocity to check for if falling // It changes depending on context
	this.fallTimer = 0; // var for the timer for changing the fallVelocity const
	this.hasFinishedLanding = false; // var for if the player has finished landing
	// The player when landing tends to have massive fluctuations in the y velocity

	// Creates a new FSM
	this.fsm = new StateMachine(this, {debug: debugBool});

	// Reference to self that can be referenced in FSM
	var self = this;

	// Add in the animation frames by name and create the anim States
	for(let i = 0; i < this.animNames.length; i++){
		var anim = this.animNames[i];
		var data = this.animData[anim];
		
		// generateFrameNames(prefix, start, stop, suffix, howManyDigitsForIndices)
		this.animations.add(anim, Phaser.Animation.generateFrameNames(this.file + '-' + anim + '-',0, data.length,'',2), data.fps, true);
		self.createAnimState(this.animNames[i]);
	}

	// create shorthand for this.animData
	var data = this.animData;

	// Create transitions
	// Idle
	self.createMoveAnimTransition('idle', "idleToWalk");
	self.createJumpAnimTransition("idle");
	self.createFallAnimTransition('idle', 'idleToFall');

		// idleToFall
		self.createNextAnimTransition('idleToFall', 'fall');

		// idleToWalk
		self.createNextAnimTransition('idleToWalk', 'walk');
		self.createJumpAnimTransition("idleToWalk");
		self.createFallAnimTransition("idleToWalk", "fall");

	// walk
	this.fsm.transition('walk_to_walkToIdleA', 'walk', 'walkToIdleA', function(){
		return ( self.checkIfStopMoving() &&  self.animations.frame === data.walkA.end );
	});
	this.fsm.transition('walk_to_walkToIdleB', 'walk', 'walkToIdleB', function(){
		return ( self.checkIfStopMoving() &&  self.animations.frame === data.walkB.end );
	});
	this.fsm.transition('walk_to_walkToIdleC', 'walk', 'walkToIdleC', function(){
		return ( self.checkIfStopMoving() &&  self.animations.frame === data.walkC.end );
	});
	this.fsm.transition('walk_to_walkToIdleD', 'walk', 'walkToIdleD', function(){
		return ( self.checkIfStopMoving() &&  self.animations.frame === data.walkD.end );
	});
	self.createJumpAnimTransition("walk");
	self.createFallAnimTransition("walk", "fall");

		// walkToIdle
		self.createNextAnimTransition('walkToIdleA', 'idle');
		self.createMoveAnimTransition('walkToIdleA', "idleToWalk");
		self.createJumpAnimTransition("walkToIdleA");
		self.createFallAnimTransition("walkToIdleA", "idleToFall");

		self.createNextAnimTransition('walkToIdleB', 'idle');
		self.createMoveAnimTransition('walkToIdleB', "idleToWalk");
		self.createJumpAnimTransition("walkToIdleB");
		self.createFallAnimTransition("walkToIdleB", "idleToFall");

		self.createNextAnimTransition('walkToIdleC', 'idle');
		self.createMoveAnimTransition('walkToIdleC', "idleToWalk");
		self.createJumpAnimTransition("walkToIdleC");
		self.createFallAnimTransition("walkToIdleC", "idleToFall");

		self.createNextAnimTransition('walkToIdleD', 'idle');
		self.createMoveAnimTransition('walkToIdleD', "idleToWalk");
		self.createJumpAnimTransition("walkToIdleD");
		self.createFallAnimTransition("walkToIdleD", "idleToFall");

	// jump
	this.fsm.transition('jump_to_jumpToFall', 'jump', 'jumpToFall', function(){
		return ( self.player.body.velocity.y*-1*self.player.body.data.gravityScale < 40
			&& self.player.body.velocity.y*-1*self.player.body.data.gravityScale > 5 );
	});
	this.fsm.transition('jump_to_ceilingCollide', 'jump', 'ceilingCollide', function(){
		return ( self.checkIfOnCeiling() ); //self.player.body.velocity.y*-1*self.player.body.data.gravityScale <= 5
	});

	// ceilingCollide
	self.createNextAnimTransition("ceilingCollide", "fall");
	self.createLandAnimTransition("ceilingCollide");
	this.fsm.transition('ceilingCollide_to_ceilingCollideToIdleOnCeiling', 'ceilingCollide', 'ceilingCollideToIdleOnCeiling', function(){
		return ( self.checkIfOnCeiling() &&
				 self.player.whichPlayer != self.gameplay.yarn.anchored &&
				 !self.checkIfMoving() &&
				 self.animations.frame === data.ceilingCollideA.end);
	});
	this.fsm.transition('ceilingCollide_to_ceilingCollideToWalkOnCeiling', 'ceilingCollide', 'ceilingCollideToWalkOnCeiling', function(){
		return ( self.checkIfOnCeiling() &&
				 self.player.whichPlayer != self.gameplay.yarn.anchored &&
				 self.checkIfMoving() &&
				 self.animations.frame === data.ceilingCollideA.end);
	});

		// jumpToFall
		// If the player reaches the end of the jumpToFall animation
		self.createNextAnimTransition('jumpToFall', 'fall');
		// If the player touches the ground before the end of the jumpToFall animation
		self.createLandAnimTransition("jumpToFall");
		this.fsm.transition('jumpToFall_to_fallToIdleOnCeiling', 'jumpToFall', 'fallToIdleOnCeiling', function(){
			return ( self.checkIfOnCeiling() &&
					 self.player.whichPlayer != self.gameplay.yarn.anchored &&
					 !self.checkIfMoving());
		});
		this.fsm.transition('jumpToFall_to_fallToWalkOnCeiling', 'jumpToFall', 'fallToWalkOnCeiling', function(){
			return ( self.checkIfOnCeiling() &&
					 self.player.whichPlayer != self.gameplay.yarn.anchored &&
					 self.checkIfMoving());
		});

	// fall
	// If the player touches the ground when falling
	self.createLandAnimTransition("fall");
	this.fsm.transition('fall_to_fallToIdleOnCeiling', 'fall', 'fallToIdleOnCeiling', function(){
		return ( self.checkIfOnCeiling() &&
				 self.player.whichPlayer != self.gameplay.yarn.anchored &&
				 !self.checkIfMoving());
	});
	this.fsm.transition('fall_to_fallToWalkOnCeiling', 'fall', 'fallToWalkOnCeiling', function(){
		return ( self.checkIfOnCeiling() &&
				 self.player.whichPlayer != self.gameplay.yarn.anchored &&
				 self.checkIfMoving());
	});

	// idleOnCeiling
	this.fsm.transition('idleOnCeiling_to_idleOnCeilngToFall', 'idleOnCeiling', 'idleOnCeilingToFall', function(){
		return ( !self.checkIfOnCeiling() );
	});
	self.createMoveAnimTransition('idleOnCeiling', 'idleToWalkOnCeiling');

	//walkOnCeiling
	this.fsm.transition('walkOnCeiling_to_walkOnCeilingToFall', 'walkOnCeiling', 'walkOnCeilingToFall', function(){
		return ( !self.checkIfOnCeiling() );
	});
	this.fsm.transition('walkOnCeiling_to_walkToIdleOnCeilingA', 'walkOnCeiling', 'walkToIdleOnCeilingA', function(){
		return ( !self.checkIfMoving() && self.animations.frame === data.walkOnCeilingA.end);
	});
	this.fsm.transition('walkOnCeiling_to_walkToIdleOnCeilingB', 'walkOnCeiling', 'walkToIdleOnCeilingB', function(){
		return ( !self.checkIfMoving() && self.animations.frame === data.walkOnCeilingB.end);
	});

		//States that enter onCeiling
		// fallToIdleOnCeiling
		self.createNextAnimTransition("fallToIdleOnCeiling", "idleOnCeiling");
		self.createFallAnimTransition("fallToIdleOnCeiling", "idleOnCeilingToFall");
		self.createMoveAnimTransition('fallToIdleOnCeiling', 'idleToWalkOnCeiling');

		// fallToWalkOnCeiling
		self.createNextAnimTransition("fallToWalkOnCeiling", "walkOnCeiling");
		self.createFallAnimTransition("fallToWalkOnCeiling", "walkOnCeilingToFall");

		// ceilingCollideToIdleOnCeiling
		self.createNextAnimTransition("ceilingCollideToIdleOnCeiling", "idleOnCeiling");
		self.createFallAnimTransition("ceilingCollideToIdleOnCeiling", "idleOnCeilingToFall");
		self.createMoveAnimTransition('ceilingCollideToIdleOnCeiling', 'idleToWalkOnCeiling');

		// ceilingCollideToWalkOnCeiling
		self.createNextAnimTransition("ceilingCollideToWalkOnCeiling", "walkOnCeiling");
		self.createFallAnimTransition("ceilingCollideToWalkOnCeiling", "walkOnCeilingToFall");

		// onCeiling states
		// idleToWalkOnCeiling
		self.createNextAnimTransition("idleToWalkOnCeiling", "walkOnCeiling");
		self.createFallAnimTransition("idleToWalkOnCeiling", "walkOnCeilingToFall");

		// walkToIdleOnCeilingA
		self.createNextAnimTransition("walkToIdleOnCeilingA", "idleOnCeiling");
		self.createFallAnimTransition("walkToIdleOnCeilingA", "idleOnCeilingToFall");
		self.createMoveAnimTransition('walkToIdleOnCeilingA', 'idleToWalkOnCeiling');

		// walkToIdleOnCeilingB
		self.createNextAnimTransition("walkToIdleOnCeilingB", "idleOnCeiling");
		self.createFallAnimTransition("walkToIdleOnCeilingB", "idleOnCeilingToFall");
		self.createMoveAnimTransition('walkToIdleOnCeilingB', 'idleToWalkOnCeiling');

		// states that exit onCeiling
		// idleOnCeilngToFall
		self.createNextAnimTransition("idleOnCeilingToFall", "fall");
		this.fsm.transition("idleOnCeilingToFall_to_idleOnCeiling", "idleOnCeilingToFall", "idleOnCeiling", function(){
			return ( self.checkIfOnCeiling() && self.player.whichPlayer != self.gameplay.yarn.anchored );
		});

		// walkOnCeilingToFall
		self.createNextAnimTransition("walkOnCeilingToFall", "fall");
		this.fsm.transition("walkOnCeilingToFall_to_walkOnCeiling", "walkOnCeilingToFall", "walkOnCeiling", function(){
			return ( self.checkIfOnCeiling() && self.player.whichPlayer != self.gameplay.yarn.anchored );
		});

	// land
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

		// landToIdle
		self.createNextAnimTransition('landToIdle', 'idle')
		self.createMoveAnimTransition("landToIdle", "idleToWalk");
		self.createJumpAnimTransition("landToIdle");
		self.createFallAnimTransition("landToIdle", "idleToFall");

		// landToWalk
		self.createNextAnimTransition('landToWalk', 'walk')
		self.createJumpAnimTransition("landToWalk");
		self.createFallAnimTransition("landToWalk", "fall");

	self.createFidgetAnimTransitions("fidgetStretch", 1);
	self.createFidgetAnimTransitions("fidgetYawn", 2);
	self.createFidgetAnimTransitions("fidgetTippyTaps", 3);

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
	if(Math.abs( this.player.body.velocity.y ) > 80 && this.isJumping === false){ // !this.player.checkIfCanJump()
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

// If condition for if the player is on the ceiling
PlayerFSM.prototype.checkIfOnCeiling = function(){
	if( this.player.checkIfOnRoof() ){
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
PlayerFSM.prototype.createFallAnimTransition = function(animName, fallAnimName){
	var self = this;

	this.fsm.transition(animName + '_to_' + fallAnimName, animName, fallAnimName, function(){
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
PlayerFSM.prototype.createMoveAnimTransition = function(animName, moveAnimName){
	var self = this;

	this.fsm.transition(animName + '_to_' + moveAnimName, animName, moveAnimName, function(){
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

// Resets the timer for blink animations
PlayerFSM.prototype.resetBlinkTimer = function(){
	this.blinkTimer = 0;
}

PlayerFSM.prototype.resetFallTimer = function(){
	this.fallTimer = 0;
}

// Resets the timer for idle animations
PlayerFSM.prototype.resetIdleTimer = function(){
	this.idleTimer = 0;
	this.idleAnimPicked = 0;
}

// Updates the timer for blink animations
PlayerFSM.prototype.updateBlinkTimer = function(){
	this.blinkTimer++;
}

PlayerFSM.prototype.updateFallTimer = function(){
	this.fallTimer++;
}

// Updates the timer for fidget animations
PlayerFSM.prototype.updateIdleTimer = function(){
	if(this.isMoving === true){
		return;
	}

	var idleAnimTotal = 3;
	if(this.idleTimer > 200){
		this.idleAnimPicked = Math.ceil( Math.random() * idleAnimTotal );
		this.idleTimer = 0;
	}

	this.idleTimer++;
}

// Updates the indices of the end of animation states
PlayerFSM.prototype.updateAnimationIndices = function(animJson){
	var atlas = game.cache.getJSON(animJson);
	var frames = atlas.frames;

	var anyChanges = false;
	for(let i = 0; i < frames.length; i++){
		for(let j = 0; j < this.animNames.length; j++){
			var anim = this.animNames[j];
			var data = this.animData[anim];

			if(frames[i].filename === this.file + "-" + anim + "-" + data.length){
				var oldData = data.end;
				data.end = i;

				if(oldData != data.end){
					if(debugAnimation) console.log("changed " + anim + " from " + oldData + " to " + data.end);
					anyChanges = true;
				}

				break;
			}
		}
		for(let j = 0; j < this.extraAnimPointNames.length; j++){
			var anim = this.extraAnimPointNames[j];
			var data = this.animData[anim];
			if(frames[i].filename === this.file + "-" + data.anim + "-" + data.begin){
				var oldData = data.end;
				data.end = i;

				if(oldData != data.end){
					if(debugAnimation) console.log("changed " + anim + " from " + oldData + " to " + data.end);
					anyChanges = true;
				}

				break;
			}
		}
	}

	if(!debugAnimation) return;

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