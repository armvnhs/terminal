/* THE AMBER ROOM — an animated story in five chapters */

const ART = {
  desk: String.raw`
      ______________________
     |  __________________  |
     | |                  | |
     | |   _.-'''''-._     | |
     | |  /  o     o  \    | |
     | |  \     ^     /    | |
     | |   '-._____.-'     | |
     | |__________________| |
     |______________________|
        |              |
   _____|______________|_____
`,
  rain: String.raw`
   |  /  /    /   /   /  |
   | /  /    /   /   /   |
   |/  /    /   /   /    |
   |  /    /   /   /     |
   | /    /   /   /   /  |
   |____________________ |
`,
  garden: String.raw`
        /\   /\   /\   /\
       /  \ /  \ /  \ /  \
      /____/____/____/____\
      |  []   []   []   [] |
      |  []   []   []   [] |
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
`,
  chair: String.raw`
        _____
       |     |     _____
       |  o  |    |     |
       |_____|    |  o  |
       |     |    |_____|
       |     |    |     |
       |_____|    |_____|
`,
  door: String.raw`
        ______________
       |              |
       |      __      |
       |     |  |     |
       |     |  |     |
       |     |__|     |
       |              |
       |______________|
          /|      |\
`,
};

const CHAPTERS = [
  {
    theme: 'amber',
    art: ART.desk,
    chord: [196, 246.9, 329.6],
    title: 'ONE — THE DESK',
    lines: [
      '3:12 in the morning. The monitor is warm before you touch it.',
      'Someone left it running in the storage room, under a sheet, for years.',
      'The glass still remembers the colour of Isfahan at sunset.',
      'A cursor blinks. It is waiting for a name.',
    ],
  },
  {
    theme: 'green',
    art: ART.rain,
    chord: [220, 277.2, 329.6],
    title: 'TWO — THE MESSAGE',
    lines: [
      'Rain on a window that is not there.',
      'A line arrives with no sender: "still drinking tea at midnight?"',
      'Only three people ever knew that. Two of them are family.',
      'The third one is you, twenty years ago.',
    ],
  },
  {
    theme: 'ice',
    art: ART.garden,
    chord: [261.6, 329.6, 392],
    title: 'THREE — THE GARDEN',
    lines: [
      'The screen cools to blue and grows a garden.',
      'Blue tiles, thirty-three arches, a river with no water in it.',
      'You are six, holding a pen you were not allowed to hold.',
      'Nobody stops you this time.',
    ],
  },
  {
    theme: 'magenta',
    art: ART.chair,
    chord: [174.6, 220, 261.6],
    title: 'FOUR — THE BROTHER',
    lines: [
      'A chair scrapes the floor. Someone sits down without asking.',
      'Radman used to steal your pens. Now he steals your deadlines.',
      'The screen turns the colour of a Daredevil hallway at 2am.',
      'He says nothing. He does not have to.',
    ],
  },
  {
    theme: 'bone',
    art: ART.door,
    chord: [146.8, 220, 293.7],
    title: 'FIVE — THE DOOR',
    lines: [
      'The last room is empty except for a door and a chair.',
      'Your father sits down first. He says: "Go on. Open them."',
      '"I remember all thirty. I was there for most of them."',
      'Thirty memories. One hand on your shoulder.',
    ],
  },
];

const TEXT = {
  soundOff: '  sound is off. type "sound on" and run story again for the full thing.',
  stop: '  story stopped. the room stays where it is.',
  next: '  [ Enter ] next chapter   ·   [ Ctrl+C ] stop',
  endTitle: 'THE END — THE ROOM IS YOURS',
  end: [
    'The monitor settles back to amber. The chair is empty again.',
    'Thirty memories are still locked inside it. Only people who know you can open them.',
  ],
  hints: 'ask — the thirty questions   ·   father — help when stuck   ·   snake / ttt / guess — the games in these colours',
};

function tone(term, freq, dur = 0.05, type = 'square', vol = 0.02, when = 0) {
  if (!term.sound) return;
  try {
    const ctx = term.audio || (term.audio = new (window.AudioContext || window.webkitAudioContext)());
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + when;
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  } catch { /* ignore */ }
}

function chord(term, freqs) {
  freqs.forEach((f, i) => tone(term, f, 0.9, 'triangle', 0.03, i * 0.06));
}

async function typeLine(term, text, cls = '', speed = 16) {
  const div = term.println('', cls);
  const chars = [...String(text)];
  for (let i = 0; i < chars.length; i++) {
    if (!div.isConnected) return;
    div.textContent = chars.slice(0, i + 1).join('');
    if (i % 2 === 0) tone(term, 520 + ((i * 37) % 260), 0.02, 'square', 0.008);
    if (i % 4 === 0) {
      term.scrollDown();
      await term.sleep(speed);
    }
  }
  term.scrollDown();
  return div;
}

function waitStep(term) {
  return new Promise((resolve) => {
    const release = term.captureKeys((e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        release();
        resolve(true);
      } else if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === 'c') {
        e.preventDefault();
        release();
        resolve(false);
      }
    });
  });
}

export async function playStory(term) {
  const previousTheme = term.theme;

  if (!term.sound) {
    term.println(TEXT.soundOff, 'dim');
    term.println('');
  }

  for (let i = 0; i < CHAPTERS.length; i++) {
    const chapter = CHAPTERS[i];
    const isLast = i === CHAPTERS.length - 1;

    term.setTheme(chapter.theme);
    term.clear();
    chord(term, chapter.chord);
    term.screen.classList.add('chapter-flash');
    await term.sleep(240);
    term.screen.classList.remove('chapter-flash');

    term.println(`  ${chapter.title}`, 'bright');
    term.println('');

    const art = term.println(chapter.art, 'dim');
    await term.sleep(260);
    if (!art.isConnected) {
      term.setTheme(previousTheme);
      return;
    }

    term.println('');
    for (const line of chapter.lines) {
      await typeLine(term, '  ' + line, '', 15);
      await term.sleep(220);
      if (!term.busy) {
        term.setTheme(previousTheme);
        return;
      }
    }

    term.println('');
    term.println(isLast ? TEXT.next : TEXT.next, 'dim');

    const ok = await waitStep(term);
    if (!ok) {
      term.println(TEXT.stop, 'dim');
      term.setTheme(previousTheme);
      return;
    }
  }

  term.clear();
  chord(term, [261.6, 329.6, 392, 523.3]);
  term.println(`  ${TEXT.endTitle}`, 'ok');
  term.println('');
  for (const line of TEXT.end) {
    await typeLine(term, '  ' + line, 'bright', 14);
    await term.sleep(200);
  }
  term.println('');
  term.println(`  ${TEXT.hints}`, 'dim');
  term.println('');
  term.setTheme(previousTheme);
  term.refreshPrompt();
}

export const STORY_CHAPTERS = CHAPTERS;
export const STORY_TEXT = TEXT;
