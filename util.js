/*global
	WIDTH: false,
	HEIGHT: false,
	PS: false,
	images: false
*/

var putImage = function (filename, x1, y1, x2, y2, tries) {
	x1 = x1 || 0;
	y1 = y1 || 0;
	x2 = x2 || WIDTH;
	y2 = y2 || HEIGHT;
	tries = tries || 0;
	
	var draw = function (image) {
		if (image == PS.ERROR) {
			if (tries < 3) {
				putImage (filename, x1, y1, x2, y2, tries + 1);
			}
			else {
				PS.debug("Error. Could not load " + filename);
			}
		}
		if (!PS.imageBlit(image, x1, y1, {left: 0, right: 0, width: x2 - x1, height: y2 - y1})) {
			if (tries < 3) {
				putImage (filename, x1, y1, x2, y2, tries + 1);
			}
			else {
				PS.debug("Error. Could not put " + filename);
			}
		}
	};
	
	if (images[filename]) {
		draw(images[filename]);
	}
	else {
		PS.imageLoad(filename, draw);
	}
};
