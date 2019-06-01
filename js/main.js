// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos
//https://github.com/teamboi/Project_Gemini

// let's keep our code tidy with strict mode 👊
"use strict";

// define global variables
var game;
var constraint;

// when window loads, create the game
window.onload = function(){
	game = new Phaser.Game(896,704, Phaser.AUTO, 'myGame');

	//Add the states
	game.state.add('Boot', Boot);
	game.state.add('Load', Load);
	game.state.add('MainMenu', MainMenu);
	game.state.add('Cats', Cats);
	game.state.add('Threads', Threads);
	game.state.add('Houses', Houses);
	game.state.add('Windows', Windows);
	game.state.add('Fences', Fences);
	game.state.add('Clouds', Clouds);
	
	
	game.state.add('GameOver', GameOver);
	
	game.state.start('Boot');
}