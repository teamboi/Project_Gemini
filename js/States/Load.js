// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// Load state

var Load = function(game) {};
Load.prototype = {
	preload: function() {
		// setup loading bar
		var loadingBar = this.add.sprite(game.width/2, game.height/2, 'loading');
		loadingBar.anchor.set(0.5);
		game.load.setPreloadSprite(loadingBar);

		// For now, this merely loads in the music and the title image, but it'll be expanded later
		game.load.path = 'assets/';
		game.load.audio('beats', 'audio/guitarsample2.mp3');
		game.load.audio('meow', 'audio/meow22.mp3');
		game.load.image('title', 'img/title.png');
		game.load.image('gameOver', 'img/gameOver.png');

		// align the game to be centered in the window
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.refresh();
	},
	create: function() {
		// go to Title state
		game.state.start('MainMenu');
	}
};