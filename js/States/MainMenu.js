// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Initialize the Main Menu state
var MainMenu = function(game){};
MainMenu.prototype = {
	create: function(){
		// Add in the title card
		this.menu = game.add.sprite(game.width/2,game.height/2,'title');
		this.menu.anchor.setTo(0.5,0.5);
	},
	update: function(){
		// If the spacebar is pressed...
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			//this.music.destroy(); // Kill the music, once we get intro music
			game.state.start('Cats', true, false); // Change state to level 1
		}
	},
}