// game.js for Perlenspiel 3.2.x

/* jshint -W097 */

/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-17 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
*/

// The "use strict" directive in the following line is important. Don't remove it!
"use strict";

// The following comment lines are for JSLint/JSHint. Don't remove them!

/*jslint nomen: true, white: true */
/*global 
	PS: false, 
	gameMode: true, 
	putImage: false,
	BATTLEMODE: false,
	MAZEMODE: false,
	NONE: false,
	Bat: false,
	generate: false,
	getMapFromMaze: false,
	Hero: false,
	preloadImages: false,
	mySendDB: false,
	newMap: false,
	getNextMap: false,
	gameover: false
*/

// This is a template for creating new Perlenspiel games

// All of the functions below MUST exist, or the engine will complain!

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

var database;

var images = {};

var phase = 1;

var WIDTH = 32;
var HEIGHT = 32;
var NUMMAPS = 1;

var hero;

var bgm, bgm2;

var prevMaps = [];

PS.init = function( system, options ) {
	PS.seed(PS.date().time);
	PS.gridSize( WIDTH, HEIGHT );
	PS.border(PS.ALL, PS.ALL, 0);
	PS.color(PS.ALL, PS.ALL, 0x847821);
	PS.gridColor(0x999999);
	
	PS.statusText("...");
	
	database = PS.dbInit("forget-" + PS.date().time, {login: true});
	
	bgm = PS.audioLoad("ancient_egypt", {
		autoplay: true,
		loop: true,
		path: "music/",
		volume: 0.4,
		fileTypes: ["ogg", "mp3", "wav"]
	});
	
	hero = new Hero();
	
	newMap();
	
	preloadImages(["imgs/healthbar_frame.png", "imgs/hf_mod.png"], function () {
		MAZEMODE.enterMode(getNextMap());
		//PUZZLEMODE.enterMode();
	});
};

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
	if (gameMode && !gameover) {gameMode.click(x, y, data, options);}
};

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.enter = function( x, y, data, options ) {
	if (gameMode && !gameover) {gameMode.enterBead(x, y, data, options);}
};

// PS.exit ( x, y, data, options )
// Called when the mouse cursor/touch exits a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.exit = function( x, y, data, options ) {
	if (gameMode && !gameover) {gameMode.exitBead(x, y, data, options);}
};


// PS.keyDown ( key, shift, ctrl, options )
// Called when a key on the keyboard is pressed
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the PS.KEY constants documented at:
// http://users.wpi.edu/~bmoriarty/ps/constants.html
// [shift] = true if shift key is held down, else false
// [ctrl] = true if control key is held down, else false
// [options] = an object with optional parameters; see documentation for details

PS.keyDown = function( key, shift, ctrl, options ) {
	if (gameMode && !gameover) {gameMode.keyDown(key, shift, ctrl, options);}
};

// PS.keyUp ( key, shift, ctrl, options )
// Called when a key on the keyboard is released
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the PS.KEY constants documented at:
// http://users.wpi.edu/~bmoriarty/ps/constants.html
// [shift] = true if shift key is held down, false otherwise
// [ctrl] = true if control key is held down, false otherwise
// [options] = an object with optional parameters; see documentation for details

PS.keyUp = function( key, shift, ctrl, options ) {
	if (gameMode && !gameover) {gameMode.keyUp(key, shift, ctrl, options);}
};

PS.shutdown = function () {
	PS.dbEvent(database, "endgame", "quit");
	mySendDB();
};