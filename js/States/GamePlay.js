// let's keep our code tidy with strict mode 👊
"use strict";

var GamePlay = function(game){};
GamePlay.prototype = {
	init: function(){
		// initialize variables for gameplay
		this.oneWon = false;
		this.twoWon = false;
			
	},
	preload: function(){
		// Assets from the example I used
        game.load.image('ball', 'assets/sprites/yarn_ball.png');
        game.load.image('background', 'assets/games/starstruck/background2.png');
        game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);

        game.load.spritesheet('mapTiles', 'img/bg_floor.png', 32, 32);
        game.load.tilemap('testLevel','img/ProjectGeminiTest.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('cat1', 'img/cat1.png');
        game.load.image('cat2', 'img/cat2.png');
        
        game.load.image('background', 'assets/games/starstruck/background2.png');
        game.load.image('backgroundInside', 'img/background.png');
        
        
        game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);

	},
	create: function(){
/*
        this.testLevel = this.game.add.tilemap('testLevel');
        this.testLevel.addTilesetImage('bg_floor', 'mapTiles');

        this.testLevel.setCollisionByExclusion([]);

        this.bgLayer = this.testLevel.createLayer('Background');

        this.bgLayer.resizeWorld();
*/
        //  Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
        game.physics.p2.gravity.y = 800; // Add vertical gravity
        game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

        this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
        this.surrogateCollisionGroup = game.physics.p2.createCollisionGroup();
        this.platformCollisionGroup = game.physics.p2.createCollisionGroup();
        this.yarnBallCollisionGroup = game.physics.p2.createCollisionGroup();

        game.physics.p2.updateBoundsCollisionGroup();

        // Add in the Level Manager
        //this.levelManager = new LevelManager(game, "ball");
       // game.add.existing(this.levelManager);

        this.beats = game.add.audio('beats');
		this.beats.play('', 0, 1, true);	

        this.room = game.add.sprite(0,0,'backgroundInside');
        this.room.scale.setTo(0.11,0.11);

        // Add in the players
        this.player1 = new Player(game, this, 100, 500, "cat1", 1);
        game.add.existing(this.player1);
        this.player1.body.setCollisionGroup(this.playerCollisionGroup);
        this.player1.body.collides([this.playerCollisionGroup, this.platformCollisionGroup, this.yarnBallCollisionGroup]);

        this.player2 = new Player(game, this, 400, 100, "cat2", 2);
        game.add.existing(this.player2);
        this.player2.body.setCollisionGroup(this.playerCollisionGroup);
        this.player2.body.collides([this.playerCollisionGroup, this.platformCollisionGroup, this.yarnBallCollisionGroup]);

        this.surrogate = new Player(game, this, 300, 100, "cat1", 3);
        game.add.existing(this.surrogate);
        this.surrogate.body.setCollisionGroup(this.surrogateCollisionGroup);
        this.surrogate.body.collides([this.platformCollisionGroup, this.yarnBallCollisionGroup]);

        // Add in the yarn
        this.yarn = new Yarn(game, this, 'ball', this.player1, this.player2, this.surrogate);
        game.add.existing(this.yarn);
		 //this.bg = game.add.tileSprite(0, 0, 1080, 800, 'background');
        this.constraint; // Create the constraint object to be turned on/off
        this.anchored = false; // Create safety switch for anchoring
        // var bounds = new Phaser.Rectangle(190, 100, 200, game.height);

        // Add platform at bottom
        this.createPlatform(400,550,100,10);
        this.createPlatform(500,450,100,10);
        this.createPlatform(50,450,100,10);

        this.createPlatform(50,200,100,10);
        this.createPlatform(400,200,400,10);

        this.yarnBall = game.add.sprite(50,400,'ball');
        game.add.existing(this.yarnBall);
        game.physics.p2.enable(this.yarnBall);
        this.yarnBall.body.setCollisionGroup(this.yarnBallCollisionGroup);
        this.yarnBall.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.platformCollisionGroup]);

        this.yarnBall2 = game.add.sprite(50,300,'ball');
        game.add.existing(this.yarnBall2);
        game.physics.p2.enable(this.yarnBall2);
        this.yarnBall2.body.data.gravityScale = -1;
        this.yarnBall2.body.setCollisionGroup(this.yarnBallCollisionGroup);
        this.yarnBall2.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.platformCollisionGroup]);

	},
	update: function(){

		//if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
		if(Phaser.Math.distance(this.yarnBall.x, this.yarnBall.y, this.player1.x, this.player1.y) < 50){
            var oneWin = game.add.text(game.width/2 + 4.5, game.height/2 + 32, 'Player 1 got their toy!', {font: 'Impact', fontSize: '32px', fill: '#ff0000'});
			oneWin.anchor.set(0.5);
			this.oneWon = true;
        }
        else {
        	this.oneWon = false;
        }
        if(Phaser.Math.distance(this.yarnBall2.x, this.yarnBall2.y, this.player2.x, this.player2.y) < 50){
            var twoWin = game.add.text(game.width/2 + 4.5, game.height/2 - 32, 'Player 2 got their toy!', {font: 'Impact', fontSize: '32px', fill: '#ff0000'});
			twoWin.anchor.set(0.5);
			this.twoWon = true;

        }
        else {
        	this.twoWon = false;
        }
        if(this.oneWon && this.twoWon) {
        	this.beats.destroy(); // Kill the music
            game.state.start('GameOver', true, false); // Change state to MainMenu
        }
	},

    createPlatform: function(x,y,width,height){
        var platform = game.add.sprite(x,y, 'background');
        game.physics.p2.enable(platform, true);
        platform.body.setRectangle(width,height, 0, 0, 0);
        platform.body.static = true;
        platform.body.setCollisionGroup(this.platformCollisionGroup);
        platform.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.yarnBallCollisionGroup]);
    }
}