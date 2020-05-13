//GET CANVAS
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

//GET THE WIN DIV
const compeleGame = document.getElementById("win");
compeleGame.addEventListener("click", () => location.reload());

//GET THE LOSE DIV
const loseGame = document.getElementById("lose");
loseGame.addEventListener("click", () => location.reload());

//DEFINE THE VARIABLES
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;
let leftArrow;
let rightArrow;
const BALL_RADIUS = 8;
let SCORE_UNIT = 10;
let GAME_OVER = false;
let MAX_LEVEL = 4;

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

//PADDLE CLASS
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

//LEVEL UP FUNCTION
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

///CLASS STATS
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

// CLASS BRICKS
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
        console.log(this.bricks[r][c].hit - this.bricks[r][c].hit);
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

//BALL CLASS
class Ball {
  constructor() {
    this.x = cvs.width / 2;
    this.y = paddle.y - BALL_RADIUS;
    this.radius = BALL_RADIUS;
    this.speed = 3;
    this.dx = 3 * (Math.random() * 2 - 1);
    this.dy = -3;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#363636";
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
          if (
            this.y + this.radius > brick.bricks[r][c].y &&
            this.x + this.radius > brick.bricks[r][c].x &&
            this.y - this.radius < brick.bricks[r][c].y + brick.brick.height &&
            this.x - this.radius < brick.bricks[r][c].x + brick.brick.width
          ) {
            console.log(brick.bricks[r][c].hit);

            brickHit.play();
            this.dy = -this.dy;
            brick.bricks[r][c].hit--;
            stats.score += SCORE_UNIT;
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
