// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for TextBubble
function TextBubble(game, gameplay, data){
	Phaser.Sprite.call(this, game, data.x, data.y, "textBlur");
	game.add.existing(this); // Adds to display list
	this.anchor.setTo(0.5, 0.5); // Sets anchor to the center
	this.zOrder = layerText; // Sets the bubble's z order for layer sorting
	gameplay.group.add(this);
	gameplay.group.sort();

	//var sizeString = toString(size);
	var style = {font: "Comfortaa", fontSize: data.fontSize + 'px', fill: '#212121', align: "center", wordWrap: true, wordWrapWidth: data.width}; // Sets style of text
	this.text = game.add.text(data.x, data.y, data.text, style); // Creates specified text
	this.text.zOrder = layerText; // Sets text's z order for layer sorting
	this.text.anchor.setTo(0.5, 0.5); // Sets the anchor to the center of the text
	this.alpha = .8; // Initial state for both bubble and text is transparent
	this.text.alpha = 0;

	// Begin scaling calcs here
	this.scale.x = (data.width + 100)/this.width;
	this.scale.y = (this.text.height + 100)/this.height;
	/*if(this.y < game.height/2){
		this.tint = 0xFED9D1;
	}
	else{
		this.tint = 0xE1E3F4;
	}*/
	this.tint = data.color;

	// Begins to fade in the text
	//game.add.tween(this).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
	game.add.tween(this.text).to( { alpha: 1 }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
}

// inherit prototype from Phaser.Sprite and set constructor to TextBubble
TextBubble.prototype = Object.create(Phaser.Sprite.prototype);
TextBubble.prototype.constructor = TextBubble;

// Function for fading the text out
TextBubble.prototype.fadeOut = function(){
	game.add.tween(this).to( { alpha: 0 }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
	game.add.tween(this.text).to( { alpha: 0 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
}