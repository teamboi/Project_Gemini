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
		var opts = {
			levelName: "Threads",
			ostFadeOut: true,
			tilemap: "levelTwoPointFive",
			backgroundImage: "Threads",
			dialogNum: 3,
			howManyGlows: 1,
			redGlowCoords: [0,0],
			blueGlowCoords: [0,0],
			player1Coords: [750, 469],
			player2Coords: [100, 55],
			enableYarn: true,
			enableBarrier: false,
		}

		this.levelManager = new LevelManager(game, this, opts);
	},
	update: function(){
		if(this.complete == true) {
			this.levelManager.win();
		}
		else{
			this.levelManager.cancelWin();
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
	},
	createLevelObstacles: function(){
		this.motionGraphic = game.add.sprite(game.width/2 +110,game.height/4 + 40,"motionGraphic2");
		this.motionGraphic.animations.add("anim_motionGraphic", Phaser.Animation.generateFrameNames('motion graphic 2-Untitled-',0, 60,'',2), 30, true);
		this.motionGraphic.animations.play("anim_motionGraphic");
		this.motionGraphic.anchor.set(0.5,0.5);
		this.motionGraphic.scale.setTo(0.6);
		this.motionGraphic.scale.x *= -1;
		game.add.existing(this.motionGraphic);
		this.motionGraphic.zOrder = layerMotionGraphic;
		this.group.add(this.motionGraphic);
	}
}