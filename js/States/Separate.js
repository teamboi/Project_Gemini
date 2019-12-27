// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Initialize the Main Menu state
var Separate = function(game){};
Separate.prototype = {
	init: function(ost){
		// initialize variables for gameplay
		this.theme = ost;
	},
	create: function(){
		var opts = {
			levelName: "Separate",
			titleCard: "housesTitle",
			ost : "Separate",
			narration : "narrate"
		}
		this.transitionManager = new TransitionManager(game, this, opts);
	}
};