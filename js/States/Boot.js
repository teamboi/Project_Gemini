// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// Boot state

// primarily for example, since we don't have much to boot into
var Boot = function(game) {};
Boot.prototype = {
	preload: function() {
		// Load in the loading bar
		game.load.image('loading', 'assets/img/objects/loading.png');
	},
	create: function() {
		game.state.start('Load');
	}
};