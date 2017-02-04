/*global RED: false, GREY: false, GREEN: false, BLUE: false */

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

function getRandomEnemy() {
	return new Bat();
}