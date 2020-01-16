// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for TransitionManager
// game and gameplay are references to their respective things
// nextLevel; string; name of the next level
// titleCard; string; name of the image to display
// ost; string; music to play
// narration; string; narration to play
function TransitionManager(game, gameplay, opts){
	//console.log(opts);
	Phaser.Sprite.call(this, game, game.width/2, game.height/2, null);
	game.add.existing(this);
	this.gameplay = gameplay; // Obtains reference to gameplay state
	var gp = this.gameplay; // Shortens the reference

	// Save init arguments
	this.titleCard = opts.titleCard;
	this.ostInput = opts.ost;
	this.narration = opts.narration;

	this.currLevel = opts.levelName;
	let levelArrPosition = this.findLevelArrPosition(this.currLevel);
	this.prevLevel = levelArr[levelArrPosition - 1];
	this.nextLevel = levelArr[levelArrPosition + 1];
	this.forceLevelChange = false;

	// Create level manager specific variables
	this.flashColor = 0xffffff; // Color of the camera fades
	this.flashDuration = 2000; // Duration of the camera flash
	this.flashDelay = 5000; // Delay until the transition fades out
	this.fadeDuration = 2000; // Duration of the transition fading out
	this.themeFadeOutDuration = 2000; // How long does the music fade out
	this.ostFadeInDuration = 3000; // How long does the OST fade in
    this.ostVolume = 0.4;

	if(debugTransitions === true){
		this.flashDuration = 1;
		this.flashDelay = 1;
		this.fadeDuration = 1;
		this.themeFadeOutDuration = 1;
		this.ostFadeInDuration = 1;
	}

	// Create gameplay state specific variables
	this.complete = false;

	// Fade out the title theme
	if(gp.theme != null && gp.theme.isPlaying == true) {
		gp.theme.fadeOut(this.themeFadeOutDuration);
	}

	// Add in the title card, initally invisible
	this.title = game.add.sprite(0, 0, this.titleCard);

	game.camera.flash(this.flashColor, this.flashDuration);

	// Begin to play the chapter one theme
	this.ost = game.add.audio(this.ostInput);
	this.ost.onDecoded.add(this.startOST, this);
	//this.ost.onFadeComplete(this.stopTheme, this);

	// Begin to play the level one narration
	this.narrate = game.add.audio(this.narration);
	//this.narrate.onDecoded.add(this.startNar, this);
	
	// Instantiate the fade events
	game.camera.onFadeComplete.add(this.resetFade, this);
	game.time.events.add(this.flashDelay, this.fade, this);
}

// inherit prototype from Phaser.Sprite and set constructor to DialogManager
TransitionManager.prototype = Object.create(Phaser.Sprite.prototype);
TransitionManager.prototype.constructor = TransitionManager;

TransitionManager.prototype.update = function(){
	if(debugHotkeys === false){
		return;
	}
	let gp = this.gameplay;
	if(game.input.keyboard.isDown(Phaser.KeyCode["O"])){ // go to previous level
		game.state.start(this.prevLevel, true, false, gp.ost);
	}
	if(game.input.keyboard.isDown(Phaser.KeyCode["P"])){ // go to next level
		game.state.start(this.nextLevel, true, false, gp.ost);
	}
	if(game.input.keyboard.isDown(Phaser.KeyCode["L"])){ // restart the level
		game.state.start(this.currLevel, true, false, gp.ost);
	}
}

// finds the position of the specified level in the global levelArr
TransitionManager.prototype.findLevelArrPosition = function(name) {
	for(let i = 0; i < levelArr.length; ++i){
		if(levelArr[i] === name){
			return i;
		}
	}
	//console.log("Could not find " + name + " within levelArr");
	return -1;
}

TransitionManager.prototype.startOST = function() {
    // Begin playing the level theme
    this.ost.play('', 0, 0, true);
    this.ost.fadeTo(this.ostFadeInDuration, this.ostVolume);
    //this.ost.loop = true;
    //this.ost.volume = 0.5;    
}
TransitionManager.prototype.stopTheme = function() {
	// Stop playing prev theme
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
	game.camera.fade(this.flashColor, this.fadeDuration);
}
TransitionManager.prototype.resetFade = function() {
	if(this.complete == false) {
	// Once the fade is complete, begin Chapter 1
		game.state.start(this.nextLevel, true, false, this.ost);
		this.complete = true;
	}
}