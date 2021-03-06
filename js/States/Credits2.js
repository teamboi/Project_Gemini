// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Initialize the Main Menu state
var Credits2 = function(game){};
Credits2.prototype = {
	init: function(ost){
		// initialize variables for gameplay
		this.ost = ost;
		this.fadeComplete = false;
	},
	create: function(){
		// Add in the title card
		this.menu = game.add.sprite(game.width/2,game.height/2,'credits2');
		this.menu.anchor.setTo(0.5,0.5);

		this.cameraFlashDuration = 2000;
		this.ostFadeDuration = 2500;
		this.ostVolume = 0.4;

		if(debugTransitions === true){
			this.cameraFlashDuration = 1;
			this.ostFadeDuration = 1;
		}

		game.camera.flash(0xffffff, this.cameraFlashDuration);

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

		this.playButton = new PlayButton(game, this, 200, 590,.65,.65, 'playButton');
	},
	startOST: function() {
		this.ost.fadeTo(500, this.ostVolume);
		this.ost.loop = true;
		//this.ost.play('', 0, 1, true);	
		//this.ost.volume = 0.5;
	},
	fade: function() {
		// Fade out the music and the camera
		this.ost.fadeOut(this.ostFadeDuration);
		game.camera.fade(0xffffff, this.cameraFlashDuration);

	},
	resetFade: function() {
		 // Load in the next level once the fade is complete
		if(this.fadeComplete == false) {
			game.state.start('Theme', true, false, this.ost);
			this.fadeComplete = true;
		}
	}
};