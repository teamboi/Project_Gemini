// WE ARE TEAM BOY (also known as group 14)
// Herman Wu, Erica Li, and Georgio Klironomos

// let's keep our code tidy with strict mode 👊
"use strict";
//Initialize the Main Menu state
var Together = function(game){};
Together.prototype = {
	init: function(ost){
		// initialize variables for gameplay
        this.theme = ost;
    },
	create: function(){
		var nextLevel = "Cats";
		var titleCard = "togetherTitle";
		var ost = "Together";
		var narration = "oneIntro";
		this.transitionManager = new TransitionManager(game, this, nextLevel, titleCard, ost, narration);
	}
};