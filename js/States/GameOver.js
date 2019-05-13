// let's keep our code tidy with strict mode 👊
"use strict";

var GameOver = function(game){};
GameOver.prototype = {
	create: function(){
        this.menu = game.add.sprite(game.width/2,game.height/2,'gameOver');
        this.menu.anchor.setTo(0.5,0.5);
    },
    update: function(){
        // If the spacebar is pressed...
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            //this.music.destroy(); // Kill the music
            game.state.start('MainMenu', true, false); // Change state to MainMenu
        }
    },
}