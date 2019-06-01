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
		game.load.audio('beats', 'audio/ost/guitarsample2.mp3');
		game.load.audio('Cradle', 'audio/ost/Cradle.mp3');
		game.load.audio('Together', 'audio/ost/Together.mp3');
		game.load.audio('Separate', 'audio/ost/Separate.mp3');
		game.load.audio('Tether', 'audio/ost/Tether.mp3');
		
		game.load.audio('meow', 'audio/sfx/meow22.mp3');
		game.load.audio('oneIntro', 'audio/sfx/sfx_level_one_intro.mp3');
		game.load.audio('oneOutro', 'audio/sfx/sfx_level_one_outro.mp3');
		game.load.audio('twoIntro', 'audio/sfx/sfx_level_two_intro.mp3');
		game.load.audio('twoOutro', 'audio/sfx/sfx_level_two_outro.mp3');
		
		
		
		game.load.image('title', 'img/cats/title.png');
		game.load.image('gameOver', 'img/cats/gameOver.png');

		game.load.image('redball', 'img/cats/redYarn.png');
		game.load.image('blueball', 'img/cats/blueYarn.png');
		//Once we have a tilemap, we'll load it in
        //game.load.spritesheet('mapTiles', 'img/bg_floor.png', 32, 32);
        //game.load.tilemap('testLevel','img/ProjectGeminiTest.json', null, Phaser.Tilemap.TILED_JSON);
        
        //Load in the character sprites
        game.load.image('cat1', 'img/cats/cat1.png');
        game.load.image('cat2', 'img/cats/cat2.png');
        //Load the platforms and background
        game.load.image('Together', 'img/bg/Together.png');
        game.load.image('bluePlat', 'img/objects/120 blue ledge 1.png');
        game.load.image('backgroundInside', 'img/bg/background.png');
        game.load.image('backgroundPlain', 'img/bg/small_both_sides.png');
		game.load.image('Houses', 'img/bg/Houses.png');
		game.load.image('Windows', 'img/bg/Windows.png');
		game.load.image('Fences', 'img/bg/120 cloud puzzle.png');
		game.load.image('Clouds', 'img/bg/120_cloud_puzzle2.png');





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