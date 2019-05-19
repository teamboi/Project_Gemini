// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for LevelManager
function DialogManager(game, key){
	Phaser.Sprite.call(this, game, 0, 0, key);
	this.dialog = JSON.parse(this.game.cache.getText('dialog'));
	this.level = 0;
	this.textLine = 0;

	this.dialogTyping = false;

	this.TypeText = function(){
		if(this.level >= this.dialog.length) {
			console.log('End of Conversations');
		}
		else{

		}
	}
}

// inherit prototype from Phaser.Sprite and set constructor to LevelManager
DialogManager.prototype = Object.create(Phaser.Sprite.prototype);
DialogManager.prototype.constructor = DialogManager;

DialogManager.prototype.update = function(){
	this.TypeText();
}