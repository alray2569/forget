/*global
	WIDTH: false,
	HEIGHT: false,
	PS: false,
	images: false
*/

var MAP_WALL = 0;
var MAP_FLOOR = 1;
var MAP_GOLD = 2;
var MAP_ACTOR = 3;
var MAP_EXIT = 4;

var MAXHEALTH = 26;

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
	return health;
}

function addHealthClamp(target, delta) {
	return setHealthClamp(target, target.health + delta);
}
