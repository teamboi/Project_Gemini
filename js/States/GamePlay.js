// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
// Initialize the level 1 state
var GamePlay = function(game){};
GamePlay.prototype = {
	init: function(){
		// initialize variables for gameplay
		this.timer = 0;
	},
	preload: function(){
		/*// Load in the yarn balls
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
        game.load.image('backgroundInside', 'img/background.png');*/
	},
	create: function(){
/* For when we create a tileset
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

        //Instantiate the collision groups for the objects can interact
        this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
        this.surrogateCollisionGroup = game.physics.p2.createCollisionGroup();
        this.platformCollisionGroup = game.physics.p2.createCollisionGroup();
        this.yarnBallCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();

        //Begin this level's music
        this.beats = game.add.audio('beats');
		this.beats.play('', 0, 1, true);	
		//Add in the background sprite
        this.room = game.add.sprite(0,-0.03,'backgroundInside');
        this.room.scale.setTo(0.12,0.112);
        //Create the tutorial text
        this.oneWinText = game.add.text(game.width/2 + 4.5, game.height/2 + 20, 'A + S to walk, D to jump', {font: 'Impact', fontSize: '27px', fill: '#FF7373'});
		this.oneWinText.anchor.set(0.5);
		this.oneWinText.inputEnabled = true;
		this.twoWinText = game.add.text(game.width/2 + 4.5, game.height/2 - 20, 'H + J to walk, K to jump', {font: 'Impact', fontSize: '27px', fill: '#9C6EB2'});
		this.twoWinText.anchor.set(0.5);
		this.twoWinText.inputEnabled = true;

        // Add in the players with the Player prefab constructor
        this.player1 = new Player(game, this, 100, 500, "cat1", 1);
        game.add.existing(this.player1);
        this.player1.body.setCollisionGroup(this.playerCollisionGroup);
        this.player1.body.collides([this.playerCollisionGroup, this.platformCollisionGroup, this.yarnBallCollisionGroup]);
        this.player2 = new Player(game, this, 400, 100, "cat2", 2);
        game.add.existing(this.player2);
        this.player2.body.setCollisionGroup(this.playerCollisionGroup);
        this.player2.body.collides([this.playerCollisionGroup, this.platformCollisionGroup, this.yarnBallCollisionGroup]);
        //Add the surrogate player so our string plays nicely
        this.surrogate = new Player(game, this, 300, 100, "cat1", 3);
        game.add.existing(this.surrogate);
        this.surrogate.body.setCollisionGroup(this.surrogateCollisionGroup);
        this.surrogate.body.collides([this.platformCollisionGroup, this.yarnBallCollisionGroup]);

        // Add in the yarn
        this.yarn = new Yarn(game, this, 'ball', this.player1, this.player2, this.surrogate);
        game.add.existing(this.yarn);
        this.constraint; // Create the constraint object to be turned on/off
        this.anchored = false; // Create safety switch for anchoring

        // Add platforms to both sides (they're hardcoded for now, hopefully Tiled later)
        this.createPlatform(380,530,120,10);
        this.createPlatform(290,405,80,10);
        this.createPlatform(90,155,130,10);
        this.createPlatform(410,250,300,10);
        //this.createPlatform(game.width/2, game.height/2, game.width, 1);//dividing line

        //Add the yarnballs for a little fun
        this.yarnBall = game.add.sprite(150,400,'blueball');
       	this.yarnBall.scale.setTo(0.08,0.08);
        game.add.existing(this.yarnBall);
        game.physics.p2.enable(this.yarnBall);
        this.yarnBall.body.setCollisionGroup(this.yarnBallCollisionGroup);
        this.yarnBall.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.platformCollisionGroup]);

        this.yarnBall2 = game.add.sprite(150,300,'redball');
       	this.yarnBall2.scale.setTo(0.08,0.08);
        game.add.existing(this.yarnBall2);
        game.physics.p2.enable(this.yarnBall2);
        this.yarnBall2.body.data.gravityScale = -1;
        this.yarnBall2.body.setCollisionGroup(this.yarnBallCollisionGroup);
        this.yarnBall2.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.platformCollisionGroup]);

	},
	update: function(){
		this.timer += 0.05; // Just using a hardcoded timer for now to let players learn the controls
		
		//Display text for level switching instructions
		if(this.timer > 200) {
			this.oneWinText.setText("Press Space for a puzzle!", true);
		}
		//Let the players decide when they want to move onto the puzzle
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.timer > 200){
			this.beats.destroy(); // Kill the music
			game.state.start('GamePlay2', true, false); // Change state to level 2
		}
	
		//Display the thread instructions after a while
		if(this.timer > 100 & this.timer < 200){
            this.oneWinText.setText("Press F to hold the Thread", true);
        }
        if(this.timer > 100){
           this.twoWinText.setText("Press L to hold the Thread", true);
        }
	},

	//Function to manually create the platforms
    createPlatform: function(x,y,width,height){
        var platform = game.add.sprite(x,y, 'bluePlat');
      	platform.scale.setTo(0.08,0.08);
        game.physics.p2.enable(platform, true);
        platform.body.setRectangle(width,height, 0, 0, 0);
        platform.body.static = true; // SO the platforms aren't affected by outside forces
        platform.body.setCollisionGroup(this.platformCollisionGroup);
        platform.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.yarnBallCollisionGroup]);
    }
}