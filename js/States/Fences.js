// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

//INstantiate the level 2 state
var Fences = function(game){};
Fences.prototype = {
    init: function(){
        // initialize variables for win conditions
        this.oneWin = false;
        this.twoWin = false;
        this.complete = false;
            
    },
    preload: function(){
        // Sprites for the yarnballs
        //game.load.image('redball', 'img/redYarn.png');
        //game.load.image('blueball', 'img/blueYarn.png');

        //Load in the tilemaps once w get them
        game.load.tilemap('LevelTwo','tilemaps/Fences.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('mapTiles', 'img/objects/Pixel3.png', 8, 8);
        
        //Load in the character sprites
       /* game.load.image('cat1', 'img/cat1.png');
        game.load.image('cat2', 'img/cat2.png');
        
        //load in the platform and backgrounds
        game.load.image('bluePlat', 'img/120 blue ledge 1.png');
        game.load.image('backgroundInside', 'img/120 bg both sides.png');*/
    },
    create: function(){
        
        // Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
        game.physics.p2.gravity.y = 800; // Add vertical gravity
        game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

        game.camera.onFadeComplete.add(this.resetFade, this);
        game.camera.flash(0x000000, 2000);

        this.room = game.add.sprite(0,0,'Fences');
       // this.room.scale.setTo(0.12,0.112);
      //For when we create a tileset
        this.testLevel = this.game.add.tilemap('LevelTwo');
        this.testLevel.addTilesetImage('pixel3', 'mapTiles');

        //this.testLevel.setCollisionByExclusion([]);

        this.bgLayer = this.testLevel.createLayer('Platforms');

        this.bgLayer.resizeWorld();


        // Create the collision groups
        this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
        this.surrogateCollisionGroup = game.physics.p2.createCollisionGroup();
        this.platformCollisionGroup = game.physics.p2.createCollisionGroup();
        this.yarnBallCollisionGroup = game.physics.p2.createCollisionGroup();
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
      
      this.platforms[i].collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.yarnBallCollisionGroup]);
     }

        //Instantiate the music for this level
        this.beats = game.add.audio('beats');
        this.beats.play('', 0, 1, true);
        //this.beats = game.add.audio('narrate');
        //this.beats.play('', 0, 1, false);


        //Add the background image
        //this.room = game.add.sprite(0,-0.03,'backgroundPlain');
        //this.room.scale.setTo(0.13,0.115);

        //Create the win state text
        this.oneWinText = game.add.text(game.width/2 + 4.5, game.height/2 + 32, '', {font: 'Impact', fontSize: '32px', fill: '#FF7373'});
        this.oneWinText.anchor.set(0.5);
        this.oneWinText.inputEnabled = true;
        this.twoWinText = game.add.text(game.width/2 + 4.5, game.height/2 - 30, '', {font: 'Impact', fontSize: '32px', fill: '#9C6EB2'});
        this.twoWinText.anchor.set(0.5);
        this.twoWinText.inputEnabled = true;

        // Add in the players
        this.player1 = new Player(game, this, 853, 596, "cat1", 1);
        game.add.existing(this.player1);
        this.player1.body.setCollisionGroup(this.playerCollisionGroup);
        this.player1.body.collides([this.playerCollisionGroup, this.platformCollisionGroup, this.yarnBallCollisionGroup]);
        this.player2 = new Player(game, this, 808, 257, "cat2", 2);
        game.add.existing(this.player2);
        this.player2.body.setCollisionGroup(this.playerCollisionGroup);
        this.player2.body.collides([this.playerCollisionGroup, this.platformCollisionGroup, this.yarnBallCollisionGroup]);
        //Create the surrogate player for the yarn
        this.surrogate = new Player(game, this, 300, 100, "cat1", 3);
        game.add.existing(this.surrogate);
        this.surrogate.body.setCollisionGroup(this.surrogateCollisionGroup);
        this.surrogate.body.collides([this.platformCollisionGroup, this.yarnBallCollisionGroup]);

        // Add in the yarn
        this.yarn = new Yarn(game, this, 'ball', this.player1, this.player2, this.surrogate);
        game.add.existing(this.yarn);
        this.constraint; // Create the constraint object to be turned on/off
        this.anchored = false; // Create safety switch for anchoring

        // Add platforms to both sides (they're hardcoded for now, hopefully Tiled later)
       /* this.createPlatform(400,550,100,10);
        this.createPlatform(500,450,100,10);
        this.createPlatform(50,450,100,10);
        this.createPlatform(50,200,100,10);
        this.createPlatform(400,200,400,10);
       */ this.createPlatform(game.width/2, game.height/2, game.width, 1);

        //Add in the yarn balls to act as player goals
        this.yarnBall = game.add.sprite(544,400,'blueball');
        this.yarnBall.scale.setTo(0.08,0.08);
        game.add.existing(this.yarnBall);
        game.physics.p2.enable(this.yarnBall);
        this.yarnBall.body.setCollisionGroup(this.yarnBallCollisionGroup);
        this.yarnBall.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.platformCollisionGroup]);

        this.yarnBall2 = game.add.sprite(544,300,'redball');
        this.yarnBall2.scale.setTo(0.08,0.08);
        game.add.existing(this.yarnBall2);
        game.physics.p2.enable(this.yarnBall2);
        this.yarnBall2.body.data.gravityScale = -1;
        this.yarnBall2.body.setCollisionGroup(this.yarnBallCollisionGroup);
        this.yarnBall2.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.platformCollisionGroup]);

    },
    update: function(){
        //Check for player one's win state
       if(this.oneWin == true && this.twoWin == true && this.complete == false) {
            this.complete = true;
            game.time.events.add(1000, this.fade, this);
        }
        if(Phaser.Math.distance(this.yarnBall.x, this.yarnBall.y, this.player1.x, this.player1.y) < 70){
            this.oneWin = true;
        }
        if(Phaser.Math.distance(this.yarnBall2.x, this.yarnBall2.y, this.player2.x, this.player2.y) < 70){
           this.twoWin = true;
        }
    },

    fade: function() {

    //  You can set your own fade color and duration
    game.camera.fade(0x000000, 1000);

    },
    resetFade: function() {
        game.state.start('Clouds', true, false);
        //game.camera.resetFX();
        

    },

    //Helper function to create platforms the old fashion way
    createPlatform: function(x,y,width,height){
        var platform = game.add.sprite(x,y, 'bluePlat');
        platform.scale.setTo(0.08,0.08);
        game.physics.p2.enable(platform, true);
        platform.body.setRectangle(width,height, 0, 0, 0);
        platform.body.static = true;
        platform.body.setCollisionGroup(this.platformCollisionGroup);
        platform.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.yarnBallCollisionGroup]);
    }
}