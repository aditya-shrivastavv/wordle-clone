/**
 * GLOBAL CONSTANTS
 */
const letters = document.querySelectorAll(".letter-container");
const loadingIcon = document.querySelector(".loading-wrapper");
const ANSWER_LENGTH = 5;
const ROUNDS = 8;

/**
 * MAIN FUNCTION
 */

async function init() {
  let currentGuess = "";
  let currentRow = 0;
  let isLoading = true;

  // FETCHING THE WORD
  const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
  const json = await res.json();
  const word = json.word.toUpperCase();

  // GLOBAL OPERATIONS
  const wordArr = word.split("");
  setLoading(false);
  isLoading = false;
  let done = false;

  /**
   * MAIN EVENT LISTNER
   */
  document.addEventListener("keydown", function handleKeyPress(e) {
    if (done || isLoading) {
      // do nothing;
      return;
    }

    const action = e.key;
    if (action === "Enter") {
      enter();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } else {
      // do nothing
    }
  });

  /**
   * MAIN FUNCTIONS
   */
  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      // Replace the last letter.
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }
    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
  }

  async function enter() {
    // LESS LENGTH
    if (currentGuess.length !== ANSWER_LENGTH) {
      // do nothing
      return;
    }

    isLoading = true;
    setLoading(true);
    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: currentGuess }),
    });
    const resObj = await res.json();
    const { validWord } = resObj;
    isLoading = false;
    setLoading(false);

    if (!validWord) {
      markInvalidWord();
      return;
    }

    // LOCAL OPERATIONS
    const guessArr = currentGuess.split("");
    const map = makeMap(wordArr);
    console.log(map);

    // CORRECT MARKING
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessArr[i] === wordArr[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessArr[i]]--;
      }
    }

    // CLOSE, WRONG MARKING
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessArr[i] === wordArr[i]) {
        /* do nothing */
      } else if (wordArr.includes(guessArr[i]) && map[guessArr[i]] > 0) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
        map[guessArr[i]]--;
      } else {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
      }
    }

    currentRow++;

    // ALERT WINNER
    if (currentGuess === word) {
      alert("YOU WIN!");
      document.querySelector(".brand").classList.add("winner");
      document.querySelector("header").classList.add("whitebg");
      done = true;
      return;
    } else if (currentRow === ROUNDS) {
      alert(`You Lose the word was ${word}`);
      done = true;
    }

    currentGuess = "";
  }

  function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
  }

  function markInvalidWord() {
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");
      setTimeout(function () {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid");
      }, 10);
    }
  }
}

/**
 * UTIL FUNCTIONS
 */
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
  loadingIcon.classList.toggle("hidden", !isLoading);
}

function makeMap(array) {
  let obj = {};
  for (let i = 0; i < array.length; i++) {
    const letter = array[i];
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }
  return obj;
}

/**
 * CALLING THE MAIN FUNCTION
 */
init();
