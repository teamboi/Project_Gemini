// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

//INstantiate the level 2 state
var Clouds = function(game){};
Clouds.prototype = {
    init: function(ost){
        // initialize variables for win conditions
        this.ost = ost;
        this.oneCanWin = false;
        this.twoCanWin = false;
        this.canWin = false;

        this.oneWin = false;
        this.twoWin = false;
        this.complete = false;
        this.barrierDestroyed = false;
            
    },
   create: function(){
        
        // Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
        game.physics.p2.gravity.y = 800; // Add vertical gravity
        game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

        // Fade in scene
        game.camera.onFadeComplete.add(this.resetFade, this);
        game.camera.flash(0xffffff, 2000);

        //For when we create a tileset
        this.createPlatforms();

        this.room = game.add.sprite(0,0,'Clouds1');
        this.room2 = game.add.sprite(0,0,'Clouds2');
        this.room2.alpha = 0;
        this.room3 = game.add.sprite(0,0,'Clouds3');
        this.room3.alpha = 0;

        this.group = game.add.group();
        
        this.dialog = new DialogManager(game, this, "ball");
        this.dialog.TypeIntro(7);
        this.dialog.TypeOutro(7);
        

        // Add in the players
        this.player1 = new Player(game, this, 85, 500, "cat1",'cat1Hitbox', 1);

        this.player2 = new Player(game, this, 32, 200, "cat2", 'cat1Hitbox', 2);
        //Create the surrogate player for the yarn
        this.surrogate = new Player(game, this, 300, 100, "cat1", 'cat1Hitbox', 3);

        // Add in the yarn
        this.yarn = new Yarn(game, this, 'ball', this.player1, this.player2, this.surrogate);

        this.barrier = this.createBarrier(game.width/2, game.height/2, game.width, 1);

        this.cloud1 = new Cloud(game, this, 450, 607, 'purpCloud', 607, 350, 'down');

        this.cloud2 = new Cloud(game, this, 450, 99, 'purpCloud', 99, 350, 'up');

        this.glow();

        this.group.sort();
    },
    update: function(){
        //Check for player one's win state
        if(this.complete == true) {
            game.time.events.add(2000, this.preFade, this);
        }
        if(this.cloud1.cloud.isMoving == 'locked'){
            this.oneCanWin = true;
            game.add.tween(this.room2).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0);
        }
        if(this.cloud2.cloud.isMoving == 'locked'){
           this.twoCanWin = true;
        }

        if(this.oneCanWin == true && this.twoCanWin == true) {
            if(this.barrierDestroyed == false) {
                this.barrierDestroyed = true;
                game.time.events.add(1000, this.destoyBarrier, this);
                game.add.tween(this.barrier).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0);
                game.add.tween(this.room3).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0);
            }
            if(Phaser.Math.distance(this.player2.x, this.player2.y, this.player1.x, this.player1.y) < 90 && Phaser.Math.distance(this.player2.x, this.player2.y, game.width/2, game.height/2)){
                this.complete = true;
                game.add.tween(this.redGlow).to( { alpha: 0.5 }, 100, Phaser.Easing.Linear.None, true, 0);
                this.redGlow.x = (this.player1.x + this.player2.x)/2;
                this.redGlow.y = (this.player1.y + this.player2.y)/2;
            }
            else { 
                this.complete = false;
                game.add.tween(this.redGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
            }
        }
    },
    glow: function() {
        this.redGlow = game.add.sprite(this.player1.x, this.player2.y, 'heart');
        this.redGlow.anchor.setTo(0.5,0.5);
        this.redGlow.scale.setTo(1.7,1.7);
        this.redGlow.alpha = 0;
    },
    preFade: function() {
        if(this.complete == true) {
            game.time.events.add(1000, this.fade, this);
        }
    },
    fade: function() {
        //  You can set your own fade color and duration
        game.camera.fade(0xffffff, 2000);
        this.ost.fadeOut(2500);
    },
    resetFade: function() {
        game.state.start('Ending', true, false, this.ost);
    },
    destoyBarrier: function() {
        this.barrier.destroy();
    },

    //Helper function to create platforms the old fashion way
    createBarrier: function(x,y,width,height){
        var platform = game.add.sprite(x,y, 'line');
        this.group.add(platform);
        //platform.scale.setTo(0.08,0.08);
        platform.anchor.setTo(0.5,0.5);
        game.physics.p2.enable(platform);
        platform.body.setRectangle(width,height, 0, 0, 0);
        platform.body.static = true;
        platform.body.setCollisionGroup(this.platformCollisionGroup);
        platform.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup]);
        return platform;
    },
    createPlatforms: function(){
        this.testLevel = this.game.add.tilemap('levelSix');
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
    }
}