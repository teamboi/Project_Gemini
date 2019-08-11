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
        var nextLevel = "Separate";
        var ostFadeOut = true;
        var tilemap = "levelOne";
        var backgroundImage = "Threads";
        var dialogNum = 3;
        var howManyGlows = 1;
        var redGlowCoords = [0,0];
        var blueGlowCoords = [0,0];
        var player1Coords = [801, 469];
        var player2Coords = [67, 255];
        var enableYarn = true;
        var enableBarrier = false;

        this.levelManager = new LevelManager(game, this, nextLevel, ostFadeOut, tilemap, backgroundImage, dialogNum, howManyGlows, redGlowCoords[0], redGlowCoords[1], blueGlowCoords[0], blueGlowCoords[1], player1Coords[0], player1Coords[1], player2Coords[0], player2Coords[1], enableYarn, enableBarrier);

        //Add the yarnballs for a little fun
        /*this.yarnBall = game.add.sprite(452,260,'purpBall');
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
*/
        //game.time.events.add(1300, this.dialog.TypeOutro(2), this);*/
	},
	update: function(){
        if(this.complete == true) {
            this.levelManager.win();
        }
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

		/*if(game.math.difference(this.player1.body.y, game.height-100) < 100) {
            if(!this.outroPlaying) {
                this.outroPlaying = true;
                //this.narrate = game.add.audio('twoOutro');
                //this.narrate.play('', 0, 1, false);
                //this.narrate.volume = 1;
            }
        }*/
        /*if(game.math.difference(this.player2.body.y, 100) < 100) {
            this.twoWinText.setText("Hold on to the other cat and let them swing", true);
        } */
		
		//Display text for level switching instructions
		/*if(this.oneWin == true && this.twoWin == true && this.complete == false) {
			this.complete = true;
            game.time.events.add(1000, this.fade, this);
		}
		
        if(Phaser.Math.distance(this.yarnBall.x, this.yarnBall.y, this.player1.x, this.player1.y) < 90){
            this.oneWin = true;
            game.add.tween(this.redGlow).to( { alpha: 0.4 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.redGlow.x = this.player1.x;
            this.redGlow.y = this.player1.y;
        }
        else { 
            this.oneWin = false;
            game.add.tween(this.redGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
        }
        if(Phaser.Math.distance(this.yarnBall2.x, this.yarnBall2.y, this.player2.x, this.player2.y) < 90){
           this.twoWin = true;
            game.add.tween(this.blueGlow).to( { alpha: 0.4 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.blueGlow.x = this.player2.x;
            this.blueGlow.y = this.player2.y;
        }
        else {
            this.twoWin = false;
            game.add.tween(this.blueGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
        }*/

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