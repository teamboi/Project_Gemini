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

        //  Add 2 sprites which we'll join with a string

        /*this.player1 = game.add.sprite(100, 400, 'dude');
        this.player1.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player1.animations.add('turn', [4], 20, true);
        this.player1.animations.add('right', [5, 6, 7, 8], 10, true);

        
        game.physics.p2.enable(this.player1); // Enable p2 physics for player1. This creates a default rectangular body.
        
        this.player1.body.fixedRotation = true; // Prevents sprites from spinning wildly 

    	this.player2 = game.add.sprite(800, 400, 'ball');

    	game.physics.p2.enable(this.player2); // Enable p2 physics for player1. This creates a default rectangular body.
        this.player2.body.fixedRotation = true;// Prevents sprites from spinning wildly*/

        //this.cursors = game.input.keyboard.createCursorKeys(); // Instantiate the cirsor keys to take in input
	},
	update: function(){
	/*var dist = Phaser.Math.difference(this.player2.x, this.player1.x);
	
	// Left and right moves player 2
    if (this.cursors.left.isDown)
    {
    	this.player2.body.moveLeft(400);
    }
    else if (this.cursors.right.isDown)
    {
    	this.player2.body.moveRight(400);
    }

    //Up and down moves player 1
    if (this.cursors.up.isDown)
    {
        this.player1.body.moveLeft(400);
    }
    else if (this.cursors.down.isDown)
    {
        this.player1.body.moveRight(400);
    }

    if(game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) { // spacebar to anchor both players
    	console.log(this.anchored);
    	if(this.anchored == false) {
    		console.log(dist); // Print the anchor distance
    		this.constraint = game.physics.p2.createDistanceConstraint(this.player2.body, this.player1.body, dist, [0.5,0], [0.5,0]); // Lock the player's x difference
    		this.anchored = true;
    	}
    }
    else {
    	console.log(this.anchored);
    	if(this.anchored == true) {
    		game.physics.p2.removeConstraint(this.constraint); // Unlock the player's x difference
    		this.anchored = false;
    	}
    }*/
	},
}