// let's keep our code tidy with strict mode 👊
"use strict";

var MainMenu = function(game){
	
};
MainMenu.prototype = {
	create: function(){
		this.menu = game.add.sprite(game.width/2,game.height/2,'title');
		this.menu.anchor.setTo(0.5,0.5);
        //this.menu.scale.setTo(3,3);
	},
	update: function(){
		// If the spacebar is pressed...
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			//this.music.destroy(); // Kill the music
			game.state.start('GamePlay', true, false); // Change state to GamePlay
		}
	},
}