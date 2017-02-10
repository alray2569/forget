/* global
	gameMode: true,
	prevMaps: false,
	PS: false,
	MAP_WALL: false,
	MAP_EXIT: false,
	MAP_ACTOR: false,
	MAP_FLOOR: false,
	MAP_GOLD: false,
	BATTLEMODE: false,
	getRandomEnemy: false,
	hero: false,
	putImage: false,
	addHealthClamp: false,
	gameWin: false,
	phase: true,
	bgm: true,
	bgm2: true,
	nextPhase: false,
	ACTIVECOLORS: false,
	ACTIVEIMGS: false,
	DISPLAYOFFSET: false,
	getNextPuzzle: false,
	MAZEMODE: false,
	getNextMap: false,
	MAP_W: false,
	MAP_H: false
*/

var SWITCH = 6, GATE = 7, BLOCK = 5;

var DIRS = {
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4
};

var XMAP_W = 26, XMAP_H = 32;

var puzzle1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
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
			   0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,4,0,0,
			   0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
			   0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
			   0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
			   0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
			   0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
			   0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,
			   0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
			   0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
			   0,3,1,1,1,1,1,5,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,
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

var puzzle2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
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
			   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];


var puzzles = [puzzle1];

var PUZZLEMODE = {
	totalMaps: 0,
	enterMode: function () {
		this.map = getNextPuzzle();
		gameMode = this;
		this.playerPosition = this.getStart(this.map);
		this.draw();
		++this.totalMaps;
	},
	exitMode: function () {
		MAZEMODE.enterMode(getNextMap());
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
		var dir;
		
		switch (key) {
			case PS.KEY_ARROW_LEFT:
			case "a".charCodeAt(0):
				dir = DIRS.LEFT;
				break;
			case PS.KEY_ARROW_RIGHT:
			case "d".charCodeAt(0):
				dir = DIRS.RIGHT;
				break;
			case PS.KEY_ARROW_UP:
			case "w".charCodeAt(0):
				dir = DIRS.UP;
				break;
			case PS.KEY_ARROW_DOWN:
			case "s".charCodeAt(0):
				dir = DIRS.DOWN;
				break;
			default:
				break;
		}
		this.attemptMove(this.applyDir(dir, this.playerPosition), dir);
	},
	keyUp: function (key, shift, ctrl, options) {
		
	},
	applyDir: function (dir, pos) {
		switch (dir) {
			case DIRS.UP: return pos - XMAP_W;
			case DIRS.DOWN: return pos + XMAP_W;
			case DIRS.LEFT: return pos - 1;
			case DIRS.RIGHT: return pos + 1;
		}
	},
	attemptMove: function (pos, dir) {
		var blockdest, a;
		switch (this.map[pos]) {
			case GATE:
			case MAP_WALL:
				return false;
			case MAP_EXIT:
				this.exitMode();
				return true;
			case BLOCK:
				// if there is a WALL, can't move
				blockdest = this.applyDir(dir, pos);
				if (this.map[blockdest] === MAP_WALL) {
					return false;
				}
				// if there is a SWITCH, remove all GATESS
				if (this.map[blockdest] === SWITCH) {
					a = this.map.indexOf(GATE);
					this.map[a] = MAP_FLOOR;
				}
				// move the block
				this.map[pos] = MAP_FLOOR;
				this.map[blockdest] = BLOCK;
				/* falls through */
			default: 
				this.playerPosition = pos;
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
			case SWITCH:
				return ACTIVECOLORS.SWITCH_COLOR;
			case BLOCK:
				return ACTIVECOLORS.BLOCK_COLOR;
			case GATE:
				return ACTIVECOLORS.GATE_COLOR;
		}
	},
	getStart: function (map) {
		var x;
		for (x = 0; x < map.length; ++x) {
			if (map[x] === MAP_ACTOR) {return x;}
		}
	}
};
