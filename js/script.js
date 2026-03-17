const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let board = Array(9).fill(null);
  let current = 'X';
  let over = false;
  let mode = 'pvp';
  let scores = {X:0, O:0, draw:0};
  let cpuThinking = false;

  function setMode(m) {
    mode = m;
    document.getElementById('btn-pvp').className = 'mode-btn'+(m==='pvp'?' active':'');
    document.getElementById('btn-cpu').className = 'mode-btn'+(m==='cpu'?' active':'');
    resetGame();
  }

  function setStatus(txt, color) {
    const el = document.getElementById('ttt-status');
    el.textContent = txt;
    el.style.color = color || '#d4d0c8';
  }

  function render(winLine) {
    document.querySelectorAll('.cell').forEach((cell, i) => {
      const inner = document.getElementById('c'+i);
      const val = board[i];
      cell.className = 'cell'+(val?' taken':'')+(val===('X')?' x-mark':val===('O')?' o-mark':'');
      if (winLine && winLine.includes(i)) cell.className += ' winner-cell';
      inner.textContent = val || '';
    });
    document.getElementById('score-x').textContent = scores.X;
    document.getElementById('score-o').textContent = scores.O;
    document.getElementById('score-draw').textContent = scores.draw;
  }

  function checkWinner(b) {
    for (const [a,c,d] of WINS) {
      if (b[a] && b[a]===b[c] && b[a]===b[d]) return {winner:b[a], line:[a,c,d]};
    }
    if (b.every(v=>v)) return {winner:'draw', line:[]};
    return null;
  }

  function play(i) {
    if (over || board[i] || cpuThinking) return;
    board[i] = current;
    const result = checkWinner(board);
    if (result) {
      render(result.line);
      over = true;
      if (result.winner==='draw') { scores.draw++; setStatus('Empate!'); }
      else { scores[result.winner]++; setStatus(result.winner+' venceu!', result.winner==='X'?'#E24B4A':'#378ADD'); }
      return;
    }
    current = current==='X'?'O':'X';
    render();
    if (mode==='cpu' && current==='O') { setStatus('CPU pensando...'); cpuThinking=true; setTimeout(cpuMove,450); }
    else setStatus('Vez do '+current);
  }

  function minimax(b, isMax) {
    const r = checkWinner(b);
    if (r) { if(r.winner==='O') return 10; if(r.winner==='X') return -10; return 0; }
    const sc = [];
    for (let i=0;i<9;i++) {
      if (!b[i]) { b[i]=isMax?'O':'X'; sc.push(minimax(b,!isMax)); b[i]=null; }
    }
    return isMax ? Math.max(...sc) : Math.min(...sc);
  }

  function cpuMove() {
    let best=-Infinity, idx=-1;
    for (let i=0;i<9;i++) {
      if (!board[i]) { board[i]='O'; const s=minimax(board,false); board[i]=null; if(s>best){best=s;idx=i;} }
    }
    cpuThinking=false;
    if (idx>=0) play(idx);
  }

  function resetGame() {
    board=Array(9).fill(null); current='X'; over=false; cpuThinking=false;
    render(); setStatus('Vez do X');
  }

  render();