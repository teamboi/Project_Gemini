// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

//INstantiate the level 2 state
var Fences = function(game){};
Fences.prototype = {
	init: function(ost){
		// initialize variables for win conditions
		this.ost = ost;
		this.oneWin = false;
		this.twoWin = false;
	},
	create: function(){
		var opts = {
			levelName: "Fences",
			ostFadeOut: false,
			tilemap: "levelFive",
			backgroundImage: "Fences",
			dialogNum: 6,
			howManyGlows: 2,
			redGlowCoords: [0,0],
			blueGlowCoords: [0,0],
			player1Coords: [771, 501],
			player2Coords: [808, 257],
			enableYarn: true,
			enableBarrier: true,
		}

		this.levelManager = new LevelManager(game, this, opts);
	},
	update: function(){
		//Check for player one's win state
		if(this.oneWin == true && this.twoWin == true && this.complete == false) {
			this.complete = true;
			this.levelManager.win();
			//game.time.events.add(1000, this.fade, this);
		}
		if(Phaser.Math.distance(this.fishBowl.x, this.fishBowl.y, this.player1.x, this.player1.y) < 70){
			this.oneWin = true;
			game.add.tween(this.redGlow).to( { alpha: 0.4 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0);
			this.redGlow.x = this.player1.x;
			this.redGlow.y = this.player1.y;
		}
		else { 
			this.oneWin = false;
			game.add.tween(this.redGlow).to( { alpha: 0 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0);
		}
		if(Phaser.Math.distance(this.flower.x, this.flower.y, this.player2.x, this.player2.y) < 70){
			this.twoWin = true;
			game.add.tween(this.blueGlow).to( { alpha: 0.4 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0);
			this.blueGlow.x = this.player2.x;
			this.blueGlow.y = this.player2.y;
		}
		else {
			this.twoWin = false;
			game.add.tween(this.blueGlow).to( { alpha: 0 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0);
		}
	},
	createLevelObstacles: function(){
		// Add the level objectives
		this.fishBowl = game.add.sprite(79, 404, null);
		this.flower = game.add.sprite(79, 304, null);
	},
}