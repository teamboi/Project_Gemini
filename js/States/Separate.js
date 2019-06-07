// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Initialize the Main Menu state
var Separate = function(game){};
Separate.prototype = {
	init: function(ost){
		// initialize variables for gameplay
        this.theme = ost;
    },
	create: function(){
		// Fade out the level one theme
		if(this.theme.isPlaying == true) {
			this.theme.fadeOut(1000);
		}
		game.camera.flash(0xffffff, 2000);

		// Add in the title card
		this.title = game.add.sprite(0,0,'housesTitle');
		//this.title.anchor.setTo(0.5,0.5);
		//this.title.alpha= 0;

		this.ost = game.add.audio('Separate');
		this.ost.onDecoded.add(this.startOST, this);

        this.narrate = game.add.audio('narrate');
        //this.narrate.onDecoded.add(this.startNar, this);

		//game.add.tween(this.title).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0);
		
		//this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		game.camera.onFadeComplete.add(this.resetFade, this);
		game.time.events.add(6000, this.fade, this);
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
		// ONce fade is complete, begin Chapter 2
		game.state.start('Houses', true, false, this.ost);
	}
};