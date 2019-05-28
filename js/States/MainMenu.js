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

		if(!game.add.audio('Cradle').isPlaying) {
			this.ost = game.add.audio('Cradle');
			this.ost.play('', 0, 1, true);	
			this.music = true;
		}
		//this.ost = game.add.audio('Cradle');
		//this.ost.play('', 0, 1, true);	
		
		this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		game.camera.onFadeComplete.add(this.resetFade, this);
		this.space.onDown.add(this.fade, this);
	},
	fade: function() {

    //  You can set your own fade color and duration
    if(this.music) {
    	this.ost.fadeOut(2000);
	}
    game.camera.fade(0x000000, 2000);

	},
	resetFade: function() {
		game.state.start('Together', true, false);
	    //game.camera.resetFX();
	    

	}
};