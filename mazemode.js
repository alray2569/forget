/* global
	// vars,
	prevMaps: false,
	gameMode: true,
	phase: false,
	hero: false,
	
	// functions,
	gameWin: false,
	nextPhase: false,
	addHealthClamp: false,
	putImage: false,
	getRandomEnemy: false,
	
	// consts,
	PUZZLEMODE: false,
	PS: false,
	XMAP_W: false,
	XMAP_H: false,
	MAP_WALL: false,
	MAP_EXIT: false,
	MAP_GOLD: false,
	MAP_FLOOR: false,
	MAP_ACTOR: false,
	ACTIVECOLORS: false,
	ACTIVEIMGS: false,
	BATTLEMODE: false,
*/

var MAPSPERPHASE = 3;
var MAPSTOEND = 1;

var DISPLAYOFFSET = 6;

var AVGSTEPSPERENCOUNTER = 20;
var VARSTEPSPERENCOUNTER = 8; // must be even

var HEALTHBONUS = 6;

var MAZEMODE = {
	totalMaps: 0,
	enterMode: function (map) {
		prevMaps.push((map || this.map));
		this.map = (map || this.map).data.slice(0); // if not given, use existing
		gameMode = this;
		this.playerPosition = this.getStart(this.map);
		this.draw();
		this.randomizeNextEncounter();
		++this.totalMaps;
	},
	exitMode: function () {
		if (this.totalMaps === MAPSPERPHASE) {
			if (phase === 2) {
				gameWin();
			}
			else {
				nextPhase();
			}
		}
		else if (this.totalMaps === MAPSTOEND) {
			THAMUSMODE.enterMode();
		}
		else {
			PUZZLEMODE.enterMode();
		}
	},
	click: function (x, y, data, options) {
		
	},
	release: function (x, y, data, options) {
		
	},
	enterBead: function (x, y, data, options) {
		
	},
	exitBead: function (x, y, data, options) {
		
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
				return;
		}
	},
	keyUp: function (key, shift, ctrl, options) {
		
	},
	attemptMove: function (pos) {
		switch (this.map[pos]) {
			case MAP_WALL:
				return false;
			case MAP_EXIT:
				this.exitMode();
				break;
			case MAP_GOLD:
				addHealthClamp(hero, HEALTHBONUS);
				this.map[pos] = MAP_FLOOR; // don't let use multiple times
				/* falls through */// because gold should be landable
			default: 
				this.playerPosition = pos;
				--this.nextEncounter;
				if (!this.nextEncounter) {
					this.encounter();
					return true;
				}
				this.draw();
				return true;
		}
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
					PS.color(x + DISPLAYOFFSET, y, this.colorFromTile(this.map[pos]));
				}
			}
		}
		
		// color blank column
		PS.color(DISPLAYOFFSET - 1, PS.ALL, ACTIVECOLORS.WALL_COLOR);
		
		// put hero health bar
		putImage(ACTIVEIMGS.HEALTHBAR_FRAME, 0, 0);
		putImage("imgs/healthbar/health" + hero.health + ".png", 1, 3);
	},
	randomizeNextEncounter: function () {
		this.nextEncounter = (AVGSTEPSPERENCOUNTER + (PS.random(VARSTEPSPERENCOUNTER) - VARSTEPSPERENCOUNTER / 2));
	},
	encounter: function () {
		BATTLEMODE.enterMode(getRandomEnemy());
		this.randomizeNextEncounter();
	},
	colorFromTile: function (tile) {
		switch(tile) {
			case MAP_EXIT:
				return ACTIVECOLORS.EXIT_COLOR;
			case MAP_FLOOR:
			case MAP_ACTOR:
				return ACTIVECOLORS.FLOOR_COLOR;
			case MAP_WALL:
				return ACTIVECOLORS.WALL_COLOR;
			case MAP_GOLD:
				return ACTIVECOLORS.GOLD_COLOR;
		}
		
	},
	getStart: function (map) {
		var x;
		for (x = 0; x < map.length; ++x) {
			if (map[x] === MAP_ACTOR) {return x;}
		}
	}
};
