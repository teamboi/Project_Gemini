// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Initialize the Main Menu state
var Credits1 = function(game){};
Credits1.prototype = {
	init: function(ost){
		// initialize variables for gameplay
        this.ost = ost;
        this.fadeComplete =false;
    },
	create: function(){
		// Add in the title card
		this.menu = game.add.sprite(game.width/2,game.height/2,'credits1');
		this.menu.anchor.setTo(0.5,0.5);

		this.cameraFlashDuration = 2000;
		this.ostFadeDuration = 2500;

		if(debugTransitions === true){
			this.cameraFlashDuration = 1;
			this.ostFadeDuration = 1;
		}

		//Add the white fade
		game.camera.flash(0xffffff, this.cameraFlashDuration);

		// Instantiate the fade events
		game.camera.onFadeComplete.add(this.resetFade, this);

		this.playButton = new PlayButton(game, this, 200, 590,.65,.65, 'playButton');
	},
	// Start the soundtrack
	startOST: function() {
		this.ost.fadeTo(500, 0.5);
		this.ost.loop = true;
	},
	// Fade out this scene
	fade: function() {
		// Fade out the music and the camera
    	this.ost.fadeOut(this.ostFadeDuration);
    	game.camera.fade(0xffffff, this.cameraFlashDuration);

	},
	resetFade: function() {
		 // Load in the next level once the fade is complete
		if(this.fadeComplete == false) {
            game.state.start('Credits2', true, false, this.ost);
            this.fadeComplete = true;
        }
	}
};