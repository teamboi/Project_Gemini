// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

//Instantiate the level 2 state
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
		this.barrierDestroyed = false;
			
	},
	create: function(){
		var opts = {
			levelName: "Clouds",
			ostFadeOut: true,
			tilemap: "levelSix",
			backgroundImage: "Clouds1",
			dialogNum: 7,
			howManyGlows: 1,
			redGlowCoords: [0,0],
			blueGlowCoords: [0,0],
			player1Coords: [85, 600],
			player2Coords: [32, 100],
			enableYarn: true,
			enableBarrier: true,
		}

		this.levelManager = new LevelManager(game, this, opts);
        this.border = game.add.sprite(game.width/2,game.height/2,'floor');
        this.border.anchor.setTo(0.5,0.5);
	},
	update: function(){
		//Check for player one's win state
		if(this.complete == true) {
			this.levelManager.win();
		}
		else{
			this.levelManager.cancelWin();
		}
		// When the first cloud is locked
		if(this.cloud1.cloud.isMoving == 'locked'){
			this.oneCanWin = true;
			game.add.tween(this.room2).to( { alpha: 1 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0);
		}
		// When the second cloud is locked
		if(this.cloud2.cloud.isMoving == 'locked'){
			this.twoCanWin = true;
		}

		// Progress the the level's second stage; when the background is purple
		if(this.oneCanWin == true && this.twoCanWin == true) {
			// Remove the barrier
			if(this.barrierDestroyed == false) {
				this.barrierDestroyed = true;

				let delayConst = 1000;

				game.time.events.add(delayConst, this.destroyBarrier, this);
				game.add.tween(this.barrier).to( { alpha: 0 }, delayConst, Phaser.Easing.Sinusoidal.InOut, true, 0);
				game.add.tween(this.room3).to( { alpha: 1 }, delayConst, Phaser.Easing.Sinusoidal.InOut, true, 0);

				this.dialog.changeBlurToPurple(delayConst);
			}
			if(Phaser.Math.distance(this.player2.x, this.player2.y, this.player1.x, this.player1.y) < 90 && Phaser.Math.distance(this.player2.x, this.player2.y, game.width/2, game.height/2)){
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
	},
	createLevelObstacles: function(){
		//Add transitionary backgrounds
		this.room2 = game.add.sprite(0,0,'Clouds2');
		this.group.add(this.room2);
		this.room2.zOrder = layerBG;
		this.room2.alpha = 0;

		this.room3 = game.add.sprite(0,0,'Clouds3');
		this.group.add(this.room3);
		this.room3.zOrder = layerBG;
		this.room3.alpha = 0;
		// Add the moveable clouds
		this.cloud1 = new Cloud(game, this, 450, 607, 'purpCloud', 607, 370, 'down', this.player1);
		this.cloud2 = new Cloud(game, this, 450, 99, 'purpCloud2', 99, 330, 'up', this.player2);
	},
	// Destroy the world barrier
	destroyBarrier: function() {
		this.barrier.destroy();
	},
}