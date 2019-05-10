// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for LevelManager
function LevelManager(game, key){
	Phaser.Sprite.call(this, game, 0, 0, key);


}

// inherit prototype from Phaser.Sprite and set constructor to LevelManager
LevelManager.prototype = Object.create(Phaser.Sprite.prototype);
LevelManager.prototype.constructor = LevelManager;

LevelManager.prototype.update = function(){
	
}