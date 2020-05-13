//CREATE BRICKS ARRAY
brick.hit++;
brick.maxHit++;
brick.create();
stats.score = Number(localStorage.getItem("score"));
stats.life = Number(localStorage.getItem("life"));
stats.gameLevel = Number(localStorage.getItem("level"));

console.log(brick.maxHit);

//************MAIN FUNCTIONS THAT LOOP ALL THE GAME***************

function draw() {
  //BACKGROUND IMAGE
  ctx.drawImage(image, 0, 0, 400, 500);

  paddle.draw();

  ball.draw();

  brick.draw();

  //STATS DRAW
  stats.draw();
}

function update() {
  paddle.move();

  ball.paddleCollision();
  ball.move();
  ball.wallCollision();
  ball.bricksCollision();

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
