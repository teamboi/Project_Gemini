// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// Load state

var Load = function(game) {};
Load.prototype = {
	preload: function() {
		// setup loading bar

		var loadingBar = this.add.sprite(game.width/2, game.height/2, 'linePurp');
		loadingBar.anchor.setTo(0.5,1);
		game.load.setPreloadSprite(loadingBar);
		
		// Load in text
		game.load.text('dialog', 'assets/Dialog.txt');

		// Used in printing out the animation indices
		if(debugAnimation === true){
			game.load.json('playerAnimations', 'assets/img/cats/blueCat.json');
		}

		game.load.path = 'assets/audio/ost2/';
		// Load in the soundtrack
		game.load.audio('Cradle', 'Cradle3.mp3');
		game.load.audio('Together', 'Together3.mp3');
		game.load.audio('Separate', 'Separate3.mp3');
		game.load.audio('Tether', 'Tether3.mp3');
		
		game.load.path = 'assets/audio/sfx/';
		// Load in the sfx
		game.load.audio('short_meow1', 'Cat_1_Short.wav');
		game.load.audio('short_meow2', 'Cat_2_Short.wav');
		game.load.audio('long_meow1', 'Cat_1_Long.mp3');
		game.load.audio('long_meow2', 'Cat_2_Long.mp3');

		//https://freesound.org/people/mhtaylor67/sounds/126041/
		game.load.audio('windowClick', '126041__mhtaylor67__gate-latch.wav');
		game.load.audio('poof', 'poof.wav');
		
		game.load.path = 'assets/img/menu/';
		// Load in the menu items
		game.load.image('title', 'titleScreen.png');
		game.load.image('playButton', 'playButton.png');
		game.load.image('credits1', 'credits1.png');
		game.load.image('credits2', 'credits2.png');

		game.load.path = 'assets/img/cats/';
		// Load in the chapter title cards
		game.load.image('theme', 'theme.png');
		game.load.image('gameOver', 'gameOver.png');
		game.load.image('togetherTitle', 'togetherTitle.png');
		game.load.image('housesTitle', 'housesTitle.png');
		game.load.image('tetherTitle', 'tetherTitle.png');
		game.load.image('endTitle', 'endTitle.png');

		// Load in object sprites
		game.load.image('redBall', 'redYarn.png');
		game.load.image('blueBall', 'blueYarn.png');
		game.load.image('purpBall', 'purpleYarn.png');
		game.load.image('heart', 'heart.png');

		game.load.path = 'assets/img/keys/';
		// Load in the keys
		game.load.image('leftArrow', 'leftKey.png');
		game.load.image('rightArrow', 'rightKey.png');
		game.load.image('upArrow', 'upKey.png');
		game.load.image('downArrow', 'downKey.png');
		game.load.image('wKey', 'wKey.png');
		game.load.image('aKey', 'aKey.png');
		game.load.image('sKey', 'sKey.png');
		game.load.image('dKey', 'dKey.png');
		game.load.image('adKey', 'adKey.png');
		game.load.image('rightleftKey', 'rightleftKey.png');
		
		game.load.path = 'assets/img/cats/';
		//Load in the character sprites
		game.load.atlas('cat1', 'redCat.png', 'redCat.json');
		game.load.image('cat1Hitbox', 'hitbox14.png');
		//game.load.image('cat2', 'img/cats/cat2.png');
		game.load.atlas('cat2', 'blueCat.png', 'blueCat.json');

		game.load.path = 'assets/img/bg/';
		//Load the platforms and background
		game.load.image('Together', 'Together.png');
		game.load.image('backgroundInside', 'background.png');
		game.load.image('backgroundPlain', 'small_both_sides.png');
		game.load.image('Cats', 'newer_Cats.png');
		game.load.image('Cradle', 'newer_Cradle.png');
		game.load.image('Threads', 'lvl3.png');
		game.load.image('Houses', 'new_Houses.png');
		game.load.image('Windows', 'Windows3.png');
		game.load.image('Fences', 'Fences4.png');
		game.load.image('Clouds1', 'newest_cloud_puzzle2.png');
		game.load.image('Clouds2', 'newest_cloud_puzzle3.png');
		game.load.image('Clouds3', 'newest_cloud_puzzle4.png');
		
		game.load.path = 'assets/img/objects/';
		//Load in object sprites
		game.load.image('bluePlat', '120 blue ledge 1.png');
		game.load.image('redWindow', 'redPullWindow.png');
		game.load.image('blueWindow', 'bluePullWindow.png');
		game.load.image('redLatch', 'redLatch2.png');
		game.load.image('blueLatch', 'blueLatch2.png');
		game.load.image('cloud2', 'cloud2.png');
		game.load.image('cloud6', 'cloud6.png');
		game.load.image('purpCloud', 'purpCloud.png');
		game.load.image('purpCloud2', 'purpCloud2.png');
		game.load.image('purpCloud3', 'purpCloud3.png');
		game.load.image('purpCloud4', 'purpCloud4.png');
		game.load.image('textBlur', 'textBlur.png');

		game.load.path = 'assets/tilemaps/';

		// load in tilemaps
		game.load.tilemap('levelOne','Cats.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('levelTwo','Cradle2.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('levelTwoPointFive','String.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('levelThree','NewHouses.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('levelFour','Windows.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('levelFive','Fences.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('levelSix','Clouds.json', null, Phaser.Tilemap.TILED_JSON);

		game.load.path = 'assets/';
		game.load.spritesheet('mapTiles', 'img/objects/Pixel3.png', 8, 8);
		game.load.spritesheet('visuals', 'tilesets/120_tileset.png', 32, 32);

		// align the game to be centered in the window
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.refresh();
	},
	create: function() {
		

		game.state.start('Theme', true, false); // Theme

	
	}
};