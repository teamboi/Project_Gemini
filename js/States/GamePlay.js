// let's keep our code tidy with strict mode 👊
"use strict";

var GamePlay = function(game){};
GamePlay.prototype = {
	init: function(){
		// initialize variables for gameplay
		
	},
	preload: function(){
		// Assets from the example I used
        game.load.image('ball', 'assets/sprites/blue_ball.png');
        game.load.image('background', 'assets/games/starstruck/background2.png');
        game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);

	},
	create: function(){
        // Add in the Level Manager
        this.levelManager = new LevelManager(game, "ball");
        game.add.existing(this.levelManager);

        // Add in the players
        this.player1 = new Player(game, 100, game.world.height/2, "ball", 1);
        game.add.existing(this.player1);
        this.player2 = new Player(game, 400, game.world.height/2, "ball", 2);
        game.add.existing(this.player2);

        // Add in the yarn
        this.yarn = new Yarn(game, 'ball', this.player1, this.player2);
        game.add.existing(this.yarn);
		 //this.bg = game.add.tileSprite(0, 0, 1080, 800, 'background');
        this.constraint; // Create the constraint object to be turned on/off
        this.anchored = false; // Create safety switch for anchoring
        // var bounds = new Phaser.Rectangle(190, 100, 200, game.height);
       
    	//	Enable p2 physics
    	game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
        game.physics.p2.gravity.y = 800; // Add vertical gravity
        game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

        // Add platform at bottom
        this.bg = game.add.sprite(500,game.height, 'background');
        game.add.existing(this.bg);
        game.physics.p2.enable(this.bg, true);
        this.bg.body.setRectangle(game.width,50, 0, 0, 0);
        this.bg.body.static = true;
        
        // Add platform at top
        this.bg2 = game.add.sprite(500,0, 'background');
        game.add.existing(this.bg2);
        game.physics.p2.enable(this.bg2, true);
        this.bg2.body.setRectangle(game.width,50, 0, 0, 0);
        this.bg2.body.static = true;
	},
	update: function(){
        
	},
}