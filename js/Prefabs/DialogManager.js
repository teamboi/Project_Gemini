// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for LevelManager
function DialogManager(game, gameplay){
	Phaser.Sprite.call(this, game, 0, 0, null);
	game.add.existing(this);
	this.gameplay = gameplay; // Obtains reference to gameplay state

	this.zOrder = layerText; // Sets the sprite's z layer for sorting
	this.gameplay.group.add(this);

	this.dialog = JSON.parse(this.game.cache.getText('dialog')); // This produces the meta array of all levels
	//this.level = this.dialog[this.levelNum]; // This produces the array of text for a single level
	//this.textBubble = this.level[this.textBubbleNum]; // This produces a single text bubble in the level

	this.dialogTyping = false; // Boolean for if the dialog is typing
}

// inherit prototype from Phaser.Sprite and set constructor to DialogManager
DialogManager.prototype = Object.create(Phaser.Sprite.prototype);
DialogManager.prototype.constructor = DialogManager;

// Function to type the intro dialog; 1 indexed
DialogManager.prototype.TypeIntro = function(levelNum){
	this.intro = this.TypeText(levelNum-1,0);
}

// Function to type the outro dialog; 1 indexed
DialogManager.prototype.TypeOutro = function(levelNum){
	this.outro = this.TypeText(levelNum-1,1);
}

// Types the text in the array in the json
DialogManager.prototype.TypeText = function(levelNum, textBubbleNum){
	//this.dialogTyping = true;

	// Obtains reference to the correct text to print
	var textBubble = this.dialog[levelNum][textBubbleNum];

	// Plays the audio associated with the text
	/*this.narrate = game.add.audio('narrate');
    this.narrate.play('', 0, 1, false);
    this.narrate.volume = 0.35;*/

    // If specified, make the previous text fade out
	if(textBubble["destroyIntro"]){
		this.intro.fadeOut();
	}

	// Create the actual text
	var currentText = new TextBubble(game, this.gameplay, this.key, textBubble["x"], textBubble["y"], textBubble["width"], textBubble["text"], textBubble["size"]);
	this.gameplay.group.add(currentText); // Add the current text to be sorted
	this.gameplay.group.add(currentText.text)

	return currentText; // Returns reference to object
}