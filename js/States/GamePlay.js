// let's keep our code tidy with strict mode 👊
"use strict";

var GamePlay = function(game){};
GamePlay.prototype = {
	init: function(){
		// initialize variables for gameplay
		
	},
	preload: function(){

    game.load.image('ball', 'assets/sprites/blue_ball.png');
    game.load.image('background', 'assets/games/starstruck/background2.png');
    game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);

	},
	create: function(){
		 this.bg = game.add.tileSprite(0, 0, 1800, 600, 'background');
    this.constraint; // Create the constraint object to be turned on/off
    this.anchored = false; // Create safety switch for anchoring
   // var bounds = new Phaser.Rectangle(190, 100, 200, game.height);
   

   
	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
    game.physics.p2.gravity.y = 800; // Add vertical gravity
    // game.physics.p2.restitution = 0.9;

    /* platforms = game.add.group(); // an attempt to create a wall
	platforms.enableBody = true;

			//Place a ground platform at the bottom of the level
	var ground = platforms.create(300, 0, 'ground');
	ground.scale.setTo(2, 20);
	ground.body.immovable = true;*/

    //  Add 2 sprites which we'll join with a string

    this.player1 = game.add.sprite(100, 400, 'dude');
    this.player1.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player1.animations.add('turn', [4], 20, true);
    this.player1.animations.add('right', [5, 6, 7, 8], 10, true);

    
    game.physics.p2.enable(this.player1); // Enable p2 physics for player1. This creates a default rectangular body.
    
    this.player1.body.fixedRotation = true; // Prevents sprites from spinning wildly 

	this.player2 = game.add.sprite(600, 400, 'ball');

	game.physics.p2.enable(this.player2); // Enable p2 physics for player1. This creates a default rectangular body.
    this.player2.body.fixedRotation = true;// Prevents sprites from spinning wildly

   /* wall = game.add.sprite(400, 400, 'dude');
   game.physics.p2.enable(wall);
   // wall.enableBody = true;
    wall.body.setRectangle(10, 600);
    wall.body.immovable = true;*/

    //  Lock the two bodies together. The [0, 50] sets the distance apart (y: 80)
    //var constraint = game.physics.p2.createLockConstraint(sprite2, player, [0, 50], 80);

    /*customBounds = { left: null, right: null, top: null, bottom: null };

    createPreviewBounds(bounds.x, bounds.y, bounds.width, bounds.height);
	*/
    //  Just to display the bounds
   /* var graphics = game.add.graphics(bounds.x, bounds.y);
    graphics.lineStyle(4, 0xffd900, 1);
    graphics.drawRect(0, 0, bounds.width, bounds.height);
    var sim = game.physics.p2;
    var wall = new p2.Body({ mass: 0, position: [ sim.pxmi(bounds.x), sim.pxmi(bounds.y) ], angle: 1.5707963267 });
    wall.addShape(new p2.Plane());
     sim.world.addBody(wall);*/

    this.cursors = game.input.keyboard.createCursorKeys(); // Instantiate the cirsor keys to take in input
	},
	update: function(){
		//var hitPlatform = game.physics.p2.collide(player, platforms);
	var dist = Phaser.Math.difference(this.player2.x, this.player1.x);
	//sprite2.body.setZeroVelocity();
	//wall.body.setZeroVelocity();

    if (this.cursors.left.isDown)
    {
    	this.player2.body.moveLeft(400);
    }
    else if (this.cursors.right.isDown)
    {
    	this.player2.body.moveRight(400);
    }

    if (this.cursors.up.isDown)
    {
        //sprite2.body.moveUp(400);
        this.player1.body.moveLeft(400);
    }
    else if (this.cursors.down.isDown)
    {
        //sprite2.body.moveDown(400);
        this.player1.body.moveRight(400);
    }

    if(game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) { // spacebar to anchor both players
    	console.log(this.anchored);
    	if(this.anchored == false) {
    		//this.constraint = game.physics.p2.createLockConstraint(sprite2, player, [0, 50], 80);
    		console.log(dist); // Print the anchor distance
    		this.constraint = game.physics.p2.createDistanceConstraint(this.player2.body, this.player1.body, dist, [0.5,0], [0.5,0]); // Lock the player's x difference
    		this.anchored = true;
    	}
    }
    else {
    	console.log(this.anchored);
    	if(this.anchored == true) {
    		game.physics.p2.removeConstraint(this.constraint); // Unclock the player's x difference
    		this.anchored = false;
    	}
    }
	},
}