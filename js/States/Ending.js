// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Intantiate the Game over state
var Ending = function(game){};
Ending.prototype = {
    init: function(ost){
        // initialize variables for gameplay
        this.theme = ost;
    },
	create: function(){
        if(this.theme.isPlaying == true) {
            this.theme.fadeOut(1000);
        }
        //Add in the game over picture
        this.menu = game.add.sprite(0,0,'endTitle');
        game.camera.flash(0xffffff, 2000);

        this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.ost = game.add.audio('Cradle');
        this.ost.onDecoded.add(this.startOST, this);

        // Instantiate the fade events
        game.camera.onFadeComplete.add(this.resetFade, this);
        game.time.events.add(5000, this.fade, this);
    },
    startOST: function() {
        this.ost.fadeIn(1000, true);
        //this.ost.play('', 0, 1, true);    
        //this.ost.volume = 0.5;
    },
    fade: function() {

        //  You can set your own fade color and duration
        game.camera.fade(0xffffff, 2000);

    },
    resetFade: function() {
        game.state.start('GameOver', true, false, this.ost);
    }
}