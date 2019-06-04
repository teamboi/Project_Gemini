// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
// Initialize the level 1 state
var Threads = function(game){};
Threads.prototype = {
	init: function(ost){
		// initialize variables for gameplay
        this.ost = ost;
        this.oneWin = false;
        this.twoWin = false;
        this.complete = false;
        this.outroPlaying = false;
          
	},
	create: function(){

        //  Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
        game.physics.p2.gravity.y = 800; // Add vertical gravity
        game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

        game.camera.onFadeComplete.add(this.resetFade, this);
        game.camera.flash(0x000000, 2000);

        this.narrate = game.add.audio('twoIntro');
        this.narrate.play('', 0, 1, false);
        this.narrate.volume = 1;

        //For when we create a tileset
        this.createPlatforms();
        this.room = game.add.sprite(0,0,'Cats');
        //Create the tutorial text
        this.tutorialText();

        // Add in the players with the Player prefab constructor
        this.player1 = new Player(game, this, 450, 400, "cat1", 1);
        game.add.existing(this.player1);
        this.player2 = new Player(game, this, 460, 320, "cat2", 2);
        game.add.existing(this.player2);
        //Add the surrogate player so our string plays nicely
        this.surrogate = new Player(game, this, 300, 100, "cat1", 3);
        game.add.existing(this.surrogate);

        // Add in the yarn
        this.yarn = new Yarn(game, this, 'ball', this.player1, this.player2, this.surrogate);
        game.add.existing(this.yarn);

        //Add the yarnballs for a little fun
        this.yarnBall = game.add.sprite(700,320,'redBall');
       	this.yarnBall.scale.setTo(0.08,0.08);
        game.add.existing(this.yarnBall);
        game.physics.p2.enable(this.yarnBall);
        this.yarnBall.body.setCollisionGroup(this.yarnBallCollisionGroup);
        this.yarnBall.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.platformCollisionGroup]);

        this.yarnBall2 = game.add.sprite(300,400,'blueBall');
       	this.yarnBall2.scale.setTo(0.08,0.08);
        game.add.existing(this.yarnBall2);
        game.physics.p2.enable(this.yarnBall2);
        this.yarnBall2.body.data.gravityScale = -1;
        this.yarnBall2.body.setCollisionGroup(this.yarnBallCollisionGroup);
        this.yarnBall2.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.platformCollisionGroup]);

        this.dialog = new DialogManager(game, 'blueball');
        game.add.existing(this.dialog);
	},
	update: function(){
		if(game.math.difference(this.player1.body.y, game.height-100) < 100) {
            this.oneWinText.setText("Give each cat their color ball of string", true);
            if(!this.outroPlaying) {
                this.outroPlaying = true;
                this.narrate = game.add.audio('twoOutro');
                this.narrate.play('', 0, 1, false);
                this.narrate.volume = 1;
            }
        }
        if(game.math.difference(this.player2.body.y, 100) < 100) {
            this.twoWinText.setText("Hold on to the other cat and let them swing", true);
        } 
		
		//Display text for level switching instructions
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
        game.camera.fade(0x000000, 2000);
        this.ost.fadeOut(2000);
    },
    resetFade: function() {
        game.state.start('Separate', true, false);
    },

	//Function to manually create the platforms
    createPlatforms: function() {

        this.testLevel = this.game.add.tilemap('levelOne');
        this.testLevel.addTilesetImage('pixel3', 'mapTiles');

        // Load in the platforms layer
        this.bgLayer = this.testLevel.createLayer('Platforms');
        // Call the background image
        //this.room = game.add.sprite(0,0,'Cats');
        // Just for safety
        this.bgLayer.resizeWorld();
       
        //Instantiate the collision groups for the objects can interact
        this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
        this.surrogateCollisionGroup = game.physics.p2.createCollisionGroup();
        this.platformCollisionGroup = game.physics.p2.createCollisionGroup();
        this.objectCollisionGroup = game.physics.p2.createCollisionGroup();
        this.cloudCollisionGroup = game.physics.p2.createCollisionGroup();
        this.limiterCollisionGroup = game.physics.p2.createCollisionGroup();
        this.yarnBallCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();

        
        //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
        //  This call returns an array of body objects which you can perform addition actions on if
        //  required. There is also a parameter to control optimising the map build.
        this.testLevel.setCollisionByExclusion([]);
        this.platforms = game.physics.p2.convertTilemap(this.testLevel, this.bgLayer, true);
        for(var i = 0; i < this.platforms.length; i++){
            this.platforms[i].setCollisionGroup(this.platformCollisionGroup);
            this.platforms[i].collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.objectCollisionGroup, this.yarnBallCollisionGroup]);
        }
        console.log(this.testLevel.objects[0]);
    },
    tutorialText: function() {
        this.oneWinText = game.add.text(game.width/2 + 4.5, game.height/2 + 180, 'Press S  and fall to hold the string tight', {font: 'Impact', fontSize: '27px', fill: '#FF7373'});
        this.oneWinText.anchor.set(0.5);
        this.oneWinText.inputEnabled = true;
        this.twoWinText = game.add.text(game.width/2 + 4.5, game.height/2 - 180, 'Press 🡩 and fall to hold the string tight', {font: 'Impact', fontSize: '27px', fill: '#9C6EB2'});
        this.twoWinText.anchor.set(0.5);
        this.twoWinText.inputEnabled = true;
    }
}