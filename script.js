const gameController = (function() {
    const gameBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    function checkRows() {
        for (let row = 0; row < gameBoard.length; row++) {
            if (
                gameBoard[row][0] !== 0
                && gameBoard[row][0] === gameBoard[row][1]
                && gameBoard[row][1] === gameBoard[row][2]
            ) {
                return true; 
            }
        }
        return false;
    }

    function checkColumns() {
        for (let col = 0; col < gameBoard.length; col++) {
            if (
                gameBoard[0][col] !== 0
                && gameBoard[0][col] === gameBoard[1][col]
                && gameBoard[1][col] === gameBoard[2][col]
            ) {
                return true;
            }
        }
        return false;
    }

    function checkDiagonals() {
        if (
            gameBoard[1][1] !== 0
            && gameBoard[0][0] === gameBoard[1][1]
            && gameBoard[1][1] === gameBoard[2][2]
        ) {
            return true;
        } else if (
            gameBoard[1][1] !== 0
            && gameBoard[2][0] === gameBoard[1][1]
            && gameBoard[1][1] === gameBoard[0][2]
        ) {
            return true;
        }
        return false;
    }

    function isGameOver() {
        if (checkRows() || checkColumns() || checkDiagonals()) {
            return true;
        }
        return false;
    }

    function isTie() {
        for (let row = 0; row < gameBoard.length; row++) {
            for (let col = 0; col < gameBoard[row].length; col++) {
                if (gameBoard[row][col] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    function resetGame() {
        for (let row = 0; row < gameBoard.length; row++) {
            for (let col = 0; col < gameBoard[row].length; col++) {
                gameBoard[row][col] = 0;
            }
        }
    }

    function play(player, row, column) {
        if (gameBoard[row][column] === 0) {
            gameBoard[row][column] = player.id;
        }
    }

    return { gameBoard, isGameOver, isTie, resetGame, play };
})();

const DOMController = (function() {
    function createGameBoard() {
        const gameBoard = document.querySelector(".gameboard");
        for (let i = 0; i < 9; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.setAttribute("data-row", `${Math.floor(i/3)}`);
            square.setAttribute("data-column", `${i%3}`);
            gameBoard.appendChild(square);
        }
    }

    function resetGame() {
        const squares = document.querySelectorAll(".square");
        for (let square of squares) {
            square.textContent = "";
            square.classList.remove("selected");
        }
        document.querySelector("#reset").textContent = "Reset";
        removeMessage();
    }

    function displayPlayerName(inputNode) {
        const playerName = inputNode.value;
        const parentNode = inputNode.parentNode;

        parentNode.removeChild(inputNode.nextElementSibling);
        parentNode.removeChild(inputNode);
        
        const playerNameNode = document.createElement("span");
        playerNameNode.classList.add("player-name");
        playerNameNode.textContent = playerName;
        parentNode.appendChild(playerNameNode);
    }

    function displayMessage(playerId, message, removeOldMessages=true) {
        if(removeOldMessages) {
            removeMessage();
        }
        const messageNode = document.createElement("div");
        messageNode.textContent = message;
        messageNode.classList.add("message");
        document.querySelector(`[for=player${playerId}]`).appendChild(messageNode);
    }

    function removeMessage() {
        const messageNode = document.querySelectorAll(".message");
        for (let node of messageNode) {
            node.parentNode.removeChild(node);
        }
    }

    return { createGameBoard, displayPlayerName, resetGame, displayMessage, removeMessage };
})();

const playerController = (function() {
    let id = 0;
    const markers = ["O", "X"];
    const registeredPlayers = [];

    function create(name) {
        id++;
        const marker = markers.pop();
        let counter = 0;
        registeredPlayers.push({ name, id, marker, counter });
    }

    function getSize() {
        return registeredPlayers.length;
    }

    function getPlayers() {
        return registeredPlayers;
    }

    function playsNext() {
        if (registeredPlayers[1].counter >= registeredPlayers[0].counter) {
            return registeredPlayers[0];
        } else {
            return registeredPlayers[1];
        }
    }

    function resetPlayers() {
        for (let player of registeredPlayers) {
            player.counter = 0;
        }
    }

    return { create, getSize, getPlayers, playsNext, resetPlayers };
})();

function main() {
    DOMController.createGameBoard();
    
    const resetButton = document.querySelector("#reset");
    if (playerController.getSize() !== 2) {
        resetButton.disabled = true;
    }

    const gameboard = document.querySelector(".gameboard");
    gameboard.addEventListener("click", (event) => {
        if (event.target.classList.contains("square")) {
            if (
                playerController.getSize() !== 2
                || gameController.isGameOver()
            ) {
                return;
            }

            const row = event.target.getAttribute("data-row");
            const column = event.target.getAttribute("data-column");
            const player = playerController.playsNext();

            gameController.play(player, row, column);

            if (!event.target.textContent) {
                event.target.textContent = player.marker;
                event.target.classList.add("selected");
                player.counter++;
                DOMController.displayMessage(playerController.playsNext().id, "Your turn");
            }

            if (gameController.isGameOver()) {
                resetButton.textContent = "Play again";
                DOMController.removeMessage();
                DOMController.displayMessage(player.id, "You won!");
            } else if (gameController.isTie()) {
                resetButton.textContent = "Play again";
                DOMController.removeMessage();
                DOMController.displayMessage(1, "It's a tie!");
                DOMController.displayMessage(2, "It's a tie!", removeOldMessages=false);
            }
        }
    });

    const okButton = document.querySelectorAll("input + button");
    for (let button of okButton) {
        button.addEventListener("click", (event) => {
            if (button.previousElementSibling.value) {
                playerController.create(button.previousElementSibling.value);
                DOMController.displayPlayerName(button.previousElementSibling);
            }
            if (playerController.getSize() === 2) {
                resetButton.disabled = false;
                DOMController.displayMessage(playerController.playsNext().id, "Your turn");
            }
        });
    }

    const playerInput = document.querySelectorAll("input");
    for (let input of playerInput) {
        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                if (input.value) {
                    playerController.create(input.value);
                    DOMController.displayPlayerName(input);
                }
                if (playerController.getSize() === 2) {
                    resetButton.disabled = false;
                    DOMController.displayMessage(playerController.playsNext().id, "Your turn");
                }
            }
        });
    }

    resetButton.addEventListener("click", (event) => {
        gameController.resetGame();
        playerController.resetPlayers();
        DOMController.resetGame();
        DOMController.displayMessage(playerController.playsNext().id, "Your turn");
    });
};

main();