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

var PUTTRIES = 3;


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

var imageQueue = {};

// This is the asychronous image loader

var onLoad = function ( image ) {
	var coords;

	// This gets called if the load fails

	if ( image === PS.ERROR ) {
		PS.debug( "Sigh. Could not load an image file.\n" );
		return;
	}

	// Retrieve the coordinates associated with this file

	coords = imageQueue[ image.source ]; // .source contains the filename

	// In case of Imperial entanglements ...

	if ( !coords ) {
		PS.debug( "Double sigh. Expected image not queued.\n" );
		return;
	}

	// Blit the loaded image using its retrieved coordinates

	PS.debug("Blitting " + image.source + " from onLoad.");
	
	PS.imageBlit( image, coords.x1, coords.y1, {
		left: 0,
		right: 0,
		width: coords.x2 - coords.x1,
		height: coords.y2 - coords.y1
	} );

	// (Optional) Delete the stored image coordinates, which are no longer needed
	// You could first copy them into the image object as custom properties if needed
	// Just be careful not to overwrite any of the standard image properties; see API

	delete imageQueue[ image.source ];

	// Save the loaded image data for later reference
	// It can be fetched from the images object using its filename as the property key

	images[ image.source ] = image;
};

// Tries? Do! There is no "tries." :)

var putImage = function ( filename, x1, y1, x2, y2 ) {

	x1 = x1 || 0;
	y1 = y1 || 0;
	x2 = x2 || WIDTH;
	y2 = y2 || HEIGHT;
	
	if (images[filename]) {
		PS.debug("Blitting " + filename + " from putImages.")
		
		PS.imageBlit( images[filename], x1, y1, {
			left: 0,
			right: 0,
			width: x2 - x1,
			height: y2 - y1
		} );
		return images[filename].id;
	}
	
	// Save a record of this file's coordinates in imageQueue for later retrieval by onLoad()

	imageQueue[ filename ] = {
		x1 : x1,
		y1 : y1,
		x2 : x2,
		y2 : y2
	};

	// Start the load and return the image id (although you're not using it yet)

	return PS.imageLoad( filename, onLoad );
};

//var putImage = function (filename, x1, y1, x2, y2, tries) {
//	x1 = x1 || 0;
//	y1 = y1 || 0;
//	x2 = x2 || WIDTH;
//	y2 = y2 || HEIGHT;
//	tries = tries || 0;
//
//	var draw = function (image) {
//		if (image == PS.ERROR) {
//			if (tries < 3) {
//				putImage (filename, x1, y1, x2, y2, tries + 1);
//			}
//			else {
//				PS.debug("Error. Could not load " + filename);
//			}
//		}
//		if (!PS.imageBlit(image, x1, y1, {left: 0, right: 0, width: x2 - x1, height: y2 - y1})) {
//			if (tries < 3) {
//				putImage (filename, x1, y1, x2, y2, tries + 1);
//			}
//			else {
//				PS.debug("Error. Could not put " + filename);
//			}
//		}
//	};
//
//	if (images[filename]) {
//		draw(images[filename]);
//	}
//	else {
//		PS.imageLoad(filename, draw);
//	}
//};