const makeMap = (array) =>
  new Array(35)
    .fill(false)
    .map((_item, i) => (array.includes(i) ? true : false));

const oMap = makeMap([
  1, 2, 3, 5, 9, 10, 14, 15, 19, 20, 24, 25, 29, 31, 32, 33,
]);
const xMap = makeMap([0, 4, 5, 9, 11, 13, 17, 21, 23, 25, 29, 30, 34]);

class Game {
  constructor(playerOne, playerTwo) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.activePlayer = playerOne;
  }

  toggleActivePlayer() {
    this.activePlayer =
      this.activePlayer === this.playerOne ? this.playerTwo : this.playerOne;
  }

  draw(grid) {
    grid.forEach((square, i) => {
      const current = document.getElementById(`board-region-${i}`);
      const drawMark = (charMap) =>
        charMap.forEach((dot, i) => {
          setTimeout(
            () =>
              current.appendChild(
                Object.assign(document.createElement("div"), {
                  classList: dot ? "true" : "false",
                })
              ),
            i * 10
          );
        });

      // if grid-area already has a mark it is skipped
      if (current.childNodes.length === 0) {
        square === "x" && drawMark(xMap);
        square === "o" && drawMark(oMap);
      }
    });
  }

  score() {
    const playerOneScoreDisplay = document.getElementById(
      "player-one-score-display"
    );
    const playerTwoScoreDisplay = document.getElementById(
      "player-two-score-display"
    );
    playerOneScoreDisplay.textContent = this.playerOne.getScore();
    playerTwoScoreDisplay.textContent = this.playerTwo.getScore();
  }

  tie() {
    const winDialog = document.getElementById("win-dialog");
    const winMessage = document.getElementById("win-message");

    winMessage.textContent = "No winner.";
    winDialog.showModal();
  }
}

class Player {
  constructor(name, mark) {
    this.name = name;
    this.mark = mark;
    this.score = 0;
  }

  win() {
    const winDialog = document.getElementById("win-dialog");
    const winMessage = document.getElementById("win-message");
    winMessage.textContent = `${this.name} won!`;
    // setTimeout allows draw() animation to complete before modal opens
    setTimeout(() => winDialog.showModal(), 350);
    this.score++;
  }
}

class Board {
  constructor() {
    this.grid = new Array(9).fill(null);
  }

  placeMarker(mark, location) {
    this.grid[location] = mark;
  }

  checkGrid(location) {
    return this.grid[location];
  }

  clearGrid() {
    this.grid = new Array(9).fill(null);
  }

  setup(game) {
    this.clearGrid();
    const gameBoard = document.getElementById("game-board");

    while (gameBoard.firstChild) gameBoard.removeChild(gameBoard.lastChild);

    const handleClick = ({ target }) => {
      const location = target.id.slice(-1);
      if (this.checkGrid(location) === null) {
        this.placeMarker(game.activePlayer.mark, location);
        game.draw(this.grid);
        this.checkWin(game.activePlayer.mark)
          ? game.activePlayer.win()
          : this.grid.includes(null)
          ? null
          : game.tie();
        game.toggleActivePlayer();
      }
    };

    for (let i = 0; i < 9; i++) {
      const newRegion = Object.assign(document.createElement("button"), {
        classList: "board-region",
        id: `board-region-${i}`,
        ariaRole: "button",
      });

      newRegion.addEventListener("click", (event) => handleClick(event));

      gameBoard.appendChild(newRegion);
    }
  }

  checkWin(mark) {
    let response = false;
    const checks = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    checks.forEach((check) => {
      if (check.every((value) => this.grid[value] === mark)) response = true;
    });

    return response;
  }
}

const board = new Board();
const playerOne = new Player("player-one", "x");
const playerTwo = new Player("player-two", "o");

const game = new Game(playerOne, playerTwo);
const startDialog = document.getElementById("start-dialog");
const startButton = document.getElementById("start-button");
const playerOneNameDisplay = document.getElementById("player-one-name-display");
const playerTwoNameDisplay = document.getElementById("player-two-name-display");
const playerOneScoreDisplay = document.getElementById(
  "player-one-score-display"
);
const playerTwoScoreDisplay = document.getElementById(
  "player-two-score-display"
);

startDialog.showModal();

startButton.addEventListener("click", () => {
  const playerOneName = document.getElementById("player-one-name").value;
  const playerTwoName = document.getElementById("player-two-name").value;

  playerOneName && (playerOne.name = playerOneName);
  playerTwoName && (playerTwo.name = playerTwoName);

  playerOneNameDisplay.textContent = playerOne.name;
  playerTwoNameDisplay.textContent = playerTwo.name;

  playerOneScoreDisplay.textContent = playerOne.score;
  playerTwoScoreDisplay.textContent = playerTwo.score;

  startDialog.close();
});

const continueButton = document.getElementById("continue-button");

continueButton.addEventListener("click", () => {
  playerOneScoreDisplay.textContent = playerOne.score;
  playerTwoScoreDisplay.textContent = playerTwo.score;
  board.setup(game);
});

board.setup(game);
