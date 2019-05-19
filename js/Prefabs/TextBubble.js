// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for LevelManager
function TextBubble(game, key, x, y, text){
	console.log("created text");
	Phaser.Sprite.call(this, game, 0, 0, key);

	//this.text = text;
	this.text = game.add.text(x, y, text, {font: 'Impact', fontSize: '27px', fill: '#FF7373'});
}

// inherit prototype from Phaser.Sprite and set constructor to LevelManager
TextBubble.prototype = Object.create(Phaser.Sprite.prototype);
TextBubble.prototype.constructor = TextBubble;