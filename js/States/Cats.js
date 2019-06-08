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
        this.showExit = false;
        this.complete = false;
        this.oneVertOffset = 0;
        this.twoVertOffset = 0;
	},
	create: function(){

        //  Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
        game.physics.p2.gravity.y = 800; // Add vertical gravity
        game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

        // Fade into the scene
        game.camera.flash(0xffffff, 2000);
        // Instantiate the fade events
        game.camera.onFadeComplete.add(this.resetFade, this);

        // Call the loaded in tilemap assets
        this.createPlatforms();

        // Call the background image
        this.room = game.add.sprite(0,0,'Cats');

        this.group = game.add.group();

        //convertCollisionObjects(map, layer, addToWorld) 
        this.dialog = new DialogManager(game, this, "ball");
        this.dialog.TypeIntro(1);
        this.dialog.TypeOutro(1);
        
        

        // Add in the players with the Player prefab constructor

        this.player1 = new Player(game, this, 68, 516, "cat1", 'cat1Hitbox', 1);

        this.player2 = new Player(game, this, 818, 199, "cat2", 'cat1Hitbox', 2);

        this.tutorialText();
        this.glow();

        this.group.sort();

        //Create the tutorial text
        //this.tutorialText();

        //Add the surrogate player so our string plays nicely
       /* this.surrogate = new Player(game, this, 300, 100, "cat1", 3);
        game.add.existing(this.surrogate);*/

       /* this.newCloud = new MovePlatform(game, this, 600, 450, "cat2", 450, 300, "down", "cloud");
        game.add.existing(this.newCloud);

        this.newCloud2 = new MovePlatform(game, this, 200, 200, "cat2", 200, 300, "up", "cloud");
        game.add.existing(this.newCloud2);
/*
        // Add in the yarn
        this.yarn = new Yarn(game, this, 'ball', this.player1, this.player2, this.surrogate);
        game.add.existing(this.yarn);*/

        // Add platforms to both sides (they're hardcoded for now, hopefully Tiled later)
       /* this.createPlatform(380,530,120,10);
        this.createPlatform(290,405,80,10);
        this.createPlatform(90,155,130,10);
        this.createPlatform(410,250,300,10);*/
        //this.createPlatform(game.width/2, game.height/2, game.width, 1);//dividing line

        //Add the yarnballs for a little fun
        /*this.yarnBall = game.add.sprite(600,70,'redball');
       	this.yarnBall.scale.setTo(0.08,0.08);
        game.add.existing(this.yarnBall);
        game.physics.p2.enable(this.yarnBall, true);
        this.yarnBall.body.setCollisionGroup(this.objectCollisionGroup);
        this.yarnBall.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.platformCollisionGroup]);

*/
	},
	update: function(){
        
        this.p1Controls.x = this.player1.x;
        this.p1Controls.y = this.player1.y - this.oneVertOffset;
        
        this.p2Controls.x = this.player2.x;
        this.p2Controls.y = this.player2.y + this.twoVertOffset;

        if(game.math.difference(this.player1.body.x, game.width) < 400) {
            this.p1Controls.setText("W", true);
            this.oneVertOffset = 40;
            if(!this.outroPlaying) {
                this.outroPlaying = true;
                //this.narrate = game.add.audio('oneOutro');
                //this.narrate.play('', 0, 1, false);
                //this.narrate.volume = 1;
            }
        }
        if(game.math.difference(this.player2.body.x, 0) < 400) {
            this.p2Controls.setText("🡫", true);
            this.twoVertOffset = 40;
            this.showExit = true;
        }
        if(this.complete == true && this.outroPlaying == true) {
            game.time.events.add(2000, this.preFade, this);
        }
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
    },
    resetFade: function() {
        game.state.start('Cradle', true, false, this.ost);
        //game.camera.resetFX();
    },
	//Function to manually create the platforms
    createPlatforms: function(){
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
        console.log(this.testLevel.objects[0]);
    },
    tutorialText: function() {
        this.p1Controls = game.add.text(this.player1.body.x, this.player1.body.y, 'A          D', {font: 'Impact', fontSize: '40px', fill: '#FF7373'});
        this.p1Controls.anchor.set(0.5);
        this.p1Controls.inputEnabled = true;
        this.p1ControlsPosition = this.p1Controls.worldPosition;
        
        this.p2Controls = game.add.text(this.player2.body.x, this.player2.body.y, '🡨          🡪', {font: 'Impact', fontSize: '40px', fill: '#9C6EB2'});
        this.p2Controls.anchor.set(0.5);
        this.p2Controls.inputEnabled = true;
        this.p2ControlsPosition = this.p2Controls.worldPosition;

        this.exit = game.add.text(game.width/2, 100, '', {font: 'Impact', fontSize: '32px', fill: '#D85BFF'});
        this.exit.anchor.set(0.5);
        this.exit.inputEnabled = true;
    },
    exitText: function() {
        this.exit.setText("Press SPACE for more.", true);
        this.exit.alpha = 0;
        game.add.tween(this.exit).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}