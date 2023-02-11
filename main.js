const letters = document.querySelectorAll(".letter-container");
const loadingIcon = document.querySelector(".loading-wrapper");
const ANSWER_LENGTH = 5;

async function init() {
  let currentGuess = "";

  document.addEventListener("keydown", function handleKeyPress(e) {
    const action = e.key;

    if (action === "Enter") {
      commit();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } else {
      // do nothing 
    }
  });

  function addLetter (letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      currentGuess = currentGuess.substring(0, currentGuess.length-1) + letter;
    }

    letters[currentGuess.length - 1].innerText = letter;
  }

}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

init();
