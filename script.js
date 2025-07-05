const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart");
const gameOverPopup = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const playAgainButton = document.getElementById("play-again");
let board = [];
let score = 0;

function initializeBoard() {
  board = Array(4)
    .fill()
    .map(() => Array(4).fill(0));
  score = 0;
  scoreDisplay.textContent = score;
  gameOverPopup.style.display = "none"; // Hide game over popup on start
  addNewTile();
  addNewTile();
  renderBoard();
}

function addNewTile() {
  let emptyCells = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        emptyCells.push({ i, j });
      }
    }
  }
  if (emptyCells.length > 0) {
    let { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
}

function renderBoard() {
  grid.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let tile = document.createElement("div");
      tile.classList.add("tile");
      if (board[i][j] !== 0) {
        tile.classList.add(`tile-${board[i][j]}`);
        tile.textContent = board[i][j];
      }
      grid.appendChild(tile);
    }
  }
}

function move(direction) {
  let moved = false;
  let newBoard = board.map((row) => [...row]);

  if (direction === "left") {
    for (let i = 0; i < 4; i++) {
      let row = board[i].filter((val) => val !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          score += row[j];
          moved = true;
        }
      }
      row = row.filter((val) => val !== 0);
      while (row.length < 4) row.push(0);
      if (board[i].join() !== row.join()) moved = true;
      newBoard[i] = row;
    }
  } else if (direction === "right") {
    for (let i = 0; i < 4; i++) {
      let row = board[i].filter((val) => val !== 0);
      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          row[j - 1] = 0;
          score += row[j];
          moved = true;
        }
      }
      row = row.filter((val) => val !== 0);
      while (row.length < 4) row.unshift(0);
      if (board[i].join() !== row.join()) moved = true;
      newBoard[i] = row;
    }
  } else if (direction === "up") {
    for (let j = 0; j < 4; j++) {
      // Fixed typo: was i++ instead of j++
      let col = [board[0][j], board[1][j], board[2][j], board[3][j]].filter(
        (val) => val !== 0
      );
      for (let i = 0; i < col.length - 1; i++) {
        if (col[i] === col[i + 1]) {
          col[i] *= 2;
          col[i + 1] = 0;
          score += col[i];
          moved = true;
        }
      }
      col = col.filter((val) => val !== 0);
      while (col.length < 4) col.push(0);
      for (let i = 0; i < 4; i++) {
        if (board[i][j] !== col[i]) moved = true;
        newBoard[i][j] = col[i];
      }
    }
  } else if (direction === "down") {
    for (let j = 0; j < 4; j++) {
      let col = [board[0][j], board[1][j], board[2][j], board[3][j]].filter(
        (val) => val !== 0
      );
      for (let i = col.length - 1; i > 0; i--) {
        if (col[i] === col[i - 1]) {
          col[i] *= 2;
          col[i - 1] = 0;
          score += col[i];
          moved = true;
        }
      }
      col = col.filter((val) => val !== 0);
      while (col.length < 4) col.unshift(0);
      for (let i = 0; i < 4; i++) {
        if (board[i][j] !== col[i]) moved = true;
        newBoard[i][j] = col[i];
      }
    }
  }

  if (moved) {
    board = newBoard;
    addNewTile();
    renderBoard();
    scoreDisplay.textContent = score;
    if (checkWin()) return;
    checkGameOver();
  }
}

function checkWin() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 2048) {
        alert("You Win!");
        return true;
      }
    }
  }
  return false;
}

function checkGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) return;
      if (i < 3 && board[i][j] === board[i + 1][j]) return;
      if (j < 3 && board[i][j] === board[i][j + 1]) return;
    }
  }
  finalScoreDisplay.textContent = score;
  gameOverPopup.style.display = "block";
}

// Keyboard controls for PC
document.addEventListener("keydown", (e) => {
  if (gameOverPopup.style.display === "block") return; // Disable moves during game over
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
  switch (e.key) {
    case "ArrowUp":
      move("up");
      break;
    case "ArrowDown":
      move("down");
      break;
    case "ArrowLeft":
      move("left");
      break;
    case "ArrowRight":
      move("right");
      break;
  }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener("touchstart", (e) => {
  if (gameOverPopup.style.display === "block") return; // Disable moves during game over
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener("touchend", (e) => {
  if (gameOverPopup.style.display === "block") return; // Disable moves during game over
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const minSwipeDistance = 30; // Minimum distance to register a swipe

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        move("right");
      } else {
        move("left");
      }
    }
  } else {
    // Vertical swipe
    if (Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0) {
        move("down");
      } else {
        move("up");
      }
    }
  }
}

restartButton.addEventListener("click", initializeBoard);
playAgainButton.addEventListener("click", initializeBoard);

initializeBoard();
