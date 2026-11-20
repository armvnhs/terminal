/* terminal core */

import { FS } from './fs.js';
import { execute, COMMANDS } from './shell.js';
import { isFa, t, faOut, applyLang } from './i18n.js';

const LS_ENV = 'retroterm.env.v1';
const LS_ALIAS = 'retroterm.alias.v1';
const LS_THEME = 'retroterm.theme.v1';
const LS_HISTORY = 'retroterm.history.v1';
const LS_SOUND = 'retroterm.sound.v1';

const THEME_LABEL = {
  amber: 'AMBER PHOSPHOR · 60Hz',
  green: 'GREEN PHOSPHOR · 60Hz',
  ice: 'ICE PHOSPHOR · 60Hz',
  magenta: 'MAGENTA PHOSPHOR · 60Hz',
  bone: 'WHITE PHOSPHOR · 60Hz',
};

const readLS = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const writeLS = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
};

export class Terminal {
  constructor() {
    this.el = document.getElementById('term');
    this.screen = document.getElementById('screen');
    this.ghost = document.getElementById('ghost');
    this.modelLabel = document.getElementById('modelLabel');
    this.winTitle = document.getElementById('winTitle');

    this.startedAt = Date.now();
    this.cwd = FS.home;
    this.lastExit = 0;
    this.busy = false;
    this.keyHandler = null;
    this.askHandler = null;
    this.editorOpen = false;
    this.history = readLS(LS_HISTORY, []);
    this.historyIndex = null;
    this.historyDraft = '';
    this.theme = readLS(LS_THEME, 'amber');
    this.sound = readLS(LS_SOUND, false);
    this.aliases = readLS(LS_ALIAS, { ll: 'ls -l', la: 'ls -a' });
    this.env = {
      USER: 'guest',
      HOST: 'retro',
      HOME: FS.home,
      SHELL: '/bin/retro-sh',
      TERM: 'retro-term',
      EDITOR: 'nano',
      THEME: this.theme,
      ...readLS(LS_ENV, {}),
    };

    this.buildInputLine();
    this.buildEditor();
    this.applyTheme(this.theme, false);
    this.bindEvents();
  }

  /* ── build DOM parts ─────────────────────────────────────── */
  buildInputLine() {
    const line = document.createElement('div');
    line.className = 'line inputline hidden';
    line.innerHTML = '<span class="prompt"></span><span class="typed"></span><span class="caret"></span><span class="rest"></span>';
    this.el.appendChild(line);
    this.inputLine = line;
    this.promptEl = line.querySelector('.prompt');
    this.typedEl = line.querySelector('.typed');
    this.restEl = line.querySelector('.rest');
    this.caretEl = line.querySelector('.caret');
    this.renderPrompt();
  }

  buildEditor() {
    const ed = document.createElement('div');
    ed.className = 'editor';
    ed.innerHTML = `
      <div class="ed-head"><span id="edFile">file</span><span>${t('Ctrl+S save · Esc save &amp; exit', 'Ctrl+S ذخیره · Esc ذخیره و خروج')}</span></div>
      <textarea id="edText" dir="auto" spellcheck="false"></textarea>
      <div class="ed-status" id="edStatus">${t('ready', 'آماده')}</div>`;
    this.screen.appendChild(ed);
    this.editorEl = ed;
    this.edText = ed.querySelector('#edText');
    this.edFile = ed.querySelector('#edFile');
    this.edStatus = ed.querySelector('#edStatus');

    this.edText.addEventListener('input', () => this.click());
    this.edText.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeEditor(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.saveEditor();
      }
    });
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    this.ghost.addEventListener('input', () => {
      this.renderInput();
      this.click();
    });
    this.ghost.addEventListener('keyup', () => this.renderInput());
    this.ghost.addEventListener('click', () => this.renderInput());
    this.screen.addEventListener('mouseup', () => this.renderInput());
    this.screen.addEventListener('mousedown', (e) => {
      if (e.target.closest('.editor') || e.target.closest('.ttt')) return;
      this.focusInput();
    });
    document.addEventListener('mouseup', () => {
      if (this.editorOpen) return;
      const sel = window.getSelection();
      if (sel && sel.toString().length) return;
      if (document.activeElement === this.ghost) return;
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      this.focusInput();
    });
    this.el.addEventListener('scroll', () => { this.inputLine.classList.add('scrolled'); });
  }

  focusInput() {
    if (this.editorOpen) return;
    try { this.ghost.focus({ preventScroll: true }); } catch { this.ghost.focus(); }
    this.el.classList.remove('blurred');
  }

  /* ── input and prompt ────────────────────────────────────── */
  promptHTML() {
    if (this.askHandler) return '<span class="ps">?</span><span class="ps-sign"> </span>';
    const user = isFa() ? 'کاربر' : this.env.USER;
    const host = isFa() ? 'رترو' : this.env.HOST;
    return `<span class="ps">${user}@${host}</span><span class="ps-sign">:</span><span class="ps-path">${this.shortPath()}</span><span class="ps-sign">$ </span>`;
  }

  shortPath() {
    return this.cwd === FS.home ? '~' : this.cwd.startsWith(FS.home + '/') ? '~' + this.cwd.slice(FS.home.length) : this.cwd;
  }

  renderPrompt() {
    this.promptEl.innerHTML = this.promptHTML();
    if (this.winTitle) this.winTitle.textContent = `${this.env.USER}@${this.env.HOST}: ${this.shortPath()} — RETRO-TERM`;
  }

  refreshPrompt() {
    this.env.PWD = this.cwd;
    this.renderPrompt();
  }

  renderInput() {
    const v = this.ghost.value;
    let pos = v.length;
    try { pos = this.ghost.selectionStart ?? v.length; } catch { /* ignore */ }
    this.typedEl.textContent = v.slice(0, pos);
    this.restEl.textContent = v.slice(pos);
    this.caretEl.style.display = 'inline-block';
  }

  onKeyDown(e) {
    if (this.editorOpen) return;

    if (this.keyHandler) {
      this.keyHandler(e);
      return;
    }

    if (this.busy) {
      if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); this.clear(); }
      return;
    }

    if (e.key === 'Meta' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift') return;

    if (e.target !== this.ghost) {
      this.focusInput();
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const v = this.ghost.value;
        const pos = this.ghost.selectionStart ?? v.length;
        this.ghost.value = v.slice(0, pos) + e.key + v.slice(pos);
        this.ghost.setSelectionRange(pos + 1, pos + 1);
        this.renderInput();
        this.click();
        e.preventDefault();
        return;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.isComposing) return;
      this.submit();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      this.complete();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.historyStep(-1);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.historyStep(1);
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      if (this.askHandler) this.cancelAsk();
      else {
        this.println(`${this.promptText()}${this.ghost.value}^C`, 'dim');
        this.ghost.value = '';
        this.renderInput();
      }
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      this.clear();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      this.ghost.value = '';
      this.renderInput();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      this.ghost.value = '';
      this.renderInput();
      return;
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
      setTimeout(() => this.renderInput(), 0);
    }
  }

  promptText() {
    if (isFa()) return `کاربر@رترو:${this.shortPath()}$ `;
    return `${this.env.USER}@${this.env.HOST}:${this.shortPath()}$ `;
  }

  click() {
    if (!this.sound) return;
    try {
      this.audio = this.audio || new (window.AudioContext || window.webkitAudioContext)();
      const ctx = this.audio;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 170 + Math.random() * 90;
      gain.gain.value = 0.018;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.014);
    } catch { /* ignore */ }
  }

  /* ── history ─────────────────────────────────────────────── */
  historyStep(dir) {
    if (this.askHandler) return;
    if (!this.history.length) return;
    if (this.historyIndex === null) {
      this.historyDraft = this.ghost.value;
      this.historyIndex = this.history.length;
    }
    this.historyIndex = Math.min(this.history.length, Math.max(0, this.historyIndex + dir));
    const value = this.historyIndex >= this.history.length ? this.historyDraft : this.history[this.historyIndex];
    this.ghost.value = value;
    this.ghost.setSelectionRange(value.length, value.length);
    this.renderInput();
  }

  pushHistory(cmd) {
    if (!cmd.trim()) return;
    if (this.history[this.history.length - 1] === cmd) return;
    this.history.push(cmd);
    if (this.history.length > 400) this.history.shift();
    writeLS(LS_HISTORY, this.history);
    this.historyIndex = null;
  }

  /* ── tab completion ──────────────────────────────────────── */
  complete() {
    const v = this.ghost.value;
    const pos = this.ghost.selectionStart ?? v.length;
    const before = v.slice(0, pos);
    const tokenMatch = before.match(/(\S*)$/);
    const token = tokenMatch ? tokenMatch[1] : '';
    const firstWord = !before.trim().includes(' ') || before.trim().split(/\s+/).length <= 1 && before.endsWith(token) && !before.slice(0, before.length - token.length).trim();
    let candidates = [];
    let prefix = '';
    let suffix = ' ';

    if (firstWord) {
      candidates = Object.keys(COMMANDS).filter((c) => c.startsWith(token) && !COMMANDS[c].hidden);
      prefix = '';
    } else {
      const slash = token.lastIndexOf('/');
      const dirPart = slash >= 0 ? token.slice(0, slash + 1) : '';
      const base = slash >= 0 ? token.slice(slash + 1) : token;
      const items = FS.list(dirPart || '.', this.cwd, { all: true }) || [];
      candidates = items.filter((it) => it.name.startsWith(base)).map((it) => it.name + (it.node.type === 'dir' ? '/' : ''));
      prefix = dirPart;
      suffix = '';
    }

    if (!candidates.length) return;

    if (candidates.length === 1) {
      const name = candidates[0];
      const newToken = prefix + name + suffix;
      const start = pos - token.length;
      const next = v.slice(0, start) + newToken + v.slice(pos);
      this.ghost.value = next;
      const caret = start + newToken.length;
      this.ghost.setSelectionRange(caret, caret);
      this.renderInput();
      return;
    }

    this.println(`${this.promptText()}${v}`, 'dim');
    this.println(candidates.join('   '), 'bright');
    const common = candidates.reduce((acc, c) => {
      let i = 0;
      while (i < acc.length && i < c.length && acc[i] === c[i]) i++;
      return acc.slice(0, i);
    });
    if (common.length > token.length) {
      const start = pos - token.length;
      const newToken = prefix + common;
      this.ghost.value = v.slice(0, start) + newToken + v.slice(pos);
      this.ghost.setSelectionRange(start + common.length, start + common.length);
    }
    this.renderInput();
  }

  /* ── submit ──────────────────────────────────────────────── */
  async submit() {
    const value = this.ghost.value;

    if (this.askHandler) {
      const cb = this.askHandler;
      this.askHandler = null;
      this.println(`  ${value}`, 'dim');
      this.ghost.value = '';
      this.renderInput();
      this.renderPrompt();
      await cb(value);
      this.focusInput();
      return;
    }

    this.println(`${this.promptText()}${value}`.trimEnd());
    this.ghost.value = '';
    this.historyIndex = null;
    this.renderInput();
    if (!value.trim()) { this.focusInput(); return; }

    this.pushHistory(value.trim());
    this.busy = true;
    this.inputLine.classList.add('hidden');
    this.env.PWD = this.cwd;

    try {
      await execute(value, this);
    } catch (err) {
      this.println(`retro-sh: ${err && err.message ? err.message : 'unknown error'}`, 'err');
    }

    this.busy = false;
    this.inputLine.classList.remove('hidden');
    this.refreshPrompt();
    this.renderInput();
    this.focusInput();
    this.scrollDown();
  }

  ask(cb) {
    this.askHandler = cb;
    this.ghost.value = '';
    this.renderInput();
    this.renderPrompt();
    this.focusInput();
  }

  cancelAsk() {
    if (!this.askHandler) return;
    const cb = this.askHandler;
    this.askHandler = null;
    this.println('^C', 'dim');
    this.renderPrompt();
    this.focusInput();
    cb(null);
  }

  /* ── printing helpers ────────────────────────────────────── */
  print(text = '', cls = '') {
    return this.println(text, cls);
  }

  println(text = '', cls = '') {
    const div = document.createElement('div');
    div.className = 'line' + (cls ? ' ' + cls : '');
    div.dir = 'auto';
    div.textContent = String(text);
    this.el.insertBefore(div, this.inputLine);
    this.scrollDown();
    return div;
  }

  html(str = '') {
    const div = document.createElement('div');
    div.className = 'line';
    div.innerHTML = str;
    this.el.insertBefore(div, this.inputLine);
    this.scrollDown();
    return div;
  }

  mount(cls = '') {
    const div = document.createElement('div');
    if (cls) div.className = cls;
    this.el.insertBefore(div, this.inputLine);
    this.scrollDown();
    return div;
  }

  connected(el) {
    return !!(el && el.isConnected);
  }

  clear() {
    [...this.el.children].forEach((c) => {
      if (c !== this.inputLine) c.remove();
    });
    this.scrollDown();
  }

  scrollDown() {
    this.el.scrollTop = this.el.scrollHeight;
  }

  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  captureKeys(fn) {
    this.keyHandler = fn;
    return () => {
      if (this.keyHandler === fn) this.keyHandler = null;
    };
  }

  makeIO({ capture = false, stdin = '' } = {}) {
    const lines = [];
    const term = this;
    return {
      term,
      capture,
      stdin,
      print(text = '', cls = '') {
        const out = faOut(String(text));
        if (capture) lines.push(out);
        else term.println(out, cls);
      },
      html(str = '') {
        const out = faOut(String(str));
        if (capture) lines.push(out.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'));
        else term.html(out);
      },
      clear() {
        if (!capture) term.clear();
      },
      output() {
        return lines.join('\n');
      },
    };
  }

  /* ── theme, sound, environment ───────────────────────────── */
  applyTheme(name, persist = true) {
    this.theme = name;
    document.body.dataset.theme = name;
    if (this.modelLabel) this.modelLabel.textContent = THEME_LABEL[name] || THEME_LABEL.amber;
    if (persist) writeLS(LS_THEME, name);
  }

  setTheme(name) {
    this.applyTheme(name);
    this.env.THEME = name;
    this.saveEnv();
  }

  setSound(on) {
    this.sound = !!on;
    writeLS(LS_SOUND, this.sound);
  }

  saveEnv() { writeLS(LS_ENV, this.env); }
  saveAliases() { writeLS(LS_ALIAS, this.aliases); }

  /* ── editor ──────────────────────────────────────────────── */
  openEditor(path) {
    const { abs, node } = FS.lookup(path, this.cwd);
    if (node && node.type === 'dir') {
      this.println(`nano: ${path}: Is a directory`, 'err');
      return;
    }
    this.editingAbs = abs;
    this.editingPath = path;
    this.edFile.textContent = humanPath(abs);
    this.edText.value = node ? node.content || '' : '';
    this.edStatus.textContent = node ? t('file opened', 'فایل باز شد') : t('new file', 'فایل جدید');
    this.editorEl.classList.add('open');
    this.editorOpen = true;
    this.inputLine.classList.add('hidden');
    setTimeout(() => this.edText.focus(), 30);
  }

  saveEditor() {
    const r = FS.write(this.editingAbs, this.edText.value, false, '/');
    if (r.error) this.edStatus.textContent = r.error;
    else this.edStatus.textContent = `saved · ${new Date().toLocaleTimeString('en-US')}`;
  }

  closeEditor(save) {
    if (save) this.saveEditor();
    const value = this.edText.value;
    this.editorEl.classList.remove('open');
    this.editorOpen = false;
    this.inputLine.classList.remove('hidden');
    this.println(`${this.promptText()}nano ${this.editingPath}`, 'dim');
    this.println(`${this.editingPath} saved (${value.split('\n').length} lines)`, 'ok');
    this.focusInput();
    this.refreshPrompt();
  }

  /* ── boot ────────────────────────────────────────────────── */
  async boot(fast = false) {
    this.inputLine.classList.add('hidden');
    this.clear();
    const delay = fast ? 40 : 110;

    const kernel = [
      t('RetroOS 1.0 — amber phosphor terminal', 'رترو‌او‌اس ۱.۰ — ترمینال فسفر کهربایی'),
      t('retro-kernel 1.0.0 (1984)  ·  x86_64', 'کرنل رترو ۱.۰.۰ (۱۹۸۴)  ·  x86_64'),
      t('[  ok  ] mounting virtual filesystem on /', '[  ok  ] نصب فایل‌سیستم مجازی روی /'),
      t('[  ok  ] loading 30 memories', '[  ok  ] بارگذاری سی خاطره'),
      t('[  ok  ] warming phosphor at 3200K', '[  ok  ] گرم کردن فسفر روی ۳۲۰۰ کلوین'),
      t('[  warn ] fan noise module not found', '[  warn ] ماژول صدای فن پیدا نشد'),
    ];
    for (const line of kernel) {
      this.println(line, line.includes('warn') ? 'warn' : 'dim');
      await this.sleep(delay);
    }
    this.println('');

    for (const boxLine of ['  ┌────────────────────────────┐', '  │  R E T R O  T E R M  1984  │', '  └────────────────────────────┘']) {
      const el = this.println(boxLine, 'bright');
      el.dir = 'ltr';
    }
    this.println('');
    this.println(t('  A full terminal in your browser — files, folders, pipes, an editor, games and thirty memories.',
      '  یک ترمینال کامل در مرورگر تو — فایل، پوشه، پایپ، ویرایشگر، بازی و سی خاطره.'));
    this.println(t('  Type "help" to start. Then type "ask": thirty memories are waiting, one question at a time.',
      '  با «کمک» شروع کن. بعد «بپرس» را بزن: سی خاطره منتظرند، سؤال به سؤال.'));
    this.println(t('  Type "story" for the animated story in five chapters.', '  برای داستان متحرک پنج‌فصلی بنویس: داستان'));
    this.println('');
    this.println(t(`  history: ${this.history.length} commands saved   ·   theme: ${this.theme}`,
      `  تاریخچه: ${this.history.length} دستور   ·   تم: ${this.theme}`), 'dim');
    this.println('');

    this.inputLine.classList.remove('hidden');
    this.refreshPrompt();
    this.renderInput();
    this.focusInput();
    this.scrollDown();
  }

  async reboot() {
    this.busy = true;
    this.inputLine.classList.add('hidden');
    this.println('Saving session…', 'dim');
    await this.sleep(280);
    this.clear();
    await this.sleep(160);
    this.busy = false;
    await this.boot(true);
  }
}

function humanPath(abs) {
  return abs.startsWith(FS.home) ? '~' + abs.slice(FS.home.length) : abs;
}

export async function startTerminal() {
  applyLang();
  FS.load();
  const term = new Terminal();
  window.term = term;
  await term.boot();
}
