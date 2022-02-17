const keyboardContainerElement = document.querySelector('[data-keyboard]');
const wordContainerElement = document.querySelector('[data-wordContainer]');
const alertContainerElement = document.querySelector('[data-alertContainer]');
const startButton = document.querySelector('[data-start]');
const loaderElement = document.querySelector('[data-load]');
const loader = document.querySelector('[data-loading]');

// word list
const wordList = ['SCIENCE'];

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

// random word generator 
const generateRandomWordIndex = ()=>{
    return Math.floor(Math.random() * wordList.length);
};
let randomWord = wordList[generateRandomWordIndex()];

// keyboard construction
keys.forEach((key, keyIndex)=>{
    const buttonElement = document.createElement('button');
    buttonElement.textContent = key;
    buttonElement.setAttribute('id', key);
    buttonElement.addEventListener('click', ()=> handleKeyClicks(key));
    keyboardContainerElement.append(buttonElement);
});

startButton.addEventListener('click', handleWordSetup, {once:true});

// generate word tiles
function handleWordSetup(){
        loaderElement.classList.remove('hide');
        setCustomProperty(loaderElement, '--load-container-width', Math.floor(randomWord.length * 10));
        startButton.classList.add('hide');
        clearTiles();
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


// handling letter keys
const handleKeyClicks = (letter)=>{
    checkLetter(letter);
}

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
      }else{
          showMessage('Wrong Letter is already present');
      }
  }
   
}

const showMessage = (message)=>{
    const messsageElement = document.createElement('div');
    messsageElement.textContent = message;
    alertContainerElement.appendChild(messsageElement);
    setTimeout(()=>{
        alertContainerElement.removeChild(messsageElement);
    },2000);
}

// clears all the tiles before redisplaying the letter tiles
const clearTiles = ()=>{
    while(wordContainerElement.firstChild){
        wordContainerElement.removeChild(wordContainerElement.firstChild);
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
    }
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