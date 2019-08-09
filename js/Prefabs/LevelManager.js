// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for LevelManager
function LevelManager(game, gameplay, key){
	Phaser.Sprite.call(this, game, 0, 0, key);
	game.add.existing(this);
	this.gameplay = gameplay; // Obtains reference to gameplay state
	
	this.alpha = 0; // Makes the ugly green box invisible
}

// inherit prototype from Phaser.Sprite and set constructor to DialogManager
LevelManager.prototype = Object.create(Phaser.Sprite.prototype);
LevelManager.prototype.constructor = LevelManager;