// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for LevelManager
function LevelManager(game, gameplay, tilemap, backgroundImage, dialogNum, player1X, player1Y, player2X, player2Y, enableYarn, enableBarrier){
	Phaser.Sprite.call(this, game, 0, 0, 'ball');
	game.add.existing(this);
	var gp = gameplay; // Obtains reference to gameplay state
	
	this.alpha = 0; // Makes the ugly green box invisible

	this.createBarrier = function(x, y, width, height){
		if(enableBarrier === true){
			var platform = game.add.sprite(x,y, 'line');
	        gp.group.add(platform);
	        //platform.scale.setTo(0.08,0.08);
	        platform.anchor.setTo(0.5,1);
	        game.physics.p2.enable(platform);
	        platform.body.setRectangle(width,height, 0, 0, 0);
	        platform.body.static = true;
	        platform.body.setCollisionGroup(gp.platformCollisionGroup);
	        platform.body.collides([gp.playerCollisionGroup, gp.surrogateCollisionGroup]);

	        gp.barrier = platform;
	    }
	    else if(enableBarrier != false){
	    	console.log(enableBarrier + " is not a valid state for enableBarrier. Please use true or false");
	    }
    }

	this.createPlatforms = function(){
		gp.testLevel = this.game.add.tilemap(tilemap);
        gp.testLevel.addTilesetImage('pixel3', 'mapTiles');

        // Load in the platforms layer
        gp.bgLayer = gp.testLevel.createLayer('Platforms');
        
        // Just for safety
        gp.bgLayer.resizeWorld();
       
        //Instantiate the collision groups for the objects can interact
        gp.playerCollisionGroup = game.physics.p2.createCollisionGroup();
        gp.surrogateCollisionGroup = game.physics.p2.createCollisionGroup();
        gp.platformCollisionGroup = game.physics.p2.createCollisionGroup();
        gp.objectCollisionGroup = game.physics.p2.createCollisionGroup();
        gp.cloudCollisionGroup = game.physics.p2.createCollisionGroup();
        gp.limiterCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();
        
        //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
        //  This call returns an array of body objects which you can perform addition actions on if
        //  required. There is also a parameter to control optimising the map build.
        gp.testLevel.setCollisionByExclusion([]);
        gp.platforms = game.physics.p2.convertTilemap(gp.testLevel, gp.bgLayer, true);
        for(var i = 0; i < gp.platforms.length; i++){
            gp.platforms[i].setCollisionGroup(gp.platformCollisionGroup);
            gp.platforms[i].collides([gp.playerCollisionGroup, gp.surrogateCollisionGroup, gp.objectCollisionGroup]);
        }
	}

	this.createYarn = function(){
		if(enableYarn === true){
	    	//Add the surrogate player so our string plays nicely
	    	gp.surrogate = new Player(game, gp, 300, 100, "cat1", 'cat1Hitbox',3);
	    	// Add in the yarn
	    	gp.yarn = new Yarn(game, gp, 'ball', gp.player1, gp.player2, gp.surrogate);
	    }
	    else if(enableYarn != false){
	    	console.log(enableYarn + " is not a valid state for enableYarn. Please use true or false");
	    }
	}

    this.glow = function() {
        gp.redGlow = game.add.sprite(gp.player1.x, gp.player2.y, 'heart');
        gp.redGlow.anchor.setTo(0.5,0.5);
        gp.redGlow.scale.setTo(1.7,1.7);
        gp.redGlow.alpha = 0;
    }

    // Enable p2 physics
    game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
    game.physics.p2.gravity.y = 800; // Add vertical gravity
    game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

    // Fade into the scene
    game.camera.flash(0xffffff, 2000);
    // Instantiate the fade events
    game.camera.onFadeComplete.add(gp.resetFade, gp);

    this.createPlatforms();

    // Call the background image
    gp.room = game.add.sprite(0,0,backgroundImage);

    // Initialise z-masking groups
    gp.group = game.add.group();

    // Create the world barriers
    this.createBarrier(game.width/2, game.height/2, game.width, 1);

    // Add in the players with the Player prefab constructor
    gp.player1 = new Player(game, gp, player1X, player1Y, "cat1", 'cat1Hitbox', 1);
    gp.player2 = new Player(game, gp, player2X, player2Y, "cat2", 'cat1Hitbox', 2);

    // Create the yarn if specified
    this.createYarn();

    // Add the story text
    gp.dialog = new DialogManager(game, gp, "ball");
    gp.dialog.TypeIntro(dialogNum);
    gp.dialog.TypeOutro(dialogNum);

    //Create the tutorial text
    gp.tutorialText();

    //Add the objective glow
    this.glow();

    // Sort the z-masking groups
    gp.group.sort();
}

// inherit prototype from Phaser.Sprite and set constructor to DialogManager
LevelManager.prototype = Object.create(Phaser.Sprite.prototype);
LevelManager.prototype.constructor = LevelManager;