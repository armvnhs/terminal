/* 30 hidden secrets */

const KEY = 'retroterm.secrets.v1';

export const SECRETS = [
  { id: 'matrix', triggers: ['matrix', 'cmatrix'], title: 'matrix rain', hint: 'Green rain; take its name from a 1999 film.' },
  { id: 'hack', triggers: ['hack', 'hack the planet'], title: 'being a hacker', hint: 'A command that pretends to hack something.' },
  { id: 'sl', triggers: ['sl'], title: 'the train', hint: 'What arrives when you mistype ls?' },
  { id: 'cowsay', triggers: ['cowsay'], title: 'talking cow', hint: 'A cow that repeats whatever you say.' },
  { id: 'fortune', triggers: ['fortune'], title: 'fortune', hint: 'A random sentence about design.' },
  { id: 'neofetch', triggers: ['neofetch'], title: 'system badge', hint: 'Shows system info next to a logo.' },
  { id: 'rainbow', triggers: ['rainbow'], title: 'rainbow', hint: 'Give every letter its own color.' },
  { id: 'banner', triggers: ['banner'], title: 'block banner', hint: 'Big blocky letters from your name.' },
  { id: 'weather', triggers: ['weather'], title: 'color weather', hint: 'The forecast, but in palette terms.' },
  { id: 'joke', triggers: ['joke'], title: 'joke', hint: 'A joke for designers.' },
  { id: 'dice', triggers: ['dice'], title: 'dice', hint: 'A six-sided die in the terminal.' },
  { id: 'coinflip', triggers: ['coinflip', 'coin', 'flip'], title: 'coin flip', hint: 'Toss a coin.' },
  { id: '8ball', triggers: ['8ball', 'eightball'], title: 'magic ball', hint: 'Ask the ball; it answers.' },
  { id: 'sandwich', triggers: ['sudo make me a sandwich'], title: 'root sandwich', hint: 'Ask the system for a sandwich with sudo.' },
  { id: 'rmrf', triggers: ['rm -rf /', 'rm -rf /*', 'rm -rf --no-preserve-root /'], title: 'total wipe', hint: 'Try the most dangerous command in the world (harmless here).' },
  { id: 'xyzzy', triggers: ['xyzzy'], title: 'magic word', hint: 'A magic word from Colossal Cave.' },
  { id: 'hello', triggers: ['hello', 'hi'], title: 'hello', hint: 'Just say hello.' },
  { id: '42', triggers: ['42'], title: 'answer to everything', hint: 'A number from the hitchhiker guide.' },
  { id: 'hal', triggers: ['hal', 'open the pod bay doors'], title: 'HAL', hint: '"Open the pod bay doors, HAL."' },
  { id: 'rickroll', triggers: ['rickroll', 'never gonna give you up'], title: 'rickroll', hint: 'Never, ever going to give you up.' },
  { id: 'nyan', triggers: ['nyan', 'nyancat'], title: 'space cat', hint: 'A cat with a rainbow trail.' },
  { id: 'dance', triggers: ['dance', 'dancing'], title: 'dance', hint: 'Make the terminal dance.' },
  { id: 'coffee', triggers: ['coffee', 'brew'], title: 'coffee', hint: 'Main fuel for a graphic designer.' },
  { id: 'pipes', triggers: ['pipes'], title: 'pipes', hint: 'The classic screensaver, in a terminal.' },
  { id: 'konami', triggers: ['konami', 'up up down down'], title: 'konami code', hint: '↑ ↑ ↓ ↓ ← → ← → B A' },
  { id: 'root', triggers: ['sudo su', 'su', 'sudo -i'], title: 'root access', hint: 'Become root with sudo. Or do not.' },
  { id: 'git', triggers: ['git', 'git status'], title: 'git repo', hint: 'Check the repo status; nothing is committed.' },
  { id: 'vim', triggers: ['vim', 'vi'], title: 'exiting vim', hint: 'Find the way out of vim.' },
  { id: 'palette', triggers: ['palette', 'colors'], title: 'color palettes', hint: 'Six ready-made palettes for the next project.' },
  { id: 'shutdown', triggers: ['shutdown', 'poweroff', 'reboot'], title: 'shutdown', hint: 'Turn the world off. Do not worry.' },
];

function loadFound() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveFound(ids) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...new Set(ids)]));
  } catch { /* ignore */ }
}

export function foundIds() {
  return loadFound();
}

export function foundCount() {
  return loadFound().length;
}

export function totalSecrets() {
  return SECRETS.length;
}

/** If the line matches a secret, return it (and record it) the first time */
export function checkLine(line) {
  const norm = String(line || '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (!norm) return null;
  for (const s of SECRETS) {
    if (s.triggers.some((tr) => norm === tr || norm.startsWith(tr + ' ') || norm.startsWith(tr + '='))) {
      const found = loadFound();
      if (!found.includes(s.id)) {
        found.push(s.id);
        saveFound(found);
        return s;
      }
    }
  }
  return null;
}

export function isFound(id) {
  return loadFound().includes(id);
}

export function resetSecrets() {
  saveFound([]);
}
