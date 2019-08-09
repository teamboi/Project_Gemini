// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

//INstantiate the level 2 state
var Fences = function(game){};
Fences.prototype = {
    init: function(ost){
        // initialize variables for win conditions
        this.ost = ost;
        this.oneWin = false;
        this.twoWin = false;
        this.complete = false;
        this.fadeComplete = false;
            
    },
    create: function(){
        // Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
        game.physics.p2.gravity.y = 800; // Add vertical gravity
        game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

        // Fade in scene
        game.camera.onFadeComplete.add(this.resetFade, this);
        game.camera.flash(0xffffff, 2000);


        // Call the loaded in tilemap assets
        this.createPlatforms();

         // Add the level objectives
        this.fishBowl = game.add.sprite(79, 404, 'fishbowl');
        this.flower = game.add.sprite(79, 304, 'flower');

        this.room = game.add.sprite(0,0,'Fences');

        this.group = game.add.group();

        // Create barrier between worlds
        this.createBarrier(game.width/2, game.height/2, game.width, 1);

        this.dialog = new DialogManager(game, this, "ball");
        this.dialog.TypeIntro(6);
        this.dialog.TypeOutro(6);
        
        // Add in the players
        this.player1 = new Player(game, this, 771, 501, "cat1", 'cat1Hitbox', 1);

        this.player2 = new Player(game, this, 808, 257, "cat2", 'cat1Hitbox', 2);
        //Create the surrogate player for the yarn
        this.surrogate = new Player(game, this, 300, 100, "cat1", 'cat1Hitbox', 3);

        // Add in the yarn
        this.yarn = new Yarn(game, this, 'ball', this.player1, this.player2, this.surrogate);

        this.glow();

        this.group.sort();

    },
    update: function(){
        //Check for player one's win state
       if(this.oneWin == true && this.twoWin == true && this.complete == false) {
            this.complete = true;
            game.time.events.add(1000, this.fade, this);
        }
        if(Phaser.Math.distance(this.fishBowl.x, this.fishBowl.y, this.player1.x, this.player1.y) < 70){
            this.oneWin = true;
            game.add.tween(this.redGlow).to( { alpha: 0.4 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.redGlow.x = this.player1.x;
            this.redGlow.y = this.player1.y;
        }
        else { 
            this.oneWin = false;
            game.add.tween(this.redGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
        }
        if(Phaser.Math.distance(this.flower.x, this.flower.y, this.player2.x, this.player2.y) < 70){
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
    glow: function() {
        this.redGlow = game.add.sprite(this.player1.x, this.player1.y, 'heart');
        this.redGlow.anchor.setTo(0.5,0.5);
        this.redGlow.scale.setTo(1.3,1.3);
        this.redGlow.alpha = 0;
        this.blueGlow = game.add.sprite(this.player2.x, this.player2.y, 'heart');
        this.blueGlow.anchor.setTo(0.5,0.5);
        this.blueGlow.scale.setTo(1.3,-1.3);
        this.blueGlow.alpha = 0;
    },
    fade: function() {
    //  You can set your own fade color and duration
        game.camera.fade(0xffffff, 1000);
    },
    resetFade: function() {
        if(this.fadeComplete == false) {
            game.state.start('Clouds', true, false, this.ost);
            this.fadeComplete = true;
        }
    },

    //Helper function to create platforms the old fashion way
    createBarrier: function(x,y,width,height){
        var platform = game.add.sprite(x,y, 'line');
        //platform.scale.setTo(0.08,0.08);
        this.group.add(platform);
        game.physics.p2.enable(platform);
        platform.anchor.setTo(0.5,1);
        platform.body.setRectangle(width,height, 0, 0, 0);
        platform.body.static = true;
        platform.body.setCollisionGroup(this.platformCollisionGroup);
        platform.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup]);
    },
    createPlatforms: function() {
        //For when we create a tileset
        this.testLevel = this.game.add.tilemap('levelFive');
        this.testLevel.addTilesetImage('pixel3', 'mapTiles');

        //this.testLevel.setCollisionByExclusion([]);
 
        this.bgLayer = this.testLevel.createLayer('Platforms');

        this.bgLayer.resizeWorld();


        // Create the collision groups
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
            this.platforms[i].collides([this.playerCollisionGroup, this.surrogateCollisionGroup]);
        }
    },
}