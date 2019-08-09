// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for LevelManager
function LevelManager(game, gameplay, key){
	Phaser.Sprite.call(this, game, 0, 0, key);
	game.add.existing(this);
	this.gameplay = gameplay; // Obtains reference to gameplay state
	
	this.alpha = 0; // Makes the ugly green box invisible

	this.createPlatforms = function(){
		this.gameplay.testLevel = this.game.add.tilemap('levelOne');
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
        for(var i = 0; i < this.platforms.length; i++){
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
    }

    this.tutorialText = function(){ //This changes per level
        //Create the win state text
        this.gameplay.oneWinText = game.add.text(game.width/2 + 4.5, game.height/2 + 32, '', {font: 'Impact', fontSize: '32px', fill: '#FF7373'});
        this.gameplay.oneWinText.anchor.set(0.5);
        this.gameplay.oneWinText.inputEnabled = true;
        this.gameplay.twoWinText = game.add.text(game.width/2 + 4.5, game.height/2 - 30, '', {font: 'Impact', fontSize: '32px', fill: '#9C6EB2'});
        this.gameplay.twoWinText.anchor.set(0.5);
        this.gameplay.twoWinText.inputEnabled = true;
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
    this.room = game.add.sprite(0,0,'Cradle');
    this.group = game.add.group();

    // Add the story text
    this.dialog = new DialogManager(game, this, "ball");
    this.dialog.TypeIntro(2);
    this.dialog.TypeOutro(2);

    // Add in the players with the Player prefab constructor
    this.player1 = new Player(game, this, game.width/2, 416, "cat1", 'cat1Hitbox', 1);
    this.player2 = new Player(game, this, game.width/2, 350, "cat2", 'cat1Hitbox', 2);

    //Add the surrogate player so our string plays nicely
    this.surrogate = new Player(game, this, 300, 100, "cat1", 'cat1Hitbox',3);

    //Create the tutorial text
    this.tutorialText();
    this.glow();

    // Add in the yarn
    this.yarn = new Yarn(game, this, 'ball', this.player1, this.player2, this.surrogate);

    // Sort the z-order group
    this.group.sort();
}

// inherit prototype from Phaser.Sprite and set constructor to DialogManager
LevelManager.prototype = Object.create(Phaser.Sprite.prototype);
LevelManager.prototype.constructor = LevelManager;