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
	game.state.add('Theme', Theme);
	game.state.add('MainMenu', MainMenu);
	// Chapter One
	game.state.add('Together', Together);
	game.state.add('Cats', Cats);
	game.state.add('Cradle', Cradle);
	game.state.add('Threads', Threads);
	// Chapter Two
	game.state.add('Separate', Separate);
	game.state.add('Houses', Houses);
	game.state.add('Windows', Windows);
	// Chapter 3
	game.state.add('Tether', Tether);
	game.state.add('Fences', Fences);
	game.state.add('Clouds', Clouds);
	
	game.state.add('Ending', Ending);
	game.state.add('GameOver', GameOver);
	
	game.state.start('Boot');
}