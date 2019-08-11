// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for LevelManager
function LevelManager(game, gameplay, tilemap, backgroundImage, player1X, player1Y, player2X, player2Y, enableYarn, enableBarrier){
	Phaser.Sprite.call(this, game, 0, 0, 'ball');
	game.add.existing(this);
	this.gameplay = gameplay; // Obtains reference to gameplay state
	
	this.alpha = 0; // Makes the ugly green box invisible

	this.createPlatforms = function(){
		this.gameplay.testLevel = this.game.add.tilemap(tilemap);
        this.gameplay.testLevel.addTilesetImage('pixel3', 'mapTiles');

        // Load in the platforms layer
        this.gameplay.bgLayer = this.gameplay.testLevel.createLayer('Platforms');
        
        // Just for safety
        this.gameplay.bgLayer.resizeWorld();
       
        //Instantiate the collision groups for the objects can interact
        this.gameplay.playerCollisionGroup = game.physics.p2.createCollisionGroup();
        this.gameplay.surrogateCollisionGroup = game.physics.p2.createCollisionGroup();
        this.gameplay.platformCollisionGroup = game.physics.p2.createCollisionGroup();
        this.gameplay.objectCollisionGroup = game.physics.p2.createCollisionGroup();
        this.gameplay.cloudCollisionGroup = game.physics.p2.createCollisionGroup();
        this.gameplay.limiterCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();
        
        //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
        //  This call returns an array of body objects which you can perform addition actions on if
        //  required. There is also a parameter to control optimising the map build.
        this.gameplay.testLevel.setCollisionByExclusion([]);
        this.gameplay.platforms = game.physics.p2.convertTilemap(this.gameplay.testLevel, this.gameplay.bgLayer, true);
        for(var i = 0; i < this.gameplay.platforms.length; i++){
            this.gameplay.platforms[i].setCollisionGroup(this.gameplay.platformCollisionGroup);
            this.gameplay.platforms[i].collides([this.gameplay.playerCollisionGroup, this.gameplay.surrogateCollisionGroup, this.gameplay.objectCollisionGroup]);
        }
	}

	this.createBarrier = function(x, y, width, height){
    	var platform = game.add.sprite(x,y, 'line');
        this.gameplay.group.add(platform);
        //platform.scale.setTo(0.08,0.08);
        platform.anchor.setTo(0.5,1);
        game.physics.p2.enable(platform);
        platform.body.setRectangle(width,height, 0, 0, 0);
        platform.body.static = true;
        platform.body.setCollisionGroup(this.gameplay.platformCollisionGroup);
        platform.body.collides([this.gameplay.playerCollisionGroup, this.gameplay.surrogateCollisionGroup]);

        this.gameplay.barrier = platform;
    }

    this.glow = function() {
        this.gameplay.redGlow = game.add.sprite(this.gameplay.player1.x, this.gameplay.player2.y, 'heart');
        this.gameplay.redGlow.anchor.setTo(0.5,0.5);
        this.gameplay.redGlow.scale.setTo(1.7,1.7);
        this.gameplay.redGlow.alpha = 0;
    }

    //  Enable p2 physics
    game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
    game.physics.p2.gravity.y = 800; // Add vertical gravity
    game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

    // Fade into the scene
    game.camera.flash(0xffffff, 2000);
    // Instantiate the fade events
    game.camera.onFadeComplete.add(this.gameplay.resetFade, this.gameplay);

    this.createPlatforms();

    // Call the background image
    this.gameplay.room = game.add.sprite(0,0,backgroundImage);

    // Initialise z-masking groups
    this.gameplay.group = game.add.group();

    if(enableBarrier === true){
    	// Create the world barriers
    	this.createBarrier(game.width/2, game.height/2, game.width, 1);
    }
    else if(enableBarrier != false){
    	console.log(enableBarrier + " is not a valid state for enableBarrier. Please use true or false");
    }

    // Add in the players with the Player prefab constructor
    this.gameplay.player1 = new Player(game, this.gameplay, player1X, player1Y, "cat1", 'cat1Hitbox', 1);
    this.gameplay.player2 = new Player(game, this.gameplay, player2X, player2Y, "cat2", 'cat1Hitbox', 2);

    // Create the yarn if specified
    if(enableYarn === true){
    	//Add the surrogate player so our string plays nicely
    	this.gameplay.surrogate = new Player(game, this.gameplay, 300, 100, "cat1", 'cat1Hitbox',3);
    	// Add in the yarn
    	this.gameplay.yarn = new Yarn(game, this.gameplay, 'ball', this.gameplay.player1, this.gameplay.player2, this.gameplay.surrogate);
    }
    else if(enableYarn != false){
    	console.log(enableYarn + " is not a valid state for enableYarn. Please use true or false");
    }

    // Add the story text
    this.gameplay.dialog = new DialogManager(game, this.gameplay, "ball");
    this.gameplay.dialog.TypeIntro(2);
    this.gameplay.dialog.TypeOutro(2);

    //Create the tutorial text
    this.gameplay.tutorialText();

    //Add the objective glow
    this.glow();
}

// inherit prototype from Phaser.Sprite and set constructor to DialogManager
LevelManager.prototype = Object.create(Phaser.Sprite.prototype);
LevelManager.prototype.constructor = LevelManager;