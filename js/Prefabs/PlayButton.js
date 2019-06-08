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
function PlayButton(game, gameplay, x, y, xscale, yscale,key){
	Phaser.Sprite.call(this, game, x, y, key);
	this.alpha = 0;

	this.gameplay = gameplay;

	this.button = game.add.button(x, y, key, actionOnClick, this, 2,1,0);
	this.button.anchor.setTo(0.5, 0.5);
	this.button.scale.setTo(xscale,yscale);

	//this.onInputOver.add(over, this);
}

function actionOnClick(){
	this.gameplay.fade();
}

// inherit prototype from Phaser.Sprite and set constructor to MovePlatform
PlayButton.prototype = Object.create(Phaser.Sprite.prototype);
PlayButton.prototype.constructor = PlayButton;