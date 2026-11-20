/* Animations and easter eggs */

import { SL, NYAN, DANCE, COFFEE, PALETTES, RAINBOW, SPINNER } from './art.js';

const KATAKANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0123456789ﾊﾋﾌﾍﾎ';

export async function matrix(io) {
  const t = io.term;
  t.print('Matrix rain — Ctrl+C or q to stop', 'dim');
  const box = t.mount('game-wrap');
  const pre = document.createElement('pre');
  pre.className = 'game-pre';
  box.appendChild(pre);

  const W = 48;
  const H = 17;
  const cols = Array.from({ length: W }, () => ({
    y: Math.random() * H,
    speed: 0.3 + Math.random() * 0.9,
    len: 3 + Math.floor(Math.random() * 7),
  }));

  let stopped = false;
  const release = t.captureKeys((e) => {
    if (e.key === 'Escape' || e.key === 'q' || (e.ctrlKey && e.key.toLowerCase() === 'c')) {
      e.preventDefault();
      stopped = true;
    }
  });

  const started = Date.now();
  while (!stopped && Date.now() - started < 12000 && t.connected(box)) {
    const grid = Array.from({ length: H }, () => Array(W).fill(' '));
    for (let x = 0; x < W; x++) {
      const c = cols[x];
      for (let i = 0; i < c.len; i++) {
        const y = Math.floor(c.y) - i;
        if (y >= 0 && y < H) grid[y][x] = KATAKANA[Math.floor(Math.random() * KATAKANA.length)];
      }
      c.y += c.speed;
      if (c.y - c.len > H) {
        c.y = 0;
        c.speed = 0.3 + Math.random() * 0.9;
        c.len = 3 + Math.floor(Math.random() * 7);
      }
    }
    pre.textContent = grid.map((r) => r.join('')).join('\n');
    t.scrollDown();
    await t.sleep(72);
  }
  release();
  t.print('Matrix stopped. Reality is still here.', 'dim');
}

export async function hack(io) {
  const t = io.term;
  t.print('Breaching the mainframe… (not really)', 'dim');
  const box = t.mount('game-wrap');
  const pre = document.createElement('pre');
  pre.className = 'game-pre';
  box.appendChild(pre);

  const steps = [
    'connecting to 192.168.0.1',
    'bypassing the firewall',
    'cracking the password  ·······',
    'extracting hidden palettes',
    'wiping the footprints',
  ];
  let stopped = false;
  const release = t.captureKeys((e) => {
    if (e.key === 'Escape' || (e.ctrlKey && e.key.toLowerCase() === 'c')) { e.preventDefault(); stopped = true; }
  });

  const lines = [];
  for (let i = 0; i < steps.length && !stopped; i++) {
    for (let p = 0; p <= 100; p += 20) {
      if (stopped) break;
      const filled = Math.round(p / 5);
      const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
      lines[i] = `  [${bar}] ${String(p).padStart(3)}%  ${steps[i]}`;
      pre.textContent = lines.filter(Boolean).join('\n');
      t.scrollDown();
      await t.sleep(45);
    }
    if (stopped) break;
    lines[i] = `  [${'█'.repeat(20)}] 100%  ${steps[i]}  ✓`;
    pre.textContent = lines.filter(Boolean).join('\n');
    await t.sleep(140);
  }
  release();
  if (stopped) { t.print('Breach cancelled. Good thing you had no hands.', 'dim'); return; }
  t.print('ACCESS GRANTED — user: designer / password: very-secure', 'ok');
  t.print('  (nobody was hacked. only your palettes were seen.)', 'dim');
}

export async function sl(io) {
  const t = io.term;
  t.print('Mistyped? Here comes the train… (Ctrl+C to stop)', 'dim');
  const box = t.mount('game-wrap');
  const pre = document.createElement('pre');
  pre.className = 'game-pre';
  box.appendChild(pre);
  const train = SL.split('\n');
  const width = Math.max(...train.map((l) => l.length));

  let stopped = false;
  const release = t.captureKeys((e) => {
    if (e.key === 'Escape' || (e.ctrlKey && e.key.toLowerCase() === 'c') || e.key === 'q') { e.preventDefault(); stopped = true; }
  });

  for (let offset = 90; offset > -width - 4 && !stopped; offset -= 3) {
    const pad = ' '.repeat(Math.max(0, offset));
    pre.textContent = train.map((l) => pad + l).join('\n');
    t.scrollDown();
    await t.sleep(38);
  }
  release();
  t.print('  🚂 The train left. Type ls correctly next time.', 'dim');
}

export async function pipes(io) {
  const t = io.term;
  t.print('Pipes — Ctrl+C to stop', 'dim');
  const box = t.mount('game-wrap');
  const pre = document.createElement('pre');
  pre.className = 'game-pre';
  box.appendChild(pre);

  const W = 56;
  const H = 16;
  let stopped = false;
  const release = t.captureKeys((e) => {
    if (e.key === 'Escape' || (e.ctrlKey && e.key.toLowerCase() === 'c') || e.key === 'q') { e.preventDefault(); stopped = true; }
  });

  const grid = Array.from({ length: H }, () => Array(W).fill(' '));
  let x = Math.floor(W / 2), y = Math.floor(H / 2);
  let d = 'r';
  let sinceReset = 0;
  const dirs = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
  const conn = {
    'ru': '└', 'rd': '┌', 'lu': '┘', 'ld': '┐',
    'ud': '│', 'lr': '─', 'du': '│', 'rl': '─',
  };
  grid[y][x] = '╹';

  const started = Date.now();
  while (!stopped && Date.now() - started < 11000 && t.connected(box)) {
    let nd = d;
    const [dx, dy] = dirs[d];
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || nx >= W || ny < 0 || ny >= H) {
      nd = { u: 'r', r: 'd', d: 'l', l: 'u' }[d];
    } else if (Math.random() < 0.18) {
      const options = Object.keys(dirs).filter((k) => {
        if ((k === 'u' && d === 'd') || (k === 'd' && d === 'u') || (k === 'l' && d === 'r') || (k === 'r' && d === 'l')) return false;
        const [ox, oy] = dirs[k];
        const tx = x + ox, ty = y + oy;
        return tx >= 0 && tx < W && ty >= 0 && ty < H;
      });
      if (options.length) nd = options[Math.floor(Math.random() * options.length)];
    }
    grid[y][x] = conn[(nd === d ? (d === 'u' || d === 'd' ? 'ud' : 'lr') : d + nd)] || '─';
    const [ndx, ndy] = dirs[nd];
    x += ndx; y += ndy;
    d = nd;
    grid[y][x] = '╹';
    sinceReset++;
    if (sinceReset > W * H * 0.55) {
      sinceReset = 0;
      for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) grid[yy][xx] = ' ';
      x = Math.floor(Math.random() * W); y = Math.floor(Math.random() * H);
      d = 'r';
    }
    pre.textContent = grid.map((r) => r.join('')).join('\n');
    t.scrollDown();
    await t.sleep(34);
  }
  release();
  t.print('Pipes closed.', 'dim');
}

export function rainbow(io, text) {
  const src = [...(text || 'RETRO TERM')].join('');
  const spans = [...src].map((ch, i) => {
    const c = RAINBOW[i % RAINBOW.length];
    return `<span style="color:${c};text-shadow:0 0 8px ${c}66">${ch === ' ' ? '&nbsp;' : escapeHtml(ch)}</span>`;
  }).join('');
  io.html(`<div class="line bright" style="font-weight:700;letter-spacing:.18em">${spans}</div>`);
}

export function palette(io, name) {
  const key = (name || 'amber-dusk').toLowerCase();
  const colors = PALETTES[key] || PALETTES['amber-dusk'];
  const label = PALETTES[key] ? key : 'amber-dusk (default)';
  const swatches = colors.map((c, i) => `<span style="display:inline-block;text-align:center;margin:2px 4px 2px 0">
      <span style="display:block;width:64px;height:34px;background:${c};border:1px solid rgba(255,255,255,.14);border-radius:4px"></span>
      <span style="display:block;font-size:10px;color:var(--fg-dim)">${c}</span>
    </span>`).join('');
  io.html(`<div class="line"><span class="dim">palette</span> <span class="bright">${escapeHtml(label)}</span></div><div class="line" style="white-space:normal;margin:4px 0 8px">${swatches}</div>`);
}

export async function shutdown(io) {
  const t = io.term;
  const lines = [
    'Broadcast message from guest@retro:',
    '  the system will shut down in 3 seconds…',
  ];
  lines.forEach((l) => t.print(l, 'warn'));
  for (let i = 3; i > 0; i--) {
    t.print(`  ${i}…`, 'err');
    t.scrollDown();
    await t.sleep(650);
  }
  t.print('  …', 'dim');
  await t.sleep(500);
  t.print('  Just kidding 😄 — this terminal is a filesystem in your browser, it cannot power off.', 'ok');
  t.print('  Nice try though. +1 secret.', 'dim');
}

export function konami(io) {
  io.print('  ↑  ↑  ↓  ↓  ←  →  ←  →  B  A');
  io.print('  Konami code accepted — 30 extra lives!', 'ok');
  io.print('  (lives ship in the next version. for now: good vibes.)', 'dim');
}

export function hal(io) {
  io.print('HAL 9000: I\'m sorry, Dave. I\'m afraid I can\'t do that.', 'warn');
  io.print('HAL 9000: but I can offer you an amber palette.  #ff9b21');
}

export function nyan(io) {
  io.print(NYAN[0]);
  io.print(NYAN[1]);
  io.print('  nyan nyan nyan nyan — a space cat just passed through.', 'dim');
}

export function dance(io) {
  DANCE.forEach((frame, i) => {
    io.print(frame);
    if (i < DANCE.length - 1) io.print('');
  });
  io.print('  💃 Dance over. Back to the project.', 'dim');
}

export function coffee(io) {
  io.print(COFFEE);
  io.print('  Caffeine added. You can now tolerate a 40-layer file.', 'dim');
}

export function spinnerFrame(i) {
  return SPINNER[i % SPINNER.length];
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
