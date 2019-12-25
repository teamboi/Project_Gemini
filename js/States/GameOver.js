// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Intantiate the Game over state
var GameOver = function(game){};
GameOver.prototype = {
	init: function(ost){
		// initialize variables for gameplay
		this.ost = ost;
	},
	create: function(){
		//Add in the game over picture
		this.menu = game.add.sprite(game.width/2,game.height/2,'gameOver');
		this.menu.anchor.setTo(0.5,0.5);
		this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		game.camera.onFadeComplete.add(this.resetFade, this);
		this.space.onDown.add(this.fade, this);
	},
	fade: function() {
		//  You can set your own fade color and duration
		game.camera.fade(0xffffff, 2000);
		this.ost.fadeOut(1000);
	},
	resetFade: function() {
		game.state.start('MainMenu', true, false);
	}
}