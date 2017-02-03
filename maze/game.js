// maze.js for Perlenspiel 3.2

// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

// This is a template for creating new Perlenspiel games

// All of the functions below MUST exist, or the engine will complain!

var G;

( function () {
	"use strict";

	// Specify the LOGICAL width/height dimensions of the maze here
	// They must be EVEN integers between 3 and 15 inclusive
	// Values outside this range are clamped; non-integral values are floored
	// The actual grid dimensions will be (2 * dim) + 2

	var WIDTH = 11;
	var HEIGHT = 11;

	var PLANE_FLOOR = 0; // z-plane of floor
	var PLANE_ACTOR = 1; // z-plane of actor

	// Specify the total number of gold pieces in the maze

	var GOLD_TOTAL = 10;

	var COLOR_BG = PS.COLOR_GRAY_DARK;
	var COLOR_WALL = PS.COLOR_BLACK;
	var COLOR_FLOOR = PS.COLOR_GRAY_LIGHT;
	var COLOR_ACTOR = PS.COLOR_GREEN;
	var COLOR_GOLD = PS.COLOR_YELLOW;
	var COLOR_EXIT = PS.COLOR_BLUE;

	var GLYPH_EXIT = "X"; // glyph to mark exit
	var GLYPH_ACTOR = 0; // glyph to mark actor
	var GLYPH_FLOOR = 0; // glyph to mark floor
	var GLYPH_GOLD = 0; // glyph to mark gold

	var SOUND_FLOOR = "fx_click"; // touch floor sound
	var SOUND_WALL = "fx_hoot"; // touch wall sound
	var SOUND_GOLD = "fx_coin1"; // take coin sound
	var SOUND_OPEN = "fx_powerup8"; // open exit sound
	var SOUND_WIN = "fx_tada"; // win sound
	var SOUND_ERROR = "fx_uhoh"; // error sound

	// Values for pathmap

	var MAP_WALL = 0;
	var MAP_FLOOR = 1;
	var MAP_GOLD = 2;
	var MAP_ACTOR = 3;
	var MAP_EXIT = 4;

	var HOLDING_GOLD = "gold";
	var HOLDING_ACTOR = "actor";
	var HOLDING_EXIT = "exit";

	var PROMPT = "Touch = edit, P = play."; // standard prompt

	// Random perfect maze generator

	var OPEN = 0; // open indicator; do not change!
	var WALL = 1; // wall indicator; do not change!
	var maze; // output of maze generator

	var generate = function ( w, h ) {
		var m, pushIntact, y, x, visited, stack, here, intact, len, there;

		m = {
			width : w,
			height : h,
			xmax : w - 1,
			ymax : h - 1,
			total : w * h,
			data : []
		};

		pushIntact = function ( x, y ) {
			var loc;

			loc = m.data[ ( y * h ) + x ];
			if ( ( loc.top === WALL ) && ( loc.left === WALL ) && ( loc.bottom === WALL ) &&
				( loc.right === WALL ) ) {
				intact.push( loc );
			}
		};

		for ( y = 0; y < h; y += 1 ) {
			for ( x = 0; x < w; x += 1 ) {
				m.data[ ( y * h ) + x ] = {
					xpos : x, // logical x coordinate
					ypos : y, // logical y coordinate
					gx : ( x * 2 ) + 1, // grid x coordinate
					gy : ( y * 2 ) + 1, // grid y coordinate
					top : WALL, left : WALL, bottom : WALL, right : WALL,
					actor : false, exit : false, gold : false
				};
			}
		}

		visited = 1;
		stack = [];
		x = PS.random( w ) - 1; // current x
		y = PS.random( h ) - 1; // current y
		here = m.data[ ( y * h ) + x ];
		while ( visited < m.total ) {
			// Make list of all adjacent intact cells

			intact = [];
			if ( y > 0 ) {
				pushIntact( x, y - 1 ); // north
			}
			if ( y < m.ymax ) {
				pushIntact( x, y + 1 ); // south
			}
			if ( x < m.xmax ) {
				pushIntact( x + 1, y ); // east
			}
			if ( x > 0 ) {
				pushIntact( x - 1, y ); // west
			}

			len = intact.length;
			if ( len > 0 ) {
				if ( len === 1 ) {
					there = intact[ 0 ];
				}
				else {
					there = intact[ PS.random( len ) - 1 ];
				}

				// Knock down connecting wall

				if ( there.xpos > x ) {
					here.right = there.left = OPEN;
				}
				else if ( there.xpos < x ) {
					here.left = there.right = OPEN;
				}
				else if ( there.ypos > y ) {
					here.bottom = there.top = OPEN;
				}
				else if ( there.ypos < y ) {
					here.top = there.bottom = OPEN;
				}
				stack.push( here );
				here = there;
				visited += 1;
			}
			else {
				here = stack.pop();
			}
			x = here.xpos;
			y = here.ypos;
		}
		return m;
	};

	// ImageMap used to control pathfinder and editor
	// Populated by the map generator

	var map = {
		width : 0, height : 0, // set by init()
		pixelSize : 1, // do not change this!
		data : []
	};

	var holding = null; // current held object, null = none
	var holdingColor; // color of held object
	var underColor; // color under held object

	var actorX = 0; // grid x-pos of actor
	var actorY = 0; // grid y-pos of actor

	// Draw actor on grid

	var drawActor = function ( x, y ) {
		actorX = x;
		actorY = y;
		PS.color( x, y, COLOR_ACTOR );
		PS.glyph( x, y, GLYPH_ACTOR );
		map.data[ ( y * map.height ) + x ] = MAP_ACTOR;
	};

	var exitX; // grid x-pos of exit
	var exitY; // grid y-pos of exit

	// Draw exit on grid

	var drawExit = function ( x, y ) {
		exitX = x;
		exitY = y;
		PS.color( x, y, COLOR_EXIT );
		PS.glyph( x, y, GLYPH_EXIT );
		map.data[ ( y * map.height ) + x ] = MAP_EXIT;
	};

	// Draw gold on grid, place in ImageMap

	var drawGold = function ( x, y ) {
		PS.color( x, y, COLOR_GOLD );
		PS.glyph( x, y, GLYPH_GOLD );
		map.data[ ( y * map.height ) + x ] = MAP_GOLD; // add to map
//		PS.debug( "Gold @ " + x + ", " + y + "\n" );
	};

	// Draw floor on grid, place in ImageMap

	var drawFloor = function ( x, y ) {
		PS.color( x, y, COLOR_FLOOR );
		PS.glyph( x, y, GLYPH_FLOOR );
		map.data[ ( y * map.height ) + x ] = MAP_FLOOR;
	};

	// Draw the maze, populate ImageMap data

	var draw = function () {
		var i, here, x, y;

		PS.gridPlane( PLANE_FLOOR ); // switch to floor plane
		for ( i = 0; i < maze.total; i += 1 ) {
			here = maze.data[ i ];
			x = here.gx;
			y = here.gy;
			drawFloor( x, y );
			if ( here.top === OPEN ) {
				drawFloor( x, y - 1 );
			}
			if ( here.left === OPEN ) {
				drawFloor( x - 1, y );
			}
			if ( here.bottom === OPEN ) {
				drawFloor( x, y + 1 );
			}
			if ( here.right === OPEN ) {
				drawFloor( x + 1, y );
			}
		}

		// Establish actor (top left corner)

		here = maze.data[ 0 ];
		here.actor = true;
		drawActor( here.gx, here.gy );

		// Establish exit (bottom right corner)

		here = maze.data[ maze.data.length - 1 ];
		here.exit = true;
		drawExit( here.gx, here.gy );

		// Randomly place gold

		i = 0;
		while ( i < GOLD_TOTAL ) {
			x = PS.random( maze.width ) - 1;
			y = PS.random( maze.height ) - 1;
			here = maze.data[ ( y * maze.height ) + x ];
			if ( !here.gold && !here.actor && !here.exit ) {
				here.gold = true;
				drawGold( here.gx, here.gy );
				i += 1;
			}
		}
	};

	var playing = false; // true if playing game

	var id_sprite; // actor sprite id
	var id_path; // pathmap id for pathfinder
	var id_timer; // timer id

	var gold_found = 0; // gold pieces collected
	var won = false; // true on win

	var exit_ready = false; // true when exit is opened

	// Timer function, called every 1/10th sec
	// This moves the actor along paths

	var path = null; // path to follow, null if none
	var step = 0; // current step on path

	var tick = function () {
		var p, nx, ny, ptr, val;

		if ( !path ) { // path invalid (null)?
			return; // just exit
		}

		// Get next point on path

		p = path[ step ];
		nx = p[ 0 ]; // next x-pos
		ny = p[ 1 ]; // next y-pos

		// If actor already at next pos,
		// path is exhausted, so nuke it

		if ( ( actorX === nx ) && ( actorY === ny ) ) {
			path = null;
			return;
		}

		// Move sprite to next position

		PS.spriteMove( id_sprite, nx, ny );
		actorX = nx; // update actor's xpos
		actorY = ny; // and ypos

		// If actor has reached a gold piece, take it

		ptr = ( actorY * map.height ) + actorX; // pointer to map data under actor
		val = map.data[ ptr ]; // get map data
		if ( val === MAP_GOLD ) {
			map.data[ ptr ] = MAP_FLOOR; // change gold to floor in map.data
			PS.gridPlane( PLANE_FLOOR ); // switch to floor plane
			PS.color( actorX, actorY, COLOR_FLOOR ); // change visible floor color

			// If last gold has been collected, activate the exit

			gold_found += 1; // update gold count
			if ( gold_found >= GOLD_TOTAL ) {
				exit_ready = true;
				PS.color( exitX, exitY, COLOR_EXIT ); // show the exit
				PS.glyphColor( exitX, exitY, PS.COLOR_WHITE ); // mark with white X
				PS.glyph( exitX, exitY, "X" );
				PS.statusText( "Found " + gold_found + " gold! Exit open!" );
				PS.audioPlay( SOUND_OPEN );
			}

			// Otherwise just update score

			else {
				PS.statusText( "Found " + gold_found + " gold!" );
				PS.audioPlay( SOUND_GOLD );
			}
		}

		// If exit is ready and actor has reached it, end game

		else if ( exit_ready && ( actorX === exitX ) && ( actorY === exitY ) ) {
			PS.timerStop( id_timer ); // stop movement timer
			PS.statusText( "You escaped with " + gold_found + " gold!" );
			PS.audioPlay( SOUND_WIN );
			won = true;
			return;
		}

		step += 1; // point to next step

		// If no more steps, nuke path

		if ( step >= path.length ) {
			path = null;
		}
	};

	G = {
		gridW : 0, // actual width of grid
		gridH : 0, // actual height of grid

		init : function () {
			var w, h, len, i;

			// Comment out the following line to generate a random perfect maze every time!

			PS.seed( 3369 ); // magic seed value used to generate sample maze

			// Validate maze dimensions, calc resulting grid size
			// Actual grid dimensions are available in G.gridW and G.gridH

			w = Math.floor( WIDTH );
			if ( w < 3 ) {
				w = 3;
			}
			else if ( w > 15 ) {
				w = 15;
			}
			h = Math.floor( HEIGHT );
			if ( h < 3 ) {
				h = 3;
			}
			else if ( h > 15 ) {
				h = 15;
			}
			G.gridW = map.width = ( w * 2 ) + 1;
			G.gridH = map.height = ( h * 2 ) + 1;

			// Init ImageMap data

			len = G.gridW * G.gridH;
			for ( i = 0; i < len; i += 1 ) {
				map.data[ i ] = MAP_WALL;
			}

			PS.gridSize( G.gridW, G.gridH );
			PS.gridColor( COLOR_BG );
			PS.border( PS.ALL, PS.ALL, 0 );
			PS.color( PS.ALL, PS.ALL, COLOR_WALL );
			PS.statusColor( PS.COLOR_WHITE );
			PS.statusText( PROMPT );

			maze = generate( w, h );
			draw();
			holding = null;

			// Preload & lock sounds

			PS.audioLoad( SOUND_FLOOR, { lock : true } );
			PS.audioLoad( SOUND_WALL, { lock : true } );
			PS.audioLoad( SOUND_GOLD, { lock : true } );
			PS.audioLoad( SOUND_OPEN, { lock : true } );
			PS.audioLoad( SOUND_WIN, { lock : true } );
		},

		touch : function ( x, y ) {
			var line, here;

			// This code controls gameplay

			if ( playing ) {
				if ( won ) { // Do nothing if game over
					return;
				}

				// Use pathfinder to calculate a line from current actor position
				// to touched position

				line = PS.pathFind( id_path, actorX, actorY, x, y );

				// If line is not empty, it's valid,
				// so make it the new path
				// Otherwise hoot at the player

				if ( line.length > 0 ) {
					path = line;
					step = 0; // start at beginning
					PS.audioPlay( SOUND_FLOOR );
				}
				else {
					PS.audioPlay( SOUND_WALL );
				}
				return;
			}

			// This code operates the editor

			// Clicked on actor

			if ( ( x === actorX ) && ( y === actorY ) ) {
				if ( !holding ) {
					holding = HOLDING_ACTOR;
					holdingColor = COLOR_ACTOR;
					actorX = actorY = -1; // prevents matching old position
					drawFloor( x, y );
					PS.statusText( "Touch to place actor." );
				}
				else {
					PS.statusText( "Can't stack " + holding + " on actor!" );
				}
			}

			// Clicked on exit

			else if ( ( x === exitX ) && ( y === exitY ) ) {
				if ( !holding ) {
					holding = HOLDING_EXIT;
					holdingColor = COLOR_EXIT;
					exitX = exitY = -1; // prevents matching old position
					drawFloor( x, y );
					PS.statusText( "Touch to place exit." );
				}
				else {
					PS.statusText( "Can't stack " + holding + " on exit!" );
				}
			}

			else {
				here = map.data[ ( y * map.height ) + x ];
				if ( here === MAP_WALL ) {
					if ( holding ) {
						PS.statusText( "Can't place " + holding + " in wall!" );
					}
				}

				// Clicked on gold

				else if ( here === MAP_GOLD ) {
					if ( !holding ) {
						map.data[ ( y * map.height ) + x ] = MAP_FLOOR; // remove gold
						holding = HOLDING_GOLD;
						holdingColor = COLOR_GOLD;
						drawFloor( x, y );
						PS.statusText( "Touch to place gold." );
					}
					else {
						PS.statusText( "Can't stack " + holding + " on gold!" );
					}
				}

				// If clicked floor, drop held object

				else if ( here === MAP_FLOOR ) {
					if ( holding ) {
						if ( holding === HOLDING_GOLD ) {
							drawGold( x, y );
						}
						else if ( holding === HOLDING_ACTOR ) {
							drawActor( x, y );
						}
						else if ( holding === HOLDING_EXIT ) {
							drawExit( x, y );
						}
						PS.statusText( "Placed " + holding + ". " + PROMPT );
						holding = null;
					}
				}
			}
		},

		// Draw held object when moving

		enter : function ( x, y ) {
			if ( holding ) {
				underColor = PS.color( x, y ); // save color underneath
				PS.color( x, y, holdingColor );
			}
		},

		// Erase held object when moving

		exit : function ( x, y ) {
			if ( holding ) {
				PS.color( x, y, underColor ); // restore color
			}
		},

		// Watch for the P key for play mode switch, D for image dump

		keyDown : function ( key ) {
			if ( !playing ) {

				// Check for lower or upper case P
				// Switches to play mode

				if ( ( key === 80 ) || ( key === 112 ) ) {

					// Can't switch if holding anything!

					if ( holding ) {
						PS.statusText( "Place " + holding + " before playing!" );
						PS.audioPlay( SOUND_ERROR );
						return;
					}

					// Hide the editor's actor & exit

					drawFloor( actorX, actorY );
					drawFloor( exitX, exitY );

					// Create 1x1 solid sprite for actor
					// Place on actor plane in initial actor position

					id_sprite = PS.spriteSolid( 1, 1 );
					PS.spriteSolidColor( id_sprite, COLOR_ACTOR );
					PS.spritePlane( id_sprite, PLANE_ACTOR );
					PS.spriteMove( id_sprite, actorX, actorY );

					// Create pathmap from our imageMap
					// for use by pathfinder

					id_path = PS.pathMap( map );

					// Start the timer function that moves the actor
					// Run at 10 frames/sec (every 6 ticks)

					path = null; // start with no path
					step = 0;
					id_timer = PS.timerStart( 6, tick );

					PS.statusText( "Click/touch to move" );
					playing = true;
				}

				// Check for lower or upper case D
				// Dumps maze to debugger

				if ( ( key === 68 ) || ( key === 100 ) ) {

					// Can't dump if holding anything!

					if ( holding ) {
						PS.statusText( "Place " + holding + " before dumping!" );
						PS.audioPlay( SOUND_ERROR );
						return;
					}

					PS.debugClear();
					PS.imageDump( map, PS.DEFAULT, PS.DEFAULT, PS.DEFAULT, 0 ); // force decimal
				}
			}
		}
	};
}());

PS.init = function( system, options ) {
	"use strict";

	G.init();
};

PS.touch = function( x, y, data, options ) {
	"use strict";

	G.touch( x, y );
};

PS.enter = function( x, y, data, options ) {
	"use strict";

	G.enter( x, y );
};

PS.exit = function( x, y, data, options ) {
	"use strict";

	G.exit( x, y );
};

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict";

	G.keyDown( key );
};

// These event handlers don't do anything in this game,
// but need to be here

PS.release = function( x, y, data, options ) {
	"use strict";
};

PS.exitGrid = function( options ) {
	"use strict";
};

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict";
};

PS.swipe = function( data, options ) {
	"use strict";
};

PS.input = function( sensors, options ) {
	"use strict";
};

