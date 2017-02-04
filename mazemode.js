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
	addHealthClamp: false
*/

var DISPLAYOFFSET = 5;

var AVGSTEPSPERENCOUNTER = 10;
var VARSTEPSPERENCOUNTER = 4; // must be even

var HEALTHBONUS = 5;

var ACTOR_COLOR = PS.COLOR_BLACK,
	EXIT_COLOR = 0x0000FF,
	FLOOR_COLOR = 0xCCC8A5,
	WALL_COLOR = 0x847821,
	GOLD_COLOR = PS.COLOR_GREEN;

var MAZEMODE = {
	enterMode: function (map) {
		this.map = map || this.map; // if not given, use existing
		gameMode = this;
		this.playerPosition = getStart(this.map);
		this.draw();
		this.randomizeNextEncounter();
	},
	exitMode: function () {
		prevMaps.push(this.map);	
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
				if (!this.attemptMove(this.playerPosition - this.map.width)) {return;}
				break;
			case PS.KEY_ARROW_DOWN:
			case "s".charCodeAt(0):
				if (!this.attemptMove(this.playerPosition + this.map.width)) {return;}
				break;
			default:
				break;
		}
	},
	keyUp: function (key, shift, ctrl, options) {
		
	},
	attemptMove: function (pos) {
		PS.debug(this.nextEncounter);
		switch (this.map.data[pos]) {
			case MAP_WALL:
				return false;
			case MAP_EXIT:
				PS.audioPlay("fx_tada");
				break;
			case MAP_GOLD:
				addHealthClamp(hero, HEALTHBONUS);
				putImage("imgs/healthbar/health" + hero.health + ".png", 1, 3); // update healthbar
				this.map.data[pos] = MAP_FLOOR; // don't let use multiple times
				/* falls through */// because gold should be landable
			default: 
				this.playerPosition = pos;
				this.draw();
				--this.nextEncounter;
				if (!this.nextEncounter) {this.encounter();}
				return true;
		}
	},
	draw: function () {
		var x, y, pos;
		for (x = 0; x < this.map.width; ++x) {
			for (y = 0; y < this.map.height; ++y) {
				pos = x + y * this.map.width;
				if (pos === this.playerPosition) {
					PS.color(x + DISPLAYOFFSET, y, ACTOR_COLOR);
				}
				else {
					PS.color(x + DISPLAYOFFSET, y, colorFromTile(this.map.data[pos]));
				}
			}
		}
		
		// put hero health bar
		putImage("imgs/healthbar_frame.png", 0, 0);
		putImage("imgs/healthbar/health" + hero.health + ".png", 1, 3);
	},
	randomizeNextEncounter: function () {
		this.nextEncounter = 
			AVGSTEPSPERENCOUNTER + 
			Math.floor((Math.random() + VARSTEPSPERENCOUNTER)) - 
			(VARSTEPSPERENCOUNTER / 2);
	},
	encounter: function () {
		BATTLEMODE.enterMode(getRandomEnemy());
		this.randomizeNextEncounter();
	}
};

function colorFromTile (tile) {
	switch(tile) {
		case MAP_EXIT:
			return EXIT_COLOR;
		case MAP_FLOOR:
		case MAP_ACTOR:
			return FLOOR_COLOR;
		case MAP_WALL:
			return WALL_COLOR;
		case MAP_GOLD:
			return GOLD_COLOR;
	}
}

function getStart (map) {
	var x;
	for (x = 0; x < map.data.length; ++x) {
		if (map.data[x] === MAP_ACTOR) {return x;}
	}
}