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
        var nextLevel = "Ending";
        var ostFadeOut = true;
        var tilemap = "levelSix";
        var backgroundImage = "Clouds1";
        var dialogNum = 7;
        var howManyGlows = 1;
        var redGlowCoords = [0,0];
        var blueGlowCoords = [0,0];
        var player1Coords = [85, 600];
        var player2Coords = [32, 100];
        var enableYarn = true;
        var enableBarrier = true;

        this.levelManager = new LevelManager(game, this, nextLevel, ostFadeOut, tilemap, backgroundImage, dialogNum, howManyGlows, redGlowCoords[0], redGlowCoords[1], blueGlowCoords[0], blueGlowCoords[1], player1Coords[0], player1Coords[1], player2Coords[0], player2Coords[1], enableYarn, enableBarrier);
    },
    update: function(){
        //Check for player one's win state
        if(this.complete == true) {
            //game.time.events.add(2000, this.preFade, this);
            this.levelManager.win();
        }
        if(this.cloud1.cloud.isMoving == 'locked'){
            this.oneCanWin = true;
            game.add.tween(this.room2).to( { alpha: 1 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0);
        }
        if(this.cloud2.cloud.isMoving == 'locked'){
           this.twoCanWin = true;
        }

        // Porgress the the level's second stage
        if(this.oneCanWin == true && this.twoCanWin == true) {
            if(this.barrierDestroyed == false) {
                this.barrierDestroyed = true;
                game.time.events.add(1000, this.destoyBarrier, this);
                game.add.tween(this.barrier).to( { alpha: 0 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0);
                game.add.tween(this.room3).to( { alpha: 1 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0);
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
        this.cloud1 = new Cloud(game, this, 450, 607, 'purpCloud', 607, 350, 'down');
        this.cloud2 = new Cloud(game, this, 450, 99, 'purpCloud2', 99, 350, 'up');
    },
    // Check for the win condition
    /*preFade: function() {
        if(this.complete == true) {
            game.time.events.add(1000, this.fade, this);
        }
    },
    // Fade out the scene and music
    fade: function() {
        //  You can set your own fade color and duration
        game.camera.fade(0xffffff, 2000);
        this.ost.fadeOut(2500);
    },
    // Call the dning state
    resetFade: function() {
        if(this.fadeComplete == false) {
            game.state.start('Ending', true, false, this.ost);
            this.fadeComplete = true;
        }
    },*/
    // Destroy the world barrier
    destoyBarrier: function() {
        this.barrier.destroy();
    },
}