const words = ["javascript", "programacion", "desarrollo", "ahorcado"];
const maxAttempts = 6;

let chosenWord = "";
let attempts = maxAttempts;
let guessedLetters = [];
let wins = 0;
let losses = 0;
let gameEnded = false;

const wordContainer = document.getElementById("word-container");
const lettersContainer = document.getElementById("letters-container");
const attemptsContainer = document.getElementById("attempts");
const restartButton = document.getElementById("restart-button");
const winsContainer = document.getElementById("wins");
const lossesContainer = document.getElementById("losses");
const resetStatsButton = document.getElementById("reset-stats-button");
const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modal-message");
const modalImage = document.getElementById("modal-image");
const modalCloseButton = document.getElementById("modal-close-button");

function init() {
    chosenWord = words[Math.floor(Math.random() * words.length)];
    attempts = maxAttempts;
    guessedLetters = [];
    gameEnded = false;
    updateWordDisplay();
    updateAttempts();
    generateLetterButtons();
    closeModal();
}

function updateWordDisplay() {
    wordContainer.innerHTML = chosenWord.split("").map(letter => guessedLetters.includes(letter) ? letter : "_").join(" ");
}

function updateAttempts() {
    attemptsContainer.textContent = attempts;
    if (attempts <= 0) {
        losses++;
        updateStats();
        showModal("Has perdido. La palabra era: " + chosenWord, "./images/sad.png");
        disableLetterButtons();
        gameEnded = true;
    }
}

function generateLetterButtons() {
    lettersContainer.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
        const button = document.createElement("button");
        button.textContent = String.fromCharCode(i);
        button.addEventListener("click", () => handleLetterClick(button));
        lettersContainer.appendChild(button);
    }
    disableGuessedLetters();
}

function handleLetterClick(button) {
    if (gameEnded) return;
    const letter = button.textContent.toLowerCase();
    button.disabled = true;
    guessedLetters.push(letter);
    if (chosenWord.includes(letter)) {
        updateWordDisplay();
        if (chosenWord.split("").every(letter => guessedLetters.includes(letter))) {
            wins++;
            updateStats();
            showModal("¡Has ganado!", "./images/happy.png");
            disableLetterButtons();
            gameEnded = true;
        }
    } else {
        attempts--;
        updateAttempts();
    }
    saveGameState();
}

function disableLetterButtons() {
    const buttons = lettersContainer.querySelectorAll("button");
    buttons.forEach(button => button.disabled = true);
}

function disableGuessedLetters() {
    guessedLetters.forEach(letter => {
        const button = Array.from(lettersContainer.children).find(button => button.textContent.toLowerCase() === letter);
        if (button) {
            button.disabled = true;
        }
    });
}

function saveGameState() {
    const gameState = {
        chosenWord,
        attempts,
        guessedLetters,
        wins,
        losses,
        gameEnded
    };
    localStorage.setItem("hangmanGameState", JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem("hangmanGameState");
    if (savedState) {
        const { chosenWord: savedWord, attempts: savedAttempts, guessedLetters: savedGuessedLetters, wins: savedWins, losses: savedLosses, gameEnded: savedGameEnded } = JSON.parse(savedState);
        chosenWord = savedWord;
        attempts = savedAttempts;
        guessedLetters = savedGuessedLetters;
        wins = parseInt(savedWins, 10);
        losses = parseInt(savedLosses, 10);
        gameEnded = savedGameEnded;
        updateWordDisplay();
        updateAttempts();
        updateStats();
        if (gameEnded) {
            disableLetterButtons();
        } else {
            generateLetterButtons();
        }
    } else {
        init();
    }
}

function updateStats() {
    winsContainer.textContent = wins;
    lossesContainer.textContent = losses;
}

function resetStats() {
    wins = 0;
    losses = 0;
    updateStats();
    saveGameState();
}

function showModal(message, image) {
    modalMessage.textContent = message;
    modalImage.src = image;
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

restartButton.addEventListener("click", () => {
    localStorage.removeItem("hangmanGameState");
    init();
});

resetStatsButton.addEventListener("click", resetStats);

modalCloseButton.addEventListener("click", closeModal);

window.addEventListener("load", () => {
    loadGameState();
    if (!gameEnded) {
        generateLetterButtons();
    }
});

