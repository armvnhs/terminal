/* Text blocks and ASCII art */

export const COW = String.raw`        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||`;

export function cowsay(text) {
  const words = String(text || 'moo!').split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > 38) { if (cur) lines.push(cur); cur = w; }
    else cur = (cur ? cur + ' ' : '') + w;
  }
  if (cur) lines.push(cur);
  if (!lines.length) lines.push('moo!');
  const width = Math.max(...lines.map((l) => [...l].length), 5);
  const pad = (s) => s + ' '.repeat(Math.max(0, width - [...s].length));
  const top = ' ' + '_'.repeat(width + 2);
  const bottom = ' ' + '-'.repeat(width + 2);
  const body = lines.map((l, i) => {
    const open = lines.length === 1 ? '<' : i === 0 ? '/' : i === lines.length - 1 ? '\\' : '|';
    const close = lines.length === 1 ? '>' : i === 0 ? '\\' : i === lines.length - 1 ? '/' : '|';
    return `${open} ${pad(l)} ${close}`;
  });
  return [top, ...body, bottom, COW].join('\n');
}

/* ── 5×5 banner font ──────────────────────────────────────── */
const F = {
  A: [' ### ', '#   #', '#####', '#   #', '#   #'],
  B: ['#### ', '#   #', '#### ', '#   #', '#### '],
  C: [' ####', '#    ', '#    ', '#    ', ' ####'],
  D: ['#### ', '#   #', '#   #', '#   #', '#### '],
  E: ['#####', '#    ', '#### ', '#    ', '#####'],
  F: ['#####', '#    ', '#### ', '#    ', '#    '],
  G: [' ####', '#    ', '#  ##', '#   #', ' ####'],
  H: ['#   #', '#   #', '#####', '#   #', '#   #'],
  I: ['#####', '  #  ', '  #  ', '  #  ', '#####'],
  J: ['#####', '   # ', '   # ', '#  # ', ' ##  '],
  K: ['#   #', '#  # ', '###  ', '#  # ', '#   #'],
  L: ['#    ', '#    ', '#    ', '#    ', '#####'],
  M: ['#   #', '## ##', '# # #', '#   #', '#   #'],
  N: ['#   #', '##  #', '# # #', '#  ##', '#   #'],
  O: [' ### ', '#   #', '#   #', '#   #', ' ### '],
  P: ['#### ', '#   #', '#### ', '#    ', '#    '],
  Q: [' ### ', '#   #', '# # #', '#  # ', ' ## #'],
  R: ['#### ', '#   #', '#### ', '#  # ', '#   #'],
  S: [' ####', '#    ', ' ### ', '    #', '#### '],
  T: ['#####', '  #  ', '  #  ', '  #  ', '  #  '],
  U: ['#   #', '#   #', '#   #', '#   #', ' ### '],
  V: ['#   #', '#   #', '#   #', ' # # ', '  #  '],
  W: ['#   #', '#   #', '# # #', '## ##', '#   #'],
  X: ['#   #', ' # # ', '  #  ', ' # # ', '#   #'],
  Y: ['#   #', ' # # ', '  #  ', '  #  ', '  #  '],
  Z: ['#####', '   # ', '  #  ', ' #   ', '#####'],
  0: [' ### ', '#   #', '#   #', '#   #', ' ### '],
  1: ['  #  ', ' ##  ', '  #  ', '  #  ', '#####'],
  2: [' ### ', '#   #', '  ## ', ' #   ', '#####'],
  3: ['#### ', '    #', ' ### ', '    #', '#### '],
  4: ['#  # ', '#  # ', '#####', '   # ', '   # '],
  5: ['#####', '#    ', '#### ', '    #', '#### '],
  6: [' ### ', '#    ', '#### ', '#   #', ' ### '],
  7: ['#####', '   # ', '  #  ', ' #   ', ' #   '],
  8: [' ### ', '#   #', ' ### ', '#   #', ' ### '],
  9: [' ### ', '#   #', ' ####', '    #', ' ### '],
  ' ': ['     ', '     ', '     ', '     ', '     '],
  '!': ['  #  ', '  #  ', '  #  ', '     ', '  #  '],
  '?': [' ### ', '#   #', '  ## ', '     ', '  #  '],
  '-': ['     ', '     ', '#####', '     ', '     '],
  '.': ['     ', '     ', '     ', '     ', '  #  '],
  ':': ['     ', '  #  ', '     ', '  #  ', '     '],
};

export function banner(text) {
  const chars = [...String(text || 'RETRO').toUpperCase()].slice(0, 12);
  const rows = ['', '', '', '', ''];
  for (const ch of chars) {
    const glyph = F[ch] || F['?'];
    for (let i = 0; i < 5; i++) rows[i] += glyph[i].replace(/#/g, '█') + ' ';
  }
  return rows.join('\n');
}

/* ── neofetch ─────────────────────────────────────────────── */
export function neofetch(info) {
  const logo = [
    '  ┌────────────────┐  ',
    '  │ ┌────────────┐ │  ',
    '  │ │ ░░░░░░░░░░ │ │  ',
    '  │ │  R E T R O │ │  ',
    '  │ │ ░░░░░░░░░░ │ │  ',
    '  │ └────────────┘ │  ',
    '  └───┬────────┬───┘  ',
    '      └────────┘      ',
    '                      ',
  ];
  const rows = info.map((r) => r);
  const out = [];
  const h = Math.max(logo.length, rows.length);
  for (let i = 0; i < h; i++) {
    out.push((logo[i] || '                      ') + '  ' + (rows[i] || ''));
  }
  return out.join('\n');
}

/* ── dice ─────────────────────────────────────────────────── */
const DICE = {
  1: ['┌───────┐', '│       │', '│   ●   │', '│       │', '└───────┘'],
  2: ['┌───────┐', '│ ●     │', '│       │', '│     ● │', '└───────┘'],
  3: ['┌───────┐', '│ ●     │', '│   ●   │', '│     ● │', '└───────┘'],
  4: ['┌───────┐', '│ ●   ● │', '│       │', '│ ●   ● │', '└───────┘'],
  5: ['┌───────┐', '│ ●   ● │', '│   ●   │', '│ ●   ● │', '└───────┘'],
  6: ['┌───────┐', '│ ●   ● │', '│ ●   ● │', '│ ●   ● │', '└───────┘'],
};
export function dice(n = 1) {
  return DICE[n] ? DICE[n].join('\n') : DICE[1].join('\n');
}

/* ── coffee ───────────────────────────────────────────────── */
export const COFFEE = String.raw`
        ( (
         ) )
      ........
      |      |]
      \      /
       \____/
   ☕  coffee is ready, designer
`;

/* ── nyan cat ─────────────────────────────────────────────── */
export const NYAN = [
  String.raw`
   ▄▄▄▄▄▄▄▄▄▄▄▄
  █ ▀▄   ▄▀ █        ~  ~  ~  ~  ~
  █   ▀▄▀   █       ~  ~  ~  ~  ~
  █  ▄   ▄  █      ~  ~  ~  ~  ~
   ▀▀█▀▀█▀▀          ~  ~  ~  ~
     █  █
    ▀    ▀
`,
  String.raw`
   ▄▄▄▄▄▄▄▄▄▄▄▄
  █  ▄▄▄▄▄  █        ~  ~  ~  ~  ~
  █  █   █  █        ~  ~  ~  ~
  █  ▀▄▄▄▀  █      ~  ~  ~  ~  ~
   ▀▀█▀▀█▀▀          ~  ~  ~  ~
     █  █
    ▀    ▀
`,
];

/* ── dance ────────────────────────────────────────────────── */
export const DANCE = [
  '   o    \\o/    o\n   |     |     |\n  / \\   / \\   / \\',
  '   o    _o_    o\n   |     |     |\n  / \\   / \\   / \\',
  '  \\o/    o    \\o/\n   |     |     |\n  / \\   / \\   / \\',
  '   o    \\o/    o\n   |     |     |\n  / \\   / \\   / \\',
];

/* ── sl train ─────────────────────────────────────────────── */
export const SL = [
  '      ====        ________                ___________ ',
  '  _D _|  |_______/        \\__I_I_____===__|_________| ',
  '   |(_)---  |   H\\________/ |   |        =|___ ___|   ',
  '   /     |  |   H  |  |     |   |         | | |       ',
  '  |      |  |   H  |__--------------------| [___] |   ',
  '  | ________|___H__/__|_____/[][]~\\_______|       |   ',
  '  |/ |   |-----------I_____I [][] []  D   |=======|__ ',
  '__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__ ',
  ' |/-=|___|=    ||    ||    ||    |_____/~\\___/        ',
  '  \\_/      \\O=====O=====O=====O_/      \\_/            ',
].join('\n');

/* ── design palettes ──────────────────────────────────────── */
export const PALETTES = {
  'amber-dusk': ['#0d0702', '#3b1d08', '#7a3d0d', '#b36a12', '#ff9b21', '#ffd08a', '#e0662b', '#9ade6b'],
  'mono-print': ['#0e0e0e', '#2a2a2a', '#4f4f4f', '#7d7d7d', '#b0b0b0', '#d9d9d9', '#f2f2f2', '#ffffff'],
  'risograph': ['#0f1a2b', '#1f3a5f', '#2f6690', '#ff5a5f', '#ff8c42', '#ffd166', '#f6f1e7', '#12100e'],
  'terminal': ['#04120a', '#0c2c14', '#1e5c2f', '#3f8a52', '#57ff8a', '#86ff9f', '#d3ffe0', '#f4fff7'],
  'sunset': ['#1a0b1e', '#3d1233', '#7a1f4a', '#c73e5b', '#f26d45', '#ffb347', '#ffe6a7', '#fff6e0'],
  'bauhaus': ['#111111', '#e63946', '#f1c40f', '#1d3f8f', '#f7f3e8', '#2a9d8f', '#e76f51', '#264653'],
};

/* ── fortune, jokes, 8-ball, weather ──────────────────────── */
export const FORTUNES = [
  'A good design works even without color.',
  'If you love typefaces, love spacing more.',
  'Empty white is not filler; it is a decision.',
  'Every pixel should have a reason.',
  'The client is always right, not always correct.',
  'High contrast; fewer words, more impact.',
  'Design in black and white first, then add color.',
  'The best logo survives in a single color.',
  'The eye judges before the brain does.',
  'If everything matters, nothing matters.',
  'Break the grid, after you build it.',
  'Patience is a design tool.',
  'Negative space is an element too.',
  'A limited palette frees the form.',
  'One finished project beats ten perfect drafts.',
];

export const JOKES = [
  'Why do designers see well at night? They work in dark mode all day.',
  'I sent a client a CMYK file. They asked: so, can I edit it?',
  'I set font-weight to 700 once. It became nicer to me.',
  'Big lies: "I have the source file", "the layers are tidy", "I will deliver tomorrow".',
  'Between a designer and a 4GB file there is always someone saying: just compress it.',
  'Say "the font is not ready" once and your project never sleeps again.',
  'In a parallel universe the client says "make the logo bigger" and then "make it smaller".',
  'One wrong pixel, one hour of arguing.',
];

export const EIGHTBALL = [
  'Absolutely.', 'Think about it… then no.', 'No.', 'Maybe, but what do I know.',
  'Today.', 'Do not doubt it.', 'You will lose one of your palettes.',
  'The answer is the one you do not want.', 'Soon.', 'Not yet.',
];

export const WEATHER = [
  'Color today: amber, with a strong chance of vignette by late evening.',
  'Forecast: cloudy with noise, 16 degrees, 35% humidity.',
  'Heavy sun in the highlight layer, soft shadows.',
  'Showers of free fonts until tomorrow morning.',
];

/* ── rainbow ──────────────────────────────────────────────── */
export const RAINBOW = ['#ff5a5f', '#ff8c42', '#ffd166', '#9ade6b', '#57c7ff', '#b184ff', '#ff6ec7'];

export const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
