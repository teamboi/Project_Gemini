// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Intantiate the Game over state
var Ending = function(game){};
Ending.prototype = {
	init: function(ost){
		// initialize variables for gameplay
		this.theme = ost;
	},
	create: function(){
		var opts = {
			levelName: "Ending",
			titleCard: "endTitle",
			ost : "Cradle",
			narration : "narrate"
		}
		this.transitionManager = new TransitionManager(game, this, opts);
	}
}