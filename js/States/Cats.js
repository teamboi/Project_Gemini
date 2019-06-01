// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
// Initialize the level 1 state
var Cats = function(game){};
Cats.prototype = {
	init: function(){
		// initialize variables for gameplay
		this.timer = 0;
	},
	preload: function(){
		// Load in the yarn balls
        //game.load.image('redball', 'img/redYarn.png');
		//game.load.image('blueball', 'img/blueYarn.png');
		//Once we have a tilemap, we'll load it in
       
        game.load.tilemap('testLevel','tilemaps/NewTutorial.json', null, Phaser.Tilemap.TILED_JSON);
        
        game.load.spritesheet('mapTiles', 'img/objects/Pixel3.png', 1, 1);
        /*
        //Load in the character sprites
        game.load.image('cat1', 'img/cat1.png');
        game.load.image('cat2', 'img/cat2.png');
        //Load the platforms and background
        game.load.image('bluePlat', 'img/120 blue ledge 1.png');
        game.load.image('backgroundInside', 'img/background.png');*/
	},
	create: function(){

        //  Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
        game.physics.p2.gravity.y = 800; // Add vertical gravity
        game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

        this.room = game.add.sprite(0,0,'backgroundPlain');
       // this.room.scale.setTo(0.12,0.112);
      //For when we create a tileset
        this.testLevel = this.game.add.tilemap('testLevel');
        this.testLevel.addTilesetImage('pixel3', 'mapTiles');
       // this.newTest = this.game.add.tilemap('House');
        //this.newTest.addTilesetImage('pixel3', 'mapTiles');


        //this.testLevel.setCollisionByExclusion([]);
       // this.newLayer = this.newTest.createLayer('Platforms');
        this.bgLayer = this.testLevel.createLayer('Platforms');

        this.bgLayer.resizeWorld();

        
        //this.testLevel.setCollisionBetween(1, 3000);

    //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
    //  This call returns an array of body objects which you can perform addition actions on if
    //  required. There is also a parameter to control optimising the map build.
       
        //Instantiate the collision groups for the objects can interact
        this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
        this.surrogateCollisionGroup = game.physics.p2.createCollisionGroup();
        this.platformCollisionGroup = game.physics.p2.createCollisionGroup();
        this.objectCollisionGroup = game.physics.p2.createCollisionGroup();
        this.cloudCollisionGroup = game.physics.p2.createCollisionGroup();
        this.limiterCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();

        
        //this.testLevel.setCollisionGroup(this.platformCollisionGroup);
        // this.testLevel.setCollisionBetween([], true);
        this.testLevel.setCollisionByExclusion([]);
        this.platforms = game.physics.p2.convertTilemap(this.testLevel, this.bgLayer, true);
        // console.log(game.physics.p2.convertTilemap(this.testLevel, 'Tile Layer 1', true));
        console.log(this.platforms);
        // game.add.existing(this.platforms[0]);
        for(var i = 0; i < this.platforms.length; i++){
            this.platforms[i].setCollisionGroup(this.platformCollisionGroup);
      
            this.platforms[i].collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.objectCollisionGroup]);
        }
        console.log(this.testLevel.objects[0]);
      

        //convertCollisionObjects(map, layer, addToWorld) 

        //Begin this level's music
        this.beats = game.add.audio('beats');
		this.beats.play('', 0, 1, true);	
        this.narrate = game.add.audio('narrate');
        this.narrate.play('', 0, 1, false);
        this.narrate.volume = 0.35;
		//Add in the background sprite
        //this.room = game.add.sprite(0,-0.03,'backgroundInside');
        //this.room.scale.setTo(0.12,0.112);
        //Create the tutorial text
        this.oneWinText = game.add.text(game.width/2 + 4.5, game.height/2 + 20, 'A + D to walk, W to jump', {font: 'Impact', fontSize: '27px', fill: '#FF7373'});
		this.oneWinText.anchor.set(0.5);
		this.oneWinText.inputEnabled = true;
		this.twoWinText = game.add.text(game.width/2 + 4.5, game.height/2 - 20, 'Left + Right to walk, Up to jump', {font: 'Impact', fontSize: '27px', fill: '#9C6EB2'});
		this.twoWinText.anchor.set(0.5);
		this.twoWinText.inputEnabled = true;

        // Add in the players with the Player prefab constructor
        this.player1 = new Player(game, this, 400, 400, "cat1", 1);
        game.add.existing(this.player1);
        this.player2 = new Player(game, this, 400, 320, "cat2", 2);
        game.add.existing(this.player2);
        //Add the surrogate player so our string plays nicely
        this.surrogate = new Player(game, this, 300, 100, "cat1", 3);
        game.add.existing(this.surrogate);

        this.newCloud = new MovePlatform(game, this, 200, 550, "cat2", 550, 400, "down", "cloud");
        game.add.existing(this.newCloud);

        this.newCloud2 = new MovePlatform(game, this, 200, 200, "cat2", 200, 300, "up", "cloud");
        game.add.existing(this.newCloud2);

        // Add in the yarn
        this.yarn = new Yarn(game, this, 'ball', this.player1, this.player2, this.surrogate);
        game.add.existing(this.yarn);

        // Add platforms to both sides (they're hardcoded for now, hopefully Tiled later)
       /* this.createPlatform(380,530,120,10);
        this.createPlatform(290,405,80,10);
        this.createPlatform(90,155,130,10);
        this.createPlatform(410,250,300,10);*/
        //this.createPlatform(game.width/2, game.height/2, game.width, 1);//dividing line

        //Add the yarnballs for a little fun
        this.yarnBall = game.add.sprite(600,70,'redball');
       	this.yarnBall.scale.setTo(0.08,0.08);
        game.add.existing(this.yarnBall);
        game.physics.p2.enable(this.yarnBall, true);
        this.yarnBall.body.setCollisionGroup(this.objectCollisionGroup);
        this.yarnBall.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.platformCollisionGroup]);

        this.yarnBall2 = game.add.sprite(400,500,'blueball');
       	this.yarnBall2.scale.setTo(0.08,0.08);
        game.add.existing(this.yarnBall2);
        game.physics.p2.enable(this.yarnBall2, true);
        this.yarnBall2.body.data.gravityScale = -1;
        this.yarnBall2.body.setCollisionGroup(this.objectCollisionGroup);
        this.yarnBall2.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.platformCollisionGroup]);

	},
	update: function(){
		this.timer += 0.05; // Just using a hardcoded timer for now to let players learn the controls
		
		//Display text for level switching instructions
		if(this.timer > 200) {
			this.oneWinText.setText("Press Space for a puzzle!", true);
		}
		//Let the players decide when they want to move onto the puzzle
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {//} && this.timer > 200){
			this.beats.destroy(); // Kill the music
			game.state.start('Threads', true, false); // Change state to level 2
		}
	
		//Display the thread instructions after a while
		/*if(this.timer > 100 & this.timer < 200){
            this.oneWinText.setText("Press S to hold the Thread", true);
        }
        if(this.timer > 100){
           this.twoWinText.setText("Press Down to hold the Thread", true);
        }*/
        if(Phaser.Math.distance(this.yarnBall.x, this.yarnBall.y, this.player1.x, this.player1.y) < 70){
            this.oneWinText.setText("Press S to hold the Thread", true);
        }
        if(Phaser.Math.distance(this.yarnBall2.x, this.yarnBall2.y, this.player2.x, this.player2.y) < 70){
           this.twoWinText.setText("Press Down to hold the Thread", true);
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