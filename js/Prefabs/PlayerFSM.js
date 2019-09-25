// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for PlayerFSM
function PlayerFSM(game, gameplay, player, x, y, whichPlayer){

	this.animationEndFrames = {
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

	this.whichPlayer = whichPlayer;

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
	this.animations.add('walk', Phaser.Animation.generateFrameNames(file + '-Walk-',0,this.animationEndFrames.walk,'',2),50, true);
	this.walk1End = 211;
	this.walk2End = 216;
	this.walk3End = 221;
	this.walk4End = 226;

	this.animations.add('jump', Phaser.Animation.generateFrameNames(file + '-Jump-',0,this.animationEndFrames.jump,'',2),30, true);

	this.animations.add('idle', Phaser.Animation.generateFrameNames(file + '-Idle-',0,this.animationEndFrames.idle,'',2),30, true);
	this.idleEnd = 150;

	this.animations.add('fall', Phaser.Animation.generateFrameNames(file + '-Fall-',0,this.animationEndFrames.fall,'',2),30, true);
	
	this.animations.add('jumpToFall', Phaser.Animation.generateFrameNames(file + '-JumpToFall-',0,this.animationEndFrames.jumpToFall,'',2),30, true);
	this.jumpToFallEnd = 188; // Index of the end of the jumpToFall animation

	this.animations.add('land', Phaser.Animation.generateFrameNames(file + '-Land-',0,this.animationEndFrames.land,'',2),30, true);
	this.landEnd = 192; // Index of the end of the land animation

	this.animations.add('landToWalk', Phaser.Animation.generateFrameNames(file + '-LandToWalk-',0,this.animationEndFrames.landToWalk,'',2),30, true);
	this.landToWalkEnd = 210; // Index of the end of the landToWalk animation

	this.animations.add('landToIdle', Phaser.Animation.generateFrameNames(file + '-LandToIdle-',0,this.animationEndFrames.landToIdle,'',2),30, true);
	this.landToIdleEnd = 204; // Index of the end of the landToIdle animation

	this.animations.add('idleToWalk', Phaser.Animation.generateFrameNames(file + '-IdleToWalk-',0,this.animationEndFrames.idleToWalk,'',2),30, true);
	this.idleToWalkEnd = 158; // Index of the end of the idleToWalk animation

	this.animations.add('idleToFall', Phaser.Animation.generateFrameNames(file + '-IdleToFall-',0,this.animationEndFrames.idleToFall,'',2),30, true);
	this.idleToFallEnd = 154; // Index of the end of the idleToFall animation

	this.animations.add('walkToIdle1', Phaser.Animation.generateFrameNames(file + '-WalkToIdle1-',0,this.animationEndFrames.walkToIdle1,'',2),30, true);
	this.walkToIdle1End = 256; // Index of the end of the walkToIdle1 animation

	this.animations.add('walkToIdle2', Phaser.Animation.generateFrameNames(file + '-WalkToIdle2-',0,this.animationEndFrames.walkToIdle1,'',2),30, true);
	this.walkToIdle2End = 282; // Index of the end of the walkToIdle2 animation

	this.animations.add('walkToIdle3', Phaser.Animation.generateFrameNames(file + '-WalkToIdle3-',0,this.animationEndFrames.walkToIdle1,'',2),30, true);
	this.walkToIdle3End = 1; // Index of the end of the walkToIdle3 animation

	this.animations.add('walkToIdle4', Phaser.Animation.generateFrameNames(file + '-WalkToIdle4-',0,this.animationEndFrames.walkToIdle1,'',2),30, true);
	this.walkToIdle4End = 27; // Index of the end of the walkToIdle4 animation

	this.animations.add('ceilingCollide', Phaser.Animation.generateFrameNames(file + '-CeilingCollide-',0,this.animationEndFrames.ceilingCollide,'',2),30, true);
	this.ceilingCollideEnd = 35; // Index of the end of the ceilingCollide animation

	this.animations.add('fidgetStretch', Phaser.Animation.generateFrameNames(file + '-FidgetStretch-',0,this.animationEndFrames.fidgetStretch,'',2),30, true);
	this.fidgetStretchEnd = 90; // Index of the end of the fidgetStretch animation

	this.animations.add('fidgetYawn', Phaser.Animation.generateFrameNames(file + '-FidgetYawn-',0,this.animationEndFrames.fidgetYawn,'',2),30, true);
	this.fidgetYawnEnd = 130; // Index of the end of the fidgetYawn animation

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
	self.createMoveAnimTransition('idle', 'idleToWalk');
	self.createJumpAnimTransition("idle");
	self.createFallAnimTransition("idle");

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
	self.createMoveAnimTransition('walkToIdle1', 'idleToWalk');
	self.createJumpAnimTransition("walkToIdle1");
	self.createFallAnimTransition("walkToIdle1");

	self.createNextAnimTransition('walkToIdle2', 'idle');
	self.createMoveAnimTransition('walkToIdle2', 'idleToWalk');
	self.createJumpAnimTransition("walkToIdle2");
	self.createFallAnimTransition("walkToIdle2");

	self.createNextAnimTransition('walkToIdle3', 'idle');
	self.createMoveAnimTransition('walkToIdle3', 'idleToWalk');
	self.createJumpAnimTransition("walkToIdle3");
	self.createFallAnimTransition("walkToIdle3");

	self.createNextAnimTransition('walkToIdle4', 'idle');
	self.createMoveAnimTransition('walkToIdle4', 'idleToWalk');
	self.createJumpAnimTransition("walkToIdle4");
	self.createFallAnimTransition("walkToIdle4");

	// If the player reaches the peak of their jump when jumping
	this.fsm.transition('jump_to_jumpToFall', 'jump', 'jumpToFall', function(){
		return ( self.player.body.velocity.y*-1*self.player.body.data.gravityScale < 40 && self.player.body.velocity.y*-1*self.player.body.data.gravityScale > 5 );
	});
	this.fsm.transition('jump_to_ceilingCollide', 'jump', 'ceilingCollide', function(){
		return ( self.player.body.velocity.y*-1*self.player.body.data.gravityScale <= 5 );
	});

	self.createJumpAnimTransition('ceilingCollide', 'fall');
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
	self.createMoveAnimTransition("landToIdle", "idleToWalk");
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

PlayerFSM.prototype.checkIfFalling = function(){
	if(Math.abs( this.player.body.velocity.y ) > 80 && this.isJumping === false){
		this.resetIdleTimer();
		return true;
	}
	return false;
}

PlayerFSM.prototype.checkIfIdleDone = function(endFrame){
	if( this.animations.frame === endFrame ){
		this.resetIdleTimer();
		return true;
	}
	return false;
}

PlayerFSM.prototype.checkToPlayIdleAnim = function(animNum){
	if(this.idleAnimPicked === animNum  && this.animations.frame === this.idleEnd){
		this.idleAnimPicked = 0;
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
	if( this.player.checkIfCanJump() ){ //this.player.body.velocity.y*-1*this.player.body.data.gravityScale <= 5
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

PlayerFSM.prototype.createAnimState = function(animState){
	this.fsm.state(animState, {
		enter: function(){ },
		update: function(){ },
		exit: function(){ }
	});
}

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

PlayerFSM.prototype.createJumpAnimTransition = function(animName){
	var self = this;

	this.fsm.transition(animName + '_to_jump', animName, 'jump', function(){
		return ( self.checkIfJumping() );
	});
}

PlayerFSM.prototype.createFallAnimTransition = function(animName){
	var self = this;

	this.fsm.transition(animName + '_to_fall', animName, 'fall', function(){
		return ( self.checkIfFalling() );
	});
}

PlayerFSM.prototype.createLandAnimTransition = function(animName){
	var self = this;

	this.fsm.transition(animName + '_to_land', animName, 'land', function(){
		return ( self.checkIfLanded() );
	});
}

PlayerFSM.prototype.createMoveAnimTransition = function(firstAnimName, nextAnimName){
	var self = this;

	this.fsm.transition(firstAnimName + '_to_' + nextAnimName, firstAnimName, nextAnimName, function(){
		return ( self.checkIfMoving() );
	});
}

PlayerFSM.prototype.createNextAnimTransition = function(firstAnimName, nextAnimName){
	var self = this;

	this.fsm.transition(firstAnimName + '_to_' + nextAnimName, firstAnimName, nextAnimName, function(){
		return ( self.animations.frame === self[firstAnimName + "End"] );
	});
}

PlayerFSM.prototype.debugPrintAnimationIndices = function(animationEndFrames){
    var atlas = game.cache.getJSON('playerAnimations');

	var frames = atlas.frames;
	var file = "PG Cat 6";
	for(let i = 0; i < frames.length; i++){
		if(frames[i].filename === file + "-Idle-" + animationEndFrames.idle){
			var idleIndex = i;
		}
		else if(frames[i].filename === file + "-Walk-" + animationEndFrames.walk1){
			var walk1Index = i;
		}
		else if(frames[i].filename === file + "-Walk-" + animationEndFrames.walk2){
			var walk2Index = i;
		}
		else if(frames[i].filename === file + "-Walk-" + animationEndFrames.walk3){
			var walk3Index = i;
		}
		else if(frames[i].filename === file + "-Walk-" + animationEndFrames.walk4){
			var walk4Index = i;
		}
		else if(frames[i].filename === file + "-JumpToFall-" + animationEndFrames.jumpToFall){
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
		else if(frames[i].filename === file + "-WalkToIdle2-" + animationEndFrames.walkToIdle2){
			var walkToIdle2Index = i;
		}
		else if(frames[i].filename === file + "-WalkToIdle3-" + animationEndFrames.walkToIdle3){
			var walkToIdle3Index = i;
		}
		else if(frames[i].filename === file + "-WalkToIdle4-" + animationEndFrames.walkToIdle4){
			var walkToIdle4Index = i;
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

	console.log("walk1 = " + walk1Index);
	console.log("walk2 = " + walk2Index);
	console.log("walk3 = " + walk3Index);
	console.log("walk4 = " + walk4Index);
	console.log("idle = " + idleIndex);
	console.log("jumpToFall = " + jumpToFallIndex);
	console.log("land = " + landIndex);
	console.log("landToWalk = " + landToWalkIndex);
	console.log("landToIdle = " + landToIdleIndex);
	console.log("idleToWalk = " + idleToWalkIndex);
	console.log("idleToFall = " + idleToFallIndex);
	console.log("walkToIdle1 = " + walkToIdle1Index);
	console.log("walkToIdle2 = " + walkToIdle2Index);
	console.log("walkToIdle3 = " + walkToIdle3Index);
	console.log("walkToIdle4 = " + walkToIdle4Index);
	console.log("ceilingCollide = " + ceilingCollideIndex);
	console.log("fidgetStretch = " + fidgetStretchIndex);
	console.log("fidgetYawn = " + fidgetYawnIndex);
}

PlayerFSM.prototype.resetIdleTimer = function(){
	this.idleTimer = 0;
	this.idleAnimPicked = 0;
}

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