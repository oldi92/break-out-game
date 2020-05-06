const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

//DEFINE THE VARIABLES
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;
let leftArrow;
let rightArrow;
const BALL_RADIUS = 8;
let LIFE = 3;
let bricks = new Array([], []);
let SCORE = 0;
let SCORE_UNIT = 10;
let LEVEL = 1;
let GAME_OVER = false;
let MAX_LEVEL = 4;

/****************SET *************/

//SET BACKGROUND IMAGE
image = new Image();
image.src = "./images/background.jpg";

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

//SET PADDLE
const paddle = {
  x: cvs.width / 2 - PADDLE_WIDTH / 2,
  y: cvs.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5,
};

//SET BRICK
const brick = {
  row: 2,
  column: 5,
  width: 55,
  height: 20,
  offSetLeft: 20,
  offSetTop: 20,
  marginTop: 20,
  fillColor: "#800000",
  strokeColor: "rgb(40,40,40)",
};

function createBricks() {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y:
          r * (brick.offSetTop + brick.height) +
          brick.offSetTop +
          brick.marginTop,
        status: true,
      };
    }
  }
}

createBricks();

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

//SET BALL
const ball = {
  x: cvs.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 3,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
};

/****************DRAW *************/

//DRAW GAME STATS
function showGameStats(text, textX, textY, img, imgX, imgY) {
  //draw text
  (ctx.fillStyle = "#FFF"), (ctx.font = "25px Germania One");
  ctx.fillText(text, textX, textY);

  //draw image
  ctx.drawImage(img, imgX, imgY, 25, 25);
}

// DRAW BRICKS
function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      if (bricks[r][c].status) {
        ctx.fillStyle = brick.fillColor;
        ctx.fillRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
        ctx.strokeStyle = brick.strokeColor;
        ctx.strokeRect(
          bricks[r][c].x,
          bricks[r][c].y,
          brick.width,
          brick.height
        );
      }
    }
  }
}

//DRAW PADDLE
function drawPaddle() {
  ctx.fillStyle = "#2e2e2e";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.strokeStyle = "#3936ff";
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

//DRAW BALL
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#3936ff";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#2e2e2e";
  ctx.stroke();
  ctx.closePath();
}

/****************UPDATE *************/

//MOVE PADDLE
function movePaddle() {
  if (leftArrow && paddle.x > cvs.width - cvs.width) {
    paddle.x -= paddle.dx;
  } else if (rightArrow && paddle.x + paddle.width < cvs.width) {
    paddle.x += paddle.dx;
  }
}
//MOVE BALL
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

//BALL BRICKS COLLISION
function ballBricksCollision() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      if (bricks[r][c].status) {
        if (
          ball.y + ball.radius > bricks[r][c].y &&
          ball.x + ball.radius > bricks[r][c].x &&
          ball.y - ball.radius < bricks[r][c].y + brick.height &&
          ball.x - ball.radius < bricks[r][c].x + brick.width
        ) {
          brickHit.play();
          ball.dy = -ball.dy;
          bricks[r][c].status = false;
          SCORE += SCORE_UNIT;
        }
      }
    }
  }
}

//BALL PADDLE COLLISION
function ballPaddleCollision() {
  if (
    ball.y + ball.radius > paddle.y &&
    ball.y < paddle.y + paddle.height &&
    ball.x + ball.radius > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    paddleHit.play();
    //CHECH WHERE THE BALL HIT THE PADDLE
    let colidePoint = ball.x - (paddle.x + paddle.width / 2);
    //WHEN WE SMALL THE NUMBER SO WE CAN USE IT
    colidePoint = colidePoint / (paddle.width / 2);
    let angle = colidePoint * (Math.PI / 3);
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
}

//BALL WALL COLLISION
function ballWallCollision() {
  if (ball.x + ball.radius > cvs.width) {
    wallHit.play();
    ball.dx = -ball.dx;
  } else if (ball.y - ball.radius < 0) {
    wallHit.play();
    ball.dy = -ball.dy;
  } else if (ball.x - ball.radius < 0) {
    wallHit.play();
    ball.dx = -ball.dx;
  } else if (ball.y + ball.radius > cvs.height) {
    lifeLost.play();
    LIFE--;
    ballRest();
  }
}

//RESET THE BALL
function ballRest() {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
}

//LEVEL UP FUNCTION
function levelUp() {
  let isLevelDone = true;

  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      isLevelDone = isLevelDone && !bricks[r][c].status;
    }
  }

  if (isLevelDone) {
    if (LEVEL > MAX_LEVEL) {
      GAME_OVER = true;
    }
    winAudio.play();
    brick.row++;
    createBricks();
    ball.speed += 0.5;
    ballRest();
    LEVEL++;
  }
}

//GAME OVER FUNCTION
function gameOver() {
  if (LIFE <= 0) {
    lifeLost.play();
    GAME_OVER = true;
  }
}

//************MAIN FUNCTIONS THAT LOOP ALL THE GAME***************

function draw() {
  //DRAW BACKGROUND IMAGE
  ctx.drawImage(image, 0, 0, 400, 500);

  drawPaddle();
  drawBall();
  drawBricks();

  //SHOW SCORE
  showGameStats(SCORE, 35, 25, imageScore, 5, 5);
  //SHOW LIFES
  showGameStats(LIFE, cvs.width - 25, 25, imageLife, cvs.width - 55, 5);
  //SHOW LEVEL
  showGameStats(LEVEL, cvs.width / 2, 25, imageLevel, cvs.width / 2 - 30, 5);
}

function update() {
  movePaddle();
  ballPaddleCollision();

  moveBall();
  ballWallCollision();
  ballBricksCollision();

  levelUp();

  gameOver();
}

function loop() {
  draw();

  update();

  if (!GAME_OVER) {
    requestAnimationFrame(loop);
  }
}

loop();
