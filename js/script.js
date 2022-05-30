let cvs = document.getElementById("canvas");
let cxt = cvs.getContext("2d");

let bird = new Image();
let bg = new Image();
let fg = new Image();
let p1 = new Image();
let p2 = new Image();
let sprite = new Image();
let getReady = new Image();
let gameOver = new Image();
let scoreMedal = new Image();
let restart = new Image();
let medalOne = new Image();
let medalTo = new Image();
let medalThree = new Image();
let medalFo = new Image();

let birdUp = new Image();
let birdDown = new Image();
let birdMid = new Image();

medalOne.src = "imgBird/medal_1.png";
medalTo.src = "imgBird/medal_2.png";
medalThree.src = "imgBird/medal_3.png";
medalFo.src = "imgBird/medal_4.png";
bird.src = "imgBird/bluebird-midflap.png";
bg.src = "img/background.png";
fg.src = "img/floor.png";
p1.src = "img/pipeUp.png";
p2.src = "img/pipeBottom.png";
sprite.src = "img/sprite.png ";
getReady.src = "imgBird/getready.png";
gameOver.src = "imgBird/gameover.png";
scoreMedal.src = "imgBird/scoreboard.png";
restart.src = "img/restart.png";

birdUp.src = "imgBird/bluebird-upflap.png";
birdDown.src = "imgBird/bluebird-downflap.png";
birdMid.src = "imgBird/bluebird-midflap.png";

let gameRestart = false;
let isGameActive = true;
let isGameStarted = false;
let gap = 85;
let birdX = 10;
let birdY = 150;
let constant = null;
let gravity = 1.5;

let gravityY = 30;
let score = 0;
const localStorageKey = "bestResult";

let fly_sound = new Audio();
let score_sound = new Audio();

fly_sound.src = "audio/fly.mp3";
score_sound.src = "audio/score.mp3";

bird.src = "imgBird/bluebird-upflap.png";
birdY -= 30;
fly_sound.play();

let birdDirection = "down";

function debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
const setBirdDirectionDown = () => {
  birdDirection = "down";
  gravity = 2.25;
};
const setBirdDirectionUp = () => {
  birdDirection = "up";
  gravity = 1.5;
};

const setBirdDirectionDownDebounce = debounce(() => setBirdDirectionDown());

function moveUp() {
  bird.src = "imgBird/bluebird-upflap.png";
  setBirdDirectionUp();
  setBirdDirectionDownDebounce();
  fly_sound.play();
}

let pipe = [];

pipe[0] = {
  x: cvs.width,
  y: 0,
};

function draw() {
  isGameStarted = true;
  document.removeEventListener("click", draw);
  document.removeEventListener("keydown", draw);
  document.addEventListener("keydown", moveUp);
  document.addEventListener("click", moveUp);

  cxt.drawImage(bg, 0, 0);
  for (let i = 0; i < pipe.length; i++) {
    constant = p1.height + gap;
    if (isGameActive) {
      cxt.drawImage(p1, pipe[i].x, pipe[i].y);
      cxt.drawImage(p2, pipe[i].x, pipe[i].y + constant);
    }

    pipe[i].x--;

    if (pipe[i].x == 90) {
      pipe.push({
        x: cvs.width,
        y: Math.floor(Math.random() * p1.height) - p1.height,
      });
    }

    if (
      (birdX + bird.width >= pipe[i].x &&
        birdX <= pipe[i].x + p1.width &&
        (birdY <= pipe[i].y + p1.height ||
          birdY + bird.height >= pipe[i].y + constant)) ||
      birdY + bird.height >= cvs.height - fg.height
    ) {
      isGameActive = false;

      cxt.drawImage(gameOver, 45, 10);
      cxt.drawImage(scoreMedal, 30, 105);
      cxt.fillText(score, 210, 157);

      let storage = localStorage.getItem(localStorageKey);

      if (storage == undefined || score > parseInt(storage)) {
        localStorage.setItem(localStorageKey, score);
      }

      cxt.fillText(localStorage.getItem(localStorageKey), 210, 200);

      function gameRestart() {
        location.reload();
      }

      cvs.addEventListener("click", gameRestart);
      cvs.addEventListener("keydown", gameRestart);

      if (score < 2) {
        cxt.drawImage(medalOne, 55, 148);
      } else if (score < 3) {
        cxt.drawImage(medalThree, 55, 148);
      } else if (score < 4) {
        cxt.drawImage(medalFo, 55, 148);
      }
    }

    if (pipe[i].x == 5) {
      score++;
      score_sound.play();
    }
  }

  cxt.drawImage(fg, 0, cvs.height - fg.height);
  cxt.drawImage(bird, birdX, birdY);
  if (birdDirection === "down") {
    birdY += gravity;
    bird.src = "imgBird/bluebird-downflap.png";
  } else {
    birdY -= gravity;
  }

  cxt.fillStyle = "#f0f8ff";
  cxt.font = "25px Anton ";

  cxt.fillText(score, 130, 440);

  if (isGameActive == true) {
    requestAnimationFrame(draw);
  }
}

function mockGame() {
  if (!isGameStarted) {
    cxt.drawImage(bg, 0, 0);
    cxt.drawImage(fg, 0, cvs.height - fg.height);
    const birdImage = cxt.drawImage(bird, birdX, birdY);
    cxt.drawImage(getReady, 50, 30);

    cxt.fillStyle = "f0f8ff";
    cxt.font = "30px Anton ";

    // cxt.fillText("Score :" + score, 100, 380);

    requestAnimationFrame(mockGame);

    document.addEventListener("click", draw);
    document.addEventListener("keydown", draw);
  }
}

mockGame();
