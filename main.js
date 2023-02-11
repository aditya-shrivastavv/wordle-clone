const letters = document.querySelectorAll(".letter-container");
const loadingIcon = document.querySelector(".loading-wrapper");
const ANSWER_LENGTH = 5;

async function init() {
  let currentGuess = "";
  let currentRow = 0;

  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const json = await res.json();
  const word = json.word.toUpperCase();

  console.log(word);
  setLoading(false);

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

  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      // Replace the last letter.
      currentGuess =
        currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText =
      letter;
  }

  async function commit() {
    if (currentGuess.length !== ANSWER_LENGTH) {
      // do nothing
      return;
    }

    // TODO: validate the word

    // TODO: marking as "correct", "close" or "wrong".

    // TODO: did they win or lose

    currentRow++;
    currentGuess = "";
  }

  function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
  }
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
  loadingIcon.classList.toggle("hidden", !isLoading);
}

init();
