// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Initialize the Main Menu state
var Tether = function(game){};
Tether.prototype = {init: function(ost){
		// initialize variables for gameplay
        this.theme = ost;
    },
	create: function(){
		// Fade out the title theme
		if(this.theme.isPlaying == true) {
			this.theme.fadeOut(1000);
		}
		// Add in the title card
		this.title = game.add.sprite(0,0,'tetherTitle');
		//this.title.anchor.setTo(0.5,0.5);
		//this.title.alpha= 0;
		game.camera.flash(0xffffff, 2000);

		this.ost = game.add.audio('Tether');
		this.ost.onDecoded.add(this.startOST, this);

		// Begin to play the level one narration
        this.narrate = game.add.audio('oneIntro');
        //this.narrate.onDecoded.add(this.startNar, this);

		game.camera.onFadeComplete.add(this.resetFade, this);
		//this.space.onDown.add(this.fade, this);
		game.time.events.add(5000, this.fade, this);
	},
	startOST: function() {
		// Begin playing the level theme
		this.ost.fadeIn(1000, true);
		//this.ost.volume = 0.5;	
	},
	startNar: function() {
		// Begin playing the intro narration
		this.narrate.play('', 0, 1, false);
        this.narrate.volume = 0.35;
	},
	fade: function() {
	    //  You can set your own fade color and duration
	    game.camera.fade(0xffffff, 2000);
	},
	resetFade: function() {
		game.state.start('Fences', true, false, this.ost);
	}
};