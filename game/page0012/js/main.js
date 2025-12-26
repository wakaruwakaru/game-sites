let newTile = null;
let mergedTiles = [];

const grid = document.getElementById("grid");
let board = Array(4).fill().map(()=>Array(4).fill(0));

function addRandom(){
  let empty=[];
  for(let y=0;y<4;y++){
    for(let x=0;x<4;x++){
      if(board[y][x]==0) empty.push({x,y});
    }
  }
  if(empty.length==0) return;
  const {x,y} = empty[Math.floor(Math.random()*empty.length)];
  board[y][x] = Math.random()<0.9?2:4;
  newTile = {x,y};
}

function draw(){
  grid.innerHTML="";
  for(let y=0;y<4;y++){
    for(let x=0;x<4;x++){
      const v=board[y][x];
      const d=document.createElement("div");
      d.className="cell";
      if(v){
        d.textContent=v;
        d.classList.add("v"+v);

        if(newTile && newTile.x==x && newTile.y==y){
          d.classList.add("new");
        }
      }
      grid.appendChild(d);
    }
  }
  newTile=null;
}

function slide(row){
  let result=[];
  for(let i=0;i<row.length;i++){
    if(row[i]==0) continue;
    if(result.length && result[result.length-1]==row[i]){
      result[result.length-1]*=2;
      mergedTiles.push(result.length-1);
    }else{
      result.push(row[i]);
    }
  }
  return result;
}

function move(dir){
  let moved=false;
  for(let i=0;i<4;i++){
    let line=[];
    for(let j=0;j<4;j++){
      if(dir=="left"||dir=="right")
        line.push(board[i][dir=="left"?j:3-j]);
      else
        line.push(board[dir=="up"?j:3-j][i]);
    }
    let merged=slide(line);
    while(merged.length<4) merged.push(0);

    for(let j=0;j<4;j++){
      let v = merged[j];
      let y = (dir=="up"?j:dir=="down"?3-j:i);
      let x = (dir=="left"?j:dir=="right"?3-j:i);
      if(board[y][x]!=v){
        board[y][x]=v;
        moved=true;
      }
    }
  }
  if(moved){
    addRandom();
    draw();
  }
}

addRandom();
addRandom();
draw();

// keyboard
document.addEventListener("keydown",e=>{
  if(e.key=="ArrowLeft") move("left");
  if(e.key=="ArrowRight") move("right");
  if(e.key=="ArrowUp") move("up");
  if(e.key=="ArrowDown") move("down");
});

// swipe
let sx=0,sy=0;
grid.addEventListener("touchstart",e=>{
  sx=e.touches[0].clientX;
  sy=e.touches[0].clientY;
});
grid.addEventListener("touchend",e=>{
  let dx=e.changedTouches[0].clientX-sx;
  let dy=e.changedTouches[0].clientY-sy;
  if(Math.abs(dx)>Math.abs(dy)){
    if(dx>30) move("right");
    if(dx<-30) move("left");
  }else{
    if(dy>30) move("down");
    if(dy<-30) move("up");
  }
});
