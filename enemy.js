/*global RED: false, GREY: false, GREEN: false, BLUE: false, PS:false*/

function Enemy (startingHealth, weakTo, strongTo, name, behavior) {
	this.health = startingHealth;
	this.weakTo = weakTo;
	this.strongTo = strongTo;
	this.behavior = behavior;
	this.name = name;
}

function Bat () {
	Enemy.apply (this, [13, RED, GREY, "bat", function () {
		return GREY;
	}]);
}

function Snake () {
	Enemy.apply (this, [13, GREY, GREEN, "snake", function () {
		return PS.random(2) - 1 ? GREEN : GREY;
	}]);
}

function getRandomEnemy() {
	var val = PS.random(2);
	switch (val) {
		case 1:
			return new Bat ();
		case 2:
			return new Snake ();
	}
}
