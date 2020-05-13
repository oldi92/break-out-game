//CREATE BRICKS ARRAY
brick.create();

console.log(brick.maxHit);

//************MAIN FUNCTIONS THAT LOOP ALL THE GAME***************

function draw() {
  //BACKGROUND IMAGE
  ctx.drawImage(image, 0, 0, 400, 500);

  //PADDLE DRAW
  paddle.draw();

  //BALL DRAW
  ball.draw();

  //BRICK DRAW
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
