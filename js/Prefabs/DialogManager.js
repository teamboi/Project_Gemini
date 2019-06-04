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

	this.TypeIntro = function(levelNum){
		this.intro = this.TypeText(levelNum-1,0);
	}

	this.TypeOutro = function(levelNum){
		this.outro = this.TypeText(levelNum-1,1);
	}

	this.TypeText = function(levelNum, textBubbleNum){
		//this.dialogTyping = true;

		var textBubble = this.dialog[levelNum][textBubbleNum];

		this.narrate = game.add.audio('narrate');
        this.narrate.play('', 0, 1, false);
        this.narrate.volume = 0.35;

		if(textBubble["destroyIntro"]){
			this.intro.fadeOut();
		}

		var currentText = new TextBubble(game, this.key, textBubble["x"], textBubble["y"], textBubble["width"], textBubble["text"]);

		return currentText;
	}
}

// inherit prototype from Phaser.Sprite and set constructor to DialogManager
DialogManager.prototype = Object.create(Phaser.Sprite.prototype);
DialogManager.prototype.constructor = DialogManager;

DialogManager.prototype.update = function(){
	if(game.input.keyboard.justPressed(Phaser.KeyCode.L)){
		this.TypeIntro(1);
	}
	if(game.input.keyboard.justPressed(Phaser.KeyCode.K)){
		this.TypeOutro(1);
	}
}