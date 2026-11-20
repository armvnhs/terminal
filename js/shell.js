/* Shell: commands, pipes and redirects */

import { FS } from './fs.js';
import { GAMES } from './games.js';
import { cowsay, banner, neofetch, dice, FORTUNES, JOKES, EIGHTBALL, WEATHER } from './art.js';
import * as fun from './fun.js';
import { playStory } from './story.js';
import {
  SECRETS, foundIds, foundCount, totalSecrets, pendingSecrets, submitAnswer,
  findByAnswer, isFound, allFound, dadPresent, dadArrives, resetSecrets,
} from './secrets.js';

export const COMMANDS = {};
export const THEMES = ['amber', 'green', 'ice', 'magenta', 'bone'];

function def(names, desc, usage, run, opts = {}) {
  for (const n of names) {
    COMMANDS[n] = { name: n, names, desc, usage, run, hidden: !!opts.hidden, group: opts.group || 'misc' };
  }
}

/* ── small helpers ───────────────────────────────────────── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtSize(n) {
  if (n < 1024) return String(n);
  if (n < 1048576) return (n / 1024).toFixed(1) + 'K';
  return (n / 1048576).toFixed(1) + 'M';
}

function fmtDate(ts) {
  const d = new Date(ts || Date.now());
  const pad = (x) => String(x).padStart(2, '0');
  return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, ' ')} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function permString(node) {
  return node.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--';
}

function expandVars(str, term) {
  return String(str).replace(/\$\{(\w+)\}|\$(\w+)|\$\?/g, (m, a, b) => {
    if (m === '$?') return String(term.lastExit ?? 0);
    const key = a || b;
    return term.env[key] ?? '';
  });
}

function humanPath(abs, home) {
  return abs === home ? '~' : abs.startsWith(home + '/') ? '~' + abs.slice(home.length) : abs;
}

function parseFlags(args) {
  const flags = new Set();
  const rest = [];
  for (const a of args) {
    if (a.startsWith('-') && a.length > 1 && !/^-\d+$/.test(a)) {
      for (const ch of a.slice(1)) flags.add(ch);
    } else rest.push(a);
  }
  return { flags, rest };
}

/* ── ls ──────────────────────────────────────────────────── */
def(['ls'], 'list directory contents', 'ls [-l] [-a] [path]', (args, io) => {
  const { flags, rest } = parseFlags(args);
  const target = rest[0] || '.';
  const items = FS.list(target, io.term.cwd, { all: flags.has('a') });
  if (!items) { io.print(`ls: cannot access '${target}': No such file or directory`, 'err'); return; }
  if (!items.length) return;
  const long = flags.has('l');
  if (long) {
    let total = 0;
    for (const it of items) total += it.node.type === 'dir' ? 4096 : (it.node.content || '').length;
    io.print(`total ${Math.ceil(total / 1024)}K`, 'dim');
    for (const it of items) {
      const size = it.node.type === 'dir' ? '4.0K' : fmtSize((it.node.content || '').length || 0);
      const name = it.node.type === 'dir' ? it.name : it.name;
      io.print(`${permString(it.node)} 1 ${io.term.env.USER} ${io.term.env.USER} ${size.padStart(6)} ${fmtDate(it.node.mtime)} ${name}`);
    }
    return;
  }
  const names = items.map((it) => it.name + (it.node.type === 'dir' ? '/' : ''));
  const width = Math.max(...names.map((n) => n.length)) + 3;
  const cols = Math.max(1, Math.floor(78 / width));
  for (let i = 0; i < names.length; i += cols) {
    io.print(names.slice(i, i + cols).map((n) => n.padEnd(width)).join('').trimEnd());
  }
});

/* ── cd / pwd ─────────────────────────────────────────────── */
def(['cd'], 'change directory', 'cd [path]', (args, io) => {
  const target = args[0] || '~';
  const { abs, node } = FS.lookup(target, io.term.cwd);
  if (!node) { io.print(`cd: ${target}: No such file or directory`, 'err'); return; }
  if (node.type !== 'dir') { io.print(`cd: ${target}: Not a directory`, 'err'); return; }
  io.term.cwd = abs;
  io.term.refreshPrompt();
});

def(['pwd'], 'print working directory', 'pwd', (args, io) => {
  io.print(io.term.cwd);
});

/* ── cat, head, tail ─────────────────────────────────────── */
def(['cat'], 'print file contents', 'cat <file...>', (args, io) => {
  if (!args.length) { io.print('cat: missing file operand (try: cat README.md)', 'err'); return; }
  for (const a of args) {
    const r = FS.read(a, io.term.cwd);
    if (r.error) io.print(r.error, 'err');
    else io.print(r.content.replace(/\n$/, ''));
  }
});

def(['head'], 'first lines of a file', 'head [-n N] <file>', (args, io) => {
  const { rest } = parseFlags(args);
  const nArg = args.find((a) => /^-\d+$/.test(a));
  const n = nArg ? -parseInt(nArg, 10) : 10;
  const path = rest[0];
  if (!path) { io.print('head: missing file operand', 'err'); return; }
  const r = FS.read(path, io.term.cwd);
  if (r.error) return io.print(r.error, 'err');
  io.print(r.content.split('\n').slice(0, n).join('\n'));
});

def(['tail'], 'last lines of a file', 'tail [-n N] <file>', (args, io) => {
  const { rest } = parseFlags(args);
  const nArg = args.find((a) => /^-\d+$/.test(a));
  const n = nArg ? parseInt(nArg.slice(1), 10) : 10;
  const path = rest[0];
  if (!path) { io.print('tail: missing file operand', 'err'); return; }
  const r = FS.read(path, io.term.cwd);
  if (r.error) return io.print(r.error, 'err');
  io.print(r.content.split('\n').slice(-n).join('\n'));
});

/* ── writing and creating ────────────────────────────────── */
def(['touch'], 'create an empty file', 'touch <file...>', (args, io) => {
  if (!args.length) { io.print('touch: missing file operand', 'err'); return; }
  for (const a of args) {
    const r = FS.touch(a, io.term.cwd);
    if (r.error) io.print(r.error, 'err');
  }
});

def(['mkdir'], 'create a directory', 'mkdir [-p] <dir...>', (args, io) => {
  const { flags, rest } = parseFlags(args);
  if (!rest.length) { io.print('mkdir: missing operand', 'err'); return; }
  for (const a of rest) {
    const r = FS.mkdir(a, io.term.cwd, flags.has('p'));
    if (r.error) io.print(`mkdir: ${r.error}`, 'err');
  }
});

def(['rm'], 'remove files or directories', 'rm [-r] <path...>', (args, io) => {
  const { flags, rest } = parseFlags(args);
  if (!rest.length) { io.print('rm: missing operand', 'err'); return; }
  for (const a of rest) {
    if (a === '/' || a === '/*' || a === '--no-preserve-root') {
      io.print('rm: operation halted — "rm -rf /" is only a joke in this terminal', 'warn');
      io.print('  (but the secret was recorded. see: secrets)', 'dim');
      continue;
    }
    const r = FS.rm(a, io.term.cwd, flags.has('r') || flags.has('f'));
    if (r.error) io.print(`rm: ${r.error}`, 'err');
  }
});

def(['cp'], 'copy files or directories', 'cp <src> <dest>', (args, io) => {
  if (args.length < 2) { io.print('cp: missing source and destination', 'err'); return; }
  const r = FS.cp(args[0], args[1], io.term.cwd);
  if (r.error) io.print(`cp: ${r.error}`, 'err');
});

def(['mv'], 'move or rename a file', 'mv <src> <dest>', (args, io) => {
  if (args.length < 2) { io.print('mv: missing source and destination', 'err'); return; }
  const r = FS.mv(args[0], args[1], io.term.cwd);
  if (r.error) io.print(`mv: ${r.error}`, 'err');
});

/* ── find / tree ─────────────────────────────────────────── */
def(['find'], 'search for files', 'find [path] [-name pattern]', (args, io) => {
  const { rest } = parseFlags(args);
  const root = rest[0] || '.';
  const nameIdx = args.indexOf('-name');
  const pattern = nameIdx >= 0 ? args[nameIdx + 1] : null;
  const matcher = pattern
    ? new RegExp('^' + String(pattern).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i')
    : null;
  const walk = (abs) => {
    const node = FS.getAbs(abs);
    if (!node) return;
    if (!matcher || matcher.test(node.name || '/')) {
      const display = humanPath(abs, FS.home);
      io.print(display === '~' ? '/home/guest' : display);
    }
    if (node.type === 'dir') for (const k of Object.keys(node.children)) walk(abs === '/' ? '/' + k : abs + '/' + k);
  };
  walk(FS.resolve(root, io.term.cwd));
});

def(['tree'], 'show the directory tree', 'tree [path]', (args, io) => {
  const target = args[0] || '.';
  const { abs, node } = FS.lookup(target, io.term.cwd);
  if (!node) { io.print('tree: path not found', 'err'); return; }
  io.print(humanPath(abs, FS.home));
  const walk = (n, prefix) => {
    if (n.type !== 'dir') return;
    const keys = Object.keys(n.children).filter((k) => !k.startsWith('.')).sort();
    keys.forEach((k, i) => {
      const child = n.children[k];
      const last = i === keys.length - 1;
      io.print(prefix + (last ? '└── ' : '├── ') + k + (child.type === 'dir' ? '/' : ''));
      walk(child, prefix + (last ? '    ' : '│   '));
    });
  };
  walk(node, '');
});

/* ── grep / wc / sort / uniq / rev ───────────────────────── */
def(['grep'], 'search text', 'grep [-i] <pattern> [file]', (args, io) => {
  const { flags, rest } = parseFlags(args);
  let pattern = rest[0];
  const file = rest[1];
  if (!pattern) { io.print('grep: missing pattern (try: grep amber README.md)', 'err'); return; }
  let text = '';
  if (file) {
    const r = FS.read(file, io.term.cwd);
    if (r.error) { io.print(r.error, 'err'); return; }
    text = r.content;
  } else if (io.stdin) text = io.stdin;
  else { io.print('grep: give a file or pipe some input', 'err'); return; }
  let re;
  try { re = new RegExp(pattern, flags.has('i') ? 'i' : ''); } catch { re = null; }
  const lines = text.split('\n');
  let hits = 0;
  lines.forEach((l, i) => {
    const ok = re ? re.test(l) : l.includes(pattern);
    if (ok) { io.print(l, 'bright'); hits++; }
  });
  if (!hits) io.print('grep: no matches', 'dim');
});

def(['wc'], 'count lines, words and bytes', 'wc [-l] <file>', (args, io) => {
  const { flags, rest } = parseFlags(args);
  let text = '';
  if (rest[0]) {
    const r = FS.read(rest[0], io.term.cwd);
    if (r.error) { io.print(r.error, 'err'); return; }
    text = r.content;
  } else if (io.stdin) text = io.stdin;
  else { io.print('wc: give a file or pipe some input', 'err'); return; }
  const lines = text.split('\n').filter((l, i, a) => !(i === a.length - 1 && l === '')).length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  if (flags.has('l')) io.print(String(lines));
  else io.print(`${lines}  ${words}  ${chars}  ${rest[0] || ''}`.trim());
});

def(['sort'], 'sort lines', 'sort [file]', (args, io) => {
  let text = '';
  if (args[0]) {
    const r = FS.read(args[0], io.term.cwd);
    if (r.error) { io.print(r.error, 'err'); return; }
    text = r.content;
  } else text = io.stdin || '';
  io.print(text.split('\n').filter(Boolean).sort().join('\n'));
});

def(['uniq'], 'remove duplicate lines', 'uniq [file]', (args, io) => {
  let text = args[0] ? FS.read(args[0], io.term.cwd).content || '' : io.stdin || '';
  const seen = new Set();
  io.print(text.split('\n').filter((l) => {
    if (!l || seen.has(l)) return false;
    seen.add(l);
    return true;
  }).join('\n'));
});

def(['rev'], 'reverse characters', 'rev [text]', (args, io) => {
  const src = args.length ? args.join(' ') : (io.stdin || '').replace(/\n$/, '');
  io.print([...src].reverse().join(''));
});

/* ── echo / calc ─────────────────────────────────────────── */
def(['echo'], 'print text', 'echo [-n] <text>', (args, io) => {
  const noNewline = args[0] === '-n';
  const src = (noNewline ? args.slice(1) : args).join(' ');
  io.print(expandVars(src, io.term));
});

def(['calc', 'expr'], 'evaluate a math expression', 'calc <expression>', (args, io) => {
  const expr = args.join(' ');
  if (!expr) { io.print('calc: missing expression (try: calc (1440/3)*2)', 'err'); return; }
  if (!/^[\d\s+\-*/().%^]+$/.test(expr)) { io.print('calc: only numbers and + - * / ( ) % ^ are allowed', 'err'); return; }
  try {
    const r = Function(`"use strict";return (${expr.replace(/\^/g, '**')})`)();
    io.print(`${expandVars(expr, io.term)} = ${r}`, 'ok');
  } catch {
    io.print('calc: invalid expression', 'err');
  }
});

/* ── system ──────────────────────────────────────────────── */
def(['whoami'], 'print the current user', 'whoami', (args, io) => io.print(io.term.env.USER));

def(['hostname'], 'print or set the hostname', 'hostname [name]', (args, io) => {
  if (args[0]) {
    io.term.env.HOST = args[0];
    io.term.saveEnv();
    io.term.refreshPrompt();
    io.print(`hostname set to ${args[0]}`, 'ok');
  } else io.print(io.term.env.HOST);
});

def(['user'], 'change the user name', 'user <name>', (args, io) => {
  if (!args[0]) { io.print(`current user: ${io.term.env.USER}`, 'dim'); return; }
  io.term.env.USER = args[0].replace(/[^\w.-]/g, '') || 'guest';
  io.term.saveEnv();
  io.term.refreshPrompt();
  io.print(`now: ${io.term.env.USER}@${io.term.env.HOST}`, 'ok');
});

def(['id'], 'print the user identity', 'id', (args, io) => {
  io.print(`uid=1000(${io.term.env.USER}) gid=1000(${io.term.env.USER}) groups=1000(${io.term.env.USER}),27(sudo)`);
});

def(['uname'], 'operating system information', 'uname [-a]', (args, io) => {
  if (args.includes('-a')) io.print('RetroOS retro 1.0.0 retroshell x86_64 Designer GNU/Linux');
  else io.print('RetroOS');
});

def(['date'], 'date and time', 'date', (args, io) => {
  const now = new Date();
  io.print(now.toString());
  try {
    const en = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(now);
    io.print(en, 'dim');
  } catch { /* ignore */ }
});

def(['uptime'], 'show uptime', 'uptime', (args, io) => {
  const mins = Math.max(1, Math.floor((Date.now() - io.term.startedAt) / 60000));
  io.print(` ${new Date().toTimeString().slice(0, 8)}  up ${mins} min,  1 user,  load average: 0.12, 0.08, 0.04`);
});

def(['ps'], 'list processes', 'ps', (args, io) => {
  io.print('  PID TTY          TIME CMD');
  io.print('    1 pts/0    00:00:01 retro-init');
  io.print('   42 pts/0    00:00:00 retro-shell');
  io.print('  137 pts/0    00:00:02 designer-brain');
  io.print('  256 pts/0    00:00:00 caffeine-d');
});

def(['df'], 'disk usage', 'df', (args, io) => {
  io.print('Filesystem      Size  Used Avail Use% Mounted on');
  io.print('retrostore      8.0M  1.4M  6.6M  18% /');
  io.print('tmpfs            64K     0   64K   0% /tmp');
  io.print('design-cache    2.0G  1.9G  0.1G  95% ~/design');
});

def(['du'], 'directory size', 'du [path]', (args, io) => {
  const target = args[0] || '.';
  const { abs, node } = FS.lookup(target, io.term.cwd);
  if (!node) { io.print('du: path not found', 'err'); return; }
  let bytes = 0;
  let files = 0;
  const walk = (n) => {
    if (n.type === 'file') { bytes += (n.content || '').length; files++; }
    else for (const k of Object.keys(n.children)) walk(n.children[k]);
  };
  walk(node);
  io.print(`${fmtSize(bytes)}  ${humanPath(abs, FS.home)}  (${files} files, ${Math.ceil(bytes / 1024)}K)`);
});

def(['free'], 'memory usage', 'free', (args, io) => {
  io.print('              total        used        free');
  io.print('Mem:          640Ki       512Ki       128Ki');
  io.print('Swap:           0Ki         0Ki         0Ki');
  io.print('  (640K ought to be enough for anybody — Bill Gates)', 'dim');
});

def(['ping'], 'test connectivity', 'ping <host>', (args, io) => {
  const host = args[0] || 'design.local';
  io.print(`PING ${host} 56 bytes of data.`);
  io.print(`64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.043 ms`);
  io.print(`64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.051 ms`);
  io.print(`64 bytes from ${host}: icmp_seq=3 ttl=64 time=0.048 ms`);
  io.print(`--- ${host} ping statistics --- 3 packets transmitted, 3 received, 0% loss`, 'dim');
  io.print('  (ping to the real world: no. this terminal is from 1984.)', 'dim');
});

def(['curl', 'wget'], 'make a network request', 'curl <url>', (args, io) => {
  io.print(`curl: (6) Could not resolve host: ${args[0] || 'example.com'}`, 'err');
  io.print('  this terminal has been offline since 1984. local files still work.', 'dim');
});

/* ── env / alias / history ───────────────────────────────── */
def(['env'], 'print environment variables', 'env', (args, io) => {
  for (const [k, v] of Object.entries(io.term.env)) io.print(`${k}=${v}`);
});

def(['export'], 'set an environment variable', 'export K=V', (args, io) => {
  if (!args.length) { for (const [k, v] of Object.entries(io.term.env)) io.print(`declare -x ${k}="${v}"`); return; }
  for (const a of args) {
    const idx = a.indexOf('=');
    if (idx > 0) {
      io.term.env[a.slice(0, idx)] = a.slice(idx + 1);
      io.term.saveEnv();
      io.term.refreshPrompt();
    } else {
      io.print(`export: ${a}: use NAME=VALUE`, 'err');
    }
  }
});

def(['alias'], 'define command shortcuts', 'alias [name=value]', (args, io) => {
  if (!args.length) {
    for (const [k, v] of Object.entries(io.term.aliases)) io.print(`alias ${k}='${v}'`);
    return;
  }
  for (const a of args) {
    const idx = a.indexOf('=');
    if (idx > 0) {
      io.term.aliases[a.slice(0, idx)] = a.slice(idx + 1);
      io.term.saveAliases();
      io.print(`alias ${a.slice(0, idx)}='${a.slice(idx + 1)}'`, 'dim');
    } else io.print(io.term.aliases[a] ? `alias ${a}='${io.term.aliases[a]}'` : `alias: ${a}: not defined`, 'err');
  }
});

def(['unalias'], 'remove a command shortcut', 'unalias <name>', (args, io) => {
  for (const a of args) {
    if (io.term.aliases[a]) { delete io.term.aliases[a]; io.term.saveAliases(); }
    else io.print(`unalias: ${a}: does not exist`, 'err');
  }
});

def(['history'], 'command history', 'history', (args, io) => {
  const h = io.term.history;
  if (!h.length) io.print('No commands typed yet.', 'dim');
  h.forEach((cmd, i) => io.print(`${String(i + 1).padStart(4)}  ${cmd}`));
});

def(['which'], 'locate a command', 'which <command>', (args, io) => {
  for (const a of args) {
    if (COMMANDS[a]) io.print(`/usr/bin/${a}  (built-in retro-shell)`);
    else io.print(`which: no ${a} in (/usr/bin:/bin)`, 'err');
  }
});

def(['man'], 'show a command manual', 'man <command>', (args, io) => {
  const c = COMMANDS[args[0]];
  if (!c) { io.print(`man: ${args[0] || ''}: no manual entry. try "help".`, 'err'); return; }
  io.print(`NAME\n    ${c.name} — ${c.desc}\n\nSYNOPSIS\n    ${c.usage}\n`, 'bright');
});

def(['clear', 'cls'], 'clear the screen', 'clear', (args, io) => io.clear());

def(['help'], 'show all help', 'help [command]', (args, io) => {
  if (args[0]) {
    const c = COMMANDS[args[0]];
    if (!c) { io.print(`help: unknown command "${args[0]}"`, 'err'); return; }
    io.print(`  ${c.name}`, 'bright');
    io.print(`  ${c.desc}`);
    io.print(`  usage: ${c.usage}`, 'dim');
    return;
  }
  io.html(`<div class="line" style="margin-bottom:6px">Everything a real terminal does happens here too: folders, files, pipes (<code>|</code>), redirects (<code>&gt;</code>), an editor, environment variables, themes. And thirty memories of a certain designer are locked inside it.</div>`);

  const groups = [
    ['FILES & DIRECTORIES', ['ls', 'cd', 'pwd', 'cat', 'head', 'tail', 'touch', 'mkdir', 'rm', 'cp', 'mv', 'find', 'tree', 'nano']],
    ['TEXT & TOOLS', ['echo', 'grep', 'wc', 'sort', 'uniq', 'rev', 'calc', 'history', 'alias', 'export', 'env']],
    ['SYSTEM', ['whoami', 'hostname', 'user', 'id', 'uname', 'date', 'uptime', 'ps', 'df', 'du', 'free', 'ping', 'curl', 'which', 'man', 'clear']],
    ['LOOKS', ['theme', 'palette', 'rainbow', 'banner']],
    ['GAMES', ['games', 'snake', '2048', 'ttt', 'guess', 'hangman']],
    ['THE 30 MEMORIES', ['ask', 'secrets', 'hint', 'father']],
    ['STORY', ['story']],
  ];
  for (const [title, names] of groups) {
    const rows = names
      .filter((n) => COMMANDS[n])
      .map((n) => `<span class="k">${n}</span><span class="v">${COMMANDS[n].desc}</span>`)
      .join('');
    io.html(`<div class="line" style="margin-top:8px"><span class="bright">${title}</span></div><div class="grid2">${rows}</div>`);
  }
  io.html(`<div class="line dim" style="margin-top:6px">Example: ls -l · cat README.md | grep amber · echo "hello" &gt; note.txt · ask</div>`);
});

/* ── theme and sound ─────────────────────────────────────── */
def(['theme', 'color'], 'change the phosphor theme', 'theme [amber|green|ice|magenta|bone]', (args, io) => {
  if (!args[0]) {
    io.print(`current theme: ${io.term.theme}`, 'bright');
    io.print(`available themes: ${THEMES.join(' · ')}`, 'dim');
    return;
  }
  const name = args[0].toLowerCase();
  if (!THEMES.includes(name)) { io.print(`theme: "${name}" not found. choose: ${THEMES.join(", ")}`, 'err'); return; }
  io.term.setTheme(name);
  io.print(`theme "${name}" enabled`, 'ok');
});

def(['sound'], 'typing sound', 'sound [on|off]', (args, io) => {
  const mode = args[0];
  if (mode === 'on' || mode === 'off') {
    io.term.setSound(mode === 'on');
    io.print(`typing sound: ${mode === 'on' ? 'on' : 'off'}`, 'ok');
  } else {
    io.print(`typing sound: ${io.term.sound ? 'on' : 'off'}  (sound on/off)`, 'dim');
  }
});

def(['reset'], 'reset the filesystem to defaults', 'reset [--all]', (args, io) => {
  FS.reset();
  io.term.cwd = FS.home;
  if (args.includes('--all')) {
    resetSecrets();
    io.term.setTheme('amber');
    io.print('Everything reset: files, memories, theme.', 'ok');
  } else {
    io.print('Filesystem restored. (memories and theme untouched)', 'ok');
  }
  io.term.refreshPrompt();
});

def(['exit', 'logout'], 'log out', 'exit', async (args, io) => {
  io.print('logout', 'dim');
  await io.term.reboot();
});

/* ── editor ──────────────────────────────────────────────── */
def(['nano', 'edit'], 'file editor', 'nano <file>', (args, io) => {
  if (!args[0]) { io.print('nano: missing filename (try: nano note.txt)', 'err'); return; }
  io.term.openEditor(args[0]);
});

/* ── games ───────────────────────────────────────────────── */
def(['games'], 'list the games', 'games', (args, io) => {
  io.html(`<div class="line"><span class="bright">TERMINAL GAMES</span></div>`);
  io.html(`<div class="grid2">
    ${Object.entries(GAMES).map(([k, g]) => `<span class="k">${k}</span><span class="v">${g.title}</span>`).join('')}
  </div>`);
  io.print('  controls: arrow keys or WASD · q to quit · Ctrl+C to cancel', 'dim');
});

for (const [key, game] of Object.entries(GAMES)) {
  def([key], `play ${game.title}`, key, async (args, io) => {
    await game.run(io);
  });
}

/* ── the story ───────────────────────────────────────────── */
def(['story'], 'the animated story in five chapters', 'story', async (args, io) => {
  await playStory(io.term);
});

/* ── the 30 memories ─────────────────────────────────────── */
let currentSecret = null;
let misses = 0;

function finale(io) {
  io.print('');
  io.print('  ------------------------------------------', 'dim');
  io.print('  30 / 30', 'ok');
  io.print('');
  io.print('  You made it, my son.', 'bright');
  io.print('  Surely you are one of the saved.', 'bright');
  io.print('');
  io.print('  Close the lid. Go and draw something.', 'dim');
  io.print('  ------------------------------------------', 'dim');
}

function unlockMsg(io, secret, res) {
  io.print('');
  io.print(`  MEMORY ${res.count}/${res.total} UNLOCKED - ${secret.title}`, 'ok');
  io.print(`  ${secret.memory}`, 'bright');
  if (res.all) finale(io);
}

function dadScene(io) {
  dadArrives();
  io.print('');
  io.print('  You called out: "Father."', 'bright');
  io.print('');
  io.print('  A chair scrapes the floor. He sits down beside you,');
  io.print('  looks at the amber screen, and nods slowly.');
  io.print('');
  io.print('  FATHER: "Thirty memories locked in a machine. Fine.');
  io.print('       I am not going anywhere. Call me when you are stuck."');
  io.print('');
  io.print('  He is sitting there now. Type "father" for help with a question.', 'dim');
  io.print('');
}

function dadHint(io, secret) {
  if (!secret) return;
  const answer = secret.a[0];
  const words = answer.split(/\s+/).length;
  const letters = answer.replace(/[^a-z0-9]/gi, '').length;
  io.print(`  FATHER: "It starts with ${answer[0].toUpperCase()}. ${words} word${words > 1 ? 's' : ''}, ${letters} letter${letters > 1 ? 's' : ''}."`, 'bright');
  io.print(`  FATHER: "${secret.hint}"`, 'dim');
}

function nextQuestion() {
  if (currentSecret && !isFound(currentSecret.id)) return currentSecret;
  return pendingSecrets()[0] || null;
}

function askSecret(io, secret) {
  currentSecret = secret;
  misses = 0;
  const n = SECRETS.indexOf(secret) + 1;
  io.print('');
  io.print(`  QUESTION ${n}/${SECRETS.length}`, 'dim');
  io.print(`  ${secret.q}`, 'bright');
  io.print('  type your answer - Ctrl+C leaves it for later', 'dim');
  io.term.ask((answer) => {
    if (answer === null) {
      io.print('  left for later. ("ask" comes back to it.)', 'dim');
      return;
    }
    handleAnswer(io, secret, answer);
  });
}

function handleAnswer(io, secret, answer) {
  const res = submitAnswer(secret, answer);
  if (res.already) { io.print('  that one is already open.', 'dim'); return; }
  if (res.ok) { misses = 0; unlockMsg(io, secret, res); return; }

  misses++;
  io.print('  not it.', 'warn');
  if (!dadPresent() && misses >= 3) {
    dadScene(io);
    dadHint(io, secret);
    return;
  }
  if (dadPresent()) dadHint(io, secret);
  else io.print('  (try again, or "hint" for a nudge)', 'dim');
}

def(['ask', 'next'], 'hunt the 30 memories, one question at a time', 'ask [number]', (args, io) => {
  if (allFound()) { finale(io); return; }
  const wanted = parseInt(args[0], 10);
  let secret = null;
  if (wanted >= 1 && wanted <= SECRETS.length) {
    const candidate = SECRETS[wanted - 1];
    if (!isFound(candidate.id)) secret = candidate;
    else io.print(`  memory ${wanted} is already open.`, 'dim');
  }
  if (!secret) secret = nextQuestion();
  if (!secret) { finale(io); return; }
  askSecret(io, secret);
});

def(['father'], 'call your father', 'father', (args, io) => {
  if (!dadPresent()) {
    dadScene(io);
    const secret = nextQuestion();
    if (secret) dadHint(io, secret);
    else io.print('  FATHER: "Nothing left to open. Look at what you built."', 'bright');
    return;
  }
  const secret = nextQuestion();
  io.print('  FATHER: "Still here, son."', 'bright');
  if (!secret) { finale(io); return; }
  dadHint(io, secret);
});

def(['secrets', 'memories'], 'the 30 memories and your progress', 'secrets', (args, io) => {
  const found = foundIds();
  const total = totalSecrets();
  const pct = Math.round((found.length / total) * 100);
  const filled = Math.round(pct / 4);
  io.html(`<div class="line bright">30 MEMORIES LOCKED IN THIS TERMINAL</div>`);
  io.html(`<div class="line">  <span class="bar">[${'█'.repeat(filled)}${'░'.repeat(25 - filled)}]</span> ${found.length}/${total} open (${pct}%)</div>`);
  io.html(`<div class="grid2" style="margin-top:8px">${SECRETS.map((s, i) => {
    const got = found.includes(s.id);
    return `<span class="k" style="color:${got ? 'var(--ok)' : 'var(--fg-dim)'}">${String(i + 1).padStart(2, '0')} ${got ? s.title : 'locked'}</span><span class="v" style="opacity:${got ? '1' : '.75'}">${got ? s.memory : s.q}</span>`;
  }).join('')}</div>`);
  io.print('  answer with "ask", or just type what you know. Opened memories stay open.', 'dim');
});

def(['hint'], 'a nudge toward the next memory', 'hint', (args, io) => {
  const pending = pendingSecrets();
  if (!pending.length) { finale(io); return; }
  const pick = nextQuestion();
  io.print(`  ${pick.hint}`, 'warn');
  if (dadPresent()) dadHint(io, pick);
  io.print(`  (${pending.length} memories still locked)`, 'dim');
});

/* ── jokes and easter eggs ───────────────────────────────── */
def(['sudo'], 'run a command as root', 'sudo <command>', async (args, io) => {
  const full = args.join(' ').trim();
  if (full === 'make me a sandwich') {
    io.print('Alright. One sandwich, no crust.', 'ok');
    io.print('  (designers usually want coffee: coffee)', 'dim');
    return;
  }
  if (full === 'su' || full === 'su -' || full === '-i') {
    io.print(`[sudo] password for ${io.term.env.USER}: ********`, 'dim');
    io.print('Sorry, user is not in the sudoers file. This incident has been reported.', 'err');
    return;
  }
  if (!full) { io.print('usage: sudo <command>', 'err'); return; }
  io.print(`[sudo] password for ${io.term.env.USER}: ********`, 'dim');
  io.print('sudo: everyone is already root here. relax.', 'warn');
});

def(['su'], 'switch user', 'su [user]', (args, io) => {
  io.print('su: Authentication failure — but this terminal is yours. relax.', 'warn');
});

def(['git'], 'repository status', 'git [status]', (args, io) => {
  io.print('On branch main');
  io.print("Your branch is up to date with 'origin/main'.", 'dim');
  io.print('');
  io.print('Changes not staged for commit:');
  io.print('  modified:   design/palette.txt');
  io.print('  modified:   design/logo.ans');
  io.print('');
  io.print('Untracked files:');
  io.print('  final-final-v3-FINAL.psd');
  io.print('  final-final-v3-FINAL-2.psd');
  io.print('  logo-final-use-this-one.psd');
  io.print('');
  io.print('no changes added to commit (use "git add" and/or "git commit -a")', 'dim');
  io.print('  (every designer has a repo that never gets committed.)', 'dim');
});

def(['vim', 'vi'], 'the vim editor', 'vim', (args, io) => {
  io.print('~ VIM — Retro Edition', 'bright');
  io.print('  to quit vim: :q!');
  io.print('  to save: :wq');
  io.print('  to escape this terminal: close the window.');
  io.print('  ');
  io.print('  …');
  io.print('  just kidding. use "nano", it is easier.', 'dim');
});

def(['matrix', 'cmatrix'], 'matrix rain', 'matrix', (args, io) => fun.matrix(io));
def(['hack'], 'pretend to hack', 'hack', (args, io) => fun.hack(io));
def(['sl'], 'the train!', 'sl', (args, io) => fun.sl(io));
def(['pipes'], 'pipes screensaver', 'pipes', (args, io) => fun.pipes(io));
def(['rainbow'], 'rainbow text', 'rainbow <text>', (args, io) => fun.rainbow(io, args.join(' ')));
def(['palette', 'colors'], 'ready-made color palettes', 'palette [name]', (args, io) => fun.palette(io, args[0]));
def(['nyan', 'nyancat'], 'space cat', 'nyan', (args, io) => fun.nyan(io));
def(['dance'], 'terminal dance', 'dance', (args, io) => fun.dance(io));
def(['coffee', 'brew'], 'coffee', 'coffee', (args, io) => fun.coffee(io));
def(['konami'], 'cheat code', 'konami', (args, io) => fun.konami(io));
def(['hal'], 'HAL 9000', 'hal', (args, io) => fun.hal(io));
def(['shutdown', 'poweroff', 'reboot'], 'shut the system down', 'shutdown', (args, io) => fun.shutdown(io));

def(['banner'], 'block letter banner', 'banner <text>', (args, io) => {
  io.print(banner(args.join(' ') || 'RETRO'), 'bright');
});

def(['cowsay'], 'talking cow', 'cowsay <text>', (args, io) => {
  io.print(cowsay(args.join(' ') || 'moo. i am a terminal cow.'));
});

def(['fortune'], 'a design fortune', 'fortune', (args, io) => {
  if (args.includes('-a')) { FORTUNES.forEach((f) => io.print('  ' + f)); return; }
  io.print('  ' + FORTUNES[Math.floor(Math.random() * FORTUNES.length)], 'bright');
});

def(['joke'], 'a joke', 'joke', (args, io) => {
  io.print('  ' + JOKES[Math.floor(Math.random() * JOKES.length)]);
});

def(['weather'], 'weather report', 'weather', (args, io) => {
  io.print('  ' + WEATHER[Math.floor(Math.random() * WEATHER.length)], 'bright');
  io.print('  palette temperature: 3200K to 6500K', 'dim');
});

def(['dice'], 'roll dice', 'dice [count]', (args, io) => {
  const count = Math.min(3, Math.max(1, parseInt(args[0], 10) || 1));
  const rolls = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6));
  io.print(rolls.map((r) => dice(r)).join('\n'));
  io.print(`  ${rolls.join(' + ')} = ${rolls.reduce((a, b) => a + b, 0)}`, 'ok');
});

def(['coinflip', 'coin'], 'flip a coin', 'coinflip', (args, io) => {
  const heads = Math.random() < 0.5;
  io.print(heads
    ? '   ╭─────────╮\n   │ HEADS   │\n   │   ●     │\n   ╰─────────╯'
    : '   ╭─────────╮\n   │ TAILS   │\n   │   ○     │\n   ╰─────────╯', 'bright');
  io.print(heads ? '  Heads!' : '  Tails!', 'ok');
});

def(['8ball'], 'magic 8-ball', '8ball <question>', (args, io) => {
  const q = args.join(' ');
  if (q) io.print(`  Q: ${q}`, 'dim');
  io.print('  A: ' + EIGHTBALL[Math.floor(Math.random() * EIGHTBALL.length)], 'bright');
});

def(['hello', 'hi', 'salam'], 'say hello', 'hello', (args, io) => {
  io.print(`  Hello ${io.term.env.USER}. Welcome to the amber realm.`, 'bright');
  io.print('  type "help", or go straight for "secrets".', 'dim');
});

def(['42'], 'the answer to everything', '42', (args, io) => {
  io.print('  42 — the answer to everything, including why the final file will not open.', 'bright');
});

def(['xyzzy'], 'the magic word', 'xyzzy', (args, io) => {
  io.print('  Nothing happens.');
  io.print('  (that is the event.)', 'dim');
});

def(['rickroll'], 'rickroll', 'rickroll', (args, io) => {
  io.print('  Never gonna give you up');
  io.print('  Never gonna let you down');
  io.print('  Never gonna run around and desert you');
  io.print('  ... and you are still staring at the terminal.', 'dim');
});

def(['open', 'openbox'], 'open a file', 'open <file>', (args, io) => {
  const r = FS.read(args[0], io.term.cwd);
  if (r.error) return io.print(r.error, 'err');
  io.print(r.content);
});

def(['neofetch'], 'system info with a logo', 'neofetch', (args, io) => {
  const info = [
    `${io.term.env.USER}@${io.term.env.HOST}`,
    '─'.repeat(`${io.term.env.USER}@${io.term.env.HOST}`.length),
    'OS: RetroOS 1.0 (Amber Dusk)',
    'Host: cool-retro-term 1984',
    'Kernel: retro-kernel 1.0.0',
    `Uptime: ${Math.max(1, Math.floor((Date.now() - io.term.startedAt) / 60000))} min`,
    'Shell: retro-sh 1.0',
    `Theme: ${io.term.theme}`,
    `Resolution: ${window.innerWidth}x${window.innerHeight}`,
    'Terminal: RetroTerm (browser)',
    'CPU: Designer Brain @ 3.2GHz',
    'Memory: 640K (enough for anyone)',
  ];
  io.print(neofetch(info));
});

/* ── execution ───────────────────────────────────────────── */

function tokenizeOps(str) {
  const tokens = [];
  let cur = '';
  let quote = null;
  let has = false;
  const push = () => { if (cur || has) { tokens.push(cur); cur = ''; has = false; } };
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; has = true; continue; }
    if (/\s/.test(ch)) { push(); continue; }
    if (ch === '|' || ch === '>') {
      push();
      if (ch === '>' && str[i + 1] === '>') { tokens.push('>>'); i++; }
      else tokens.push(ch);
      continue;
    }
    cur += ch;
  }
  push();
  if (quote) throw new Error('unclosed quote');
  return tokens;
}

export function parseLine(line) {
  const tokens = tokenizeOps(line);
  const segments = [];
  let cur = [];
  let redirect = null;
  for (let i = 0; i < tokens.length; i++) {
    const tk = tokens[i];
    if (tk === '|') { if (cur.length) segments.push(cur); cur = []; continue; }
    if (tk === '>' || tk === '>>') {
      const target = tokens[i + 1];
      i++;
      redirect = { file: target, append: tk === '>>' };
      continue;
    }
    cur.push(tk);
  }
  if (cur.length) segments.push(cur);
  return { segments, redirect };
}

function usage(cmd, io) {
  io.print(`usage: ${cmd.usage}`, 'dim');
  io.print(`  ${cmd.desc}`, 'dim');
}

async function runTokens(tokens, io, term) {
  let name = tokens[0];
  let args = tokens.slice(1);
  if (term.aliases[name]) {
    const extra = tokenizeOps(term.aliases[name]);
    name = extra[0];
    args = [...extra.slice(1), ...args];
  }
  const cmd = COMMANDS[name];
  if (!cmd) {
    const line = tokens.join(' ');
    const hit = findByAnswer(line);
    if (hit) {
      unlockMsg(io, hit, submitAnswer(hit, line));
      term.lastExit = 0;
      return;
    }
    io.print(`retro-sh: ${name}: command not found`, 'err');
    io.print('  "help" for commands, "ask" for the memories. A name or a fact might also be an answer.', 'dim');
    term.lastExit = 127;
    return;
  }
  if (args.includes('--help') || args.includes('-h')) { usage(cmd, io); return; }
  await cmd.run(args, io, term);
  term.lastExit = 0;
}

export async function execute(line, term) {
  let parsed;
  try { parsed = parseLine(line); } catch (e) { term.println(`retro-sh: ${e.message}`, 'err'); return; }
  if (!parsed.segments.length) return;

  const complex = parsed.segments.length > 1 || !!parsed.redirect;
  let stdin = '';

  for (const seg of parsed.segments) {
    const io = term.makeIO({ capture: complex, stdin });
    await runTokens(seg, io, term);
    stdin = io.output();
    if (parsed.segments.length > 1) stdin += '\n';
  }

  if (parsed.redirect) {
    if (!parsed.redirect.file) { term.println('retro-sh: missing redirect target', 'err'); return; }
    const r = FS.write(parsed.redirect.file, stdin ? stdin + '\n' : '', parsed.redirect.append, term.cwd);
    if (r.error) term.println(r.error, 'err');
    else term.println(`${parsed.redirect.append ? 'appended to' : 'wrote'} ${parsed.redirect.file}`, 'dim');
  } else if (complex) {
    if (stdin.trim()) term.println(stdin.replace(/\n$/, ''));
  }
}
