//LEVEL 3 GAME SET UP
ball.speed += 0.2;
brick.maxHit = 2;
brick.hit = 2;
brick.create();
stats.score = Number(localStorage.getItem("score"));
stats.life = Number(localStorage.getItem("life"));
stats.gameLevel = Number(localStorage.getItem("level"));

console.log(brick.maxHit);
console.log(brick.hit);

//************MAIN FUNCTIONS THAT LOOP ALL THE GAME***************

function draw() {
  //BACKGROUND IMAGE
  ctx.drawImage(image, 0, 0, 400, 500);

  paddle.draw();

  ball.draw();

  secondBall ? secondBall.draw() : null;

  animationFallDown ? animationFallDown.draw() : null;

  brick.draw();

  //STATS DRAW
  stats.draw();
}

function update() {
  paddle.move();
  PADDLE_SHORT ? action.paddleShort() : null;

  ball.paddleCollision();
  ball.move();
  ball.wallCollision();
  ball.bricksCollision();

  secondBall
    ? secondBall.paddleCollision() +
      secondBall.move() +
      secondBall.wallCollision() +
      secondBall.bricksCollision()
    : null;

  animationFallDown
    ? animationFallDown.move() + animationFallDown.paddleCollision()
    : null;

  animationFallDown ? animationFallDown.wallBottomCollision() : null;

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

console.log(ball);
