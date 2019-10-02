// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for PlayerFSM
function PlayerFSM(game, gameplay, player, x, y, whichPlayer){

	// The length of each animation
	// Used to determine the endpoints of each animation
	this.animationLengths = {
		// looping animations
		walk: 19,
		jump: "09",
		idle: 19,
		fall: "09",

		// walkToIdle beginning frames
		walk1: "00",
		walk2: "05",
		walk3: 10,
		walk4: 15,

		// single-cycle animations
		idleToFall: "03",
		jumpToFall: 19,
		land: "03",
		landToIdle: 11,
		landToWalk: "05",
		idleToWalk: "03",
		walkToIdle1: 25,
		walkToIdle2: 25,
		walkToIdle3: 25,
		walkToIdle4: 25,
		ceilingCollide: "07",
		fidgetStretch: 44,
		fidgetYawn: 39
	}

	// The indices of the end of each animation in the array
	this.animationEndIndices = {
		// looping animations
		walk: 0,
		jump: 0,
		idle: 122,
		fall: 0,

		// walkToIdle End frames
		walk1: 183,
		walk2: 188,
		walk3: 193,
		walk4: 198,

		// single-cycle animations
		idleToFall: 126,
		jumpToFall: 160,
		land: 164,
		landToIdle: 176,
		landToWalk: 182,
		idleToWalk: 130,
		walkToIdle1: 228,
		walkToIdle2: 254,
		walkToIdle3: 280,
		walkToIdle4: 306,
		ceilingCollide: 7,
		fidgetStretch: 62,
		fidgetYawn: 102
	}

	var key, debugBool;
	if(whichPlayer === 1){
		key = "cat1";
		if(debugAnimation === true){
			debugBool = true;
			console.log(this.animationEndIndices);
			this.animationEndIndices = this.debugPrintAnimationIndices(this.animationLengths, this.animationEndIndices);
			console.log(this.animationEndIndices);
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
	this.idleAnimPicked = 0; // var for which idle animation to play; 0 is none

	// Add in the animations
	// generateFrameNames(prefix, start, stop, suffix, howManyDigitsForIndices)
	var file = "PG Cat 6";
	var AEI = this.animationEndIndices;

	this.animations.add('walk', Phaser.Animation.generateFrameNames(file + '-Walk-',0,this.animationLengths.walk,'',2),50, true);
	this.walk1End = AEI.walk1;
	this.walk2End = AEI.walk2;
	this.walk3End = AEI.walk3;
	this.walk4End = AEI.walk4;

	this.animations.add('jump', Phaser.Animation.generateFrameNames(file + '-Jump-',0,this.animationLengths.jump,'',2),30, true);

	this.animations.add('idle', Phaser.Animation.generateFrameNames(file + '-Idle-',0,this.animationLengths.idle,'',2),30, true);
	this.idleEnd = AEI.idle;

	this.animations.add('fall', Phaser.Animation.generateFrameNames(file + '-Fall-',0,this.animationLengths.fall,'',2),30, true);
	
	this.animations.add('jumpToFall', Phaser.Animation.generateFrameNames(file + '-JumpToFall-',0,this.animationLengths.jumpToFall,'',2),30, true);
	this.jumpToFallEnd = AEI.jumpToFall; // Index of the end of the jumpToFall animation

	this.animations.add('land', Phaser.Animation.generateFrameNames(file + '-Land-',0,this.animationLengths.land,'',2),30, true);
	this.landEnd = AEI.land; // Index of the end of the land animation

	this.animations.add('landToWalk', Phaser.Animation.generateFrameNames(file + '-LandToWalk-',0,this.animationLengths.landToWalk,'',2),30, true);
	this.landToWalkEnd = AEI.landToWalk; // Index of the end of the landToWalk animation

	this.animations.add('landToIdle', Phaser.Animation.generateFrameNames(file + '-LandToIdle-',0,this.animationLengths.landToIdle,'',2),30, true);
	this.landToIdleEnd = AEI.landToIdle; // Index of the end of the landToIdle animation

	this.animations.add('idleToWalk', Phaser.Animation.generateFrameNames(file + '-IdleToWalk-',0,this.animationLengths.idleToWalk,'',2),30, true);
	this.idleToWalkEnd = AEI.idleToWalk; // Index of the end of the idleToWalk animation

	this.animations.add('idleToFall', Phaser.Animation.generateFrameNames(file + '-IdleToFall-',0,this.animationLengths.idleToFall,'',2),30, true);
	this.idleToFallEnd = AEI.idleToFall; // Index of the end of the idleToFall animation

	this.animations.add('walkToIdle1', Phaser.Animation.generateFrameNames(file + '-WalkToIdle1-',0,this.animationLengths.walkToIdle1,'',2),30, true);
	this.walkToIdle1End = AEI.walkToIdle1; // Index of the end of the walkToIdle1 animation

	this.animations.add('walkToIdle2', Phaser.Animation.generateFrameNames(file + '-WalkToIdle2-',0,this.animationLengths.walkToIdle1,'',2),30, true);
	this.walkToIdle2End = AEI.walkToIdle2; // Index of the end of the walkToIdle2 animation

	this.animations.add('walkToIdle3', Phaser.Animation.generateFrameNames(file + '-WalkToIdle3-',0,this.animationLengths.walkToIdle1,'',2),30, true);
	this.walkToIdle3End = AEI.walkToIdle3; // Index of the end of the walkToIdle3 animation

	this.animations.add('walkToIdle4', Phaser.Animation.generateFrameNames(file + '-WalkToIdle4-',0,this.animationLengths.walkToIdle1,'',2),30, true);
	this.walkToIdle4End = AEI.walkToIdle4; // Index of the end of the walkToIdle4 animation

	this.animations.add('ceilingCollide', Phaser.Animation.generateFrameNames(file + '-CeilingCollide-',0,this.animationLengths.ceilingCollide,'',2),30, true);
	this.ceilingCollideEnd = AEI.ceilingCollide; // Index of the end of the ceilingCollide animation

	this.animations.add('fidgetStretch', Phaser.Animation.generateFrameNames(file + '-FidgetStretch-',0,this.animationLengths.fidgetStretch,'',2),30, true);
	this.fidgetStretchEnd = AEI.fidgetStretch; // Index of the end of the fidgetStretch animation

	this.animations.add('fidgetYawn', Phaser.Animation.generateFrameNames(file + '-FidgetYawn-',0,this.animationLengths.fidgetYawn,'',2),30, true);
	this.fidgetYawnEnd = AEI.fidgetYawn; // Index of the end of the fidgetYawn animation

	// Creates a new FSM
	this.fsm = new StateMachine(this, {debug: debugBool});

	// Reference to self that can be referenced in FSM
	var self = this;

	// Create states
	self.createAnimState('idle');
	self.createAnimState('walk');
	self.createAnimState('jump');
	self.createAnimState('jumpToFall');
	self.createAnimState('fall');
	self.createAnimState('land');
	self.createAnimState('landToWalk');
	self.createAnimState('landToIdle');
	self.createAnimState('idleToWalk');
	self.createAnimState('idleToFall');
	self.createAnimState('walkToIdle1');
	self.createAnimState('walkToIdle2');
	self.createAnimState('walkToIdle3');
	self.createAnimState('walkToIdle4');
	self.createAnimState('ceilingCollide');
	self.createAnimState('fidgetStretch');
	self.createAnimState('fidgetYawn');

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
		return ( self.checkIfStopMoving() &&  self.animations.frame === self.walk1End );
	});
	this.fsm.transition('walk_to_walkToIdle2', 'walk', 'walkToIdle2', function(){
		return ( self.checkIfStopMoving() &&  self.animations.frame === self.walk2End );
	});
	this.fsm.transition('walk_to_walkToIdle3', 'walk', 'walkToIdle3', function(){
		return ( self.checkIfStopMoving() &&  self.animations.frame === self.walk3End );
	});
	this.fsm.transition('walk_to_walkToIdle4', 'walk', 'walkToIdle4', function(){
		return ( self.checkIfStopMoving() &&  self.animations.frame === self.walk4End );
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
		return ( self.player.body.velocity.y*-1*self.player.body.data.gravityScale < 40 && self.player.body.velocity.y*-1*self.player.body.data.gravityScale > 5 );
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
		return ( self.animations.frame === self.landEnd && self.checkIfStopMoving() );
	});
	// If the player reaches the end of the land animation and does provide keyboard input
	this.fsm.transition('land_to_landToWalk', 'land', 'landToWalk', function(){
		return ( self.animations.frame === self.landEnd && self.checkIfMoving() );
	});

	self.createNextAnimTransition('landToIdle', 'idle')
	self.createMoveAnimTransition("landToIdle");
	self.createJumpAnimTransition("landToIdle");
	self.createFallAnimTransition("landToIdle");

	self.createNextAnimTransition('landToWalk', 'walk')
	self.createJumpAnimTransition("landToWalk");
	self.createFallAnimTransition("landToWalk");

	self.createFidgetAnimTransitions("fidgetStretch", 1, self.fidgetStretchEnd);
	self.createFidgetAnimTransitions("fidgetYawn", 2, self.fidgetYawnEnd);

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
	if(this.idleAnimPicked === animNum  && this.animations.frame === this.idleEnd){
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
	if( this.player.checkIfCanJump() ){ //this.player.body.velocity.y*-1*this.player.body.data.gravityScale <= 5
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
PlayerFSM.prototype.createFidgetAnimTransitions = function(animName, animID, animEndFrame){
	var self = this;

	this.fsm.transition('idle_to_' + animName, 'idle', animName, function(){
		return ( self.checkToPlayIdleAnim(animID) );
	});
	this.fsm.transition(animName + '_to_idle', animName, 'idle', function(){
		return ( self.checkIfIdleDone(animEndFrame) );
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
		return ( self.animations.frame === self[firstAnimName + "End"] );
	});
}

// Prints out the indices of the end of animation states
PlayerFSM.prototype.debugPrintAnimationIndices = function(animationLengths, animationEndIndices){
    var atlas = game.cache.getJSON('playerAnimations');

	var frames = atlas.frames;
	var file = "PG Cat 6";
	var AEI = animationEndIndices;
	for(let i = 0; i < frames.length; i++){
		if(frames[i].filename === file + "-Idle-" + animationLengths.idle){
			AEI.idle = i;
		}
		else if(frames[i].filename === file + "-Walk-" + animationLengths.walk1){
			AEI.walk1 = i;
		}
		else if(frames[i].filename === file + "-Walk-" + animationLengths.walk2){
			AEI.walk2 = i;
		}
		else if(frames[i].filename === file + "-Walk-" + animationLengths.walk3){
			AEI.walk3 = i;
		}
		else if(frames[i].filename === file + "-Walk-" + animationLengths.walk4){
			AEI.walk4 = i;
		}
		else if(frames[i].filename === file + "-JumpToFall-" + animationLengths.jumpToFall){
			AEI.jumpToFall = i;
		}
		else if(frames[i].filename === file + "-Land-" + animationLengths.land){
			AEI.land = i;
		}
		else if(frames[i].filename === file + "-LandToWalk-" + animationLengths.landToWalk){
			AEI.landToWalk = i;
		}
		else if(frames[i].filename === file + "-LandToIdle-" + animationLengths.landToIdle){
			AEI.landToIdle = i;
		}
		else if(frames[i].filename === file + "-IdleToWalk-" + animationLengths.idleToWalk){
			AEI.idleToWalk = i;
		}
		else if(frames[i].filename === file + "-IdleToFall-" + animationLengths.idleToFall){
			AEI.idleToFall = i;
		}
		else if(frames[i].filename === file + "-WalkToIdle1-" + animationLengths.walkToIdle1){
			AEI.walkToIdle1 = i;
		}
		else if(frames[i].filename === file + "-WalkToIdle2-" + animationLengths.walkToIdle2){
			AEI.walkToIdle2 = i;
		}
		else if(frames[i].filename === file + "-WalkToIdle3-" + animationLengths.walkToIdle3){
			AEI.walkToIdle3 = i;
		}
		else if(frames[i].filename === file + "-WalkToIdle4-" + animationLengths.walkToIdle4){
			AEI.walkToIdle4 = i;
		}
		else if(frames[i].filename === file + "-CeilingCollide-" + animationLengths.ceilingCollide){
			AEI.ceilingCollide = i;
		}
		else if(frames[i].filename === file + "-FidgetStretch-" + animationLengths.fidgetStretch){
			AEI.fidgetStretch = i;
		}
		else if(frames[i].filename === file + "-FidgetYawn-" + animationLengths.fidgetYawn){
			AEI.fidgetYawn = i;
		}
	}

	console.log("walk1 = " + AEI.walk1);
	console.log("walk2 = " + AEI.walk2);
	console.log("walk3 = " + AEI.walk3);
	console.log("walk4 = " + AEI.walk4);
	console.log("idle = " + AEI.idleIndex);
	console.log("jumpToFall = " + AEI.jumpToFall);
	console.log("land = " + AEI.land);
	console.log("landToWalk = " + AEI.landToWalk);
	console.log("landToIdle = " + AEI.landToIdle);
	console.log("idleToWalk = " + AEI.idleToWalk);
	console.log("idleToFall = " + AEI.idleToFall);
	console.log("walkToIdle1 = " + AEI.walkToIdle1);
	console.log("walkToIdle2 = " + AEI.walkToIdle2);
	console.log("walkToIdle3 = " + AEI.walkToIdle3);
	console.log("walkToIdle4 = " + AEI.walkToIdle4);
	console.log("ceilingCollide = " + AEI.ceilingCollide);
	console.log("fidgetStretch = " + AEI.fidgetStretch);
	console.log("fidgetYawn = " + AEI.fidgetYawn);

	return AEI;
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