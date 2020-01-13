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
	this.text.lineSpacing = data.lineSpacing; // Sets the spacing between the text lines
	this.alpha = 0; // Initial state for both bubble and text is transparent
	this.text.alpha = 0;

	// Set the scaling of the text blur to the size of the text box
	this.scale.x = (data.width * 1.05)/this.width;
	this.scale.y = (this.text.height + 100)/this.height;

	this.tint = data.color;
	this.firstColor = data.color;
	this.changeColor = false;
	this.tintTotalSteps = 0;
	this.tintCurrStep = 0;

	// Begins to fade in the text
	game.add.tween(this).to( { alpha: .8 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
	game.add.tween(this.text).to( { alpha: 1 }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
}

// inherit prototype from Phaser.Sprite and set constructor to TextBubble
TextBubble.prototype = Object.create(Phaser.Sprite.prototype);
TextBubble.prototype.constructor = TextBubble;

TextBubble.prototype.update = function(){
	if(this.changeColor === false) return;

	this.tint = Phaser.Color.interpolateColor(this.firstColor, 0xE5D3FD, this.tintTotalSteps, this.tintCurrStep, 1, 0);
}

// Allows the update loop to update the color and starts the tween
TextBubble.prototype.beginChangeToPurple = function(totalSteps){
	this.changeColor = true;
	this.tintTotalSteps = totalSteps;

	if(this.tintTween != null) this.tintTween.stop();
	this.tintTween = game.add.tween(this).to( { tintCurrStep: totalSteps }, totalSteps, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);

	this.tintTween.onComplete.add(this.endChangeToPurple, this);
}

// Stops the update loop from updating the color
TextBubble.prototype.endChangeToPurple = function(){
	this.changeColor = false;
}

// Function for fading the text out
TextBubble.prototype.fadeOut = function(duration){
	game.add.tween(this).to( { alpha: 0 }, duration*1.2, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
	game.add.tween(this.text).to( { alpha: 0 }, duration, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
}