// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for PlayButton
function PlayButton(game, gameplay, x, y, xscale, yscale,key){
	Phaser.Sprite.call(this, game, x, y, key);
	this.alpha = 0; // Sets current sprite to invisible

	this.gameplay = gameplay; // Obtains reference to gameplay state

	this.button = game.add.button(x, y, key, actionOnClick, this, 2,1,0); // Creates clickable button
	this.button.anchor.setTo(0.5, 0.5); // Sets anchor to the center
	this.button.scale.setTo(xscale,yscale); // Scales button to specified scale

	//this.onInputOver.add(over, this);
}

// If clicked, will call the gameplay's fade function to move onto next state
function actionOnClick(){
	this.gameplay.fade();
}

// inherit prototype from Phaser.Sprite and set constructor to MovePlatform
PlayButton.prototype = Object.create(Phaser.Sprite.prototype);
PlayButton.prototype.constructor = PlayButton;