// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// Boot state

// primarily for example, since we don't have much to boot into
var Boot = function(game) {};
Boot.prototype = {
	preload: function() {
		// Load in the loading bar
		game.load.image('linePurp', 'assets/img/linePurp.png');
		game.load.image('line', 'assets/img/line.png');
		game.load.text('dialog', 'assets/Dialog.txt');
	},
	create: function() {
		//HACK TO PRELOAD A CUSTOM FONT
		game.stage.backgroundColor = '#FFFFFF';
		this.game.add.text(0, 0, "hack", {font:"1px Comfortaa", fill:"##212121"});
		game.state.start('Load');
	}
};