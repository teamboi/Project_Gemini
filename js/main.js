// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos
//https://github.com/teamboi/Project_Gemini

// let's keep our code tidy with strict mode 👊
"use strict";

// define global variables
var game;
var constraint;

// constants for layer sorting
var layerRedPlatforms = 0;
var layerBG = 1;
var layerText = 2;
var layerWindow = 10;
var layerMovePlatform = 11;
var layerDrapes = 12;
var layerBarrier = 25;
var layerYarnBall = 50;
var layerYarn = 100;
var layerPlayer = 90;

// variables for debugging
var debugLevel				= null; // default to null; replace with the name of the level to switch to
var debugAnimation			= false; // true or false; prints out animation indices for the player,
									// so I don't have to count, and it isn't calculated every time a level is loaded;
									// Also enables debug on FSM
var debugCollisionsObjects	= false; // true or false; enable collisions with objects
var debugCollisionsLevel	= false; // true or false; enable collisions for the platforms
var debugHotkeys			= false; // true or false; enables the use of hotkeys to navigate levels;
									// [ for prev, ] for next;
									// ' for restart;
var debugLoopLevel			= false; // true or false; when a level is completed, loop the level instead of proceeding; only works with levels, not transitions
var debugSkipIntro			= false; // true or false; skips the Team Boy Intro
var debugTransitions		= false; // true or false; makes level transitions instant
var debugWin				= false; // true or false; prevents level from being able to be won

var levelArr = ['MainMenu',
				'Together',
				'Cats',
				'Cradle',
				'Threads',
				'Separate',
				'Houses',
				'Windows',
				'Tether',
				'Fences',
				'Clouds',
				'Ending',
				'Credits1',
				'Credits2'];

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
	game.state.add('Credits1', Credits1);
	game.state.add('Credits2', Credits2);
	
	game.state.start('Boot');
}