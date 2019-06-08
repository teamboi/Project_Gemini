// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://phaser.io/examples/v2/p2-physics/platformer-material
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Player
function PlayerFSM(game, gameplay, player, x, y, key){
	Phaser.Sprite.call(this, game, x, y, key);
	game.add.existing(this);
	this.z = layerPlayer;
	//this.scale.setTo(0.13, 0.13); // Scales the sprite
	this.anchor.setTo(0.45,0.6);

	this.gameplay = gameplay; // Obtain reference to gameplay state
	this.player = player;
	this.gameplay.group.add(this);

	this.animations.add('fall', Phaser.Animation.generateFrameNames('PG Cat 5-Fall-',0,9,'',2),30, true);
	this.animations.add('idle', Phaser.Animation.generateFrameNames('PG Cat 5-Idle-',0,19,'',2),30, true);
	this.animations.add('jump', Phaser.Animation.generateFrameNames('PG Cat 5-Jump-',0,9,'',2),30, true);
	this.animations.add('jumpToFall', Phaser.Animation.generateFrameNames('PG Cat 5-JumpToFall-',0,6,'',2),30, true);
	//var jumpToFallArr = Phaser.Animation.generateFrameNames('PG Cat 5-JumpToFall-',0,6,'',2);
	this.jumpToFallEnd = 46; //jumpToFallArr[jumpToFallArr.length-1];
	this.animations.add('land', Phaser.Animation.generateFrameNames('PG Cat 5-Land-',0,4,'',2),30, true);
	//var landArr = Phaser.Animation.generateFrameNames('PG Cat 5-Land-',0,4,'',2);
	this.landEnd = 51; //landArr[landArr.length-1];
	this.animations.add('walk', Phaser.Animation.generateFrameNames('PG Cat 5-Walk-',0,19,'',2),30, true);

	this.fsm = new StateMachine(this, {debug: true});

	var self = this;

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

	this.fsm.transition('idle_to_walk', 'idle', 'walk', function(){
		return ( self.player.fsmIsMoving === true );
	});

	this.fsm.transition('walk_to_idle', 'walk', 'idle', function(){
		return ( self.player.fsmIsMoving === false );
	});

	this.fsm.transition('walk_to_fall', 'walk', 'fall', function(){
		return ( self.player.body.velocity.y*-1*self.player.body.data.gravityScale < -5); //!self.checkIfCanJump()
	});

	this.fsm.transition('idle_to_jump', 'idle', 'jump', function(){
		return ( game.input.keyboard.justPressed(Phaser.KeyCode[self.player.controls[2]]) && self.player.checkIfCanJump() );
	});

	this.fsm.transition('walk_to_jump', 'walk', 'jump', function(){
		return ( game.input.keyboard.justPressed(Phaser.KeyCode[self.player.controls[2]]) && self.player.checkIfCanJump() );
	});

	this.fsm.transition('jump_to_jumpToFall', 'jump', 'jumpToFall', function(){
		return ( self.player.body.velocity.y*-1*self.player.body.data.gravityScale < 5);
	});

	this.fsm.transition('jumpToFall_to_fall', 'jumpToFall', 'fall', function(){
		return ( self.animations.frame === self.jumpToFallEnd );
	});

	this.fsm.transition('fall_to_land', 'fall', 'land', function(){
		return ( self.player.body.velocity.y*-1*self.player.body.data.gravityScale > -1 ); //self.checkIfCanJump()
	});

	this.fsm.transition('land_to_idle', 'land', 'idle', function(){
		return ( self.animations.frame === self.landEnd ); //self.animations.loopCount > 0
	});

	this.animations.play(self.fsm.initialState);
}

// inherit prototype from Phaser.Sprite and set constructor to Player
PlayerFSM.prototype = Object.create(Phaser.Sprite.prototype);
PlayerFSM.prototype.constructor = PlayerFSM;

PlayerFSM.prototype.update = function(){
	this.fsm.update();
}