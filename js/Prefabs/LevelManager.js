// let's keep our code tidy with strict mode 👊
"use strict";

// Constructor for LevelManager
function LevelManager(game, gameplay, nextLevel, tilemap, backgroundImage, dialogNum, howManyGlows, redGlowX, redGlowY, blueGlowX, blueGlowY, player1X, player1Y, player2X, player2Y, enableYarn, enableBarrier){
	Phaser.Sprite.call(this, game, game.width/2, game.height/2, null);
	game.add.existing(this);
	this.gameplay = gameplay; // Obtains reference to gameplay state
	var gp = this.gameplay;

	// Save init arguments
	this.nextLevel = nextLevel;
	this.tilemap = tilemap;
	this.howManyGlows = howManyGlows;
	this.redGlowX = redGlowX;
	this.redGlowY = redGlowY;
	this.blueGlowX = blueGlowX;
	this.blueGlowY = blueGlowY;
	this.enableYarn = enableYarn;
	this.enableBarrier = enableBarrier;

	// Create level manager specific variables
	this.heartSprite = "heart";
	this.heartScale = 1.7; //blue was set to 1.3?
	this.flashColor = 0xffffff;
	this.winTimerDelay = 1500;
	this.preFadeConst = 1000;
	this.fadeDuration = 2000;

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

    // Loads in the tilemap and static platforms
    this.createPlatforms();

    // Call the background image
    gp.room = game.add.sprite(0,0,backgroundImage);

    // Initialise z-masking groups
    gp.group = game.add.group();

    // Create the world barriers
    this.createBarrier(enableBarrier, game.width/2, game.height/2, game.width, 1);

    // Create level specific platforms/interactables
    this.createLevelObstacles();

    // Add in the players with the Player prefab constructor
    gp.player1 = new Player(game, gp, player1X, player1Y, "cat1", 'cat1Hitbox', 1);
    gp.player2 = new Player(game, gp, player2X, player2Y, "cat2", 'cat1Hitbox', 2);

    // Create the yarn if specified
    this.createYarn(enableYarn);

    // Add the story text
    gp.dialog = new DialogManager(game, gp, "ball");
    gp.dialog.TypeIntro(dialogNum);
    gp.dialog.TypeOutro(dialogNum);

    //Create the tutorial text
    this.tutorialText();

    //Add the objective glow
    this.glow(howManyGlows, redGlowX, redGlowY, blueGlowX, blueGlowY);

    // Sort the z-masking groups
    gp.group.sort();
}

// inherit prototype from Phaser.Sprite and set constructor to DialogManager
LevelManager.prototype = Object.create(Phaser.Sprite.prototype);
LevelManager.prototype.constructor = LevelManager;

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
LevelManager.prototype.createYarn = function(){
	var gp = this.gameplay; // renaming it to be shorter

	// Only add them if we want to
	if(this.enableYarn === true){
    	// Add the surrogate player so our string plays nicely
    	gp.surrogate = new Player(game, gp, 300, 100, "cat1", "cat1Hitbox",3);
    	// Add in the yarn
    	gp.yarn = new Yarn(game, gp, 'ball', gp.player1, gp.player2, gp.surrogate);
    }
    // Just in case of typos
    else if(this.enableYarn != false){
    	console.log(this.enableYarn + " is not a valid state for enableYarn. Please use true or false");
    }
}

// Adds in the objective glows for the level
LevelManager.prototype.glow = function() {
	var gp = this.gameplay; // renaming it to be shorter

	// Add in the first glow
    gp.redGlow = game.add.sprite(this.redGlowX, this.redGlowY, this.heartSprite); //gp.player1.x, gp.player2.y
    gp.redGlow.anchor.setTo(0.5,0.5);
    gp.redGlow.scale.setTo(this.heartScale, this.heartScale);
    gp.redGlow.alpha = 0;

    // Add in the second glow if we need player-specific objectives
    if(this.howManyGlows === 2){
    	gp.blueGlow = game.add.sprite(this.blueGlowX, this.blueGlowY, this.heartSprite);
        gp.blueGlow.anchor.setTo(0.5,0.5);
        gp.blueGlow.scale.setTo(this.heartScale, -this.heartScale);
        gp.blueGlow.alpha = 0;
    }
    // Just in case of typos
    else if(this.howManyGlows != 1){
    	console.log("Cannot have " + this.howManyGlows + " glows. Please enter 1 or 2");
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
	game.time.events.add(this.winTimerDelay, this.preFade, this);
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
    game.camera.fade(this.flashColor, this.fadeDuration);
}
// Call the next level
LevelManager.prototype.resetFade = function() {
	var gp = this.gameplay; // renaming it to be shorter

    if(this.fadeComplete == false) {
        game.state.start(this.nextLevel, true, false, gp.ost);
        this.fadeComplete = true;
    }
}