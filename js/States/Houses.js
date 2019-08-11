// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

//INstantiate the level 2 state
var Houses = function(game){};
Houses.prototype = {
    init: function(ost){
        // initialize variables for win conditions
        this.ost = ost;
        this.oneWin = false;
        this.twoWin = false;
        this.complete = false;   
        this.fadeComplete = false;      
    },
    create: function(){
        var nextLevel = "Windows";
        var ostFadeOut = false;
        var tilemap = "levelThree";
        var backgroundImage = "Houses";
        var dialogNum = 4;
        var howManyGlows = 2;
        var redGlowCoords = [834, 428];
        var blueGlowCoords = [839, 299];
        var player1Coords = [640, 665];
        var player2Coords = [640, 40];
        var enableYarn = true;
        var enableBarrier = true;

        this.levelManager = new LevelManager(game, this, nextLevel, ostFadeOut, tilemap, backgroundImage, dialogNum, howManyGlows, redGlowCoords[0], redGlowCoords[1], blueGlowCoords[0], blueGlowCoords[1], player1Coords[0], player1Coords[1], player2Coords[0], player2Coords[1], enableYarn, enableBarrier);
        /*// Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
        game.physics.p2.gravity.y = 800; // Add vertical gravity
        game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

        // Fade in scene
        game.camera.onFadeComplete.add(this.resetFade, this);
        // Fade into the scene
        game.camera.flash(0xffffff, 2000);

        // Call the loaded in tilemap assets
        this.createPlatforms();*/

        // Add the level objectives
        //this.fishBowl = game.add.sprite(830, 428, 'fishbowl'); 
        //this.flower = game.add.sprite(810, 299, 'flower');

        /*// Call the background sprite
        this.room = game.add.sprite(0,0,'Houses');

        // Initialise z-masking groups
        this.group = game.add.group();

        // Add the barrier between worlds
        this.createBarrier(game.width/2, game.height/2, game.width, 1);

        // Add the story text
        this.dialog = new DialogManager(game, this, "ball");
        this.dialog.TypeIntro(4);
        this.dialog.TypeOutro(4);
      
        // Add in the players
        this.player1 = new Player(game, this, 640, 665, "cat1", 'cat1Hitbox', 1);
        this.player2 = new Player(game, this, 640, 40, "cat2", 'cat1Hitbox', 2);
        //Create the surrogate player for the yarn
        this.surrogate = new Player(game, this, 300, 100, "cat1", 'cat1Hitbox', 3);

        // Add in the yarn
        this.yarn = new Yarn(game, this, 'ball', this.player1, this.player2, this.surrogate);

        // Add in objective glow
        this.glow();

        this.group.sort();*/

    },
    update: function(){
        //Check for player one's win state
        if(this.oneWin == true && this.twoWin == true && this.complete == false) {
            this.complete = true;
            this.levelManager.win();
            //game.time.events.add(1000, this.fade, this);
        }
        if(Phaser.Math.distance(this.fishBowl.x, this.fishBowl.y, this.player1.x, this.player1.y) < 70) {
            this.oneWin = true;
            game.add.tween(this.redGlow).to( { alpha: 0.4 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.redGlow.x = this.player1.x;
            this.redGlow.y = this.player1.y;
        }
        else { 
            this.oneWin = false;
            game.add.tween(this.redGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
        }
        if(Phaser.Math.distance(this.flower.x, this.flower.y, this.player2.x, this.player2.y) < 80) {
            this.twoWin = true;
            game.add.tween(this.blueGlow).to( { alpha: 0.4 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.blueGlow.x = this.player2.x;
            this.blueGlow.y = this.player2.y;
        }
        else {
            this.twoWin = false;
            game.add.tween(this.blueGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
        }
    },
    /*createLevelObstacles: function(){
        this.fishBowl = game.add.sprite(830, 428, 'fishbowl');
        game.add.existing(this.fishbowl);
        this.flower = game.add.sprite(810, 299, 'flower');
        game.add.existing(this.flower);
    }*/

    /*glow: function() {
        this.redGlow = game.add.sprite(834, 428, 'heart');
        this.redGlow.anchor.setTo(0.5,0.5);
        this.redGlow.scale.setTo(1.3,1.3);
        this.redGlow.alpha = 0;
        this.blueGlow = game.add.sprite(839, 299, 'heart');
        this.blueGlow.anchor.setTo(0.5,0.5);
        this.blueGlow.scale.setTo(1.3, -1.3);
        this.blueGlow.alpha = 0;
    },*/

    /*fade: function() {
        //  You can set your own fade color and duration
        game.camera.fade(0xffffff, 1000);
    },
    resetFade: function() {
       if(this.fadeComplete == false) {
            game.state.start('Windows', true, false, this.ost);
            this.fadeComplete = true;
        }
    },*/

    /*//Helper function to create platforms the old fashion way
    createPlatforms: function(){
        this.testLevel = this.game.add.tilemap('levelThree');
        //this.visuals = this.game.add.tilemap('levelThreeVis');
        this.testLevel.addTilesetImage('pixel3', 'mapTiles');
        //this.visuals.addTilesetImage('Objects', 'visuals');


        // Load in the platforms layer
        this.bgLayer = this.testLevel.createLayer('Platforms');
        //this.visuals.createLayer('Tiles');
        
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
    },
    createBarrier: function(x,y,width,height){
        var platform = game.add.sprite(x,y, 'line');
        this.group.add(platform);
        //platform.scale.setTo(0.08,0.08);
        platform.anchor.setTo(0.5,1);
        game.physics.p2.enable(platform);
        platform.body.setRectangle(width,height, 0, 0, 0);
        platform.body.static = true;
        platform.body.setCollisionGroup(this.platformCollisionGroup);
        platform.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup]);
    },
    tutorialText: function() {
        //Create the win state text
        this.oneWinText = game.add.text(game.width/2 + 4.5, game.height/2 + 32, '', {font: 'Impact', fontSize: '32px', fill: '#FF7373'});
        this.oneWinText.anchor.set(0.5);
        this.oneWinText.inputEnabled = true;
        this.twoWinText = game.add.text(game.width/2 + 4.5, game.height/2 - 30, '', {font: 'Impact', fontSize: '32px', fill: '#9C6EB2'});
        this.twoWinText.anchor.set(0.5);
        this.twoWinText.inputEnabled = true;
    }*/
}