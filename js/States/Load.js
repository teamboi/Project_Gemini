// Load state

var Load = function(game) {};
Load.prototype = {
	preload: function() {
		// setup loading bar
		var loadingBar = this.add.sprite(game.width/2, game.height/2, 'loading');
		loadingBar.anchor.set(0.5);
		game.load.setPreloadSprite(loadingBar);

		// load in the sprites

		game.load.path = 'assets/';
		game.load.audio('beats', ['audio/guitarsample2.mp3']);


		game.load.audio('meow', ['audio/meow22.mp3']);
		game.load.image('catlove', 'img/CatLove.png');
		// load in the sprite atlases with animations
		//game.load.atlas('spr_player', 'player.png', 'player.json');
		//game.load.atlas('spr_freshman', 'freshman.png', 'freshman.json');

		// load in the beginning audio and music
		// load in the sound effects
		//game.load.path = 'assets/audio/SFX/';

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