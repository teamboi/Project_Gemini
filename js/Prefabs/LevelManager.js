// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for LevelManager
// game and gameplay are references to their respective things
// levelName; string; name of the current level
// ostFadeout; true or false; does the music fade at the end of the level
// backgroundImage; string; the background image
// dialogNum; int; index of the text to display in Dialog.json; 1-indexed
// howManyGlows; 1 or 2; how many objective glows will there be in the level
// redGlowCoords; [int,int]; coordinates of the objective glows; can be left as [0,0] if not used or will follow player
// blueGlowCoords same as above
// player1Coords; [int,int]; coordinates to spawn player 1
// player2Coords; [int,int]; coordinates to spawn player 2
// enableYarn; true or false; will there be yarn in this level
// enableBarrier; true or false; will there be a barrier in this level
function LevelManager(game, gameplay, opts){
	Phaser.Sprite.call(this, game, game.width/2, game.height/2, null);
	game.add.existing(this);
	this.gameplay = gameplay; // Obtains reference to gameplay state
	var gp = this.gameplay; // Shortens the reference

	// Save init arguments
	this.ostFadeOut = opts.ostFadeOut;
	this.tilemap = opts.tilemap;
	this.enableYarn = opts.enableYarn;
	this.enableBarrier = opts.enableBarrier;

	this.currLevel = opts.levelName;
	let levelArrPosition = this.findLevelArrPosition(this.currLevel);
	this.prevLevel = levelArr[levelArrPosition - 1];
	this.nextLevel = levelArr[levelArrPosition + 1];
	this.forceLevelChange = false;

	// Create level manager specific variables
	this.heartSprite = "heart"; // Sprite of the objective glows
	this.heartScale = 1.7; // Scale of heartSprite //blue was set to 1.3?
	this.flashColor = 0xffffff; // Color of the camera fades
	this.winTimerDelay = 1500; // Delay from win condition to preFade
	this.preFadeConst = 1000; // Delay from preFade to fade
	this.fadeDuration = 2000; // How long the fade lasts
	this.ostFadeOutDuration = 2500; // How long does the music fade out

	if(debugTransitions === true){
		this.winTimerDelay = 1;
		this.preFadeConst = 1;
		this.fadeDuration = 1;
		this.ostFadeOutDuration = 1;
	}

	// Create gameplay state specific variables
	this.fadeComplete = false;
	gp.complete = false;
	gp.barrier;

	// Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS); // Begin the P2 physics
	game.physics.p2.gravity.y = 800; // Add vertical gravity
	game.physics.p2.world.defaultContactMaterial.friction = 1; // Set global friction, unless it's just friction with the world bounds

	// Fade into the scene
	game.camera.flash(this.flashColor, 2000);
	// Instantiate the fade events
	game.camera.onFadeComplete.add(this.resetFade, this);

	if(debugCollisionsLevel === false){
		// Loads in the tilemap and static platforms
		this.createPlatforms();
		// Call the background image
		gp.room = game.add.sprite(0,0,opts.backgroundImage);
	}
	else{
		// Call the background image
		gp.room = game.add.sprite(0,0,opts.backgroundImage);
		// Loads in the tilemap and static platforms on top of the background
		this.createPlatforms();
	}

	// Initialise z-masking groups
	gp.group = game.add.group();

	// Add the story text
	gp.dialog = new DialogManager(game, gp);
	gp.dialog.TypeIntro(opts.dialogNum);
	gp.dialog.TypeOutro(opts.dialogNum);

	// Add in the players with the Player prefab constructor
	gp.player1 = new Player(game, gp, opts.player1Coords[0], opts.player1Coords[1], 1);
	gp.player2 = new Player(game, gp, opts.player2Coords[0], opts.player2Coords[1], 2);

	// Create the yarn if specified
	this.createYarn(opts.enableYarn);

	// Create the world barriers
	this.createBarrier(game.width/2, game.height/2, game.width, 1);

	// Create level specific platforms/interactables
	this.createLevelObstacles();

	//Create the tutorial text
	this.tutorialText();

	//Add the objective glow
	this.glow(opts.howManyGlows, opts.redGlowCoords[0], opts.redGlowCoords[1], opts.blueGlowCoords[0], opts.blueGlowCoords[1]);

	// Sort the z-masking groups
	gp.group.sort('zOrder', Phaser.Group.SORT_ASCENDING);
}

// inherit prototype from Phaser.Sprite and set constructor to DialogManager
LevelManager.prototype = Object.create(Phaser.Sprite.prototype);
LevelManager.prototype.constructor = LevelManager;

LevelManager.prototype.update = function(){
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

// Adds the barrier between the two halves of the screen
LevelManager.prototype.createBarrier = function(x, y, width, height){
	var gp = this.gameplay; // renaming it to be shorter

	// Only add it if we specify it
	if(this.enableBarrier === true){
		var platform = game.add.sprite(x,y, "line");
		gp.group.add(platform);
		//platform.scale.setTo(0.08,0.08);
		platform.anchor.setTo(0.5,1);
		game.physics.p2.enable(platform);
		platform.body.setRectangle(width,height, 0, 0, 0);
		platform.body.static = true;
		platform.body.setCollisionGroup(gp.platformCollisionGroup);
		platform.body.collides([gp.playerCollisionGroup, gp.surrogateCollisionGroup]);

		platform.zOrder = layerBarrier;
		gp.group.add(platform);

		gp.barrier = platform; // Make the gameplay state have a reference to the barrier
	}
	// Just in case of typos
	else if(this.enableBarrier != false){
		console.log(this.enableBarrier + " is not a valid state for enableBarrier. Please use true or false");
	}
}

// Adds in the level-specific obstacles
// Only runs if the gameplay state has a function "createLevelObstacles()"
LevelManager.prototype.createLevelObstacles = function(){
	var gp = this.gameplay; // renaming it to be shorter

	if(typeof gp.createLevelObstacles === "function"){
		gp.createLevelObstacles();
	}
}

// Loads in the tilemap and static platforms
LevelManager.prototype.createPlatforms = function(){
	var gp = this.gameplay; // renaming it to be shorter

	// Load in tilemap
	gp.testLevel = this.game.add.tilemap(this.tilemap);
	gp.testLevel.addTilesetImage('pixel3', 'mapTiles');

	// Load in the platforms layer
	gp.bgLayer = gp.testLevel.createLayer('Platforms');
	
	// Just for safety
	gp.bgLayer.resizeWorld();

	// Instantiate the collision groups for the objects can interact
	gp.playerCollisionGroup = game.physics.p2.createCollisionGroup();
	gp.surrogateCollisionGroup = game.physics.p2.createCollisionGroup();
	gp.platformCollisionGroup = game.physics.p2.createCollisionGroup();
	gp.objectCollisionGroup = game.physics.p2.createCollisionGroup();
	gp.cloudCollisionGroup = game.physics.p2.createCollisionGroup();
	gp.limiterCollisionGroup = game.physics.p2.createCollisionGroup();
	game.physics.p2.updateBoundsCollisionGroup();
	
	// Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
	// This call returns an array of body objects which you can perform addition actions on if
	// required. There is also a parameter to control optimising the map build.
	gp.testLevel.setCollisionByExclusion([]);
	gp.platforms = game.physics.p2.convertTilemap(gp.testLevel, gp.bgLayer, true);
	for(var i = 0; i < gp.platforms.length; i++){
		gp.platforms[i].setCollisionGroup(gp.platformCollisionGroup);
		gp.platforms[i].collides([gp.playerCollisionGroup, gp.surrogateCollisionGroup, gp.objectCollisionGroup]);
	}
}

// Adds in the yarn manager and the surrogate if specified
LevelManager.prototype.createYarn = function(createBool){
	var gp = this.gameplay; // renaming it to be shorter

	// Only add them if we want to
	if(createBool === true){
		// Add the surrogate player so our string plays nicely
		gp.surrogate = new Player(game, gp, 300, 100, 3);
		// Add in the yarn
		gp.yarn = new Yarn(game, gp, gp.player1, gp.player2, gp.surrogate);
	}
	// Just in case of typos
	else if(createBool != false){
		console.log(this.enableYarn + " is not a valid state for enableYarn. Please use true or false");
	}
}

// finds the position of the specified level in the global levelArr
LevelManager.prototype.findLevelArrPosition = function(name) {
	for(let i = 0; i < levelArr.length; ++i){
		if(levelArr[i] === name){
			return i;
		}
	}
	console.log("Could not find " + name + " within levelArr");
	return -1;
}

// Adds in the objective glows for the level
LevelManager.prototype.glow = function(howManyGlows, redGlowX, redGlowY, blueGlowX, blueGlowY) {
	var gp = this.gameplay; // renaming it to be shorter

	// Add in the first glow
	gp.redGlow = game.add.sprite(redGlowX, redGlowY, this.heartSprite); //gp.player1.x, gp.player2.y
	gp.redGlow.anchor.setTo(0.5,0.5);
	gp.redGlow.scale.setTo(this.heartScale, this.heartScale);
	gp.redGlow.alpha = 0;

	// Add in the second glow if we need player-specific objectives
	if(howManyGlows === 2){
		gp.blueGlow = game.add.sprite(blueGlowX, blueGlowY, this.heartSprite);
		gp.blueGlow.anchor.setTo(0.5,0.5);
		gp.blueGlow.scale.setTo(this.heartScale, -this.heartScale);
		gp.blueGlow.alpha = 0;
	}
	// Just in case of typos
	else if(howManyGlows != 1){
		console.log("Cannot have " + howManyGlows + " glows. Please enter 1 or 2");
	}
}

// Adds in any tutorial text
// Only runs if the gameplay state has a function "tutorialText()"
LevelManager.prototype.tutorialText = function(){
	var gp = this.gameplay; // renaming it to be shorter

	if(typeof gp.tutorialText === "function"){
		gp.tutorialText();
	}
}

// Win state function
// Call this function inside the gameplay state to trigger the end of the level
LevelManager.prototype.win = function(){
	if(debugWin === false){
		game.time.events.add(this.winTimerDelay, this.preFade, this);
	}
}

// Fade functions
// End the level if the cats are still close
LevelManager.prototype.preFade = function() {
	var gp = this.gameplay; // renaming it to be shorter

	if(gp.complete == true) {
		game.time.events.add(this.preFadeConst, this.fade, this);
	}
}
// Fade out the level
LevelManager.prototype.fade = function() {
	var gp = this.gameplay; // renaming it to be shorter

	game.camera.fade(this.flashColor, this.fadeDuration);
	if(this.ostFadeOut === true){
		if(gp.ost != null)
			gp.ost.fadeOut(this.ostFadeOutDuration);
	}
	else if(this.ostFadeOut != false){
		console.log(this.ostFadeOut + " is not a valid state for ostFadeOut. Please use true or false");
	}
}
// Call the next level
LevelManager.prototype.resetFade = function() {
	var gp = this.gameplay; // renaming it to be shorter

	if(this.fadeComplete === false) {
		if(debugLoopLevel === true){
			game.state.start(this.currLevel, true, false, gp.ost); // current level
		}
		else{
			game.state.start(this.nextLevel, true, false, gp.ost);
		}
		this.fadeComplete = true;
	}
}