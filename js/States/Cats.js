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
        this.complete = false;
        this.oneVertOffset = 5;
        this.twoVertOffset = 5;
        this.fadeComplete = false;
	},
	create: function(){
		var tilemap = 'levelOne';
		var backgroundImage = 'Cats';
		var dialogNum = 1;
		var player1X = 68;
		var player1Y = 516;
		var player2X = 818;
		var player2Y = 199;
		var enableYarn = false;
		var enableBarrier = false;
		this.levelManager = new LevelManager(game, this, tilemap, backgroundImage, dialogNum, player1X, player1Y, player2X, player2Y, enableYarn, enableBarrier);
	},
	update: function(){
        
        // Keep the player controls by the character sprites
        this.p1Controls.x = this.player1.x;
        this.p1Controls.y = this.player1.y - this.oneVertOffset;
        
        this.p2Controls.x = this.player2.x;
        this.p2Controls.y = this.player2.y + this.twoVertOffset;

        // Show the jump control once players are near a platform
        if(game.math.difference(this.player1.body.x, game.width/2) < 10) {
            this.p1Controls.setText("W", true);
            this.oneVertOffset = 40;
        }
        if(game.math.difference(this.player2.body.x, game.width/2) < 10) {
            this.p2Controls.setText("🡫", true);
            this.twoVertOffset = 40;
        }
        
        // Begin the level end
        if(this.complete == true) {
            game.time.events.add(1500, this.preFade, this);
        }

        // Check for players to be close to each other
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
    // End the level if the cats are still close
    preFade: function() {
        if(this.complete == true) {
            game.time.events.add(1000, this.fade, this);
        }
    },
    // Fade out the level
    fade: function() {
        //  You can set your own fade color and duration
        game.camera.fade(0xffffff, 2000);
    },
    // Call the next level
    resetFade: function() {
        if(this.fadeComplete == false) {
            game.state.start('Cradle', true, false, this.ost);
            this.fadeComplete = true;
        }
    },

    // Show the movement controls dynamically
    tutorialText: function() {
        this.p1Controls = game.add.text(this.player1.body.x, this.player1.body.y - this.oneVertOffset, 'A        D', {font: 'Comfortaa', fontSize: '40px', fill: '#E25D85'});
        this.p1Controls.anchor.set(0.5);
        this.p1Controls.inputEnabled = true;
        this.p1ControlsPosition = this.p1Controls.worldPosition;
        
        this.p2Controls = game.add.text(this.player2.body.x, this.player2.body.y + this.oneVertOffset, '🡨        🡪', {font: 'Comfortaa', fontSize: '40px', fill: '#707DE0'});
        this.p2Controls.anchor.set(0.5);
        this.p2Controls.inputEnabled = true;
        this.p2ControlsPosition = this.p2Controls.worldPosition;
    },
}