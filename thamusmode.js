/*global
	MAP_ACTOR: false,
	XMAP_W: false,
	XMAP_H: false,
	PS: false,
	DISPLAYOFFSET: false,
	ACTIVECOLORS: false,
	ACTIVEIMGS: false,
	putImage: false,
	hero: false,
	PUZZLEMODE: false,
	phase: false,
	MAP_EXIT: false,
	MAP_FLOOR: false,
	MAP_WALL: false,
	MAP_GOLD: false,
	gameMode: true,
	bookOrSmartPhone: true,
	gameWin: false
*/

var THAMUSMAP =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
 			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
			    0,0,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,1,0,0,
			    0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var THAMUSMODE = {
	enterMode: function () {
		this.playerPosition = this.getStart(THAMUSMAP);
		this.draw();
		gameMode = this;
		this.enable = true;
	},
	exitMode: function () {
		this.enable = false;

		PS.statusFade(30);

		// sequence of dialogue
		PS.timerStart(60 * 3, function () {
			PS.statusText("You think this is good...");
			PS.timerStart(60 * 3, function () {
				PS.statusText("...that they will remember more...");
				PS.timerStart(60 * 3, function () {
					PS.statusText("You are mistaken...");
					PS.timerStart(60 * 3, function () {
						PS.statusText("...it will make them forget");
						PS.timerStart(60 * 3, function () {
							if (phase == 1) {
								PUZZLEMODE.enterMode();
							}
							else {
								gameWin();
							}
							bookOrSmartPhone = false;
							PS.statusText("...");
							PS.statusFade(0);
							return PS.ERROR;
						});
						return PS.ERROR;
					});
					return PS.ERROR;
				});
				return PS.ERROR;
			});
			return PS.ERROR;
		});
	},
	getStart: function (map) {
		return map.indexOf(MAP_ACTOR);
	},
	draw: function () {
		var x, y, pos;
		// render map bits
		for (x = 0; x < XMAP_W; ++x) {
			for (y = 0; y < XMAP_H; ++y) {
				pos = x + y * XMAP_W;
				if (pos === this.playerPosition) {
					// player is here
					PS.color(x + DISPLAYOFFSET, y, ACTIVECOLORS.ACTOR_COLOR);
				}
				else {
					// get the color based on the tile; helper function below
					PS.color(x + DISPLAYOFFSET, y, this.colorFromTile(THAMUSMAP[pos]));
				}
			}
		}

		// color blank column
		PS.color(DISPLAYOFFSET - 1, PS.ALL, ACTIVECOLORS.WALL_COLOR);

		// put hero health bar
		putImage(ACTIVEIMGS.HEALTHBAR_FRAME, 0, 0);
		putImage("imgs/healthbar/health" + hero.health + ".png", 1, 3);
	},
	colorFromTile: function (tile) {
		switch(tile) {
			case MAP_EXIT:
				return 0x99ff99;
			case MAP_FLOOR:
			case MAP_ACTOR:
				return ACTIVECOLORS.FLOOR_COLOR;
			case MAP_WALL:
				return ACTIVECOLORS.WALL_COLOR;
			case MAP_GOLD:
				return ACTIVECOLORS.GOLD_COLOR;
		}
	},
	keyDown: function (key, shift, ctrl, options) {
		switch (key) {
			case PS.KEY_ARROW_LEFT:
			case "a".charCodeAt(0):
				if (!this.attemptMove(this.playerPosition - 1)) {return;}
				break;
			case PS.KEY_ARROW_RIGHT:
			case "d".charCodeAt(0):
				if (!this.attemptMove(this.playerPosition + 1)) {return;}
				break;
			case PS.KEY_ARROW_UP:
			case "w".charCodeAt(0):
				if (!this.attemptMove(this.playerPosition - XMAP_W)) {return;}
				break;
			case PS.KEY_ARROW_DOWN:
			case "s".charCodeAt(0):
				if (!this.attemptMove(this.playerPosition + XMAP_W)) {return;}
				break;
			default:
				break;
		}
	},
	attemptMove: function (pos) {
		switch (THAMUSMAP[pos]) {
			case MAP_WALL:
				return false;
			case MAP_EXIT:
				this.exitMode();
				break;
			default:
				this.playerPosition = pos;
				this.draw();
				return true;
		}
	},
	keyUp: function () {}
};
