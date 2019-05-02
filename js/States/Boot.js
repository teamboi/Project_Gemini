// Boot state

// primarily for example, since we don't have much to boot into
var Boot = function(game) {};
Boot.prototype = {
	preload: function() {
		// Load in the loading bar
		game.load.image('loading', 'assets/img/loading.png');
	},
	create: function() {
		game.state.start('Load');
	}
};