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

		game.load.audio('Cradle', 'audio/ost2/Cradle2.mp3');
		game.load.audio('Together', 'audio/ost2/Together2.mp3');
		game.load.audio('Separate', 'audio/ost2/Separate2.mp3');
		game.load.audio('Tether', 'audio/ost2/Tether2.mp3');
		
		game.load.audio('short_meow1', 'audio/sfx/Cat_1_Short.mp3');
		game.load.audio('short_meow2', 'audio/sfx/Cat_2_Short.mp3');
		game.load.audio('long_meow1', 'audio/sfx/Cat_1_Long.mp3');
		game.load.audio('long_meow2', 'audio/sfx/Cat_2_Long.mp3');
		game.load.audio('oneIntro', 'audio/sfx/sfx_level_one_intro.mp3');
		game.load.audio('oneOutro', 'audio/sfx/sfx_level_one_outro.mp3');
		game.load.audio('twoIntro', 'audio/sfx/sfx_level_two_intro.mp3');
		game.load.audio('twoOutro', 'audio/sfx/sfx_level_two_outro.mp3');
		
		
		
		game.load.image('title', 'img/cats/title.png');
		game.load.image('theme', 'img/cats/theme.png');
		game.load.image('gameOver', 'img/cats/gameOver.png');
		game.load.image('togetherTitle', 'img/cats/togetherTitle.png');
		game.load.image('housesTitle', 'img/cats/housesTitle.png');
		game.load.image('tetherTitle', 'img/cats/tetherTitle.png');
		game.load.image('endTitle', 'img/cats/endTitle.png');


		game.load.image('redBall', 'img/cats/redYarn.png');
		game.load.image('blueBall', 'img/cats/blueYarn.png');
		game.load.image('purpBall', 'img/cats/purpleYarn.png');
		game.load.image('heart', 'img/cats/heart.png');
		
		
		//Once we have a tilemap, we'll load it in
        //game.load.spritesheet('mapTiles', 'img/bg_floor.png', 32, 32);
        //game.load.tilemap('testLevel','img/ProjectGeminiTest.json', null, Phaser.Tilemap.TILED_JSON);
        
        //Load in the character sprites
       	//game.load.image('cat1', 'img/cats/cat1.png');
        game.load.atlas('cat1', 'img/cats/redCat.png', 'img/cats/redCat.json');
        game.load.image('cat1Hitbox', 'img/cats/cat1HitBox2.png');
        //game.load.image('cat2', 'img/cats/cat2.png');
        game.load.atlas('cat2', 'img/cats/blueCat.png', 'img/cats/blueCat.json');
        //Load the platforms and background
        game.load.image('Together', 'img/bg/Together.png');
        game.load.image('bluePlat', 'img/objects/120 blue ledge 1.png');
        game.load.image('backgroundInside', 'img/bg/background.png');
        game.load.image('backgroundPlain', 'img/bg/small_both_sides.png');
        game.load.image('Cats', 'img/bg/new_Cats.png');
        game.load.image('Cradle', 'img/bg/new_Cradle.png');
        game.load.image('Threads', 'img/bg/new_Threads.png');
		game.load.image('Houses', 'img/bg/new_Houses.png');
		game.load.image('Windows', 'img/bg/new_Windows.png');
		game.load.image('Fences', 'img/bg/new_Fences.png');
		game.load.image('Clouds1', 'img/bg/newer_cloud_puzzle2.png');
		game.load.image('Clouds2', 'img/bg/newer_cloud_puzzle3.png');
		game.load.image('Clouds3', 'img/bg/newer_cloud_puzzle4.png');
		
		//Load in object sprites
		game.load.image('redWindow', 'img/objects/redPullWindow.png');
		game.load.image('blueWindow', 'img/objects/bluePullWindow.png');
		game.load.image('redLatch', 'img/objects/redLatch2.png');
		game.load.image('blueLatch', 'img/objects/blueLatch2.png');
		game.load.image('cloud2', 'img/objects/cloud2.png');
		game.load.image('cloud6', 'img/objects/cloud6.png');
		game.load.image('purpCloud', 'img/objects/purpCloud.png');
		game.load.image('purpCloud2', 'img/objects/purpCloud2.png');
		
		game.load.image('line', 'img/bg/line.png');
		game.load.image('bubble', 'img/bg/bubble.png');


        game.load.tilemap('levelOne','tilemaps/Cats.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('levelTwo','tilemaps/Cradle.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('levelThree','tilemaps/NewHouses.json', null, Phaser.Tilemap.TILED_JSON);
        
        game.load.tilemap('levelFour','tilemaps/Windows.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('levelFive','tilemaps/Fences.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('levelSix','tilemaps/Clouds.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('mapTiles', 'img/objects/Pixel3.png', 8, 8);
		game.load.spritesheet('visuals', 'tilesets/120_tileset.png', 32, 32);

        game.load.path = 'js/';
        game.load.text('dialog', 'prefabs/Dialog.json');

        game.load.path = 'assets/';

		// align the game to be centered in the window
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.refresh();
	},
	create: function() {
		// go to Title state
		game.state.start('Cats'); // Theme
	}
};