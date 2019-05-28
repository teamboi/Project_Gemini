// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for LevelManager
function DialogManager(game, key){
	Phaser.Sprite.call(this, game, 0, 0, key);
	this.alpha = 0;

	this.dialog = JSON.parse(this.game.cache.getText('dialog')); // This produces the meta array of all levels
	//this.level = this.dialog[this.levelNum]; // This produces the array of text for a single level
	//this.textBubble = this.level[this.textBubbleNum]; // This produces a single text bubble in the level

	this.dialogTyping = false;

	this.TypeText = function(levelNum, textBubbleNum){
		//this.dialogTyping = true;

		/*if(this.textBubbleNum >= this.dialog[this.levelNum].length){
			this.textBubbleNum = 0;
			this.levelNum++;

			if(this.levelNum >= this.dialog.length){
				console.log("End of Conversations");
				return;
			}
		}*/

		var textBubble = this.dialog[levelNum][textBubbleNum];
		var currentText = new TextBubble(game, this.key, textBubble["x"], textBubble["y"], textBubble["text"]);

		//this.textBubbleNum++;
	}
}

// inherit prototype from Phaser.Sprite and set constructor to DialogManager
DialogManager.prototype = Object.create(Phaser.Sprite.prototype);
DialogManager.prototype.constructor = DialogManager;

DialogManager.prototype.update = function(){
	if(game.input.keyboard.justPressed(Phaser.KeyCode.SPACEBAR)){
		this.TypeText(0,0);
	}
}