// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos
//https://github.com/teamboi/Project_Gemini

// let's keep our code tidy with strict mode 👊
"use strict";

/*WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Revalia']
    }

};*/

// define global variables
var game;
var constraint;

var layerText = 1;
var layerWindow = 10;
var layerMovePlatform = 11;
var layerDrapes = 12;
var layerBarrier = 25;
var layerYarnBall = 50;
var layerYarn = 90;
var layerPlayer = 100;

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