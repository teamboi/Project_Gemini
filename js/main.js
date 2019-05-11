// let's keep our code tidy with strict mode 👊
"use strict";

// define global variables
var game;
var spring;

// when window loads, create the game
window.onload = function(){
	game = new Phaser.Game(560,630, Phaser.AUTO, 'myGame');

	//Add the states
	game.state.add('Boot', Boot);
	game.state.add('Load', Load);
	game.state.add('MainMenu', MainMenu);
	game.state.add('GamePlay', GamePlay);
	game.state.start('Boot');
}