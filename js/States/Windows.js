// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";

//INstantiate the level 2 state
var Windows = function(game){};
Windows.prototype = {
    init: function(ost){
        // initialize variables for win conditions
        this.ost = ost;
        this.oneWin = false;
        this.twoWin = false;
        this.oneCanWin = false;
        this.twoCanWin = false;
    },
    create: function(){
        var nextLevel = "Tether";
        var ostFadeOut = true;
        var tilemap = "levelFour";
        var backgroundImage = "Windows";
        var dialogNum = 5;
        var howManyGlows = 2;
        var redGlowCoords = [834, 428];
        var blueGlowCoords = [839, 299];
        var player1Coords = [273, 682];
        var player2Coords = [170, 164];
        var enableYarn = true;
        var enableBarrier = true;

        this.levelManager = new LevelManager(game, this, nextLevel, ostFadeOut, tilemap, backgroundImage, dialogNum, howManyGlows, redGlowCoords[0], redGlowCoords[1], blueGlowCoords[0], blueGlowCoords[1], player1Coords[0], player1Coords[1], player2Coords[0], player2Coords[1], enableYarn, enableBarrier);
    },
    update: function(){
        //Check for player one's win state
        if(this.oneWin == true && this.twoWin == true && this.complete == false) {
            this.complete = true;
            this.levelManager.win();
            //game.time.events.add(1000, this.fade, this);
        }
       if(this.window1.latch.isMoving == 'locked'){
            this.oneCanWin = true;
        }
        if(this.window2.latch.isMoving == 'locked'){
           this.twoCanWin = true;
        }
        if(Phaser.Math.difference(this.window1.x, this.player1.x) < 300 && this.oneCanWin == true) {
            this.oneWin = true;
            game.add.tween(this.redGlow).to( { alpha: 0.3 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.redGlow.x = this.player1.x;
            this.redGlow.y = this.player1.y;
        }
        else { 
            this.oneWin = false;
            game.add.tween(this.redGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
        }
        if(Phaser.Math.difference(this.window2.x, this.player2.x) < 205 && this.twoCanWin == true) {
            this.twoWin = true;
            game.add.tween(this.blueGlow).to( { alpha: 0.3 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.blueGlow.x = this.player2.x;
            this.blueGlow.y = this.player2.y;
        }
        else {
            this.twoWin = false;
            game.add.tween(this.blueGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
        }
    },

    createLevelObstacles: function(){
        this.window1 = new WindowMask(game, this, 727, 623, 'blueWindow', 'blueLatch', 600, 481, 'down');

        this.window2 = new WindowMask(game, this, 661, 99, 'redWindow', 'redLatch', 106, 250, 'up');
    }

    /*fade: function() {
        //Fade camera and level theme
        game.camera.fade(0xffffff, 2000);
        this.ost.fadeOut(2500);
    },
    resetFade: function() {
        if(this.fadeComplete == false) {
            game.state.start('Tether', true, false, this.ost);
            this.fadeComplete = true;
        }
    },*/
}