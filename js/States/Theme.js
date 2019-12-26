// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Initialize the Main Menu state
var Theme = function(game){};
Theme.prototype = {
	create: function(){
		// Prevent the keys from scrolling the page
		game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
		game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
		game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
		
		this.complete = false;
		if(debugLevel === null){
			this.nextLevel = 'MainMenu';
			this.flashDuration = 2000;
			this.fadeDuration = 2000;
			this.ostFadeDuration = 3000;
			this.fadeDelay = 3000;
		}
		else{
			this.nextLevel = debugLevel;
			this.flashDuration = 1;
			this.fadeDuration = 1;
			this.ostFadeDuration = 1;
			this.fadeDelay = 1;
		}
		if(debugTransitions === true || debugSkipIntro === true){
			this.flashDuration = 1;
			this.fadeDuration = 1;
			this.ostFadeDuration = 1;
			this.fadeDelay = 1;
		}
		// Add in the title card
		this.menu = game.add.sprite(0,0,'theme');
		game.camera.flash(0xffffff, this.flashDuration);
		// Play the Main Theme
		this.ost = game.add.audio('Cradle');
		this.ost.onDecoded.add(this.startOST, this);
		
		// Check for the spacebar to start the game

		// Instantiate the fade events
		game.camera.onFadeComplete.add(this.resetFade, this);
		game.time.events.add(this.fadeDelay, this.fade, this);
	},
	startOST: function() {
		this.ost.play('', 0, 0, true);
		this.ost.fadeTo(this.ostFadeDuration, 0.5);
	},
	fade: function() {
		// Fade out the music and the camera
		game.camera.fade(0xffffff, this.fadeDuration);

	},
	resetFade: function() {
		if(this.complete == false) {
			// Load in the next level once the fade is complete
			game.state.start(this.nextLevel, true, false, this.ost);
			this.complete = true;
		}
	}
};