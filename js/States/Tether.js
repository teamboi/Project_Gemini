// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Initialize the Main Menu state
var Tether = function(game){};
Tether.prototype = {
	init: function(ost){
		// initialize variables for gameplay
        this.theme = ost;
        //this.fadeComplete = false;
    },
	create: function(){
		var nextLevel = "Fences";
		var titleCard = "tetherTitle";
		var ost = "Tether";
		var narration = "narrate";
		this.transitionManager = new TransitionManager(game, this, nextLevel, titleCard, ost, narration);
		/*// Fade out the title theme
		if(this.theme.isPlaying == true) {
			this.theme.fadeOut(2000);
		}
		// Add in the title card
		this.title = game.add.sprite(0,0,'tetherTitle');

		// White fade
		game.camera.flash(0xffffff, 2000);

		// Initialize level theme
		this.ost = game.add.audio('Tether');
		this.ost.onDecoded.add(this.startOST, this);

		// Fade out of the scene
		game.camera.onFadeComplete.add(this.resetFade, this);
		game.time.events.add(5000, this.fade, this);*/
	},
	/*startOST: function() {
		// Begin playing the level theme
		this.ost.play('', 0, 0, true);
        this.ost.fadeTo(3000, 0.5);
	},
	stopTheme: function() {
		// Stop playaing prev theme
		this.theme.stop();
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
		// Begin the next chapter
		if(this.fadeComplete == false) {
            game.state.start('Fences', true, false, this.ost);
            this.fadeComplete = true;
        }
	}*/
};