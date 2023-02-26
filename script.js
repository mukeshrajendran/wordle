import { countries } from './db.js';


const guessGridEl = document.querySelector('#guess-grid');
const keyBoard = document.querySelector('.keyboard');
const textPopup = document.querySelector('.text-pop');
const wordLength = 5;
let currentRow = 0;
const wordList = countries.map((item) => item.toLowerCase());
const randWord = countries[Math.floor(Math.random() * countries.length)].toLowerCase();
console.log(randWord)
function startInteraction() {
    document.addEventListener('click', clickHandler);
    document.addEventListener('keyup', keyHandler);
}

function stopInteraction() {
    document.removeEventListener('click', clickHandler);
    document.removeEventListener('keyup', keyHandler);
}

function clickHandler(e) {
    if (e.target.matches("[data-key='Enter']")) {
        submitWords()
    } else if (e.target.matches("[data-key='Backspace']")) {
        deleteLetter();
    } else if (e.target.matches("[data-key]")) {
        pressKey(e.target.dataset.key)
    }
}

function keyHandler(e) {
    switch (e.key) {
        case 'Enter':
            submitWords()
            break;
        case 'Backspace':
            deleteLetter();
            break;
        default:
            pressKey(e.key)
            break;
    }
}

function pressKey(key) {
    if (!/^[a-z,A-Z]$/.test(key) && key !== 'Backspace' && key !== 'Enter') {
        return;
    }
    const activeTiles = getActiveTiles();
    if (activeTiles.length >= wordLength) return;
    const nextTile = guessGridEl.querySelector(":not([data-letter])");
    nextTile.dataset.letter = key;
    nextTile.dataset.state = 'active';
    nextTile.textContent = key;
}

function deleteLetter() {
    const nextTile = getActiveTiles();
    if (!nextTile.length) return;
    delete nextTile[nextTile.length - 1].dataset.letter;
    delete nextTile[nextTile.length - 1].dataset.state;
    nextTile[nextTile.length - 1].textContent = '';
}

function submitWords() {
    const activeTiles = getActiveTiles();
    if (activeTiles.length < wordLength) {
        shakeTiles();
        showPopup('Not enough letters');
        return;
    };
    let userInput = '';
    activeTiles.forEach(tile => {
        userInput += tile.dataset.letter;
    })
    userInput = userInput.toLowerCase();
    if (userInput === randWord) {
        activeTiles.forEach(tile => {
            tile.style.setProperty('--tile-color', 'green');
        })
        showPopup('You answer is correct', 2000);
        stopInteraction();
        flip();
        return;
    }

    if (!wordList.includes(userInput)) {
        showPopup('Word does not exist');
        shakeTiles();
        return;
    }
    flip();
    for (let i = 0; i < userInput.length; i++) {
        const key = keyBoard.querySelector(`[data-key="${userInput[i]}"i]`)
        if (userInput[i] === randWord[i]) {
            //pos correct
            activeTiles[i].style.setProperty('--tile-color', 'green');
            key.style.setProperty('--key-color', 'green');
        }
        else if (randWord.includes(userInput[i])) {
            //pos wrong
            activeTiles[i].style.setProperty('--tile-color', 'yellow');
            key.style.setProperty('--key-color', 'yellow');
        } else {
            //wrong letter
            activeTiles[i].style.setProperty('--tile-color', 'gray');
            key.style.setProperty('--key-color', 'gray');
        }

        activeTiles[i].dataset.state = 'inactive';
    }
    if (currentRow > 4) {
        showPopup(`correct answer is ${randWord}`, 3000);
        stopInteraction();
    }
    currentRow++;

}

function getActiveTiles() {
    return guessGridEl.querySelectorAll('[data-state="active"');
}

function shakeTiles() {
    const activeTiles = getActiveTiles();
    activeTiles.forEach((tile) => {
        tile.classList.add('shake');
        tile.addEventListener('animationend', () => {
            tile.classList.remove('shake');
        }, { once: true })
    })
}

function flip() {
    const activeTiles = getActiveTiles();
    activeTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip');
            tile.addEventListener('animationend', () => {
                tile.classList.remove('flip');
            }, { once: true })
        }, index * 1000);
    })
}


function showPopup(content, timeout = 1000) {
    textPopup.textContent = content;
    textPopup.classList.add('show');
    setTimeout(() => {
        textPopup.classList.remove('show');
    }, timeout);
}
startInteraction();

