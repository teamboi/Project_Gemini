// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for movePlatform
// game = reference to game
// gameplay = reference to gameplay state
// x, y = starting coordinates
// key = sprite
// firstY, secondY = range in which the moving platform can move
// gravityDir = direction of gravity imposed on platform
function WindowMask(game, gameplay, x, y, windowKey, latchKey, firstY, secondY, gravityDir, maskTopOffset){
	Phaser.Sprite.call(this, game, x, y, windowKey); // This sprite will be the graphical windowpane
	game.add.existing(this); // Adds to display list
	this.zOrder = layerWindow; // Sets z order for layer sorting
	this.gameplay = gameplay; // Obtains reference to gameplay state
	this.gameplay.group.add(this); // Adds self to gameplay's group for layer sorting
	this.y = Phaser.Math.clamp(this.y,firstY,secondY); // clamps the y coord to the given range

	this.latch = new MovePlatform(game, gameplay, x, y, latchKey, firstY, secondY, gravityDir, 'windowClick'); // Creates the platform that will be moved

	this.rectMask = game.add.graphics(0, 0); // Adds in mask
	game.add.existing(this.rectMask); // Adds mask to display list
	this.rectMask.beginFill(0xFFFFFF,1); // Fills mask with white so it can be seen

	// If the window will be pulled up
	if(gravityDir == "down"){
		this.anchor.setTo(0.5,1); // Sets anchor to the bottom of the window

		var gdm = -1; // gravDirMultiplier; see Cloud.js or MovePlatform.js
		var sillY = gdm*Phaser.Math.min(gdm * firstY, gdm * secondY); // Y coord of the sill

		this.rectMask.drawRect(x - (this.width/2), sillY-this.height + maskTopOffset, this.width, this.height - maskTopOffset); // Draws the appropriate rectangle
	}
	// If the window will be pulled down
	else if(gravityDir == "up"){
		this.anchor.setTo(0.5,0); // Sets anchor to the top of the window

		var gdm = 1; // gravDirMultiplier; see Cloud.js or MovePlatform.js
		var sillY = gdm*Phaser.Math.min(gdm * firstY, gdm * secondY); // Y coord of the sill

		this.rectMask.drawRect(x - (this.width/2), sillY, this.width, this.height - maskTopOffset); // Draws the appropriate rectangle
	}
	else{
		console.log(gravityDir + " is not a valid direction. 'up' or 'down'"); // In case I make a typo
	}

	this.mask = this.rectMask; // sets the mask of the windowpane to the rectangle we made
}

// inherit prototype from Phaser.Sprite and set constructor to WindowMask
WindowMask.prototype = Object.create(Phaser.Sprite.prototype);
WindowMask.prototype.constructor = WindowMask;

WindowMask.prototype.update = function(){
	this.y = this.latch.body.y; //Sets the graphical windowpane height to the collidable platform's height
}