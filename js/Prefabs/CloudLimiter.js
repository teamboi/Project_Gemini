// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial
// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for Yarn
function CloudLimiter(game, x, y, key){
	Phaser.Sprite.call(this, game, 0, 0, key);

	this.updatePosition = function(newPosition){
		this.body.y = newPosition;
	}
}

// inherit prototype from Phaser.Sprite and set constructor to Yarn
CloudLimiter.prototype = Object.create(Phaser.Sprite.prototype);
CLoudLimiter.prototype.constructor = CloudLimiter;