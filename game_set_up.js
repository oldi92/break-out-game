//GET CANVAS
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

//GET THE WIN DIV
const compeleGame = document.getElementById("win");
compeleGame
  ? compeleGame.addEventListener("click", () => location.reload())
  : null;

//GET THE LOSE DIV
const loseGame = document.getElementById("lose");
loseGame ? loseGame.addEventListener("click", () => location.reload()) : null;

//DEFINE THE VARIABLES
let PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 15;
const PADDLE_MARGIN_BOTTOM = 50;
let leftArrow;
let rightArrow;
const BALL_RADIUS = 5;
let SCORE_UNIT = 10;
let GAME_OVER = false;
let MAX_LEVEL = 4;
let secondBall = null;
let TOP_SCORE = 0;
let PADDLE_SHORT = false;

//SET BACKGROUND IMAGE
image = new Image();
image.src = "./images/background.jpg";

//SET BRICK IMAGE
imageBrick = new Image();
imageBrick.src = "./images/brick1.png";

//SET BROKEN BRICK IMAGE
imageBrickBroken = new Image();
imageBrickBroken.src = "./images/brick1Broken.png";

//SET LEVEL IMAGE
imageLevel = new Image();
imageLevel.src = "./images/star.png";

//SET LIFE IMAGE
imageLife = new Image();
imageLife.src = "./images/life.png";

//SET SCORE IMAGE
imageScore = new Image();
imageScore.src = "./images/trophy.png";

//SET MYSTERY BOX IMAGE
imageMystery = new Image();
imageMystery.src = "./images/mysteryBox.png";

//SET THE SOUNDS
const wallHit = new Audio();
wallHit.src = "./sounds/wall.mp3";

const brickHit = new Audio();
brickHit.src = "./sounds/brick_hit.mp3";

const lifeLost = new Audio();
lifeLost.src = "./sounds/life_lost.mp3";

const winAudio = new Audio();
winAudio.src = "./sounds/win.mp3";

const paddleHit = new Audio();
paddleHit.src = "./sounds/paddle_hit.mp3";

//SET THE ADD EVENT LISTENER
document.addEventListener("keydown", () => {
  if (event.keyCode === 37) {
    leftArrow = true;
  } else if (event.keyCode === 39) {
    rightArrow = true;
  }
});

document.addEventListener("keyup", () => {
  if (event.keyCode === 37) {
    leftArrow = false;
  } else if (event.keyCode === 39) {
    rightArrow = false;
  }
});

//********************PADDLE CLASS********************
class Paddle {
  constructor() {
    this.x = cvs.width / 2 - PADDLE_WIDTH / 2;
    this.y = cvs.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM;
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.dx = 5;
  }
  draw() {
    ctx.fillStyle = "#363636";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "#2e2e2e";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
  move() {
    if (leftArrow && this.x > cvs.width - cvs.width) {
      this.x -= this.dx;
    } else if (rightArrow && this.x + this.width < cvs.width) {
      this.x += this.dx;
    }
  }
}

let paddle = new Paddle();

//********************LEVEL UP FUNCTION********************
function levelUp() {
  let isLevelDone = true;

  for (let r = 0; r < brick.brick.row; r++) {
    for (let c = 0; c < brick.brick.column; c++) {
      isLevelDone = isLevelDone && brick.bricks[r][c].hit === 0;
    }
  }

  if (isLevelDone) {
    if (stats.level > MAX_LEVEL) {
      //SET THE SCORE FOR THE NEXT LEVEL
      localStorage.setItem("score", stats.score);

      //SET THE LIFE FOR THE NEXT LEVEL
      localStorage.setItem("life", stats.life);

      //SET THE GAME LEVEL FOR THE NEXT LEVEL
      localStorage.setItem("level", ++stats.gameLevel);

      //WE DISPLAY THE WIN DIV
      compeleGame.style.display = "block";
      GAME_OVER = true;
    }
    winAudio.play();
    brick.brick.row++;
    brick.create();
    ball.speed += 0.2;
    ball.reset();
    stats.level++;
  }
}

function gameOver() {
  if (stats.life <= 0) {
    console.log("LIFE 0");
    lifeLost.play();
    loseGame.style.display = "block";
    window.addEventListener("keydown", () => {
      if (event.keyCode === 13) {
        location.reload();
      } else if (event.keyCode === 32) {
        location.reload();
      } else {
        return;
      }
    });
    GAME_OVER = true;
  }
}

///******************** STATS CLASS ********************
class STATS {
  constructor() {
    //score variables
    this.score = 0;
    this.scoreX = 35;
    this.scoreY = 25;
    this.imageScore = imageScore;
    this.imageScoreX = 5;
    this.imageScoreY = 5;

    //life variables
    this.life = 3;
    this.lifeX = cvs.width - 25;
    this.lifeY = 25;
    this.imageLife = imageLife;
    this.imageLifeX = cvs.width - 55;
    this.imageLifeY = 5;

    //level variables
    this.level = 1;
    this.levelX = cvs.width / 2 + 20;
    this.levelY = 25;
    this.imageLevel = imageLevel;
    this.imageLevelX = cvs.width / 2 - 30;
    this.imageLevelY = 5;

    //game level variables
    this.gameLevel = 1;
    this.gameLevelX = cvs.width / 2;
    this.gameLevelY = 25;
  }
  draw() {
    //SCORE
    (ctx.fillStyle = "#FFF"), (ctx.font = "25px Germania One");
    ctx.fillText(this.score, this.scoreX, this.scoreY);

    //SCORE IMAGE
    ctx.drawImage(this.imageScore, this.imageScoreX, this.imageScoreY, 25, 25);

    //LIFE
    (ctx.fillStyle = "#FFF"), (ctx.font = "25px Germania One");
    ctx.fillText(this.life, this.lifeX, this.lifeY);

    //LIFE IMAGE
    ctx.drawImage(this.imageLife, this.imageLifeX, this.imageLifeY, 25, 25);

    //LEVEL
    (ctx.fillStyle = "#FFF"), (ctx.font = "25px Germania One");
    ctx.fillText(this.level, this.levelX, this.levelY);

    //GAME LEVEL
    (ctx.fillStyle = "#FFF"), (ctx.font = "25px Germania One");
    ctx.fillText(this.gameLevel + "-", this.gameLevelX, this.gameLevelY);

    //LEVEL IMAGE
    ctx.drawImage(this.imageLevel, this.imageLevelX, this.imageLevelY, 25, 25);
  }
}

let stats = new STATS();

//******************** CLASS BRICKS********************
class Bricks {
  constructor() {
    this.brick = {
      row: 1,
      column: 5,
      width: 55,
      height: 20,
      offSetLeft: 20,
      offSetTop: 20,
      marginTop: 20,
      fillColor: "#800000",
      strokeColor: "rgb(40,40,40)",
    };
    this.bricks = new Array([], []);
    this.hit = 1;
    this.maxHit = 1;
  }

  create() {
    for (let r = 0; r < this.brick.row; r++) {
      this.bricks[r] = [];
      for (let c = 0; c < this.brick.column; c++) {
        this.bricks[r][c] = {
          x:
            c * (this.brick.offSetLeft + this.brick.width) +
            this.brick.offSetLeft,
          y:
            r * (this.brick.offSetTop + this.brick.height) +
            this.brick.offSetTop +
            this.brick.marginTop,
          hit: this.hit,
        };
      }
    }
  }

  draw() {
    for (let r = 0; r < this.brick.row; r++) {
      for (let c = 0; c < this.brick.column; c++) {
        if (
          this.maxHit - this.bricks[r][c].hit === 1 &&
          this.bricks[r][c].hit > 0
        ) {
          ctx.drawImage(
            imageBrickBroken,
            this.bricks[r][c].x,
            this.bricks[r][c].y,
            this.brick.width,
            this.brick.height
          );
        } else if (this.bricks[r][c].hit === this.maxHit) {
          ctx.drawImage(
            imageBrick,
            this.bricks[r][c].x,
            this.bricks[r][c].y,
            this.brick.width,
            this.brick.height
          );
        }
      }
    }
  }
}
let brick = new Bricks();

//********************BALL CLASS********************
class Ball {
  constructor() {
    this.x = cvs.width / 2;
    this.y = paddle.y - BALL_RADIUS;
    this.radius = BALL_RADIUS;
    this.speed = 3;
    this.dx = 3 * (Math.random() * 2 - 1);
    this.dy = -3;
    this.color = "#363636";
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#2e2e2e";
    ctx.stroke();
    ctx.closePath();
  }
  move() {
    this.x += this.dx;
    this.y += this.dy;
  }
  wallCollision() {
    if (this.x + this.radius > cvs.width) {
      wallHit.play();
      this.dx = -this.dx;
    } else if (this.y - this.radius < 0) {
      wallHit.play();
      this.dy = -this.dy;
    } else if (this.x - this.radius < 0) {
      wallHit.play();
      this.dx = -this.dx;
    } else if (this.y + this.radius > cvs.height) {
      lifeLost.play();
      stats.life--;
      this.reset();
    }
  }
  paddleCollision() {
    if (
      this.y + this.radius > paddle.y &&
      this.y < paddle.y + paddle.height &&
      this.x + this.radius > paddle.x &&
      this.x < paddle.x + paddle.width
    ) {
      paddleHit.play();
      //CHECH WHERE THE BALL HIT THE PADDLE
      let colidePoint = this.x - (paddle.x + paddle.width / 2);
      //WHEN WE SMALL THE NUMBER SO WE CAN USE IT
      colidePoint = colidePoint / (paddle.width / 2);
      let angle = colidePoint * (Math.PI / 3);
      this.dx = this.speed * Math.sin(angle);
      this.dy = -this.speed * Math.cos(angle);
    }
  }

  //BRICKS COLLISION
  bricksCollision() {
    for (let r = 0; r < brick.brick.row; r++) {
      for (let c = 0; c < brick.brick.column; c++) {
        if (brick.bricks[r][c].hit > 0) {
          //IF THE BALL HIT THE BOTTOM
          if (
            this.y - this.radius < brick.bricks[r][c].y + brick.brick.height &&
            this.x + this.radius > brick.bricks[r][c].x + 5 &&
            this.x - this.radius <
              brick.bricks[r][c].x + brick.brick.width - 5 &&
            this.y + this.radius > brick.bricks[r][c].y + 5
          ) {
            //we increase the y
            this.dy = -this.dy;
            console.log("HIT BOTTOM");
            //playsound
            brickHit.play();
            //decrease the hit left
            brick.bricks[r][c].hit--;
            //we increase the score
            stats.score += SCORE_UNIT;
            //we check if the hit left are smaller than 1
            if (brick.bricks[r][c].hit < 1 && stats.gameLevel > 2) {
              action.counter--;
              console.log(action.counter);
              //we check if the counter of actions is zero
              if (action.counter === 0) {
                //we reset counter
                action.counter = 4;
                //start random action generator
                animationFallDown = new AnimationFallDown(
                  brick.bricks[r][c].x,
                  brick.bricks[r][c].y
                );
              }
            }
          } else if (
            this.y + this.radius > brick.bricks[r][c].y &&
            this.y - this.radius < brick.bricks[r][c].y + brick.brick.height &&
            this.x - this.radius < brick.bricks[r][c].x + brick.brick.width &&
            this.x + this.radius > brick.bricks[r][c].x + brick.brick.width - 5
          ) {
            //we increase the x
            this.dx = -this.dx;
            console.log("HIT RIGHT");
            //playsound
            brickHit.play();
            //decrease the hit left
            brick.bricks[r][c].hit--;
            //we increase the score
            stats.score += SCORE_UNIT;
            //we check if the hit left are smaller than 1
            if (brick.bricks[r][c].hit < 1 && stats.gameLevel > 2) {
              action.counter--;
              console.log(action.counter);
              //we check if the counter of actions is zero
              if (action.counter === 0) {
                //we reset counter
                action.counter = 4;
                //start random action generator
                animationFallDown = new AnimationFallDown(
                  brick.bricks[r][c].x,
                  brick.bricks[r][c].y
                );
              }
            }
          } else if (
            this.x + this.radius > brick.bricks[r][c].x + 5 &&
            this.y + this.radius > brick.bricks[r][c].y &&
            this.x - this.radius <
              brick.bricks[r][c].x + brick.brick.width - 5 &&
            this.y - this.radius < brick.bricks[r][c].y + 5
          ) {
            //we decrease the y
            this.dy = -this.dy;
            console.log("HIT TOP");
            //playsound
            brickHit.play();
            //decrease the hit left
            brick.bricks[r][c].hit--;
            //we increase the score
            stats.score += SCORE_UNIT;
            //we check if the hit left are smaller than 1
            if (brick.bricks[r][c].hit < 1 && stats.gameLevel > 2) {
              action.counter--;
              console.log(action.counter);
              //we check if the counter of actions is zero
              if (action.counter === 0) {
                //we reset counter
                action.counter = 4;
                //start random action generator
                animationFallDown = new AnimationFallDown(
                  brick.bricks[r][c].x,
                  brick.bricks[r][c].y
                );
              }
            }
          } else if (
            this.x + this.radius > brick.bricks[r][c].x &&
            this.y + this.radius > brick.bricks[r][c].y &&
            this.y - this.radius < brick.bricks[r][c].y + brick.brick.height &&
            this.x - this.radius < brick.bricks[r][c].x + 5
          ) {
            //we decrease the x
            this.dx = -this.dx;
            console.log("HIT LEFT");
            //playsound
            brickHit.play();
            //decrease the hit left
            brick.bricks[r][c].hit--;
            //we increase the score
            stats.score += SCORE_UNIT;
            //we check if the hit left are smaller than 1
            if (brick.bricks[r][c].hit < 1 && stats.gameLevel > 2) {
              action.counter--;
              console.log(action.counter);
              //we check if the counter of actions is zero
              if (action.counter === 0) {
                //we reset counter
                action.counter = 4;
                //start random action generator
                animationFallDown = new AnimationFallDown(
                  brick.bricks[r][c].x,
                  brick.bricks[r][c].y
                );
              }
            }
          }
        }
      }
    }
  }

  reset() {
    this.x = cvs.width / 2;
    this.y = cvs.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM - BALL_RADIUS;
    this.dx = 3 * (Math.random() * 2 - 1);
    this.dy = -3;
  }
}
let ball = new Ball();

//********* CLASS * ANIMATION  ********************

//create the animation fall down of the random action
class AnimationFallDown {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = BALL_RADIUS + 6;
    this.speed = 3;
    this.dy = 1.5;
  }
  draw() {
    ctx.drawImage(imageMystery, this.x, this.y, 30, 30);
  }
  move() {
    console.log("Animation fal moving");
    this.y += this.dy;
  }
  paddleCollision() {
    if (
      this.y + 30 > paddle.y &&
      this.y < paddle.y + paddle.height &&
      this.x + this.radius > paddle.x &&
      this.x < paddle.x + paddle.width
    ) {
      console.log("HIT THE PADDLE");
      winAudio.play();
      action.actionGenerator();
      animationFallDown = null;
    }
  }
  wallBottomCollision() {
    if (this.y + 30 > cvs.height) {
      console.log("BOTTOM PAS");
      animationFallDown = null;
    }
  }
}
let animationFallDown = null;

//************* CLASS * ACTION *************
// create random action to manipulate the player
class Action {
  constructor() {
    this.counter = 4;
    this.secondBall = "";
  }
  actionGenerator() {
    const randomNuber = Math.round(Math.random()) + 1;
    if (randomNuber === 1) {
      this.paddleShort();
      PADDLE_SHORT = true;
    } else if (randomNuber === 2) {
      this.extraBall();
    }
    console.log("GENERATOR", randomNuber);
  }
  paddleShort() {
    console.log("SHORTING");

    if (paddle.width > 44) {
      paddle.width -= 0.5;
    } else {
      PADDLE_SHORT = false;
    }

    setTimeout(() => this.paddleNormal(), 10000);
  }
  paddleNormal() {
    console.log("NORMAL");
    if (paddle.width < 80) {
      paddle.width += 0.5;
    } else return;
  }
  extraBall() {
    // create new ball with ball constractor
    secondBall = new Ball();
    //  change the color of the new ball
    secondBall.color = "#ea2d23";
    // change the bottom collision of copy ball to avoid lose life
    secondBall.wallCollision = function () {
      if (this.x + this.radius > cvs.width) {
        wallHit.play();
        this.dx = -this.dx;
      } else if (this.y - this.radius < 0) {
        wallHit.play();
        this.dy = -this.dy;
      } else if (this.x - this.radius < 0) {
        wallHit.play();
        this.dx = -this.dx;
      }
    };
    setTimeout(() => (secondBall = null), 15000);
  }
}

let action = new Action();
