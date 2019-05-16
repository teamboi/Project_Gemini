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
		game.load.audio('narrate', 'audio/sfx_test_narration.mp3');
		
		game.load.image('title', 'img/title.png');
		game.load.image('gameOver', 'img/gameOver.png');

		game.load.image('redball', 'img/redYarn.png');
		game.load.image('blueball', 'img/blueYarn.png');
		//Once we have a tilemap, we'll load it in
        //game.load.spritesheet('mapTiles', 'img/bg_floor.png', 32, 32);
        //game.load.tilemap('testLevel','img/ProjectGeminiTest.json', null, Phaser.Tilemap.TILED_JSON);
        
        //Load in the character sprites
        game.load.image('cat1', 'img/cat1.png');
        game.load.image('cat2', 'img/cat2.png');
        //Load the platforms and background
        game.load.image('bluePlat', 'img/120 blue ledge 1.png');
        game.load.image('backgroundInside', 'img/background.png');
        game.load.image('backgroundPlain', 'img/120 bg both sides.png');

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