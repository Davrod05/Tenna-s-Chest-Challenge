"use strict";
/* Methods*/
const print = function (message) {
  console.log(message);
};

/* TENNA DIALOGE FUNCTION */
const dialoge = function (message, delay, pose, reset) {
  setTimeout(() => {
    TennaPose.style.height = "280px";
    TennaPose.src = `img/${pose}.png`;
    Speech.style.display = "flex";
    SpeechText.textContent = message;
    voice.currentTime = 0;
    voice.play();
    setTimeout(() => {
      TennaPose.style.height = "270px";
    }, 0.09 * 1000);

    if (reset == true) {
      setTimeout(() => {
        Speech.style.display = "none";
        TennaPose.src = `img/Tenna_1.png`;
      }, 2000);
    }
  }, delay * 1000);
};

/* MENU BUTTONS */
const start = document.querySelector(".Start");
const restart = document.querySelector(".Restart");
/*Tenna*/
const Tenna = document.querySelector(".Tenna");
const TennaPose = document.querySelector(".TennaPose");
const Speech = document.querySelector(".Speech");
const SpeechText = document.querySelector(".text");
/* OTHERS */
const Chests = document.querySelectorAll(".chest");
const ScoreTxt = document.querySelector(".Score");
const ScoreChange = document.querySelector(".ScoreChange");
const Results = document.querySelector(".Results");
/*SFX AND MUSIC*/
const voice = new Audio("sfx/snd_tv_voice_short_5.wav");
const BgMusic = new Audio("sfx/TV WORLD.mp3");
const ChestStart = new Audio("sfx/snd_board_splash.wav");
const ChestWrong = new Audio("sfx/wrong.mp3");
const ChestCorrect = new Audio("sfx/correct.mp3");
const Cheer = new Audio("sfx/crowd_cheer_single.wav");
const Gasp = new Audio("sfx/crowd_gasp.wav");

////////////* GAME LOGIC STARTS HERE *////////////
restart.disabled = true;
let FirstPlay = true;

let RNG = 0;
let Score = 0;

let plus20s = 0;
let plus10s = 0;
let plus5s = 0;
let minus5s = 0;

let startTimer;
let Time = 30;

const newRNG = function () {
  RNG = Math.trunc(Math.random() * 6 + 1);
};

let IsGameStarted = false;
let StartTime = 9.6;

/* GAME START */
const StartGame = function () {
  restart.disabled = true;
  restart.style.opacity = "20%";
  print("Game Start");
  CloseAllChests();
  Tenna.style.display = "block";

  Chests.forEach(function (button) {
    button.disabled = false;
  });
  document.querySelector(".Timer").textContent = Time;

  setTimeout(() => {
    Tenna.style.left = "200px";
  }, 50);

  if (FirstPlay == true) {
    dialoge("Welcome for another challenge!", 0.5, "Tenna_1", false);
    dialoge("100 Points to Win", 3, "Tenna_1", false);
    dialoge("30 seconds. Good luck!", 6, "Tenna_excited", true);
  }
  setTimeout(() => {
    ChestStart.play();
    startTimer = setInterval(() => {
      Time--;
      if (Time >= 0) {
        document.querySelector(".Timer").textContent = Time;
      }
    }, 1 * 1000);
    document.querySelector(".Chests").style.filter = "grayscale(0%)";
    document.querySelector(".Timer").style.opacity = "100%";
    ScoreTxt.textContent = "0";
    ScoreTxt.style.fontSize = "23px";
    ScoreTxt.style.top = "55px";
    ScoreTxt.style.left = "40px";
    IsGameStarted = true;
    newRNG();
    document.querySelector(".wrapper").style.animation =
      "moveStars 11s linear infinite";
    BgMusic.play();
    BgMusic.volume = 0.2;

    /*TIME OUT*/
    setTimeout(() => {
      document.querySelector(".Timer").style.opacity = "20%";
      Chests.forEach(function (button) {
        button.disabled = true;
      });
      BgMusic.pause();
      ChestStart.play();
      document.querySelector(".Chests").style.filter = "grayscale(100%)";
      dialoge("Time's Up!!", 0, "Tenna_excited", true);
      dialoge("The results are in..", 3, "Tenna_hands", false);

      setTimeout(() => {
        print("Results");
        Results.classList.remove("hide");
        document.getElementById(
          "r1"
        ).textContent = `Points: +20: ${plus20s} / +10: ${plus10s} / +5: ${plus5s} / -5: ${minus5s}`;
        document.getElementById("r2").textContent = `Score: ${Score} / 100`;
        if (Score >= 100) {
          document.getElementById("r3").textContent = `You Win`;
          Cheer.play();
          dialoge("WE HAVE A WINNER", 1, "Tenna_Excited", false);
          restart.style.opacity = "100%";
          restart.disabled = false;
        } else {
          document.getElementById("r3").textContent = `You Lose`;
          Gasp.play();
          dialoge("Sorry Folks no Winner today...", 1, "Tenna_confused", false);
          restart.style.opacity = "100%";
          restart.disabled = false;
        }
      }, 5 * 1000);
    }, Time * 1000);
  }, StartTime * 700);

  start.style.opacity = "20%";
  start.disabled = true;
};

/* START BUTTON */
start.addEventListener("click", () => {
  StartGame();
});

let OpenedChests = [];

/* CLOSING CHEST FUNCTION */
let CloseAllChests = function (time) {
  setTimeout(() => {
    for (let i = 0; i < OpenedChests.length; i++) {
      document.getElementById(OpenedChests[i]).querySelector("img").src =
        "img/chestClosed.png";
      Chests.forEach(function (button) {
        button.disabled = false;
      });
    }
    OpenedChests = [];
  }, time * 1000);
};

/*DISPLAY SCORE CHANGE*/
let ScoreChangeDisplay = function (moreless, amount, color) {
  ScoreChange.textContent = moreless + amount;
  ScoreChange.style.color = color;
  ScoreChange.style.display = "block";
  setTimeout(() => {
    ScoreChange.style.display = "none";
  }, 0.6 * 1000);
};

/* ANY CHEST BUTTON */
Chests.forEach(function (button) {
  button.addEventListener("click", function () {
    if (!IsGameStarted) return;

    this.querySelector("img").src = "img/chestOpen.png";
    OpenedChests.push(this.id);
    this.disabled = true;
    print(OpenedChests);

    if (this.id == RNG) {
      ChestCorrect.currentTime = 0;
      ChestCorrect.play();
      Chests.forEach(function (button) {
        button.disabled = true;
      });
      this.querySelector("img").src = "img/chestHeart.png";

      if (OpenedChests.length == 1) {
        Score += 20;
        plus20s++;
        ScoreTxt.textContent = `${Score}`;
        ScoreChangeDisplay("+", "20", "#FFD700");
      } else if (OpenedChests.length == 2) {
        Score += 10;
        plus10s++;
        ScoreTxt.textContent = `${Score}`;
        ScoreChangeDisplay("+", "10", "#32CD32");
      } else if (OpenedChests.length == 3) {
        Score += 5;
        plus5s++;
        ScoreTxt.textContent = `${Score}`;
        ScoreChangeDisplay("+", "5", "#90EE90");
      }
      print(Score);
      newRNG();
      CloseAllChests(0.6);
    } else if (this.id != RNG && OpenedChests.length == 3) {
      Score -= 5;
      minus5s++;
      ScoreTxt.textContent = `${Score}`;
      ScoreChangeDisplay("-", "5", "#FF0055");
      ChestWrong.currentTime = 0;
      ChestWrong.play();
    }

    if (OpenedChests.length == 3) {
      Chests.forEach(function (button) {
        button.disabled = true;
      });
      newRNG();
      CloseAllChests(0.6);
    }
  });
});

restart.addEventListener("click", function () {
  restart.disabled = true;
  FirstPlay = false;
  BgMusic.pause();
  clearInterval(startTimer);
  BgMusic.currentTime = 0;
  RNG = 0;
  Score = 0;
  plus20s = 0;
  plus10s = 0;
  plus5s = 0;
  minus5s = 0;
  Time = 30;
  StartTime = 1;

  document.querySelector(".Timer").textContent = Time;

  dialoge("Lets try that again.", 0, "Tenna_Excited", true);

  setTimeout(() => {
    print("restarted");
    Results.classList.add("hide");
    StartGame();
  }, 2 * 1000);
});
