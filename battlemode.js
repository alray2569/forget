/* global 
	PS: false,
	hero: false,
	putImage: false,
	gameOver: false,
	prevMaps: false,
	addHealthClamp: false
*/
/* jshint browser: true */

var gameMode;

var RED = 1, GREEN = 2, BLUE = 3, GREY = 4, NONE = 0;
var PLAYER = 1, ENEMY = 2;

var WEAKTODMG = 4, STRONGTODMG = 1, STDDMG = 2;

// locations on the screen, in beads
var HEROHEALTHPOS = {x: 1, y: 3};
var ENEMYHEALTHPOS = {x: 28, y: 3};
var FIGHTERPOS = {x: 6, y: 17};

// times in 60ths of a second
var FLASHDURATION = 10;
var ENEMYPAUSE = 60;

// buttons
var GREENBUTTON = {
	xmin: 17,
	xmax: 23,
	ymin: 10,
	ymax: 16,
	dark: 0x007F0E,
	lite: 0x449F44,
	flash: 0x00FF00
};

var BLUEBUTTON = {
	xmin: 17,
	xmax: 23,
	ymin: 2,
	ymax: 8,
	dark: 0x0094FF,
	lite: 0x44aaFF,
	flash: 0x0000FF
};

var GREYBUTTON = {
	xmin: 9,
	xmax: 15,
	ymin: 10, 
	ymax: 16,
	dark: 0x808080,
	lite: 0xAAAAAA,
	flash: 0xFFFFFF
};

var REDBUTTON = {
	xmin: 9,
	xmax: 15,
	ymin: 2,
	ymax: 8,
	dark: 0xFF0000,
	lite: 0xFF4444,
	flash: 0xFF0000
};

var BATTLEMODE = {
	enterMode: function (enemy) {
		this.lastState = gameMode; // record previous state for resume later
		this.enemy = enemy; // the enemy we're fighting
		
		this.whoseTurn = PLAYER;
		
		this.draw();
		
		// update the game mode
		gameMode = this;
	},
	exitMode: function () {
		PS.timerStop(this.timer2);
	},
	click: function (x, y, data, options) {
		if (this.whoseTurn !== PLAYER) {return;} // make sure it's our turn
		
		var attack = inrange(x, y); // check button clicked
		if (!attack) {return;} // check that we clicked a button
		
		this.doAttack(attack, this.enemy);
		this.whoseTurn = ENEMY;
		if (this.handleWin()) {return;}
		
		this.timer1 = PS.timerStart(ENEMYPAUSE, function (self) {
			self.doAttack(self.enemy.behavior(), hero);
			self.whoseTurn = PLAYER;
			self.handleWin();
			return PS.ERROR;
		}, this);
	},
	release: function (x, y, data, options) {
		
	},
	enterBead: function (x, y, data, options) {
		var color = inrange(x, y),
			a, b;
		
		if (this.whoseTurn !== PLAYER) {return;}
		
		// color the buttons on highlight
		switch (color) {
			case RED:
				for (a = REDBUTTON.xmin + 1; a < REDBUTTON.xmax - 1; ++a) {
					for (b = REDBUTTON.ymin + 1; b < REDBUTTON.ymax - 1; ++b) {
						PS.color(a, b, REDBUTTON.lite);
					}
				}
				break;
			case BLUE:
				for (a = BLUEBUTTON.xmin + 1; a < BLUEBUTTON.xmax - 1; ++a) {
					for (b = BLUEBUTTON.ymin + 1; b < BLUEBUTTON.ymax - 1; ++b) {
						PS.color(a, b, BLUEBUTTON.lite);
					}
				}
				break;
			case GREY:
				for (a = GREYBUTTON.xmin + 1; a < GREYBUTTON.xmax - 1; ++a) {
					for (b = GREYBUTTON.ymin + 1; b < GREYBUTTON.ymax - 1; ++b) {
						PS.color(a, b, GREYBUTTON.lite);
					}
				}
				break;
			case GREEN:
				for (a = GREENBUTTON.xmin + 1; a < GREENBUTTON.xmax - 1; ++a) {
					for (b = GREENBUTTON.ymin + 1; b < GREENBUTTON.ymax - 1; ++b) {
						PS.color(a, b, GREENBUTTON.lite);
					}
				}
		}
	},
	exitBead: function (x, y, data, options) {
		var color = inrange(x, y),
			a, b;
		
		// uncolor the buttons on unhighlight
		switch (color) {
			case RED:
				for (a = REDBUTTON.xmin + 1; a < REDBUTTON.xmax - 1; ++a) {
					for (b = REDBUTTON.ymin + 1; b < REDBUTTON.ymax - 1; ++b) {
						PS.color(a, b, REDBUTTON.dark);
					}
				}
				break;
			case BLUE:
				for (a = BLUEBUTTON.xmin + 1; a < BLUEBUTTON.xmax - 1; ++a) {
					for (b = BLUEBUTTON.ymin + 1; b < BLUEBUTTON.ymax - 1; ++b) {
						PS.color(a, b, BLUEBUTTON.dark);
					}
				}
				break;
			case GREY:
				for (a = GREYBUTTON.xmin + 1; a < GREYBUTTON.xmax - 1; ++a) {
					for (b = GREYBUTTON.ymin + 1; b < GREYBUTTON.ymax - 1; ++b) {
						PS.color(a, b, GREYBUTTON.dark);
					}
				}
				break;
			case GREEN:
				for (a = GREENBUTTON.xmin + 1; a < GREENBUTTON.xmax - 1; ++a) {
					for (b = GREENBUTTON.ymin + 1; b < GREENBUTTON.ymax - 1; ++b) {
						PS.color(a, b, GREENBUTTON.dark);
					}
				}
		}
	},
	keyDown: function (key, shift, ctrl, options) {
		
	},
	keyUp: function (key, shift, ctrl, options) {
		
	},
	draw: function () {
		// draw the fight screen
		putImage("imgs/battle_egy_sm.png", 5);
		putImage("imgs/healthbar_frame.png", ENEMYHEALTHPOS.x - 1);
		putImage("imgs/healthbar_frame.png", 0);
		putImage("imgs/shim.png", 5, 18);
		putImage("imgs/shim.png", 26, 18);
		putImage("imgs/thoth.png", FIGHTERPOS.x, FIGHTERPOS.y);
		putImage("imgs/healthbar/health" + hero.health + ".png", HEROHEALTHPOS.x, HEROHEALTHPOS.y);
		putImage("imgs/healthbar/health" + this.enemy.health + ".png", ENEMYHEALTHPOS.x, ENEMYHEALTHPOS.y);
	},
	doAttack: function (atkType, target) {
		if (atkType === target.weakTo) {
			addHealthClamp(target, -WEAKTODMG);
		}
		else if (atkType === target.strongTo) {
			addHealthClamp(target, -STRONGTODMG);
		}
		else {
			addHealthClamp(target, -STDDMG);
		}
		
		// draw screen flash
		PS.color(PS.ALL, PS.ALL, colorFromName(atkType));
			
		// redraw battle
		this.timer2 = PS.timerStart(FLASHDURATION, function (self) {
			putImage("imgs/battle_egy_sm.png", 5);
			putImage("imgs/healthbar_frame.png", ENEMYHEALTHPOS.x - 1);
			putImage("imgs/healthbar_frame.png", 0);
			putImage("imgs/shim.png", 5, 18);
			putImage("imgs/shim.png", 26, 18);
			if (target !== hero) {putImage("imgs/" + self.enemy.name + ".png", FIGHTERPOS.x, FIGHTERPOS.y);}
			else {putImage("imgs/thoth.png", FIGHTERPOS.x, FIGHTERPOS.y);}
			putImage("imgs/healthbar/health" + hero.health + ".png", HEROHEALTHPOS.x, HEROHEALTHPOS.y);
			putImage("imgs/healthbar/health" + self.enemy.health + ".png", ENEMYHEALTHPOS.x, ENEMYHEALTHPOS.y);
			return PS.ERROR; // do not repeat
		}, this);
	},
	handleWin: function () {
		if (!hero.health) {
			// player has died
			gameOver();
			return true;
		}
		else if (!this.enemy.health) {
			// player has won battle
			PS.audioPlay("fx_tada");
			gameMode = this.lastState;
			gameMode.draw();
			this.exitMode();
			return true;
		}
		return false;
	}
};


function colorFromName (attack) {
		switch (attack) {
			case RED:
				return REDBUTTON.flash;
			case GREEN:
				return GREENBUTTON.flash;
			case BLUE:
				return BLUEBUTTON.flash;
			case GREY:
				return GREYBUTTON.flash;
		}
	}


function inrange(x, y) {
	if (BLUEBUTTON.ymin <= y && BLUEBUTTON.ymax > y) { // top line
		if (REDBUTTON.xmin <= x && REDBUTTON.xmax > x) { // left button
			return RED;
		}
		else if (BLUEBUTTON.xmin <= x && BLUEBUTTON.xmax > x) { // right button
			return BLUE;
		}
	}
	else if (GREENBUTTON.ymin <= y && GREENBUTTON.ymax > y) { // bottom line
		if (GREYBUTTON.xmin <= x && GREYBUTTON.xmax > x) { // left button
			return GREY;
		}
		else if (GREENBUTTON.xmin <= x && GREENBUTTON.xmax > x) { // right button
			return GREEN;
		}
	}
	return NONE;
}