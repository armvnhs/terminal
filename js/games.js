/* Terminal games */

function isQuit(e) {
  return e.key === 'Escape' || e.key === 'q' || (e.ctrlKey && e.key.toLowerCase() === 'c');
}

/* ── Snake ────────────────────────────────────────────────── */
async function snake(io) {
  const t = io.term;
  const W = 32, H = 15;
  t.html('<div class="game-head"><b>SNAKE</b> — arrow keys or WASD · quit: q</div>');

  const box = t.mount('game-wrap');
  const head = document.createElement('div');
  head.className = 'game-head';
  const pre = document.createElement('pre');
  pre.className = 'game-pre';
  box.append(head, pre);

  let snakeArr = [{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }];
  let dx = 1, dy = 0;
  let food = randFood();
  let score = 0;
  let dead = false;
  let quit = false;

  function randFood() {
    let p;
    do {
      p = { x: 1 + Math.floor(Math.random() * (W - 2)), y: 1 + Math.floor(Math.random() * (H - 2)) };
    } while (snakeArr.some((s) => s.x === p.x && s.y === p.y));
    return p;
  }

  function draw() {
    const grid = Array.from({ length: H }, () => Array(W).fill(' '));
    for (let x = 0; x < W; x++) { grid[0][x] = '─'; grid[H - 1][x] = '─'; }
    for (let y = 0; y < H; y++) { grid[y][0] = '│'; grid[y][W - 1] = '│'; }
    grid[0][0] = '┌'; grid[0][W - 1] = '┐'; grid[H - 1][0] = '└'; grid[H - 1][W - 1] = '┘';
    grid[food.y][food.x] = '●';
    snakeArr.forEach((s, i) => { grid[s.y][s.x] = i === 0 ? '◆' : '▪'; });
    pre.textContent = grid.map((r) => r.join('')).join('\n');
    head.textContent = `SCORE ${score}   ·   LENGTH ${snakeArr.length}   ·   q to quit`;
  }

  draw();

  const release = t.captureKeys((e) => {
    if (isQuit(e)) { e.preventDefault(); quit = true; return; }
    const map = {
      ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
      w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
    };
    const m = map[e.key];
    if (m) {
      e.preventDefault();
      if (m[0] === -dx && m[1] === -dy) return;
      dx = m[0]; dy = m[1];
    }
  });

  await new Promise((resolve) => {
    const timer = setInterval(() => {
      if (quit) { clearInterval(timer); resolve(); return; }
      const nx = snakeArr[0].x + dx;
      const ny = snakeArr[0].y + dy;
      if (nx <= 0 || nx >= W - 1 || ny <= 0 || ny >= H - 1 || snakeArr.some((s) => s.x === nx && s.y === ny)) {
        dead = true;
        clearInterval(timer);
        resolve();
        return;
      }
      snakeArr.unshift({ x: nx, y: ny });
      if (nx === food.x && ny === food.y) {
        score += 10;
        food = randFood();
      } else {
        snakeArr.pop();
      }
      draw();
      t.scrollDown();
    }, Math.max(75, 150 - snakeArr.length * 2));
  });

  release();
  if (quit && !dead) t.print('Game abandoned. 🐍', 'dim');
  else {
    t.print(`💀 You hit the wall. Score: ${score} — length: ${snakeArr.length}`, 'err');
    t.print(score >= 100 ? 'Nice run. Play again: snake' : 'Try again: snake', 'dim');
  }
}

/* ── 2048 ─────────────────────────────────────────────────── */
async function g2048(io) {
  const t = io.term;
  t.html('<div class="game-head"><b>2048</b> — arrow keys to slide · merge 1024 or 2048 to win · quit: q</div>');

  const box = t.mount('game-wrap');
  const head = document.createElement('div');
  head.className = 'game-head';
  const grid = document.createElement('div');
  grid.className = 'g2048';
  const cells = [];
  for (let i = 0; i < 16; i++) {
    const c = document.createElement('div');
    c.className = 'tile empty';
    grid.appendChild(c);
    cells.push(c);
  }
  box.append(head, grid);

  let board = Array.from({ length: 4 }, () => Array(4).fill(0));
  let score = 0;
  let quit = false;
  let over = false;

  const addRandom = () => {
    const empty = [];
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) if (!board[y][x]) empty.push([y, x]);
    if (!empty.length) return;
    const [y, x] = empty[Math.floor(Math.random() * empty.length)];
    board[y][x] = Math.random() < 0.9 ? 2 : 4;
  };

  const render = () => {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const v = board[y][x];
        const cell = cells[y * 4 + x];
        cell.textContent = v || '';
        cell.className = 'tile' + (v ? ` big` : ' empty');
        if (v) cell.dataset.v = String(v);
        else delete cell.dataset.v;
      }
    }
    head.textContent = `SCORE ${score}   ·   merge 1024 or 2048 to win`;
  };

  const slide = (row) => {
    const vals = row.filter((v) => v);
    const out = [];
    let gained = 0;
    for (let i = 0; i < vals.length; i++) {
      if (vals[i] === vals[i + 1]) { out.push(vals[i] * 2); gained += vals[i] * 2; i++; }
      else out.push(vals[i]);
    }
    while (out.length < 4) out.push(0);
    return { row: out, gained };
  };

  const move = (dir) => {
    const before = JSON.stringify(board);
    let gained = 0;
    for (let i = 0; i < 4; i++) {
      let line;
      if (dir === 'left') line = board[i];
      else if (dir === 'right') line = [...board[i]].reverse();
      else if (dir === 'up') line = board.map((r) => r[i]);
      else line = board.map((r) => r[i]).reverse();

      const res = slide(line);
      gained += res.gained;
      if (dir === 'left') board[i] = res.row;
      else if (dir === 'right') board[i] = [...res.row].reverse();
      else if (dir === 'up') res.row.forEach((v, y) => { board[y][i] = v; });
      else res.row.forEach((v, y) => { board[3 - y][i] = v; });
    }
    if (JSON.stringify(board) === before) return;
    score += gained;
    addRandom();
    render();
    t.scrollDown();
    if (board.flat().includes(2048)) {
      over = true;
      t.print('🏆 2048! You win. Go outside now.', 'ok');
    } else if (isStuck()) {
      over = true;
      t.print(`Game over. Score: ${score}`, 'err');
    }
  };

  const isStuck = () => {
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      if (!board[y][x]) return false;
      if (x < 3 && board[y][x] === board[y][x + 1]) return false;
      if (y < 3 && board[y][x] === board[y + 1][x]) return false;
    }
    return true;
  };

  addRandom();
  addRandom();
  render();

  const release = t.captureKeys((e) => {
    if (over) return;
    if (isQuit(e)) { e.preventDefault(); quit = true; return; }
    const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down' };
    if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
  });

  await new Promise((resolve) => {
    const timer = setInterval(() => {
      if (quit || over) { clearInterval(timer); resolve(); }
    }, 90);
  });
  release();
  if (quit) t.print(`Game abandoned. Score: ${score}`, 'dim');
  else t.print('Play again: 2048', 'dim');
}

/* ── Tic Tac Toe ──────────────────────────────────────────── */
async function ttt(io) {
  const t = io.term;
  t.html('<div class="game-head"><b>TIC TAC TOE</b> — you are ✕ · click a square or press 1-9 · quit: q</div>');

  const box = t.mount('game-wrap');
  const head = document.createElement('div');
  head.className = 'game-head';
  const grid = document.createElement('div');
  grid.className = 'ttt';
  const cells = [];
  for (let i = 0; i < 9; i++) {
    const c = document.createElement('div');
    c.className = 'cell';
    c.dataset.i = String(i);
    grid.appendChild(c);
    cells.push(c);
  }
  box.append(head, grid);

  let board = Array(9).fill('');
  let finished = false;
  let quit = false;

  const WINS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const winner = (b) => {
    for (const [a, c, d] of WINS) if (b[a] && b[a] === b[c] && b[a] === b[d]) return { mark: b[a], line: [a, c, d] };
    return b.every((v) => v) ? { mark: 'tie' } : null;
  };

  const render = (win) => {
    board.forEach((v, i) => {
      const cell = cells[i];
      cell.textContent = v === 'X' ? '✕' : v === 'O' ? '◯' : '';
      cell.className = 'cell' + (v === 'X' ? ' me' : v === 'O' ? ' ai' : '') + (win?.line?.includes(i) ? ' win' : '');
    });
    head.textContent = finished ? '' : 'your move ✕';
  };

  const minimax = (b, isAi) => {
    const w = winner(b);
    if (w) return w.mark === 'O' ? 10 : w.mark === 'X' ? -10 : 0;
    let best = isAi ? -Infinity : Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i]) continue;
      b[i] = isAi ? 'O' : 'X';
      const s = minimax(b, !isAi);
      b[i] = '';
      best = isAi ? Math.max(best, s) : Math.min(best, s);
    }
    return best;
  };

  const aiMove = () => {
    let bestScore = -Infinity;
    let choice = -1;
    for (let i = 0; i < 9; i++) {
      if (board[i]) continue;
      board[i] = 'O';
      const s = minimax(board, false) + Math.random() * 0.4;
      board[i] = '';
      if (s > bestScore) { bestScore = s; choice = i; }
    }
    if (choice >= 0) board[choice] = 'O';
  };

  const finish = (w) => {
    finished = true;
    render(w);
    if (w.mark === 'X') t.print('🏆 You win. Well played.', 'ok');
    else if (w.mark === 'O') t.print('🤖 You lose. The computer is not happy, it just calculated.', 'err');
    else t.print('🤝 A draw.', 'warn');
    t.print('Play again: ttt', 'dim');
  };

  const play = (i) => {
    if (finished || board[i]) return;
    board[i] = 'X';
    let w = winner(board);
    if (w) { finish(w); return; }
    aiMove();
    w = winner(board);
    if (w) { finish(w); return; }
    render();
  };

  grid.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (cell) play(Number(cell.dataset.i));
  });

  render();

  const release = t.captureKeys((e) => {
    if (finished) return;
    if (isQuit(e)) { e.preventDefault(); quit = true; return; }
    const n = '123456789'.indexOf(e.key);
    if (n >= 0) { e.preventDefault(); play(n); }
  });

  await new Promise((resolve) => {
    const timer = setInterval(() => {
      if (quit || finished) { clearInterval(timer); resolve(); }
    }, 100);
  });
  release();
  if (quit) t.print('Game abandoned.', 'dim');
}

/* ── Number guessing ──────────────────────────────────────── */
function guess(io) {
  const t = io.term;
  const target = 1 + Math.floor(Math.random() * 100);
  let tries = 0;
  t.html('<div class="game-head"><b>GUESS THE NUMBER</b> — I am thinking of 1-100 · quit: Ctrl+C</div>');
  return new Promise((resolve) => {
    const round = () => {
      t.ask((value) => {
        if (value === null) { t.print('Game cancelled.', 'dim'); resolve(); return; }
        const n = Number(String(value).trim());
        if (!Number.isFinite(n) || n < 1 || n > 100) {
          t.print('Enter a whole number from 1 to 100.', 'err');
          round();
          return;
        }
        tries++;
        if (n === target) {
          t.print(`🎉 Correct! It was ${target} — in ${tries} tries.`, 'ok');
          t.print(tries <= 5 ? 'That was quick.' : 'Play again: guess', 'dim');
          resolve();
        } else if (tries >= 8) {
          t.print(`Out of tries. It was ${target}. Play again: guess`, 'err');
          resolve();
        } else {
          t.print(`${n < target ? 'higher ↑' : 'lower ↓'}   (${tries}/8)`, 'warn');
          round();
        }
      });
    };
    round();
  });
}

/* ── hangman ──────────────────────────────────────────────── */
const WORDS = [
  { w: 'palette', h: 'a set of colors for one project' },
  { w: 'contrast', h: 'the lightness difference between two colors' },
  { w: 'typography', h: 'the art of setting type' },
  { w: 'logo', h: 'the visual mark of a brand' },
  { w: 'grid', h: 'the invisible skeleton of a layout' },
  { w: 'composition', h: 'how elements are put together' },
  { w: 'identity', h: 'what makes a brand recognizable' },
  { w: 'mask', h: 'a shape that hides everything outside it' },
  { w: 'vector', h: 'path-based graphics, no pixels' },
  { w: 'kerning', h: 'space between a pair of letters' },
];

function hangman(io) {
  const t = io.term;
  const pick = WORDS[Math.floor(Math.random() * WORDS.length)];
  const word = pick.w;
  const letters = [...word];
  const found = new Set();
  let wrong = 0;

  const STAGES = [
    '  ┌───┐\n  │\n  │\n  │\n  │\n══╧══',
    '  ┌───┐\n  │   O\n  │\n  │\n  │\n══╧══',
    '  ┌───┐\n  │   O\n  │   │\n  │\n  │\n══╧══',
    '  ┌───┐\n  │   O\n  │  ╱│\n  │\n  │\n══╧══',
    '  ┌───┐\n  │   O\n  │  ╱│╲\n  │\n  │\n══╧══',
    '  ┌───┐\n  │   O\n  │  ╱│╲\n  │  ╱\n  │\n══╧══',
    '  ┌───┐\n  │   O\n  │  ╱│╲\n  │  ╱ ╲\n  │\n══╧══',
  ];

  t.html('<div class="game-head"><b>HANGMAN</b> — guess letters · quit: Ctrl+C</div>');
  t.print(`hint: ${pick.h}`, 'dim');

  return new Promise((resolve) => {
    const round = () => {
      const masked = letters.map((ch) => (found.has(ch) || ch === ' ' ? ch : '_')).join(' ');
      t.print(`${STAGES[wrong]}`, 'warn');
      t.print(`   ${masked}     (${wrong}/6 misses)`, 'bright');
      t.ask((value) => {
        if (value === null) { t.print('Game cancelled.', 'dim'); resolve(); return; }
        let ch = String(value).trim().toLowerCase();
        if (ch.length > 1) {
          if ([...ch].every((c) => letters.includes(c))) {
            letters.forEach((c) => found.add(c));
          } else { t.print('That is not the word.', 'err'); }
        } else {
          if (letters.includes(ch)) {
            if (found.has(ch)) t.print('That letter is already used.', 'warn');
            else { found.add(ch); t.print(`✓ "${ch}" is in there.`, 'ok'); }
          } else {
            wrong++;
            t.print(`✗ no "${ch}".`, 'err');
          }
        }
        if (letters.every((c) => found.has(c))) {
          t.print(`  ${letters.join(' ')}`, 'ok');
          t.print('🎉 You win. Word found.', 'ok');
          resolve();
        } else if (wrong >= 6) {
          t.print(`💀 You lose. The word was: ${word}`, 'err');
          t.print('Play again: hangman', 'dim');
          resolve();
        } else if (ch.length > 1 && ![...ch].every((c) => letters.includes(c))) {
          round();
        } else {
          round();
        }
      });
    };
    round();
  });
}

export const GAMES = {
  snake: { title: 'snake', desc: 'snake', run: snake },
  '2048': { title: '2048', desc: '2048', run: g2048 },
  ttt: { title: 'tic tac toe', desc: 'ttt', run: ttt },
  guess: { title: 'guess the number', desc: 'guess', run: guess },
  hangman: { title: 'hangman', desc: 'hangman', run: hangman },
};
