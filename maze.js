/*global 
	PS,
	MAP_WALL,
	MAP_FLOOR,
	MAP_ACTOR,
	MAP_EXIT,
	MAP_GOLD
*/

/**
 * Maze generator based on the MazeTool from PROF. BRIAN MORIARTY at WPI.
 * Modified by ANDREW RAY.
*/

var WALL = 0,
	OPEN = 1;

var TOTALHEALTHPODS = 15;

function generate ( w, h ) {
	var m, pushIntact, y, x, visited, stack, here, intact, len, there, numhealthpods = 0;
	
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
		
		loc = m.data[ ( y * w ) + x ];
		if ( ( loc.top === WALL ) && ( loc.left === WALL ) && ( loc.bottom === WALL ) &&
			( loc.right === WALL ) ) {
			intact.push( loc );
		}
	};

	for ( y = 0; y < h; y += 1 ) {
		for ( x = 0; x < w; x += 1 ) {
			m.data[ ( y * w ) + x ] = {
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
	here = m.data[ ( y * w ) + x ];
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
	
	// put health pods
	for (; numhealthpods < TOTALHEALTHPODS; ++numhealthpods) {
		x = PS.random(w - 1);
		y = PS.random(h - 1);
		m.data[x + y * w].gold = true;
	}
	
	return m;
}

function getMapFromMaze(maze) {
	var map = {
			width: maze.width * 2 + 2,
			height: maze.height * 2 + 2,
			data: []
		},
		x, y, coord, here;
	
	function ix(coord, maze) {
		return coord.y * maze.width + coord.x;
	}
	
	function mazeCoordToMapCoord(coord) {
		return {
			x: coord.x * 2 + 1,
			y: coord.y * 2 + 1
		};
	}
	
	map.data.length = map.width * map.height;
	
	// fill in map with walls
	map.data = map.data.fill(MAP_WALL);
	
	for (x = 0; x < maze.width; ++x) {
		for (y = 0; y < maze.height; ++y) {
			coord = {x: x, y: y};
			here = maze.data[ix(coord, maze)];
			
			// logic
			if (here.actor) {
				map.data[ix(mazeCoordToMapCoord(coord), map)] = MAP_ACTOR;
			}
			else if (here.exit) {
				map.data[ix(mazeCoordToMapCoord(coord), map)] = MAP_EXIT;
			}
			else if (here.gold) {
				map.data[ix(mazeCoordToMapCoord(coord), map)] = MAP_GOLD;
			}
			else {
				map.data[ix(mazeCoordToMapCoord(coord), map)] = MAP_FLOOR;
			}
			
			// right and below
			if (here.right) {
				map.data[ix(mazeCoordToMapCoord(coord), map) + 1] = MAP_FLOOR;
			}
			if (here.bottom) {
				map.data[ix(mazeCoordToMapCoord(coord), map) + map.width] = MAP_FLOOR;
			}
		}
	}
	
	map.data[ix({x: 1, y: 1}, map)] = MAP_ACTOR;
	map.data[ix({x: map.width - 3, y: map.height - 3}, map)] = MAP_EXIT;
	
	// return the map
	return map;
}
