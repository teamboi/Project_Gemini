// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
// Initialize the level 1 state
var Cradle = function(game){};
Cradle.prototype = {
	init: function(ost){
		// initialize variables for gameplay
        this.ost = ost;
        this.showExit = false;
        this.textVertOffset = 60;
        this.oneAnchoredLast = true;
        this.oneHasAnchored = false;
        this.twoHasAnchored = false;
        this.progress = false;
        this.controlsAlpha = 1;
	},
	create: function(){
        var nextLevel = "Threads";
        var ostFadeOut = false;
        var tilemap = "levelTwo";
        var backgroundImage = "Cradle";
        var dialogNum = 2;
        var howManyGlows = 1;
        var redGlowCoords = [0,0];
        var blueGlowCoords = [0,0];
        var player1Coords = [game.width/2, 416];
        var player2Coords = [game.width/2, 350];
        var enableYarn = true;
        var enableBarrier = false;

        this.levelManager = new LevelManager(game, this, nextLevel, ostFadeOut, tilemap, backgroundImage, dialogNum, howManyGlows, redGlowCoords[0], redGlowCoords[1], blueGlowCoords[0], blueGlowCoords[1], player1Coords[0], player1Coords[1], player2Coords[0], player2Coords[1], enableYarn, enableBarrier);
	},
	update: function(){

        // Check for the win condition
        if(this.complete == true) {
            this.levelManager.win();
        }
        if(Phaser.Math.distance(this.player2.x, this.player2.y, this.player1.x, this.player1.y) < 90 ){
            if(this.player2.anchorState == "isAnchor" || this.player1.anchorState == "isAnchor") {
                this.complete = true;
            }
            game.add.tween(this.redGlow).to( { alpha: 0.5 }, 100, Phaser.Easing.Linear.None, true, 0);
            this.redGlow.x = (this.player1.x + this.player2.x)/2;
            this.redGlow.y = (this.player1.y + this.player2.y)/2;
            this.controlsAlpha -= 0.02;
        }
        else { 
            this.complete = false;
            game.add.tween(this.redGlow).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0);
        }

        if(this.oneHasAnchored && this.twoHasAnchored) {
            game.time.events.add(10000, this.progressTutorial, this);
        }

       
        // Bonkers dynamic tutorial!
        if(this.oneAnchoredLast == false) {
            if(this.player1.checkIfCanJump()) {
                this.p1Controls.destroy();
            	this.p1Controls = game.add.image(this.player1.body.x, this.player1.body.y  - this.oneVertOffset, 'wKey');
                this.p1Controls.x = this.player1.x;
                this.p1Controls.y = this.player1.y - this.textVertOffset;
                
            }
            else if(this.player2.anchorState != "beingAnchored") {
                this.p1Controls.destroy();
            	this.p1Controls = game.add.image(this.player1.body.x, this.player1.body.y  + this.oneVertOffset, 'sKey');
                this.p1Controls.x = this.player1.x;
                this.p1Controls.y = this.player1.y + this.textVertOffset;
                
            }
            //this.p2Controls.setText('', true);
        }
        else {
            if(this.player2.checkIfCanJump()) {
                this.p2Controls.destroy();
           		this.p2Controls = game.add.image(this.player2.body.x, this.player2.body.y  + this.twoVertOffset, 'downArrow');
                this.p2Controls.x = this.player2.x;
                this.p2Controls.y = this.player2.y + this.textVertOffset;
                
            }
            else if(this.player1.anchorState != "beingAnchored") {
                this.p2Controls.destroy();
           		this.p2Controls = game.add.image(this.player2.body.x, this.player2.body.y  - this.twoVertOffset, 'upArrow');
                this.p2Controls.x = this.player2.x;
                this.p2Controls.y = this.player2.y - this.textVertOffset;
                
            }
            //this.p1Controls.setText('', true);
        }
        if(this.progress == true && this.player1.checkIfCanJump() && this.player2.checkIfCanJump()) {
            this.p1Controls.destroy();
            this.p1Controls = game.add.image(this.player1.body.x, this.player1.body.y  - this.oneVertOffset, 'wKey');
            this.p1Controls.x = this.player1.x;
            this.p1Controls.y = this.player1.y - this.textVertOffset;
            
            
            this.p2Controls.destroy();
            this.p2Controls = game.add.image(this.player2.body.x, this.player2.body.y  + this.twoVertOffset, 'downArrow');
            this.p2Controls.x = this.player2.x;
            this.p2Controls.y = this.player2.y + this.textVertOffset;
            
        }
      
        // If either player is being held up, show them the swinging controls
        if(this.player2.anchorState == "isAnchor") {
        	this.p1Controls.destroy();
            this.p1Controls = game.add.image(this.player1.body.x, this.player1.body.y  - this.oneVertOffset, 'adKey');
            this.p1Controls.x = this.player1.x;
            this.p1Controls.y = this.player1.y;
            this.oneAnchoredLast = false;
            this.twoHasAnchored = true;
         
            this.p2Controls.destroy();
            this.p2Controls = game.add.image(this.player2.body.x, this.player2.body.y  - this.twoVertOffset, 'upArrow');
            this.p2Controls.x = this.player2.x;
            this.p2Controls.y = this.player2.y + this.textVertOffset;
        }
        if(this.player1.anchorState == "isAnchor") {
        	this.p2Controls.destroy();
            this.p2Controls = game.add.image(this.player2.body.x, this.player2.body.y  + this.twoVertOffset, 'rightleftKey');
            this.p2Controls.x = this.player2.x;
            this.p2Controls.y = this.player2.y;
            this.oneAnchoredLast = true;
            this.oneHasAnchored = true;
            
            this.p1Controls.destroy();
            this.p1Controls = game.add.image(this.player1.body.x, this.player1.body.y  + this.oneVertOffset, 'sKey');
            this.p1Controls.x = this.player1.x;
            this.p1Controls.y = this.player1.y - this.textVertOffset;
        }
        this.p1Controls.scale.set(0.5);
        this.p1Controls.anchor.set(0.5);
        this.p1Controls.alpha = this.controlsAlpha;
        this.p2Controls.scale.set(0.5);
        this.p2Controls.anchor.set(0.5);
        this.p2Controls.alpha = this.controlsAlpha;

	},
    // Progress the tutorial
    progressTutorial: function() {
        this.progress = true;
    },
    // Create the tutorial text
    tutorialText: function() {
         this.p1Controls = game.add.image(this.player1.body.x, this.player1.body.y  - this.oneVertOffset, 'wKey');
        this.p1Controls.x = this.player1.x;
        this.p1Controls.y = this.player1.y - this.textVertOffset;
        this.p1Controls.anchor.set(0.5);
        this.p1Controls.inputEnabled = true;
        this.p1ControlsPosition = this.p1Controls.worldPosition;
        
        this.p2Controls = game.add.image(this.player2.body.x, this.player2.body.y  + this.twoVertOffset, 'downArrow');
        this.p2Controls.x = this.player2.x;
        this.p2Controls.y = this.player2.y + this.textVertOffset;
        this.p2Controls.inputEnabled = true;
        this.p2ControlsPosition = this.p2Controls.worldPosition;

        this.exit = game.add.text(game.width/2, 100, '', {font: 'Impact', fontSize: '32px', fill: '#D85BFF'});
        this.exit.anchor.set(0.5);
        this.exit.inputEnabled = true;
    },
}