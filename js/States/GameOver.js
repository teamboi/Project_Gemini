// let's keep our code tidy with strict mode 👊
"use strict";

var GameOver = function(game){};
GameOver.prototype = {
	create: function(){
        var overText = game.add.text(game.width/2 + 4.5, game.height/3 + 4.5, 'Thanks for playing', {font: 'Impact', fontSize: '64px', fill: '#ff0000'});
        overText.anchor.set(0.5);
    },
    update: function(){
        // If the spacebar is pressed...
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            //this.music.destroy(); // Kill the music
            game.state.start('MainMenu', true, false); // Change state to MainMenu
        }
    },
}