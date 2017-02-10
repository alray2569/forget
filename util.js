/*global
	WIDTH: false,
	HEIGHT: false,
	PS: false,
	images: false,
	phase: true,
	bgm: true,
	bgm2: true,
	MAZEMODE: false,
	hero: false,
	database: false,
	NONE: false,
	maze: true,
	getMapFromMaze: false,
	generate: false,
	prevMaps: false,
	puzzles: false
*/

var MAP_WALL = 0;
var MAP_FLOOR = 1;
var MAP_GOLD = 2;
var MAP_ACTOR = 3;
var MAP_EXIT = 4;

var MAP_W = 12,
	MAP_H = 15;

var MAXHEALTH = 26;

var PHASE1COLORS = {
	ACTOR_COLOR: PS.COLOR_BLACK,
	EXIT_COLOR: 0x0000FF,
	FLOOR_COLOR: 0xCCC8A5,
	WALL_COLOR: 0x847821,
	GOLD_COLOR: PS.COLOR_GREEN,
	GATE_COLOR: 0x847821,
	SWITCH_COLOR: 0x990000,
	BLOCK_COLOR: 0x666666
};

var PHASE2COLORS = {
	ACTOR_COLOR: PS.COLOR_BLACK,
	EXIT_COLOR: 0x0000FF,
	FLOOR_COLOR: 0x999999,
	WALL_COLOR: 0xCCCCCC,
	GOLD_COLOR: 0x009900,
	SWITCH_COLOR: 0x990000,
	BLOCK_COLOR: 0x666666,
	GATE_COLOR: 0xcccccc
};

var ACTIVECOLORS = PHASE1COLORS;

var PHASE1IMGS = {
	BATTLE_BG: "imgs/battle_egy.png",
	HEALTHBAR_FRAME: "imgs/healthbar_frame.png",
	HERO_IMG: "imgs/thoth.png",
	SHIM: "imgs/shim.png",
	bat: "imgs/bat.png"
};

var PHASE2IMGS = {
	BATTLE_BG: "imgs/battle_mod.png",
	HEALTHBAR_FRAME: "imgs/hf_mod.png",
	HERO_IMG: "imgs/you.png",
	SHIM: "imgs/shiml.png",
	bat: "imgs/bat_mod.png"
};

var ACTIVEIMGS = PHASE1IMGS;

var PUTTRIES = 0;

var putImage = function (filename, x1, y1, x2, y2, tries) {
	// default values
	x1 = x1 || 0;
	y1 = y1 || 0;
	x2 = x2 || WIDTH;
	y2 = y2 || HEIGHT;
	tries = tries || 0;
	
	// draw function
	var draw = function (image) {
		images[filename] = image;
		PS.imageBlit(image, x1, y1, {
			left: 0, 
			right: 0, 
			width: x2 - x1, 
			height: y2 - y1
		});
	};
	
	// check if already loaded
	if (images[filename]) {
		draw(images[filename]);
	}
	// if not, load it
	else {
		PS.imageLoad(filename, draw);
	}
};

function setHealthClamp(target, health) {
	if (health < 0) {
		target.health = 0;
		return 0;
	}
	if (health > MAXHEALTH) {
		target.health = MAXHEALTH;
		return MAXHEALTH;
	}
	target.health = health;
	return target.health;
}

function addHealthClamp(target, delta) {
	return setHealthClamp(target, target.health + delta);
}

function nextPhase() {
	++phase;
	ACTIVECOLORS = PHASE2COLORS;
	ACTIVEIMGS = PHASE2IMGS;
	PS.audioStop(bgm);
	bgm2 = PS.audioLoad("modern_day", {
		autoplay: true,
		loop: true,
		path: "music/",
		volume: 0.4,
		fileTypes: ["ogg", "mp3", "wav"]
	});
	MAZEMODE.totalMaps = 0;
	hero.health = 26;
	PS.dbEvent(database, "nextPhase", true);
	MAZEMODE.enterMode(getNextMap());
}

function gameOver() {
	PS.audioStop(bgm);
	PS.audioPlay("fx_wilhelm");
	PS.dbEvent(database, "endgame", "gameover");
	mySendDB();
}

function gameWin() {
	PS.fade(PS.ALL, PS.ALL, 60 * 5);
	PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.dbEvent(database, "endgame", "win");
	mySendDB();
}

function mySendDB() {
	PS.dbSend(database, ["alray"], {discard: true, message: "..."});
}

function Hero () {
	this.health = 26;
	this.weakTo = NONE;
	this.strongTo = NONE;
}

function preloadImages(filenames, callback) {
	var filename = filenames.pop();
	
	function after(image) {
		image[filename] = image;
		
		if (filenames.length === 0) {
			callback();
		}
		else {
			preloadImages(filenames, callback);
		}
	}
	
	PS.imageLoad(filename, after);
}

function newMap() {
	return getMapFromMaze(generate(12, 15));
}

function getNextMap() {
	// return the existing maze or the next one.
	return prevMaps[MAZEMODE.totalMaps] || newMap();
}

function getNextPuzzle() {
	return puzzles[MAZEMODE.totalMaps - 1];
}