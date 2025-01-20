const gameController = (function() {
    const gameBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    function checkRows() {
        for (let row = 0; row < gameBoard.length; row++) {
            for (let col = 0; col < gameBoard[row].length-1; col++) {
                if (
                    gameBoard[row][col] !== 0
                    && gameBoard[row][col] === gameBoard[row][col+1]
                ) {
                    return true; 
                }
            }
        }
        return false;
    };

    function checkColumns() {
        for (let col = 0; col < gameBoard.length; col++) {
            for (let row = 0; row < gameBoard.length-1; row++) {
                if (
                    gameBoard[row][col] !== 0
                    && gameBoard[row][col] === gameBoard[row+1][col]
                ) {
                    return true;
                }
            }
        }
        return false;
    };

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
    };

    function isGameOver() {
        if (checkRows() || checkColumns() || checkDiagonals()) {
            return true;
        }
        return false;
    };

    function play(player, row, column) {
        if (gameBoard[row][column] === 0) {
            gameBoard[row][column] = player.id;
        }
    };

    return { gameBoard, isGameOver, play };
})();

function printGameBoard(gameBoard) {
    for (let row of gameBoard) {
        console.log(row);
    }
}


function createPlayer(name, id, marker) {
    return { name, id, marker };
}

const player1 = createPlayer("", 1, "X");
const player2 = createPlayer("", 2, "O");