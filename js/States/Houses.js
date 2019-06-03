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
            
    },
    create: function(){
        
        // Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
        game.physics.p2.gravity.y = 800; // Add vertical gravity
        game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

        game.camera.onFadeComplete.add(this.resetFade, this);
        game.camera.flash(0x000000, 2000);

        //this.room = game.add.sprite(0,0,'Houses');
       // this.room.scale.setTo(0.12,0.112);
      //For when we create a tileset
        this.testLevel = this.game.add.tilemap('levelThree');
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

          //this.testLevel.setCollisionGroup(this.platformCollisionGroup);
     // this.testLevel.setCollisionBetween([], true);
      this.testLevel.setCollisionByExclusion([]);
      this.platforms = game.physics.p2.convertTilemap(this.testLevel, this.bgLayer, true);
     // console.log(game.physics.p2.convertTilemap(this.testLevel, 'Tile Layer 1', true));
      console.log(this.platforms);
     // game.add.existing(this.platforms[0]);
     for(var i = 0; i < this.platforms.length; i++){
      this.platforms[i].setCollisionGroup(this.platformCollisionGroup);
      
      this.platforms[i].collides([this.playerCollisionGroup, this.surrogateCollisionGroup]);
     }

        this.fishBowl = game.add.sprite(834, 428, 'fishbowl'); 
      //  game.add.existing(this.fishBowl);
        //game.physics.p2.enable(this.fishBowl);

        this.flower = game.add.sprite(839, 299, 'flower');

        this.room = game.add.sprite(0,0,'Houses');
        //Instantiate the music for this level
       
        //Create the win state text
        this.oneWinText = game.add.text(game.width/2 + 4.5, game.height/2 + 32, '', {font: 'Impact', fontSize: '32px', fill: '#FF7373'});
        this.oneWinText.anchor.set(0.5);
        this.oneWinText.inputEnabled = true;
        this.twoWinText = game.add.text(game.width/2 + 4.5, game.height/2 - 30, '', {font: 'Impact', fontSize: '32px', fill: '#9C6EB2'});
        this.twoWinText.anchor.set(0.5);
        this.twoWinText.inputEnabled = true;

        // Add in the players
        this.player1 = new Player(game, this, 170, 682, "cat1", 1);
        game.add.existing(this.player1);
        this.player2 = new Player(game, this, 170, 40, "cat2", 2);
        game.add.existing(this.player2);
        //Create the surrogate player for the yarn
        this.surrogate = new Player(game, this, 300, 100, "cat1", 3);
        game.add.existing(this.surrogate);

        // Add in the yarn
        this.yarn = new Yarn(game, this, 'ball', this.player1, this.player2, this.surrogate);
        game.add.existing(this.yarn);
   

        this.createPlatform(game.width/2, game.height/2, game.width, 1);

    },
    update: function(){
        //Check for player one's win state
        if(this.oneWin == true && this.twoWin == true && this.complete == false) {
            this.complete = true;
            game.time.events.add(1000, this.fade, this);
        }
        if(Phaser.Math.distance(this.fishBowl.x, this.fishBowl.y, this.player1.x, this.player1.y) < 70){
            this.oneWin = true;
        }
        if(Phaser.Math.distance(this.flower.x, this.flower.y, this.player2.x, this.player2.y) < 70){
           this.twoWin = true;
        }
    },

    fade: function() {

    //  You can set your own fade color and duration
    game.camera.fade(0x000000, 1000);

    },
    resetFade: function() {
        game.state.start('Windows', true, false);
        //game.camera.resetFX();
        

    },

    //Helper function to create platforms the old fashion way
    createPlatform: function(x,y,width,height){
        var platform = game.add.sprite(x,y, 'line');
        platform.anchor.setTo(0.5,0.5);
        //platform.scale.setTo(0.08,0.08);
        game.physics.p2.enable(platform, true);
        platform.body.setRectangle(width,height, 0, 0, 0);
        platform.body.static = true;
        platform.body.setCollisionGroup(this.platformCollisionGroup);
        platform.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup]);
    }
}