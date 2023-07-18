"use strict";

// Selected all the DOM elements that I'm going to use
const ps = document.querySelectorAll(".slot-item");
const playBtn = document.querySelector(".play-button");
const budgetElem = document.querySelector(".budget");
const betElem = document.querySelector(".bet");
const announcementElem = document.querySelector(".announcement");
const minusElem = document.querySelector(".minus");
const plusElem = document.querySelector(".plus");
const closeModal = document.querySelector(".close-modal");
const rules = document.querySelector(".rules");
const showRules = document.querySelector(".show-rules");

const winSound = new Audio("src/winAudio.wav");

// Created an object containing all the possible picks and their bet multiplier at index
const icons = {
  1: "🍒",
  2: "🍇",
  3: "🍉",
  4: "🍊",
  5: "🍑",
  6: "🍓",
  7: "7️⃣",
};

// Created a player object that contains details about the player
const player = {
  budget: 200,
  bet: 5,
};

// Updating the DOM with the welcoming elements
budgetElem.innerText = `Budget ${player.budget}`;
betElem.innerText = `Bet ${player.bet}`;
announcementElem.innerText = "Press play!";

// Creating a global variable that I'm going to need for the whole code
let won;

// Creating a function that is going to return a random number from 1-7(number of possible icons)
function randomN() {
  return Math.floor(Math.random() * 7) + 1;
}

// Creating a two dimensional array with random values, that will contain the values from the icons object
function createSlot(items) {
  const slots = [
    [items[randomN()], items[randomN()], items[randomN()]],
    [items[randomN()], items[randomN()], items[randomN()]],
    [items[randomN()], items[randomN()], items[randomN()]],
  ];

  return slots;
}

// Creating a function that will be called each round that checks if the player won the round
function checkWin(round) {
  if (round[1].every((val) => val === round[1][0])) {
    won = round[1][0];
    return true;
  } else if (round[0][0] === round[1][1] && round[0][0] === round[2][2]) {
    won = round[0][0];

    return true;
  } else if (round[2][0] === round[1][1] && round[2][0] === round[0][2]) {
    won = round[2][0];

    return true;
  }
}

// Creating a function that will return the key(the multiplier), based on the value(the icons)
function keyByValue(object, value) {
  if (won) {
    return Number(Object.keys(object).find((key) => object[key] === value));
  }
}

// Creating a function that will return the credit that was won each round
function ifWon(round, bet) {
  if (checkWin(round)) {
    const sumWon = (bet *= keyByValue(icons, won));
    announcementElem.innerText = `You won: ${sumWon}`;
    announcementElem.classList.add("win");
    winSound.play();
    return sumWon;
  } else {
    announcementElem.innerText = "Try again";
    announcementElem.classList.remove("win");
    return 0;
  }
}

// Creating a function that will update the DOM every round
function updateDOM(round, budget, bet) {
  const flatRound = round.flat();

  for (let p = 0; p < ps.length; p++) {
    ps[p].innerText = flatRound[p];
  }

  budgetElem.innerText = `Budget ${budget}`;
  betElem.innerText = `Bet ${bet}`;
}

// Creating a method for the object player, that will check if player is eligible to play and will call all the functions that make the game work
player.play = function () {
  const round = createSlot(icons);
  if (this.budget > 0 && this.bet <= this.budget) {
    this.budget -= this.bet;
    this.budget += ifWon(round, this.bet);
    updateDOM(round, this.budget, this.bet);
  } else {
    announcementElem.innerText = "You can stop playing now 😢";
  }
};

// Creating event listeners for the Bet incrementor
minusElem.addEventListener("click", () => {
  if (player.bet > 5) {
    player.bet -= 5;
    betElem.innerText = `Budget ${player.bet}`;
  }
});

plusElem.addEventListener("click", () => {
  player.bet += 5;
  betElem.innerText = `Budget ${player.bet}`;
});

// Creating event listener for the button that closes and opens the rules dialogue box
closeModal.addEventListener("click", () => rules.classList.toggle("hidden"));

showRules.addEventListener("click", () => rules.classList.toggle("hidden"));

// Creating an event listener that will call the play method on the player, and so the round wil begin
playBtn.addEventListener("click", () => player.play());
