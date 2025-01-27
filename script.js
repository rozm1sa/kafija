const gameContainer = document.getElementById("game-container");
const can = document.getElementById("can");
const scoreDisplay = document.getElementById("score");
const gameOverText = document.getElementById("game-over-text");
const gameOverScreen = document.getElementById("game-over");
const retryBtn = document.getElementById("retry-btn");
const winMessage = document.getElementById("win-message");
const playAgainBtn = document.getElementById("play-again-btn");

let canPosition = gameContainer.offsetWidth / 2;
let speed = 5;
let beanFallSpeed = 2;
let score = 0;
let missedBeans = 0;
let maxMisses = 3;
let gamePaused = false;

function spawnBean() {
    if (gamePaused) return; // Stop spawning beans if the game is paused

    const bean = document.createElement("div");
    bean.classList.add("bean");
    bean.style.left = Math.random() * (gameContainer.offsetWidth - 30) + "px";
    bean.style.top = "0px";
    gameContainer.appendChild(bean);

    const fallInterval = setInterval(() => {
        const beanTop = parseFloat(bean.style.top);
        const beanLeft = parseFloat(bean.style.left);

        if (beanTop >= gameContainer.offsetHeight - 120 &&
            beanLeft >= canPosition - 30 &&
            beanLeft <= canPosition + 60) {
            score++;
            beanFallSpeed += 0.2;
            speed += 0.5;
            gameContainer.removeChild(bean);
            clearInterval(fallInterval);
        } else if (beanTop >= gameContainer.offsetHeight) {
            missedBeans++;
            if (missedBeans >= maxMisses) {
                gameOver();
            } else {
                gameContainer.removeChild(bean);
                clearInterval(fallInterval);
            }
        } else {
            bean.style.top = beanTop + beanFallSpeed + "px";
        }
    }, 16);
}

function moveCan(x) {
    if (gamePaused) return; // Prevent moving the can if the game is paused

    canPosition = Math.max(0, Math.min(gameContainer.offsetWidth - 60, x));
    can.style.left = canPosition + "px";
}

document.addEventListener("keydown", (e) => {
    if (gamePaused) return; // Stop movement if the game is paused

    if (e.key === "ArrowLeft") {
        moveCan(canPosition - speed);
    } else if (e.key === "ArrowRight") {
        moveCan(canPosition + speed);
    }
});

let isDragging = false;

gameContainer.addEventListener("mousedown", (e) => {
    if (gamePaused) return; // Prevent dragging if the game is paused

    isDragging = true;
});

gameContainer.addEventListener("mousemove", (e) => {
    if (gamePaused) return; // Prevent dragging if the game is paused

    if (isDragging) {
        moveCan(e.clientX - gameContainer.offsetLeft - 30);
    }
});

gameContainer.addEventListener("mouseup", () => {
    isDragging = false;
});

gameContainer.addEventListener("touchstart", (e) => {
    if (gamePaused) return; // Prevent dragging if the game is paused

    isDragging = true;
});

gameContainer.addEventListener("touchmove", (e) => {
    if (gamePaused) return; // Prevent dragging if the game is paused

    if (isDragging) {
        const touch = e.touches[0];
        moveCan(touch.clientX - gameContainer.offsetLeft - 30);
    }
});

gameContainer.addEventListener("touchend", () => {
    isDragging = false;
});

setInterval(() => {
    if (!gamePaused) {
        spawnBean(); // Only spawn beans if the game is not paused
    }
}, 1500);

function gameOver() {
    gamePaused = true; // Pause the game
    gameOverText.textContent = `Game Over! Your score: ${score}`;
    gameOverScreen.style.display = "block";
}

function winGame() {
    gamePaused = true; // Pause the game
    winMessage.style.display = "block";
    const tree = document.getElementById("tree");
    tree.style.filter = "blur(5px)"; // Apply blur only to the tree (background)
}

retryBtn.addEventListener("click", () => {
    location.reload();
});

playAgainBtn.addEventListener("click", () => {
    location.reload();
});

setInterval(() => {
    if (score >= 20 && !gamePaused) {
        winGame();
    }
    scoreDisplay.textContent = `Score: ${score}`;
}, 100);
