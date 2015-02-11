var view = {
	//Display message in messageArea
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	//sets location class to .hit
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	//sets location class to .miss
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

/* Testing
view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");
*/

var model = {
	boardSize: 7,
	numShips: 3,
	shipsSunk: 0,
	shipLength: 3,
	ships: [{locations: [0, 0, 0], hits: ["", "", ""] },
			{locations: [0, 0, 0], hits: ["", "", ""] },
			{locations: [0, 0, 0], hits: ["", "", ""] }],
	// Generate ship locations
	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		if (direction === 1) {
			// Generate a starting location for a horizontal ship
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			// Generate a starting location for a vertical ship
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				// add location to array for new horizontal ship
				newShipLocations.push(row + "" + (col + i));
			} else {
				// add location to array for new vertical ship
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	},
	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (index >= 0) {
				// We have a hit!
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		// We don't have a hit
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},
	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	}
};

/* Testing
model.fire("53");
model.fire("06");
model.fire("16");
model.fire("26");
model.fire("34");
model.fire("24");
model.fire("44");
model.fire("12");
model.fire("11");
model.fire("10");
*/

var controller = {
	guesses: 0,
	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses.");
			}
		}
	}
}; 

// Parse guess
function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	// Make sure input is valid
	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		// Gets first character of the guess
		var firstChar = guess.charAt(0);
		// indexOf gives a number 0-6
		var row = alphabet.indexOf(firstChar);
		// represents second character of guess
		var column = guess.charAt(1);

		// Making sure inputs are valid
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
				alert("Oops, that's off the board!");
			} else {
			return row + column;
			}
		}
		return null;
}

/* Testing
console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0"));
console.log(parseGuess("A7"));
*/

/* Testing
controller.processGuess("A0");
controller.processGuess("A6");
controller.processGuess("B6");
controller.processGuess("C6");
controller.processGuess("C4");
controller.processGuess("D4");
controller.processGuess("E4");
controller.processGuess("B0");
controller.processGuess("B1");
controller.processGuess("B2");
*/

function init() {
	// get the player's guess from the form
	var fireButton = document.getElementById("fireButton");
	// get the player's guess if Fire! button is clicked
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	// get the player's guess if enter button is pressed 
	guessInput.onkeypress = handleKeyPress;

	// Generate ship locations in init function so it happens right when the game loads, before player starts playing
	model.generateShipLocations();
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

function handleFireButton() {
	// code to get the value from the form
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();
	// and get the guess to the controller
	controller.processGuess(guess);
	guessInput.value = "";
}

window.onload = init;