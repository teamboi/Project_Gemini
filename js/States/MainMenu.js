// let's keep our code tidy with strict mode 👊
"use strict";

var MainMenu = function(game){
	
};
MainMenu.prototype = {
	create: function(){
		
	},
	update: function(){
		// If the spacebar is pressed...
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			//this.music.destroy(); // Kill the music
			game.state.start('GamePlay', true, false); // Change state to GamePlay
		}
	},
}