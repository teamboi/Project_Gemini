// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Initialize the Main Menu state
var Together = function(game){};
Together.prototype = {
	init: function(ost){
		// initialize variables for gameplay
        this.theme = ost;
    },
	create: function(){
		// Fade out the title theme
		if(this.theme.isPlaying == true) {
			this.theme.fadeOut(1000);
		}

		// Add in the title card, initally invisible
		this.title = game.add.sprite(game.width/2,game.height/2,'Together');
		this.title.anchor.setTo(0.5,0.5);
		this.title.alpha = 0;

		// Begin to play the chapter one theme
		this.ost = game.add.audio('Together');
		this.ost.onDecoded.add(this.startOST, this);

		// Begin to play the level one narration
        this.narrate = game.add.audio('oneIntro');
        this.narrate.onDecoded.add(this.startNar, this);
        
        // Fade in the title card
		game.add.tween(this.title).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0);
	
		// Instantiate the fade events
		game.camera.onFadeComplete.add(this.resetFade, this);
		game.time.events.add(3000, this.fade, this);
	},
	startOST: function() {
		// Begin playing the level theme
		this.ost.play('', 0, 1, true);
		this.ost.volume = 0.5;	
	},
	startNar: function() {
		// Begin playing the intro narration
		this.narrate.play('', 0, 1, false);
        this.narrate.volume = 0.35;
	},
	fade: function() {
	    // You can set your own fade color and duration
	    game.camera.fade(0x000000, 2000);
	},
	resetFade: function() {
		// Once the fade is complete, begin Chapter 1
		game.state.start('Cats', true, false, this.ost);
	}
};