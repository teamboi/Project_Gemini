// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Intantiate the Game over state
var Ending = function(game){};
Ending.prototype = {
	create: function(){
        //Add in the game over picture
        this.menu = game.add.sprite(0,0,'endTitle');
        game.camera.flash(0xffffff, 2000);

        this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.ost = game.add.audio('Cradle');
        this.ost.play('', 0, 1, true);

        // Instantiate the fade events
        game.camera.onFadeComplete.add(this.resetFade, this);
        game.time.events.add(5000, this.fade, this);
    },
    fade: function() {

        //  You can set your own fade color and duration
        game.camera.fade(0xffffff, 2000);

    },
    resetFade: function() {
        game.state.start('GameOver', true, false);
    }
}