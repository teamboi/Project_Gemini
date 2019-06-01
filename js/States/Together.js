// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Initialize the Main Menu state
var Together = function(game){};
Together.prototype = {
	create: function(){
		// Add in the title card
		this.title = game.add.sprite(game.width/2,game.height/2,'Together');
		this.title.anchor.setTo(0.5,0.5);
		this.title.alpha= 0;

		this.ost = game.add.audio('Together');
		this.ost.play('', 0, 1, true);
		this.ost.volume = 0.5;	
        this.narrate = game.add.audio('oneIntro');
        this.narrate.play('', 0, 1, false);
        this.narrate.volume = 0.35;

		game.add.tween(this.title).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0);
		
		//this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		game.camera.onFadeComplete.add(this.resetFade, this);
		//this.space.onDown.add(this.fade, this);
		game.time.events.add(3000, this.fade, this);
		if(game.add.audio('Cradle').isPlaying) {
			game.add.audio('Cradle').destroy();
		}
	},
	fade: function() {

    //  You can set your own fade color and duration
    game.camera.fade(0x000000, 2000);

	},
	resetFade: function() {
		game.state.start('Cats', true, false, this.ost);
	    //game.camera.resetFX();
	    

	}
};