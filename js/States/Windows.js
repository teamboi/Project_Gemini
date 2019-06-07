// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

//INstantiate the level 2 state
var Windows = function(game){};
Windows.prototype = {
    init: function(ost){
        // initialize variables for win conditions
        this.ost = ost;
        this.oneWin = false;
        this.twoWin = false;
        this.oneCanWin = false;
        this.twoCanWin = false;
        this.complete = false;
            
    },
    create: function(){
        
        // Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
        game.physics.p2.gravity.y = 800; // Add vertical gravity
        game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

        game.camera.onFadeComplete.add(this.resetFade, this);
        game.camera.flash(0xffffff, 2000);

        this.createPlatforms();

        this.room = game.add.sprite(0,0,'Windows');

        this.dialog = new DialogManager(game, "ball");
        game.add.existing(this.dialog);
        this.dialog.TypeIntro(5);
        this.dialog.TypeOutro(5);
       
        this.tutorialText();

        this.glow();

        // Add in the players
        this.player1 = new Player(game, this, 273, 682, "cat1", 1);
        game.add.existing(this.player1);
        this.player2 = new Player(game, this, 170, 164, "cat2", 2);
        game.add.existing(this.player2);
        //Create the surrogate player for the yarn
        this.surrogate = new Player(game, this, 300, 100, "cat1", 3);
        game.add.existing(this.surrogate);

        // Add in the yarn
        this.yarn = new Yarn(game, this, 'ball', this.player1, this.player2, this.surrogate);
        game.add.existing(this.yarn);
        
        // Create the world barriers
        this.createBarrier(game.width/2, game.height/2, game.width, 1);


        this.window1 = new WindowMask(game, this, 727, 550, 'blueWindow', 'blueLatch', 600, 481, 'down');
        game.add.existing(this.window1);

        this.window2 = new WindowMask(game, this, 656, 150, 'redWindow', 'redLatch', 106, 250, 'up');

        game.add.existing(this.window2);
    },
    update: function(){
        //Check for player one's win state
        if(this.oneWin == true && this.twoWin == true && this.complete == false) {
            this.complete = true;
            game.time.events.add(1000, this.fade, this);
        }
       if(this.window1.latch.isMoving == 'locked'){
            this.oneCanWin = true;
            console.log("here");
        }
        if(this.window2.latch.isMoving == 'locked'){
           this.twoCanWin = true;
           console.log("here");
        }
        if(Phaser.Math.difference(this.window1.x, this.player1.x) < 300 && this.oneCanWin == true) {
            this.oneWin = true;
            game.add.tween(this.redGlow).to( { alpha: 0.3 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.redGlow.x = this.player1.x;
            this.redGlow.y = this.player1.y;
        }
        else { 
            this.oneWin = false;
            game.add.tween(this.redGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
        }
        if(Phaser.Math.difference(this.window2.x, this.player2.x) < 205 && this.twoCanWin == true) {
            this.twoWin = true;
            game.add.tween(this.blueGlow).to( { alpha: 0.3 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.blueGlow.x = this.player2.x;
            this.blueGlow.y = this.player2.y;
        }
        else {
            this.twoWin = false;
            game.add.tween(this.blueGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
        }
    },

    fade: function() {
        //Fade camera and level theme
        game.camera.fade(0xffffff, 2000);
        this.ost.fadeOut(2000);
    },
    resetFade: function() {
        game.state.start('Tether', true, false, this.ost);
    },
    glow: function() {
        this.redGlow = game.add.sprite(834, 428, 'heart');
        this.redGlow.anchor.setTo(0.5,0.5);
        this.redGlow.scale.setTo(1.3,1.3);
        this.redGlow.alpha = 0;
        this.blueGlow = game.add.sprite(839, 299, 'heart');
        this.blueGlow.anchor.setTo(0.5,0.5);
        this.blueGlow.scale.setTo(1.3, -1.3);
        this.blueGlow.alpha = 0;
          
    },
    //Helper function to create platforms the old fashion way
    createBarrier: function(x,y,width,height){
        var platform = game.add.sprite(x,y, 'line');
        platform.anchor.setTo(0.5,0.5);
        game.physics.p2.enable(platform);
        platform.body.setRectangle(width,height, 0, 0, 0);
        platform.body.static = true;
        platform.body.setCollisionGroup(this.platformCollisionGroup);
        platform.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup]);
    },
    //Helper function to create platforms the new fancy way
    createPlatforms: function(){
        this.testLevel = this.game.add.tilemap('levelFour');
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
        console.log(this.testLevel.objects[0]);
    },
     tutorialText: function() {
        //Create the win state text
        this.oneWinText = game.add.text(game.width/2 + 4.5, game.height/2 + 32, '', {font: 'Impact', fontSize: '32px', fill: '#FF7373'});
        this.oneWinText.anchor.set(0.5);
        this.oneWinText.inputEnabled = true;
        this.twoWinText = game.add.text(game.width/2 + 4.5, game.height/2 - 30, '', {font: 'Impact', fontSize: '32px', fill: '#9C6EB2'});
        this.twoWinText.anchor.set(0.5);
        this.twoWinText.inputEnabled = true;
    }
}