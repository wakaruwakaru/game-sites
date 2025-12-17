(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width, H = canvas.height;

  // UI elements
  const startBtn = document.getElementById('startBtn');
  const livesEl = document.getElementById('lives');
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');
  const highscoreEl = document.getElementById('highscore');
  const speedInput = document.getElementById('speed');
  const paddleWInput = document.getElementById('paddleW');
  const soundToggle = document.getElementById('soundToggle');
  const resetBtn = document.getElementById('resetBtn');

  // Game state
  let paddle = {w:140,h:12,x:W/2-70,y:H-36,dx:0};
  let ball = {x:W/2,y:H-60,r:9,dx:4,dy:-4,stuck:true};
  let bricks = [];
  let rows=5, cols=9, brickW=72, brickH=20, brickPadding=8, brickOffsetTop=60, brickOffsetLeft=32;
  let score=0, lives=3, level=1, highscore=0;
  let leftDown=false, rightDown=false;
  let rafId=null;

  // load highscore
  try{ highscore = parseInt(localStorage.getItem('breakout_highscore')) || 0; }catch(e){ highscore=0 }
  highscoreEl.textContent = highscore;

  // sounds (very small synth tones using WebAudio)
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  function beep(freq, duration=0.06, gain=0.08){ if(!soundToggle.checked) return; const o=audioCtx.createOscillator(); const g=audioCtx.createGain(); o.type='sine'; o.frequency.value=freq; g.gain.value=gain; o.connect(g); g.connect(audioCtx.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+duration); setTimeout(()=>o.stop(),duration*1000); }

  function buildBricks(){
    bricks = [];
    const colsFit = cols;
    for(let c=0;c<colsFit;c++){
      bricks[c]=[];
      for(let r=0;r<rows;r++){
        const x = c*(brickW+brickPadding)+brickOffsetLeft;
        const y = r*(brickH+brickPadding)+brickOffsetTop;
        bricks[c][r] = {x,y,w:brickW,h:brickH,status:1, hits:1};
      }
    }
  }

  function resetBall(){
    ball.x = paddle.x + paddle.w/2;
    ball.y = paddle.y - ball.r - 1;
    ball.dx = (speedInput.value/4) * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -(speedInput.value/4);
    ball.stuck = true;
  }

  function resetGame(full=true){
    paddle.w = parseInt(paddleWInput.value);
    paddle.x = W/2 - paddle.w/2;
    score = 0; lives = 3; level = 1;
    rows = 4 + Math.min(6, level+1);
    buildBricks();
    resetBall();
    updateUI();
    draw();
  }

  function updateUI(){
    livesEl.textContent = lives;
    scoreEl.textContent = score;
    levelEl.textContent = level;
    highscoreEl.textContent = highscore;
  }

  function drawRoundedRect(x,y,w,h,r){
    ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); ctx.fill();
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    // background glow
    const g = ctx.createRadialGradient(W/2,H/2,20,W/2,H/2,Math.max(W,H));
    g.addColorStop(0,'rgba(102,224,255,0.06)'); g.addColorStop(1,'rgba(200,200,200,0.4)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

    // bricks
    for(let c=0;c<bricks.length;c++){
      for(let r=0;r<bricks[c].length;r++){
        const b = bricks[c][r]; if(!b || b.status==0) continue;
        const hue = 200 - r*12 + c*3;
        ctx.fillStyle = `hsl(${hue} 80% 60% / 1)`;
        drawRoundedRect(b.x,b.y,b.w,b.h,6);
        // inner shine
        ctx.fillStyle = `rgba(255,255,255,0.06)`;
        ctx.fillRect(b.x+6,b.y+6,b.w-12,b.h/2);
      }
    }

    // paddle
    ctx.fillStyle = 'linear-gradient(90deg,#66e0ff,#ffd166)';
    ctx.save(); ctx.shadowColor='rgba(102,224,255,0.25)'; ctx.shadowBlur=18;
    ctx.fillStyle='rgba(102,224,255,0.8)'; drawRoundedRect(paddle.x,paddle.y,paddle.w,paddle.h,8);
    ctx.restore();

    // ball
    const grad = ctx.createRadialGradient(ball.x-3,ball.y-3,2,ball.x,ball.y,ball.r);
    grad.addColorStop(0,'#fff'); grad.addColorStop(1,'#66e0ff'); ctx.fillStyle=grad;
    ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();

    // HUD
    ctx.fillStyle='rgba(230,238,248,0.06)'; ctx.font='13px system-ui'; ctx.fillText('Score: '+score,10,20);
    ctx.fillText('Lives: '+lives,10,40);
  }

  function collide(){
    // wall
    if(ball.x + ball.dx + ball.r > W || ball.x + ball.dx - ball.r < 0){ ball.dx = -ball.dx; beep(520); }
    if(ball.y + ball.dy - ball.r < 0){ ball.dy = -ball.dy; beep(660); }

    // paddle
    if(ball.y + ball.dy + ball.r > paddle.y){
      if(ball.x > paddle.x && ball.x < paddle.x + paddle.w){
        // move based on hit position
        const collidePoint = ball.x - (paddle.x + paddle.w/2);
        const normalized = collidePoint / (paddle.w/2);
        const maxAngle = Math.PI/3; // 60deg
        const angle = normalized * maxAngle;
        const speed = Math.sqrt(ball.dx*ball.dx + ball.dy*ball.dy);
        ball.dx = speed * Math.sin(angle);
        ball.dy = -Math.abs(speed * Math.cos(angle));
        ball.y = paddle.y - ball.r - 1;
        beep(900);
      }
    }

    // bricks collision
    for(let c=0;c<bricks.length;c++){
      for(let r=0;r<bricks[c].length;r++){
        const b = bricks[c][r]; if(!b || b.status==0) continue;
        if(ball.x > b.x && ball.x < b.x + b.w && ball.y > b.y && ball.y < b.y + b.h){
          ball.dy = -ball.dy;
          b.status = 0; score += 10; beep(1200);
          if(score > highscore){ highscore = score; try{ localStorage.setItem('breakout_highscore', highscore); }catch(e){} }
          updateUI();
        }
      }
    }
  }

  function update(){
    // paddle movement by keys
    if(leftDown) paddle.x -= 8; if(rightDown) paddle.x += 8;
    // keep paddle inside
    paddle.x = Math.max(6, Math.min(W - paddle.w - 6, paddle.x));

    // ball follow paddle when stuck
    if(ball.stuck){ ball.x = paddle.x + paddle.w/2; ball.y = paddle.y - ball.r - 1; }
    else{
      ball.x += ball.dx; ball.y += ball.dy;
    }

    collide();

    // ball out
    if(ball.y - ball.r > H){
      lives--; beep(120);
      if(lives <= 0){
        // game over
        if(score > highscore){ highscore = score; try{ localStorage.setItem('breakout_highscore', highscore); }catch(e){} }
        updateUI();
        cancelAnimationFrame(rafId);
        alert('ゲームオーバー！ スコア: '+score);
        resetGame();
        startLoop();
        return;
      }else{
        resetBall();
      }
      updateUI();
    }

    // check level clear
    const remaining = bricks.flat().filter(b=>b && b.status==1).length;
    if(remaining === 0){
      // next level
      level++; score += 50; rows = Math.min(8, rows+1);
      buildBricks(); resetBall(); updateUI();
    }

    // apply friction to dx for subtle smoothing
    ball.dx *= 1.0001;
  }

  function loop(){
    update(); draw();
    rafId = requestAnimationFrame(loop);
  }

  function startLoop(){
    if(rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }

  // controls
  document.addEventListener('keydown', e => { if(e.key==='ArrowLeft') leftDown=true; if(e.key==='ArrowRight') rightDown=true; if(e.key===' '){ if(ball.stuck){ ball.stuck=false; } } });
  document.addEventListener('keyup', e => { if(e.key==='ArrowLeft') leftDown=false; if(e.key==='ArrowRight') rightDown=false; });
  canvas.addEventListener('mousemove', e => { const rect = canvas.getBoundingClientRect(); const mx = e.clientX - rect.left; paddle.x = mx - paddle.w/2; });
  canvas.addEventListener('click', e => { if(ball.stuck) ball.stuck=false; });

  // touch support
  let ongoingTouch = false;
  canvas.addEventListener('touchstart', e => { ongoingTouch = true; const t = e.touches[0]; const rect = canvas.getBoundingClientRect(); paddle.x = t.clientX - rect.left - paddle.w/2; if(ball.stuck) ball.stuck=false; });
  canvas.addEventListener('touchmove', e => { e.preventDefault(); const t = e.touches[0]; const rect = canvas.getBoundingClientRect(); paddle.x = t.clientX - rect.left - paddle.w/2; });
  canvas.addEventListener('touchend', e => { ongoingTouch = false; });

  // UI interactions
  startBtn.addEventListener('click', ()=>{ try{ audioCtx.resume(); }catch(e){} if(!rafId) startLoop(); if(ball.stuck) ball.stuck=false; });
  resetBtn.addEventListener('click', ()=>{ if(confirm('本当にリセットしますか？')){ resetGame(); } });
  speedInput.addEventListener('input', ()=>{ const sp = parseFloat(speedInput.value)/4; const sign = Math.sign(ball.dy) || -1; ball.dx = sp * (Math.sign(ball.dx)||1); ball.dy = Math.abs(sp) * sign; });
  paddleWInput.addEventListener('input', ()=>{ paddle.w = parseInt(paddleWInput.value); paddle.x = Math.max(6, Math.min(W - paddle.w - 6, paddle.x)); });

  // resize handling (keep canvas responsive)
  function fitCanvas(){
    const maxW = Math.min(window.innerWidth - 120, 960);
    const ratio = 720/480;
    const newW = Math.max(360, Math.min(maxW, 720));
    const newH = Math.round(newW / ratio);
    canvas.width = W = newW; canvas.height = H = newH;
    paddle.y = H - 36; paddle.x = Math.max(6, Math.min(W - paddle.w - 6, paddle.x));
    resetBall(); draw();
  }
  window.addEventListener('resize', fitCanvas);

  // init
  buildBricks(); resetGame(); fitCanvas(); startLoop();
})();
