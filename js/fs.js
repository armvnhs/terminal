/* Virtual filesystem for the terminal — persisted in localStorage */

const STORE = 'retroterm.fs.v5';
const DAY = 86400000;

const file = (name, content, daysAgo = 0) => ({
  type: 'file',
  name,
  content,
  mtime: Date.now() - daysAgo * DAY,
});

const dir = (name, children = {}, daysAgo = 3) => ({
  type: 'dir',
  name,
  children,
  mtime: Date.now() - daysAgo * DAY,
});

function defaultRoot() {
  return dir('', {
    home: dir('home', {
      guest: dir('guest', {
        'README.md': file('README.md', `# Welcome to Retro Term

This is a terminal simulator: a real filesystem (inside your browser), real
shell commands, pipes, redirects, an editor and thirty memories that only
people who know me can open.

Quick start:
  help        list every command
  ask         30 memories, one question at a time
  games       play: snake, 2048, ttt, guess, hangman
  nano file   create and edit a file
  theme green switch the phosphor color

Built for a graphic designer.
`, 2),
        '.bashrc': file('.bashrc', `# ~/.bashrc
export EDITOR=nano
export THEME=amber
alias ll='ls -l'
alias gs='git status'
`, 12),
        '.secrets': file('.secrets', `Three of the thirty memories:
  1) my brother's name, spelled backwards
  2) the small city I live in
  3) what is always next to my keyboard

Type "ask" to be questioned properly. Type "dad" if you get stuck.
`, 1),
        design: dir('design', {
          'palette.txt': file('palette.txt', `# AMBER DUSK
#0d0702  #3b1d08  #ff9b21  #ffd08a  #e0662b  #9ade6b
`, 4),
          'logo.ans': file('logo.ans', `   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  █  R E T R O  █
  █   T E R M   █
   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
      └──┬──┬──┘
`, 6),
          'notes.md': file('notes.md', `# Design notes

- Dark background, amber type: high contrast at night.
- 8px grid; spacing steps of 8 / 16 / 24.
- Soft glow plus vignette for the phosphor lamp feel.
- 1px scanlines at roughly 35% alpha.
`, 3),
        }, 9),
        work: dir('work', {
          'clients.txt': file('clients.txt', `- Studio Nour / logo / 2024-05-12
- Retro Cafe / menu + visual identity / 2024-06-01
- Aftab Press / book cover / 2024-06-20
`, 5),
          'brief.md': file('brief.md', `# Project brief

Goal: a "retro-futurist" visual identity, amber and bone palette.
Delivery: logo, palette, typography, 3 mockups.
`, 7),
        }, 8),
        screenshots: dir('screenshots', {
          '.keep': file('.keep', ''),
        }, 20),
      }, 1),
    }),
    etc: dir('etc', {
      hostname: file('hostname', 'retro\n', 30),
      motd: file('motd', `Welcome to RetroOS 1.0 — an amber phosphor experience.
`, 30),
      os: file('os-release', `NAME="RetroOS"
VERSION="1.0 (Amber Dusk)"
ID=retroos
`, 30),
    }, 30),
    usr: dir('usr', {
      share: dir('share', {
        art: dir('art', {
          'cat.ans': file('cat.ans', ` /\\_/\\
( o.o )
 > ^ <
`, 15),
        }, 15),
      }, 15),
    }, 15),
    tmp: dir('tmp', {}, 0),
    var: dir('var', {
      log: dir('log', {
        'system.log': file('system.log', `[boot] retro-kernel 1.0.0 loaded
[ok] crt phosphor driver (amber)
[ok] localStorage mounted on /
[warn] fan noise module missing
[ok] shell ready
`, 0),
      }, 0),
    }, 0),
    bin: dir('bin', {
      'retro-shell': file('retro-shell', '#!/bin/sh\n# binary-ish file\nexec /bin/bash "$@"\n', 30),
    }, 30),
  }, 0);
}

export const FS = {
  root: null,
  home: '/home/guest',

  load() {
    try {
      const raw = localStorage.getItem(STORE);
      this.root = raw ? JSON.parse(raw) : defaultRoot();
      if (!this.root || this.root.type !== 'dir') this.root = defaultRoot();
    } catch {
      this.root = defaultRoot();
    }
  },

  save() {
    try {
      localStorage.setItem(STORE, JSON.stringify(this.root));
    } catch { /* storage is full */ }
  },

  reset() {
    this.root = defaultRoot();
    this.save();
  },

  isAbs(p) {
    return typeof p === 'string' && p.startsWith('/');
  },

  resolve(path = '', cwd = this.home) {
    let p = String(path ?? '').trim();
    if (!p) return cwd;
    if (p === '~') p = this.home;
    else if (p.startsWith('~/')) p = this.home + p.slice(1);
    const base = this.isAbs(p) ? [] : this.split(cwd);
    for (const part of p.split('/')) {
      if (!part || part === '.') continue;
      if (part === '..') { base.pop(); continue; }
      base.push(part);
    }
    return '/' + base.join('/');
  },

  split(abs) {
    return String(abs).split('/').filter(Boolean);
  },

  getAbs(abs) {
    if (abs === '/' || abs === '') return this.root;
    let cur = this.root;
    for (const part of this.split(abs)) {
      if (!cur || cur.type !== 'dir') return null;
      cur = cur.children[part];
      if (!cur) return null;
    }
    return cur;
  },

  lookup(path, cwd = this.home) {
    const abs = this.resolve(path, cwd);
    return { abs, node: this.getAbs(abs) };
  },

  parentOf(abs) {
    const parts = this.split(abs);
    const name = parts.pop();
    const parentAbs = '/' + parts.join('/');
    return { parentAbs, parent: this.getAbs(parentAbs), name };
  },

  list(path, cwd = this.home, { all = false } = {}) {
    const { abs, node } = this.lookup(path, cwd);
    if (!node) return null;
    if (node.type === 'file') return [{ name: node.name, node, abs }];
    const names = Object.keys(node.children)
      .filter((n) => all || !n.startsWith('.'))
      .sort((a, b) => a.localeCompare(b, 'en'));
    return names.map((name) => ({ name, node: node.children[name], abs: abs === '/' ? '/' + name : abs + '/' + name }));
  },

  mkdir(path, cwd, parents = false) {
    const abs = this.resolve(path, cwd);
    if (abs === '/') return { error: 'directory / already exists' };
    const { parent, name } = this.parentOf(abs);
    if (!parent) {
      if (!parents) return { error: `no such path ${abs}` };
      // recursive creation
      const parts = this.split(abs);
      let cur = this.root;
      for (const p of parts) {
        if (!cur.children[p]) cur.children[p] = dir(p, {}, 0);
        cur = cur.children[p];
        if (cur.type !== 'dir') return { error: 'a file is in the way' };
      }
      this.save();
      return { abs };
    }
    if (parent.children[name]) return { error: `"${name}" already exists` };
    parent.children[name] = dir(name, {}, 0);
    this.save();
    return { abs };
  },

  touch(path, cwd) {
    const { node } = this.lookup(path, cwd);
    if (node) { node.mtime = Date.now(); this.save(); return { abs: this.resolve(path, cwd) }; }
    return this.write(path, '', false, cwd);
  },

  write(path, content, append = false, cwd = this.home) {
    const abs = this.resolve(path, cwd);
    const parts = this.split(abs);
    if (!parts.length) return { error: 'invalid path' };
    const name = parts.pop();
    let parent = this.root;
    for (const p of parts) {
      if (!parent.children[p] || parent.children[p].type !== 'dir') return { error: `no such path ${abs}` };
      parent = parent.children[p];
    }
    let node = parent.children[name];
    if (node && node.type === 'dir') return { error: `"${name}" is a directory` };
    if (!node) {
      node = file(name, '');
      parent.children[name] = node;
    }
    node.content = append ? (node.content || '') + content : content;
    node.mtime = Date.now();
    this.save();
    return { abs, node };
  },

  read(path, cwd) {
    const { node, abs } = this.lookup(path, cwd);
    if (!node) return { error: `cat: ${path}: No such file or directory` };
    if (node.type === 'dir') return { error: `cat: ${path}: Is a directory` };
    return { content: node.content || '', abs, node };
  },

  rm(path, cwd, recursive = false) {
    const abs = this.resolve(path, cwd);
    if (abs === '/' || abs === this.home) return { error: `cannot remove ${abs}` };
    const { parent, name } = this.parentOf(abs);
    if (!parent || !parent.children[name]) return { error: `"${path}" does not exist` };
    const node = parent.children[name];
    if (node.type === 'dir' && !recursive) return { error: `"${name}" is a directory (use -r)` };
    delete parent.children[name];
    this.save();
    return { abs };
  },

  cp(src, dest, cwd) {
    const { node: s } = this.lookup(src, cwd);
    if (!s) return { error: `"${src}" does not exist` };
    let absDest = this.resolve(dest, cwd);
    const existing = this.getAbs(absDest);
    if (existing && existing.type === 'dir') absDest = absDest === '/' ? '/' + s.name : absDest + '/' + s.name;
    const result = this.write(absDest, '', false, '/');
    if (result.error) return result;
    result.node.content = s.content || '';
    result.node.type = s.type;
    result.node.children = s.children ? JSON.parse(JSON.stringify(s.children)) : undefined;
    this.save();
    return { abs: absDest };
  },

  mv(src, dest, cwd) {
    const copy = this.cp(src, dest, cwd);
    if (copy.error) return copy;
    this.rm(src, cwd, true);
    return copy;
  },
};
