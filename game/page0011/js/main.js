const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const nextCanvas = document.getElementById("next");
const nextCtx = nextCanvas.getContext("2d");
let nextType = Math.floor(Math.random()*7)+1;

  
const COLS = 10;
const ROWS = 20;
const BLOCK = 20;

canvas.width = COLS * BLOCK;
canvas.height = ROWS * BLOCK;

const COLORS = [
  null,
  "#00f0f0", // I
  "#0000f0", // J
  "#f0a000", // L
  "#f0f000", // O
  "#00f000", // S
  "#a000f0", // T
  "#f00000"  // Z
];

const SHAPES = [
  [],
  [[1,1,1,1]],
  [[2,0,0],[2,2,2]],
  [[0,0,3],[3,3,3]],
  [[4,4],[4,4]],
  [[0,5,5],[5,5,0]],
  [[0,6,0],[6,6,6]],
  [[7,7,0],[0,7,7]]
];

let board = Array.from({length:ROWS},()=>Array(COLS).fill(0));
let score = 0;

let player = {
  x:0,
  y:0,
  matrix:null
};

function drawBlock(x,y,val){
  ctx.fillStyle = COLORS[val];
  ctx.fillRect(x*BLOCK,y*BLOCK,BLOCK-1,BLOCK-1);
}

function drawGrid(){
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1;
  // 縦線
  for(let x=0; x<=COLS; x++){
    ctx.beginPath();
    ctx.moveTo(x*BLOCK, 0);
    ctx.lineTo(x*BLOCK, ROWS*BLOCK);
    ctx.stroke();
  }
  // 横線
  for(let y=0; y<=ROWS; y++){
    ctx.beginPath();
    ctx.moveTo(0, y*BLOCK);
    ctx.lineTo(COLS*BLOCK, y*BLOCK);
    ctx.stroke();
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawGrid();

  board.forEach((row,y)=>{
    row.forEach((v,x)=>{
      if(v) drawBlock(x,y,v);
    });
  });

  player.matrix.forEach((row,y)=>{
    row.forEach((v,x)=>{
      if(v) drawBlock(player.x+x, player.y+y, v);
    });
  });
}

function collide(){
  return player.matrix.some((row,y)=>
    row.some((v,x)=>{
      if(!v) return false;
      const px = player.x + x;
      const py = player.y + y;
      return py>=ROWS || px<0 || px>=COLS || board[py][px];
    })
  );
}

function merge(){
  player.matrix.forEach((row,y)=>{
    row.forEach((v,x)=>{
      if(v) board[player.y+y][player.x+x] = v;
    });
  });
}

function rotate(mat){
  return mat[0].map((_,i)=>mat.map(r=>r[i]).reverse());
}

function clearLines(){
  outer: for(let y=ROWS-1;y>=0;y--){
    if(board[y].every(v=>v)){
      board.splice(y,1);
      board.unshift(Array(COLS).fill(0));
      score += 100;
      y++;
    }
  }
  scoreEl.textContent = score;
}

function drop(){
  player.y++;
  if(collide()){
    player.y--;
    merge();
    clearLines();
    resetPlayer();
    if(collide()){
      alert("GAME OVER\nScore: "+score);
      board = Array.from({length:ROWS},()=>Array(COLS).fill(0));
      score = 0;
      scoreEl.textContent = score;
    }
  }
}

function hardDrop(){
  while(!collide()){
    player.y++;
  }
  player.y--;
  merge();
  clearLines();
  resetPlayer();
}

function drawNext(){
  nextCtx.clearRect(0,0,nextCanvas.width,nextCanvas.height);

  const matrix = SHAPES[nextType];
  const size = 16;

  matrix.forEach((row,y)=>{
    row.forEach((v,x)=>{
      if(v){
        nextCtx.fillStyle = COLORS[v];
        nextCtx.fillRect(x*size+8, y*size+8, size-1, size-1);
      }
    });
  });
}
  
function resetPlayer(){
  player.matrix = SHAPES[nextType];
  nextType = Math.floor(Math.random()*7)+1;
  drawNext();

  player.y = 0;
  player.x = (COLS/2|0) - (player.matrix[0].length/2|0);
}


let dropCounter = 0;
let dropInterval = 500;
let lastTime = 0;

function update(time=0){
  const delta = time - lastTime;
  lastTime = time;
  dropCounter += delta;
  if(dropCounter > dropInterval){
    drop();
    dropCounter = 0;
  }
  draw();
  requestAnimationFrame(update);
}

document.addEventListener("keydown",e=>{
  if(e.key==="ArrowLeft"){
    player.x--;
    if(collide()){
      player.x++;
    }
  }
  if(e.key==="ArrowRight"){
    player.x++;
    if(collide()){
      player.x--;
    }
  }
  if(e.key==="ArrowDown"){
    drop();
    event.preventDefault();
  }
  if(e.key==="ArrowUp"){
    const old = player.matrix;
    player.matrix = rotate(player.matrix);
    if(collide()){
      player.matrix = old;
    }
    event.preventDefault();
  }
  if(e.code==="Space"){
    hardDrop();
    event.preventDefault();
  }
});

// スマホボタン
document.querySelectorAll(".btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const dir = btn.dataset.dir;
    if(dir==="up"){
      const old = player.matrix;
      player.matrix = rotate(player.matrix);
      if(collide()){
        player.matrix = old;
      }
    }
    if(dir==="down"){
      drop();
    }
    if(dir==="left"){
      player.x--;
      if(collide()){
        player.x++;
      }
    }
    if(dir==="right"){
      player.x++;
      if(collide()){
        player.x--;
      }
    }
    if(dir==="spa"){
      hardDrop();
    }
  });
});
  
drawNext();
resetPlayer();
update();
