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
        this.outroPlaying = false;
        this.textVertOffset = 40;
	},
	create: function(){
        /*var nextLevel = "Separate";
        var ostFadeOut = true;
        var tilemap = "levelTwoPointFive";
        var backgroundImage = "Threads";
        var dialogNum = 3;
        var howManyGlows = 1;
        var redGlowCoords = [0,0];
        var blueGlowCoords = [0,0];
        var player1Coords = [180, 469];
        var player2Coords = [450, 55];
        var enableYarn = true;
        var enableBarrier = false;*/
        var opts = {
            nextLevel: "Separate",
            ostFadeOut: true,
            tilemap: "levelTwoPointFive",
            backgroundImage: "Threads",
            dialogNum: 3,
            howManyGlows: 1,
            redGlowCoords: [0,0],
            blueGlowCoords: [0,0],
            player1Coords: [180, 469],
            player2Coords: [450, 55],
            enableYarn: true,
            enableBarrier: false,
        }

        this.levelManager = new LevelManager(game, this, opts);
	},
	update: function(){
        if(this.complete == true) {
            this.levelManager.win();
        }
        if(Phaser.Math.distance(this.player2.x, this.player2.y, this.player1.x, this.player1.y) < 70){
            this.complete = true;
            game.add.tween(this.redGlow).to( { alpha: 0.5 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0);
            this.redGlow.x = (this.player1.x + this.player2.x)/2;
            this.redGlow.y = (this.player1.y + this.player2.y)/2;
        }
        else { 
            this.complete = false;
            game.add.tween(this.redGlow).to( { alpha: 0 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0);
        }
	}
}