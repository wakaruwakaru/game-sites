const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 15;

let snake, apple, vx, vy, score;
let interval;
let speed = 120;

// 初期化
function resetGame() {
  snake = [{x:150, y:150}];
  apple = randApple();
  vx = grid;
  vy = 0;
  score = 0;
  document.getElementById("score").textContent = "Score: 0";
  
  if (interval) clearInterval(interval);
  interval = setInterval(loop, speed);
}

function randApple() {
  return {
    x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
    y: Math.floor(Math.random() * (canvas.height / grid)) * grid
  };
}

function gameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "#f00";
  ctx.font = "30px Arial";
  ctx.fillText("GAME OVER", 50, 150);

  setTimeout(resetGame, 1500);
}

function loop() {
  const head = {x: snake[0].x + vx, y: snake[0].y + vy};

  // 壁衝突 → ゲームオーバー
  if (head.x < 0 || head.x >= canvas.width ||
      head.y < 0 || head.y >= canvas.height) {
    gameOver();
    return;
  }

  // 自分にぶつかった？
  if (snake.some(p => p.x === head.x && p.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // りんごを食べた？
  if (head.x === apple.x && head.y === apple.y) {
    apple = randApple();
    score++;
    document.getElementById("score").textContent = "Score: " + score;
  } else {
    snake.pop();
  }

  // 描画
  ctx.fillStyle = "#222";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // スネーク
  ctx.fillStyle = "#0f0";
  snake.forEach(p => ctx.fillRect(p.x,p.y,grid-1,grid-1));

  // りんご
  ctx.fillStyle = "red";
  ctx.fillRect(apple.x, apple.y, grid-1, grid-1);
}

// スピード調整
document.getElementById("speed").addEventListener("input", e=>{
  speed = Number(e.target.value);
  document.getElementById("speedVal").textContent = speed + "ms";
  clearInterval(interval);
  interval = setInterval(loop, speed);
});

// キーボード操作
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && vy === 0) {vx=0;vy=-grid;}
  if (e.key === "ArrowDown" && vy === 0) {vx=0;vy=grid;}
  if (e.key === "ArrowLeft" && vx === 0) {vx=-grid;vy=0;}
  if (e.key === "ArrowRight" && vx === 0) {vx=grid;vy=0;}
});

// スマホボタン
document.querySelectorAll(".btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const dir = btn.dataset.dir;
    if (dir==="up" && vy===0) {vx=0;vy=-grid;}
    if (dir==="down" && vy===0) {vx=0;vy=grid;}
    if (dir==="left" && vx===0) {vx=-grid;vy=0;}
    if (dir==="right" && vx===0) {vx=grid;vy=0;}
  });
});

// ゲーム開始
resetGame();
