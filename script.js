// National Lottery Simulator Script
// Author: [Your Name]
// Description: This script handles board creation, number selection, draw simulation, and credit calculation.

/** @type {number} Initial player credits */
let credits = 250;

/** @type {Array<{id: number, numbers: number[], finalized: boolean}>} */
let boards = [];

/**
 * Updates the UI display of current credits.
 */
function updateCredits() {
    document.getElementById("credits").innerText = credits;
}

/**
 * Handles the purchase of lottery boards and updates the UI.
 */
function purchaseBoards() {
    const boardCountInput = document.getElementById("boardCount");
    const boardCount = parseInt(boardCountInput.value);

    if (isNaN(boardCount) || boardCount < 1 || boardCount > 10) {
        alert("Please enter a valid number between 1 and 10.");
        return;
    }

    const cost = boardCount * 25;

    if (credits < cost) {
        alert("Not enough credits!");
        return;
    }

    credits -= cost;
    updateCredits();

    const container = document.getElementById("boardsContainer");
    container.innerHTML = ""; // Clear previous boards
    boards = [];

    for (let i = 0; i < boardCount; i++) {
        const board = { id: i, numbers: [], finalized: false };
        boards.push(board);
        container.appendChild(createBoardElement(i));
    }

    document.getElementById("startDrawBtn").disabled = true;
}

/**
 * Creates a board element in the DOM.
 * @param {number} boardId - The unique ID of the board.
 * @returns {HTMLDivElement} - The board DOM element.
 */
function createBoardElement(boardId) {
    const boardDiv = document.createElement("div");
    boardDiv.classList.add("board");
    boardDiv.id = `board-${boardId}`;

    const numberGrid = document.createElement("div");
    numberGrid.classList.add("number-grid");

    for (let num = 1; num <= 20; num++) {
        const numBtn = document.createElement("button");
        numBtn.innerText = num;
        numBtn.onclick = () => selectNumber(boardId, num, numBtn);
        numberGrid.appendChild(numBtn);
    }

    const finalizeBtn = document.createElement("button");
    finalizeBtn.innerText = "Finalize Board";
    finalizeBtn.onclick = () => finalizeBoard(boardId);
    finalizeBtn.disabled = true;
    finalizeBtn.id = `finalize-${boardId}`;

    boardDiv.appendChild(numberGrid);
    boardDiv.appendChild(finalizeBtn);

    return boardDiv;
}

/**
 * Handles selection and deselection of numbers on a board.
 * @param {number} boardId - ID of the board.
 * @param {number} num - Number selected or deselected.
 * @param {HTMLButtonElement} button - Button element clicked.
 */
function selectNumber(boardId, num, button) {
    const board = boards.find(b => b.id === boardId);
    if (board.finalized) return;

    const index = board.numbers.indexOf(num);

    if (index === -1) {
        if (board.numbers.length < 6) {
            board.numbers.push(num);
            button.classList.add("selected");
        }
    } else {
        board.numbers.splice(index, 1);
        button.classList.remove("selected");
    }

    const finalizeBtn = document.getElementById(`finalize-${boardId}`);
    finalizeBtn.disabled = board.numbers.length !== 6;
}

/**
 * Finalizes a board and disables further interaction.
 * @param {number} boardId - ID of the board to finalize.
 */
function finalizeBoard(boardId) {
    const board = boards.find(b => b.id === boardId);
    if (board.numbers.length === 6) {
        board.finalized = true;

        const finalizeBtn = document.getElementById(`finalize-${boardId}`);
        finalizeBtn.disabled = true;

        const boardElement = document.getElementById(`board-${boardId}`);
        boardElement.querySelectorAll("button").forEach(btn => btn.onclick = null);

        if (boards.every(b => b.finalized)) {
            document.getElementById("startDrawBtn").disabled = false;
        }
    }
}

/**
 * Starts the lottery draw and displays the winning numbers.
 */
function startDraw() {
    const winningNumbers = [];

    while (winningNumbers.length < 6) {
        const rand = Math.floor(Math.random() * 20) + 1;
        if (!winningNumbers.includes(rand)) {
            winningNumbers.push(rand);
        }
    }

    document.getElementById("winningNumbers").innerHTML = `
        <h3>Winning Numbers: ${winningNumbers.join(", ")}</h3>
    `;

    calculateWinnings(winningNumbers);
}

/**
 * Calculates winnings based on matching numbers.
 * @param {number[]} winningNumbers - The drawn winning numbers.
 */
function calculateWinnings(winningNumbers) {
    const resultDiv = document.getElementById("results");
    resultDiv.innerHTML = "";

    boards.forEach((board, index) => {
        const matches = board.numbers.filter(num => winningNumbers.includes(num)).length;
        const winningsTable = [0, 0, 10, 50, 200, 500, 1000];
        const winnings = winningsTable[matches];
        credits += winnings;

        const boardResult = document.createElement("p");
        boardResult.innerText = `Board ${index + 1}: ${matches} matches - Won ${winnings} credits!`;
        resultDiv.appendChild(boardResult);
    });

    updateCredits();
}
