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
        var opts = {
            currLevel: "Windows",
            nextLevel: "Tether",
            ostFadeOut: true,
            tilemap: "levelFour",
            backgroundImage: "Windows",
            dialogNum: 5,
            howManyGlows: 2,
            redGlowCoords: [834, 428],
            blueGlowCoords: [839, 299],
            player1Coords: [273, 682],
            player2Coords: [170, 164],
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
       if(this.window1.latch.isMoving == 'locked'){
            this.oneCanWin = true;
        }
        if(this.window2.latch.isMoving == 'locked'){
           this.twoCanWin = true;
        }
        if(Phaser.Math.difference(this.window1.x, this.player1.x) < 300 && this.oneCanWin == true) {
            this.oneWin = true;
            game.add.tween(this.redGlow).to( { alpha: 0.3 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0);
            this.redGlow.x = this.player1.x;
            this.redGlow.y = this.player1.y;
        }
        else { 
            this.oneWin = false;
            game.add.tween(this.redGlow).to( { alpha: 0 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0);
        }
        if(Phaser.Math.difference(this.window2.x, this.player2.x) < 205 && this.twoCanWin == true) {
            this.twoWin = true;
            game.add.tween(this.blueGlow).to( { alpha: 0.3 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0);
            this.blueGlow.x = this.player2.x;
            this.blueGlow.y = this.player2.y;
        }
        else {
            this.twoWin = false;
            game.add.tween(this.blueGlow).to( { alpha: 0 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0);
        }
    },

    createLevelObstacles: function(){
        this.window1 = new WindowMask(game, this, 727, 623, 'blueWindow', 'blueLatch', 623, 481, 'down');

        this.window2 = new WindowMask(game, this, 661, 99, 'redWindow', 'redLatch', 99, 250, 'up');
    }
}