// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Initialize the Main Menu state
var MainMenu = function(game){};
MainMenu.prototype = {
	init: function(ost){
		// initialize variables for gameplay
        this.ost = ost;
    },
	create: function(){
		// Add in the title card
		this.menu = game.add.sprite(game.width/2,game.height/2,'title');
		this.menu.anchor.setTo(0.5,0.5);

		game.camera.flash(0xffffff, 2000);

		// Play the Main Theme
		//this.ost = game.add.audio('Cradle');
		//this.ost.onDecoded.add(this.startOST, this);
		//this.ost.fadeIn(500, true);
		//this.ost.play('', 0, 1, true);
		
		// Check for the spacebar to start the game
		//this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		// Instantiate the fade events
		game.camera.onFadeComplete.add(this.resetFade, this);
		//this.space.onDown.add(this.fade, this);

		this.playButton = new PlayButton(game, this, game.width.half, game.height.half, 'playButton');
	},
	startOST: function() {
		this.ost.fadeTo(500, 0.5);
		this.ost.loop = true;
		//this.ost.play('', 0, 1, true);	
		//this.ost.volume = 0.5;
	},
	fade: function() {
		// Fade out the music and the camera
    	this.ost.fadeOut(2500);
    	game.camera.fade(0xffffff, 2000);

	},
	resetFade: function() {
		 // Load in the next level once the fade is complete
		game.state.start('Together', true, false, this.ost);
	}
};