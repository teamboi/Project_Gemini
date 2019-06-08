// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for LevelManager
function TextBubble(game, key, x, y, width, text){
	Phaser.Sprite.call(this, game, 0, 0, key);

	//this.bubble = game.add.sprite(x,y,'bubble');
	//this.bubble.anchor.setTo(0.5, 0.5);
	//this.text = text;
	var style = {font: "Comfortaa", fontSize: '22px', fill: '#212121', align: "center", wordWrap: true, wordWrapWidth: width};
	this.text = game.add.text(x, y, text, style);
	this.text.anchor.setTo(0.5, 0.5);
	this.alpha = 0;
	this.text.alpha = 0;

	game.add.tween(this).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
	game.add.tween(this.text).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 0, 0, false);

	this.fadeOut = function(){
		game.add.tween(this).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true, 0, 0, false);
		game.add.tween(this.text).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
	}
}

// inherit prototype from Phaser.Sprite and set constructor to LevelManager
TextBubble.prototype = Object.create(Phaser.Sprite.prototype);
TextBubble.prototype.constructor = TextBubble;