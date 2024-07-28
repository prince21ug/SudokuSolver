var board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var time = 0;
var numToAdd;
var index1, index2;
var fault1, fault2, fault3;
var isSolved = false;

window.onload = function() {
    makeBoard();
    funcId("newboard").addEventListener("click", makeBoard);
    for (let i = 0; i < 9; i++) {
        funcId("numbers").children[i].addEventListener("click", function() {
            if (this.classList.contains("selected")) {
                this.classList.remove("selected");
                numToAdd = undefined;
            } else {
                for (let j = 0; j < 9; j++) {
                    funcId("numbers").children[j].classList.remove("selected");
                }
                this.classList.add("selected");
                numToAdd = this.innerHTML;
            }
        });
    }
};

function makeBoard() {
    emptyBoard();
    for (let i = 0; i < 81; i++) {
        const idnum = String(i);
        let square = document.createElement("p");
        square.textContent = '';
        square.classList.add("square");
        square.id = idnum;
        if (i >= 0 && i < 9) { square.classList.add("borderUp"); }
        if (i >= 72 && i <= 80) { square.classList.add("borderBottom"); } // Corrected to 80
        if ((i + 1) % 9 == 0) { square.classList.add("borderRight"); }
        if (i % 9 == 0) { square.classList.add("borderLeft"); }
        if ((i > 17 && i < 27) || (i > 44 && i < 54)) { square.classList.add("borderBottom"); }
        if (((i + 1) % 9 == 3) || ((i + 1) % 9 == 6)) { square.classList.add("borderRight"); }

        funcId("board").appendChild(square);

        funcId("board").children[i].addEventListener("click", async function() {
            const numid = parseInt(this.id) + 1;
            if (numid % 9 != 0) {
                index1 = Math.floor(numid / 9);
                index2 = numid % 9 - 1;
            } else {
                index2 = 8;
                index1 = Math.floor((numid - 1) / 9);
            }
            var finalIndexes = [index1, index2];
            if (this.innerHTML != '' && numToAdd == 'del') {
                this.innerHTML = '';
                this.classList.remove("solveColor");
                board[index1][index2] = 0;
            }
            if (checkDuplicates(board, parseInt(numToAdd), finalIndexes) && numToAdd != undefined && numToAdd != 'del') {
                this.innerHTML = numToAdd;
                this.classList.add("solveColor");
                board[index1][index2] = parseInt(numToAdd);
            }

            funcId("solver").addEventListener("click", function() {
                time = 25;
                solve1();
            });
            funcId("speedUp").addEventListener("click", function() {
                time = 0;
                solve1();
            });
        });
    }
}

function sleep() {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function solve1() {
    var empty = findEmptySpace();
    if (!empty) {
        isSolved = true;
        return true;
    }
    for (let i = 1; i <= 9; i++) { // Corrected loop to go from 1 to 9
        if (checkDuplicates(board, i, empty)) {
            board[empty[0]][empty[1]] = i;
            var finalInd = (empty[0] * 9) + empty[1];
            funcId("board").children[finalInd].classList.remove("solveColor");
            await sleep();
            funcId("board").children[finalInd].classList.add("solveColor");
            funcId("board").children[finalInd].innerHTML = i;
            if (await solve1()) {
                return true;
            }
            board[empty[0]][empty[1]] = 0;
        }
    }
    funcId("board").children[0].innerHTML = board[0][0];
    return false;
}

function findEmptySpace() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] == 0) {
                return [i, j];
            }
        }
    }
}

function funcId(id) {
    return document.getElementById(id);
}

function emptyBoard() {
    let squares = document.querySelectorAll(".square");
    for (let i = 0; i < squares.length; i++) {
        squares[i].remove();
    }
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            board[i][j] = 0; // Corrected variable name to 'board'
        }
    }
    fault1 = 0;
    fault2 = 0;
    fault3 = 0;
    isSolved = false;
}

function checkDuplicates(board, num, empty) {
    for (let i = 0; i < 9; i++) {
        if (board[empty[0]][i] == num && empty[1] != i) {
            fault1 = 1;
            return false;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (board[i][empty[1]] == num && empty[0] != i) {
            fault2 = 1;
            return false;
        }
    }
    var x = Math.floor(empty[1] / 3);
    var y = Math.floor(empty[0] / 3);
    for (let i = y * 3; i < (y * 3) + 3; i++) {
        for (let j = x * 3; j < (x * 3) + 3; j++) {
            if (board[i][j] == num && i != empty[0] && j != empty[1]) {
                fault3 = 1;
                return false;
            }
        }
    }
    return true;
}
