// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
// Initialize the level 1 state
var Cats = function(game){};
Cats.prototype = {
	init: function(ost){
		// initialize variables for gameplay
        this.ost = ost;
        this.introPlaying = false;
        this.outroPlaying = false;
        this.complete = false;
        this.oneVertOffset = 5;
        this.twoVertOffset = 5;
        this.fadeComplete = false;
	},
	create: function(){
		this.levelManager = new LevelManager(game, this, 'levelOne', 'Cats', 68, 516, 818, 199, false, false);
        //  Enable p2 physics
        /*game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
        game.physics.p2.gravity.y = 800; // Add vertical gravity
        game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

        // Instantiate the fade events
        game.camera.onFadeComplete.add(this.resetFade, this);
        // Fade into the scene
        game.camera.flash(0xffffff, 2000);

        // Call the loaded in tilemap assets
        this.createPlatforms();

        // Call the background image
        this.room = game.add.sprite(0,0,'Cats');

        // Initialise z-masking groups
        this.group = game.add.group();

        // Create story text 
        this.dialog = new DialogManager(game, this, "ball");
        this.dialog.TypeIntro(1);
        this.dialog.TypeOutro(1);
        
        // Add in the players with the Player prefab constructor
        this.player1 = new Player(game, this, 68, 516, "cat1", 'cat1Hitbox', 1);
        this.player2 = new Player(game, this, 818, 199, "cat2", 'cat1Hitbox', 2);

        // Show the character controls
        this.tutorialText();

        // Create the objective glow
        this.glow();*/

        // Sort the z-masking groups
        this.group.sort();

	},
	update: function(){
        
        // Keep the player controls by the character sprites
        this.p1Controls.x = this.player1.x;
        this.p1Controls.y = this.player1.y - this.oneVertOffset;
        
        this.p2Controls.x = this.player2.x;
        this.p2Controls.y = this.player2.y + this.twoVertOffset;

        // Show the jump control once players are near a platform
        if(game.math.difference(this.player1.body.x, game.width/2) < 10) {
            this.p1Controls.setText("W", true);
            this.oneVertOffset = 40;
        }
        if(game.math.difference(this.player2.body.x, game.width/2) < 10) {
            this.p2Controls.setText("🡫", true);
            this.twoVertOffset = 40;
        }
        
        // Begin the level end
        if(this.complete == true) {
            game.time.events.add(1500, this.preFade, this);
        }

        // Check for players to be close to each other
        if(Phaser.Math.distance(this.player2.x, this.player2.y, this.player1.x, this.player1.y) < 70){
            this.complete = true;
            game.add.tween(this.redGlow).to( { alpha: 0.5 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.redGlow.x = (this.player1.x + this.player2.x)/2;
            this.redGlow.y = (this.player1.y + this.player2.y)/2;
        }
        else { 
            this.complete = false;
            game.add.tween(this.redGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
        }

	},
    // Create the objective glow
    /*glow: function() {
        this.redGlow = game.add.sprite(this.player1.x, this.player2.y, 'heart');
        this.redGlow.anchor.setTo(0.5,0.5);
        this.redGlow.scale.setTo(1.7,1.7);
        this.redGlow.alpha = 0;
    },*/
    // End the level if the cats are still close
    preFade: function() {
        if(this.complete == true) {
            game.time.events.add(1000, this.fade, this);
        }
    },
    // Fade out the level
    fade: function() {
        //  You can set your own fade color and duration
        game.camera.fade(0xffffff, 2000);
    },
    // Call the next level
    resetFade: function() {
        if(this.fadeComplete == false) {
            game.state.start('Cradle', true, false, this.ost);
            this.fadeComplete = true;
        }
    },

	//Function to manually create the platforms
    /*createPlatforms: function(){
        this.testLevel = this.game.add.tilemap('levelOne');
        this.testLevel.addTilesetImage('pixel3', 'mapTiles');

        // Load in the platforms layer
        this.bgLayer = this.testLevel.createLayer('Platforms');
        
        // Just for safety
        this.bgLayer.resizeWorld();
       
        //Instantiate the collision groups for the objects can interact
        this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
        this.surrogateCollisionGroup = game.physics.p2.createCollisionGroup();
        this.platformCollisionGroup = game.physics.p2.createCollisionGroup();
        this.objectCollisionGroup = game.physics.p2.createCollisionGroup();
        this.cloudCollisionGroup = game.physics.p2.createCollisionGroup();
        this.limiterCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();

        
        //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
        //  This call returns an array of body objects which you can perform addition actions on if
        //  required. There is also a parameter to control optimising the map build.
        this.testLevel.setCollisionByExclusion([]);
        this.platforms = game.physics.p2.convertTilemap(this.testLevel, this.bgLayer, true);
        for(var i = 0; i < this.platforms.length; i++){
            this.platforms[i].setCollisionGroup(this.platformCollisionGroup);
            this.platforms[i].collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.objectCollisionGroup]);
        }
    },*/
    // Show the movement controls dynamically
    tutorialText: function() {
        this.p1Controls = game.add.text(this.player1.body.x, this.player1.body.y - this.oneVertOffset, 'A        D', {font: 'Comfortaa', fontSize: '40px', fill: '#E25D85'});
        this.p1Controls.anchor.set(0.5);
        this.p1Controls.inputEnabled = true;
        this.p1ControlsPosition = this.p1Controls.worldPosition;
        
        this.p2Controls = game.add.text(this.player2.body.x, this.player2.body.y + this.oneVertOffset, '🡨        🡪', {font: 'Comfortaa', fontSize: '40px', fill: '#707DE0'});
        this.p2Controls.anchor.set(0.5);
        this.p2Controls.inputEnabled = true;
        this.p2ControlsPosition = this.p2Controls.worldPosition;
    },
}