// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for movePlatform
// game = reference to game
// gameplay = reference to gameplay state
// x, y = starting coordinates
// key = sprite
// firstY, secondY = range in which the moving platform can move
// gravityDir = direction of gravity imposed on platform
// platformType = window or cloud
function WindowMask(game, gameplay, x, y, windowKey, latchKey, firstY, secondY, gravityDir){
	Phaser.Sprite.call(this, game, x, y, windowKey);
	game.add.existing(this);
	this.z = layerWindow;
	this.gameplay = gameplay;
	this.gameplay.group.add(this);

	this.latch = new MovePlatform(game, gameplay, x, y, latchKey, firstY, secondY, gravityDir, 'windowClick');

	this.rectMask = game.add.graphics(0, 0);
	game.add.existing(this.rectMask);
	this.rectMask.beginFill(0xFFFFFF,1);

	if(gravityDir == "down"){
		this.anchor.setTo(0.5,1);
		this.rectMask.drawRect(x - (this.width/2), y-this.height, this.width, this.height);
	}
	else if(gravityDir == "up"){
		this.anchor.setTo(0.5,0);
		this.rectMask.drawRect(x - (this.width/2), y, this.width, this.height);
	}
	else{
		console.log(gravityDir + " is not a valid direction. 'up' or 'down'");
	}

	this.mask = this.rectMask;
}

// inherit prototype from Phaser.Sprite and set constructor to MovePlatform
WindowMask.prototype = Object.create(Phaser.Sprite.prototype);
WindowMask.prototype.constructor = Window;

WindowMask.prototype.update = function(){
	this.y = this.latch.body.y;
}