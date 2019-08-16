// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for TransitionManager
// game and gameplay are references to their respective things
function TransitionManager(game, gameplay, nextLevel, titleCard, ost, narration){
	Phaser.Sprite.call(this, game, game.width/2, game.height/2, null);
	game.add.existing(this);
	this.gameplay = gameplay; // Obtains reference to gameplay state
	var gp = this.gameplay; // Shortens the reference

    // Save init arguments
    this.nextLevel = nextLevel;
    this.titleCard = titleCard;
    this.ostInput = ost;
    this.narration = narration;

    // Create level manager specific variables
    this.flashColor = 0xffffff; // Color of the camera fades
    this.ostFadeOutDuration = 2500; // How long does the music fade out

    // Create gameplay state specific variables
    this.complete = false;

    // Fade out the title theme
    if(gp.theme.isPlaying == true) {
        gp.theme.fadeOut(2000);
    }

    // Add in the title card, initally invisible
    this.title = game.add.sprite(0, 0, this.titleCard);

    game.camera.flash(this.flashColor, 2000);

    // Begin to play the chapter one theme
    this.ost = game.add.audio(this.ostInput);
    this.ost.onDecoded.add(this.startOST, this);
    //this.ost.onFadeComplete(this.stopTheme, this);

    // Begin to play the level one narration
    this.narrate = game.add.audio(this.narration);
    //this.narrate.onDecoded.add(this.startNar, this);
    
    // Instantiate the fade events
    game.camera.onFadeComplete.add(this.resetFade, this);
    game.time.events.add(5000, this.fade, this);
}

// inherit prototype from Phaser.Sprite and set constructor to DialogManager
TransitionManager.prototype = Object.create(Phaser.Sprite.prototype);
TransitionManager.prototype.constructor = TransitionManager;

TransitionManager.prototype.startOST = function() {
    // Begin playing the level theme
    this.ost.play('', 0, 0, true);
    this.ost.fadeTo(3000, 0.5);
    //this.ost.loop = true;
    //this.ost.volume = 0.5;    
}
TransitionManager.prototype.stopTheme = function() {
    // Stop playaing prev theme
    this.theme.stop();
    //this.ost.volume = 0.5;    
}
TransitionManager.prototype.startNar = function() {
    // Begin playing the intro narration
    this.narrate.play('', 0, 1, false);
    this.narrate.volume = 0.35;
}
TransitionManager.prototype.fade = function() {
    // You can set your own fade color and duration
    game.camera.fade(this.flashColor, 2000);
}
TransitionManager.prototype.resetFade = function() {
    if(this.complete == false) {
    // Once the fade is complete, begin Chapter 1
        game.state.start(this.nextLevel, true, false, this.ost);
        this.complete = true;
    }
}