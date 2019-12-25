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
        this.oneVertOffset = 6;
        this.twoVertOffset = 6;
        this.oneHasJumped = false;
		this.twoHasJumped = false;
		this.controlsAlpha = 1;
	},
	create: function(){
		this.oneHasJumped = false;
		this.twoHasJumped = false;
		this.controlsAlpha = 1;

        var opts = {
            levelName: "Cats",
            ostFadeOut: false,
            tilemap: "levelOne",
            backgroundImage: "Cats",
            dialogNum: 1,
            howManyGlows: 1,
            redGlowCoords: [0,0],
            blueGlowCoords: [0,0],
            player1Coords: [100, 516],
            player2Coords: [800, 199],
            enableYarn: false,
            enableBarrier: false,
        }

		this.levelManager = new LevelManager(game, this, opts);
	},
	update: function(){
        
        // Keep the player controls by the character sprites
        this.p1Controls.x = this.player1.x;
        this.p1Controls.y = this.player1.y - this.oneVertOffset;
        
        this.p2Controls.x = this.player2.x;
        this.p2Controls.y = this.player2.y + this.twoVertOffset;

        if(game.input.keyboard.justPressed(Phaser.KeyCode[this.player1.controls.jump]) && this.player1.checkIfCanJump() ) {
        	this.oneHasJumped = true;
        }
        if(game.input.keyboard.justPressed(Phaser.KeyCode[this.player2.controls.jump]) && this.player2.checkIfCanJump()) {
        	this.twoHasJumped = true;
        }

        // Show the jump control once players are near a platform
        if(game.math.difference(this.player1.body.x, game.width/2) < 10 || this.oneHasJumped) {
            //this.p1Controls.setText("W", true);
            this.p1Controls.destroy();
            this.p1Controls = game.add.image(this.player1.body.x, this.player1.body.y  - this.oneVertOffset, 'wKey');
            this.p1Controls.scale.set(0.5);
       		this.p1Controls.anchor.set(0.5);
       		this.p1Controls.alpha = this.controlsAlpha;
            this.oneVertOffset = 60;
        }
        if(game.math.difference(this.player2.body.x, game.width/2) < 10 || this.twoHasJumped) {
           //this.p1Controls.setText("W", true);
            this.p2Controls.destroy();
            this.p2Controls = game.add.image(this.player2.body.x, this.player2.body.y  + this.twoVertOffset, 'downArrow');
            this.p2Controls.scale.set(0.5);
       		this.p2Controls.anchor.set(0.5);
       		this.p2Controls.alpha = this.controlsAlpha;
            this.twoVertOffset = 60;
        }
        
        // Begin the level end
        if(this.complete == true) {
            this.levelManager.win();
        }

        // Check for players to be close to each other
        if(Phaser.Math.distance(this.player2.x, this.player2.y, this.player1.x, this.player1.y) < 70){
            this.complete = true;
            game.add.tween(this.redGlow).to( { alpha: 0.5 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0);
            this.redGlow.x = (this.player1.x + this.player2.x)/2;
            this.redGlow.y = (this.player1.y + this.player2.y)/2;
            game.add.tween(this.redGlow).to( { alpha: 0.5 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.controlsAlpha -= 0.02;
        }
        else { 
            this.complete = false;
            game.add.tween(this.redGlow).to( { alpha: 0 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0);
        }

	},

    // Show the movement controls dynamically
    tutorialText: function() {
        this.p1Controls = game.add.image(this.player1.body.x, this.player1.body.y  - this.oneVertOffset, 'adKey');
        this.p1Controls.scale.set(0.5);
        this.p1Controls.anchor.set(0.5);
        this.p1Controls.alpha = this.controlsAlpha;
        //this.p1Controls.inputEnabled = true;
        this.p1ControlsPosition = this.p1Controls.worldPosition;
        
        this.p2Controls = game.add.image(this.player2.body.x, this.player2.body.y + this.oneVertOffset, 'rightleftKey');
        this.p2Controls.scale.set(0.5);
        this.p2Controls.anchor.set(0.5);
        this.p2Controls.alpha = this.controlsAlpha;
        this.p2ControlsPosition = this.p2Controls.worldPosition;
    },
}