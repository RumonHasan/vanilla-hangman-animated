const keyboardContainerElement = document.querySelector('[data-keyboard]');
const wordContainerElement = document.querySelector('[data-wordContainer]');
const alertContainerElement = document.querySelector('[data-alertContainer]');
const startButton = document.querySelector('[data-start]');
const loaderElement = document.querySelector('[data-load]');
const loader = document.querySelector('[data-loading]');
const wrongContainerElement = document.querySelector('[data-wrongContainer]');
const titleElement = document.querySelector('[data-title]');
const restartButtonElement = document.querySelector('[data-restart]');

// word list
const wordList = [
    "a" ,
    "aa" ,
    "aah" ,
    "aahed" ,
    "aahing" ,
    "aahs" ,
    "aal" ,
    "aalii" ,
    "aaliis" ,
    "aals" ,
    "aardvark" ,
    "aardvarks" ,
    "aardwolf" ,
    "aardwolves" ,
    "aargh" ,
    "aarrgh" ,
    "aarrghh" ,
    "aarti" ,
    "aartis" ,
    "aas" ,
    "aasvogel" ,
    "aasvogels" ,
    "ab" ,
    "aba" ,
    "abac" ,
    "abaca" ,
    "abacas" ,
    "abaci" ,
    "aback" ,
    "abacs" ,
    "abacterial" ,
    "abactinal" ,
    "abactinally" ,
    "abactor" ,
    "abactors" ,
    "abacus" ,
    "abacuses" ,
    "abaft" ,
    "abaka" ,
    "abakas" ,
    "abalone" ,
    "abalones" ,
    "abamp" ,
    "abampere" ,
    "abamperes" ,
    "abamps" ,
    "aband" ,
    "abandoned" ,
    "abanding" ,
    "abandon" 
]
// key list
const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '«',
];
// main enter key
const ENTER_KEY = 'ENTER';

// globals
let checkGameOver = false;
let correctLetters = [];
let wrongLetters = [];
let lifeTitle = ['H', 'A', 'N', 'G', 'M', 'A', 'N'];
let currentLifeTile = lifeTitle.length - 1;

// random word generator 
const generateRandomWordIndex = ()=>{
    return Math.floor(Math.random() * wordList.length);
};
let randomWord = wordList[generateRandomWordIndex()].toUpperCase();
const MAX_LOAD_NUMBER = Math.floor(randomWord.length * 10);
console.log(randomWord);

// keyboard construction
const keyboardDisplay = ()=>{
    keys.forEach((key, keyIndex)=>{
        const buttonElement = document.createElement('button');
        buttonElement.textContent = key;
        buttonElement.setAttribute('id', key);
        buttonElement.addEventListener('click', ()=> handleKeyClicks(key));
        keyboardContainerElement.append(buttonElement);
    });
}
// primary event listener
startButton.addEventListener('click', gameStart, {once:true});

// main function to start the initial game setup
function gameStart(){
    wordContainerElement.classList.remove('hide');
    keyboardContainerElement.classList.remove('hide');
    titleElement.classList.remove('hide');
    loaderElement.classList.remove('hide');
    startButton.classList.add('hide');
    restartButtonElement.classList.add('hide');
    handleWordSetup();
    keyboardDisplay();
    showTitle();
};

function checkGameLose(){
    checkGameOver = true;
    if(checkGameOver){
        window.location = '/';
        wordContainerElement.classList.add('hide');
        keyboardContainerElement.classList.add('hide');
        titleElement.classList.remove('hide');
        loaderElement.classList.add('hide');
        startButton.classList.add('hide');
    }
}

const showTitle = ()=>{
    lifeTitle.forEach((titleLetter, index)=>{
        setTimeout(()=>{
            const titleLetterElement = document.createElement('div');
            titleLetterElement.textContent = titleLetter;
            titleLetterElement.classList.add('title-letter');
            titleLetterElement.setAttribute('id', 'title-'+index);
            titleElement.append(titleLetterElement);
        }, 200 * index);
    })
}

// generate word tiles
function handleWordSetup(){
        setCustomProperty(loaderElement, '--load-container-width', MAX_LOAD_NUMBER);
        clearTiles(wordContainerElement);
        randomWord.split('').forEach((letter, letterIndex)=>{
            const letterRowElement = document.createElement('div');
            letterRowElement.classList.add('letter-tile');
            letterRowElement.setAttribute('id', 'guessLetter-' + letterIndex);
            if(correctLetters.includes(letter)){
                letterRowElement.textContent = letter;
            }else{
                letterRowElement.textContent = '';
            }
            wordContainerElement.append(letterRowElement);
        })
};

const displayWrongLetters = ()=>{
    clearTiles(wrongContainerElement);
    wrongLetters?.forEach((singleWrongLetter)=>{
        const wrongTileElement = document.createElement('div');
        wrongTileElement.classList.add('wrong-tile');
        wrongTileElement.textContent = singleWrongLetter;
        wrongContainerElement.append(wrongTileElement);
    })
};

const removeLifeLetter = ()=>{
    if(currentLifeTile === 0){
        showMessage('Game over!');
        setTimeout(()=>{
            checkGameLose();
        }, 2500);
        return;
    }
    if(currentLifeTile >= 0){
        const titleNode = document.getElementById('title-' + currentLifeTile);
        titleNode.textContent = '';
        currentLifeTile--;
    }
};

// final game over call when the player loses 
const gameOverFinalCall = ()=>{
    restartButtonElement.classList.remove('hide');
    restartButtonElement.addEventListener('click', gameStart);
}

// handling letter keys
const handleKeyClicks = (letter)=>{
    checkLetter(letter);
}

// main function to check whether letter is wrong or right
const checkLetter = (letter)=>{ // adds it independently to the dom;
  if(randomWord.includes(letter)){
    if(!correctLetters.includes(letter)){
        correctLetters.push(letter);
        handleWordSetup();
        flipLetterTile();
        increaseLoader();
        
    }else{
        showMessage('Letter is already chosen');
    }
  }else{
      if(!wrongLetters.includes(letter)){
          wrongLetters.push(letter);
          showMessage('You loose one life');
          console.log(wrongLetters);
          displayWrongLetters();
          removeLifeLetter();
      }else{
          showMessage('Wrong Letter is already present');
      }
  }
   
}

const showMessage = (message)=>{
    const messsageElement = document.createElement('div');
    messsageElement.textContent = message;
    messsageElement.classList.add('alert-message');
    alertContainerElement.appendChild(messsageElement);
    setTimeout(()=>{
        alertContainerElement.removeChild(messsageElement);
    },2000);
}

// clears all the tiles before redisplaying the letter tiles
const clearTiles = (elementContainer)=>{
    while(elementContainer.firstChild){
        elementContainer.removeChild(elementContainer.firstChild);
    }
}

// function to flip tiles based on classes for css color
const flipLetterTile = ()=>{
    const letterTiles = wordContainerElement.childNodes;
    letterTiles.forEach((letterElement, index)=>{
        const letter = letterElement.textContent;
        if(letterElement.textContent){
            letterElement.classList.add('flip');
        }
        setTimeout(()=>{
            if(correctLetters.includes(letter)){
                letterElement.classList.add('correct-overlay');
            };
        }, 100 * index);
     
    })
};


// increase loading based on correct letters
const increaseLoader = ()=>{
    const loaderIncreaseRate = Math.floor(100 / randomWord.length);
    const loaderWidth = getCustomProperty(loader, '--load-width');
    if(loaderWidth < 100){
        increaseCustomProperty(loader, '--load-width', loaderIncreaseRate);
    };
    if(loaderWidth >= MAX_LOAD_NUMBER){
        alert('show me something please');
    }
    console.log(MAX_LOAD_NUMBER, loaderIncreaseRate);
};

// custom property manager for element style control
function getCustomProperty(element, value){
    return parseFloat(getComputedStyle(element).getPropertyValue(value));
};
function setCustomProperty(element, prop, value){
    element.style.setProperty(prop, value)
}
function increaseCustomProperty(element, prop, incrementVal){
   return setCustomProperty(element, prop, getCustomProperty(element, prop) + incrementVal);
};