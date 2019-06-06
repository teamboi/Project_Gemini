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
        this.textVertOffset = 40;
          
	},
	create: function(){

        //  Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
        game.physics.p2.gravity.y = 800; // Add vertical gravity
        game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

        game.camera.onFadeComplete.add(this.resetFade, this);
        game.camera.flash(0xffffff, 2000);

        this.narrate = game.add.audio('twoIntro');
        //this.narrate.play('', 0, 1, false);
        //this.narrate.volume = 1;

        //For when we create a tileset
        this.createPlatforms();
        this.room = game.add.sprite(0,0,'Threads');

        //this.dialog = new DialogManager(game, "ball");
       // game.add.existing(this.dialog);
       // this.dialog.TypeIntro(2);

        // Add in the players with the Player prefab constructor
        this.player1 = new Player(game, this, 450, 400, "cat1", 1);
        game.add.existing(this.player1);
        this.player2 = new Player(game, this, 460, 320, "cat2", 2);
        game.add.existing(this.player2);
        //Add the surrogate player so our string plays nicely
        this.surrogate = new Player(game, this, 300, 100, "cat1", 3);
        game.add.existing(this.surrogate);

        //this.tutorialText();

        this.glow();
        // Add in the yarn
        this.yarn = new Yarn(game, this, 'ball', this.player1, this.player2, this.surrogate);
        game.add.existing(this.yarn);

        //Add the yarnballs for a little fun
        this.yarnBall = game.add.sprite(452,260,'purpBall');
       	//this.yarnBall.scale.setTo(0.08,0.08);
        game.add.existing(this.yarnBall);
        game.physics.p2.enable(this.yarnBall);
        this.yarnBall.body.setCollisionGroup(this.objectCollisionGroup);
        this.yarnBall.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.platformCollisionGroup]);

        this.yarnBall2 = game.add.sprite(460,510,'purpBall');
       	//this.yarnBall2.scale.setTo(0.08,0.08);
        game.add.existing(this.yarnBall2);
        game.physics.p2.enable(this.yarnBall2);
        this.yarnBall2.body.data.gravityScale = -1;
        this.yarnBall2.body.setCollisionGroup(this.objectCollisionGroup);
        this.yarnBall2.body.collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.platformCollisionGroup]);

        //game.time.events.add(1300, this.dialog.TypeOutro(2), this);
	},
	update: function(){
		if(game.math.difference(this.player1.body.y, game.height-100) < 100) {
            if(!this.outroPlaying) {
                this.outroPlaying = true;
                //this.narrate = game.add.audio('twoOutro');
                //this.narrate.play('', 0, 1, false);
                //this.narrate.volume = 1;
            }
        }
        /*if(game.math.difference(this.player2.body.y, 100) < 100) {
            this.twoWinText.setText("Hold on to the other cat and let them swing", true);
        } */
		
		//Display text for level switching instructions
		if(this.oneWin == true && this.twoWin == true && this.complete == false) {
			this.complete = true;
            game.time.events.add(1000, this.fade, this);
		}
		
        if(Phaser.Math.distance(this.yarnBall.x, this.yarnBall.y, this.player1.x, this.player1.y) < 70){
            this.oneWin = true;
            game.add.tween(this.redGlow).to( { alpha: 0.4 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.redGlow.x = this.player1.x;
            this.redGlow.y = this.player1.y;
        }
        else { 
            this.oneWin = false;
            game.add.tween(this.redGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
        }
        if(Phaser.Math.distance(this.yarnBall2.x, this.yarnBall2.y, this.player2.x, this.player2.y) < 70){
           this.twoWin = true;
            game.add.tween(this.blueGlow).to( { alpha: 0.4 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.blueGlow.x = this.player2.x;
            this.blueGlow.y = this.player2.y;
        }
        else {
            this.twoWin = false;
            game.add.tween(this.blueGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
        }

        /*this.p1Controls.x = this.player1.x;
        this.p1Controls.y = this.player1.y;
        
        this.p2Controls.x = this.player2.x;
        this.p2Controls.y = this.player2.y;*/

        /*if(this.player1.checkIfCanJump()) {
            this.p1Controls.setText("W", true);
            this.p1Controls.x = this.player1.x;
            this.p1Controls.y = this.player1.y - this.textVertOffset;
        }
        else if(this.player2.anchorState == "isAnchor") {
        	this.p1Controls.setText('A          D', true);
            this.p1Controls.x = this.player1.x;
            this.p1Controls.y = this.player1.y;
        }
        else if(this.player2.anchorState != "beingAnchored") {
        	this.p1Controls.setText('S', true);
            this.p1Controls.x = this.player1.x;
            this.p1Controls.y = this.player1.y + this.textVertOffset;
        }
        else {
        	this.p1Controls.setText('', true);
        }

        if(this.player2.checkIfCanJump()) {
            this.p2Controls.setText("🡫", true);
            this.p2Controls.x = this.player2.x;
            this.p2Controls.y = this.player2.y + this.textVertOffset;
        }
        else if(this.player1.anchorState == "isAnchor") {
        	this.p2Controls.setText('🡨          🡪 ', true);
            this.p2Controls.x = this.player2.x;
            this.p2Controls.y = this.player2.y;
        }
        else if(this.player1.anchorState != "beingAnchored") {
        	this.p2Controls.setText('🡩', true);
            this.p2Controls.x = this.player2.x;
            this.p2Controls.y = this.player2.y - this.textVertOffset;
        }
        else {
        	this.p2Controls.setText('', true);
        }*/

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
        game.camera.fade(0xffffff, 2000);
        this.ost.fadeOut(2000);
    },
    resetFade: function() {
        game.state.start('Separate', true, false, this.ost);
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
            this.platforms[i].collides([this.playerCollisionGroup, this.surrogateCollisionGroup, this.objectCollisionGroup]);
        }
        console.log(this.testLevel.objects[0]);
    },
    tutorialText: function() {
        this.p1Controls = game.add.text(this.player1.body.x, this.player1.body.y - this.textVertOffset, 'W', {font: 'Impact', fontSize: '40px', fill: '#FF7373'});
        this.p1Controls.anchor.set(0.5);
        this.p1Controls.inputEnabled = true;
        this.p1ControlsPosition = this.p1Controls.worldPosition;
        
        this.p2Controls = game.add.text(this.player2.body.x, this.player2.body.y + this.textVertOffset, '🡫', {font: 'Impact', fontSize: '40px', fill: '#9C6EB2'});
        this.p2Controls.anchor.set(0.5);
        this.p2Controls.inputEnabled = true;
        this.p2ControlsPosition = this.p2Controls.worldPosition;

        this.exit = game.add.text(game.width/2, 100, '', {font: 'Impact', fontSize: '32px', fill: '#D85BFF'});
        this.exit.anchor.set(0.5);
        this.exit.inputEnabled = true;
    }
}