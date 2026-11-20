/* THE AMBER ROOM — an animated story in five chapters */

import { getLang } from './i18n.js';

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
    en: {
      title: 'ONE — THE DESK',
      lines: [
        '3:12 in the morning. The monitor is warm before you touch it.',
        'Someone left it running in the storage room, under a sheet, for years.',
        'The glass still remembers the colour of Isfahan at sunset.',
        'A cursor blinks. It is waiting for a name.',
      ],
    },
    fa: {
      title: 'یک — میز',
      lines: [
        'سه و دوازده دقیقه‌ی شب. مانیتور قبل از اینکه دست بزنی گرم است.',
        'کسی سال‌ها آن را در انبار، زیر یک ملافه، روشن گذاشته بود.',
        'شیشه هنوز رنگ غروب اصفهان را به یاد دارد.',
        'یک کرسر چشمک می‌زند. منتظر یک اسم است.',
      ],
    },
  },
  {
    theme: 'green',
    art: ART.rain,
    chord: [220, 277.2, 329.6],
    en: {
      title: 'TWO — THE MESSAGE',
      lines: [
        'Rain on a window that is not there.',
        'A line arrives with no sender: "still drinking tea at midnight?"',
        'Only three people ever knew that. Two of them are family.',
        'The third one is you, twenty years ago.',
      ],
    },
    fa: {
      title: 'دو — پیام',
      lines: [
        'باران روی پنجره‌ای که وجود ندارد.',
        'خطی بی‌فرستنده می‌رسد: «هنوز نصف‌شب چای می‌خوری؟»',
        'این را فقط سه نفر می‌دانستند. دو نفرشان خانواده‌اند.',
        'نفر سوم تو هستی، بیست سال پیش.',
      ],
    },
  },
  {
    theme: 'ice',
    art: ART.garden,
    chord: [261.6, 329.6, 392],
    en: {
      title: 'THREE — THE GARDEN',
      lines: [
        'The screen cools to blue and grows a garden.',
        'Blue tiles, thirty-three arches, a river with no water in it.',
        'You are six, holding a pen you were not allowed to hold.',
        'Nobody stops you this time.',
      ],
    },
    fa: {
      title: 'سه — باغ',
      lines: [
        'صفحه آبی و سرد می‌شود و باغی می‌روید.',
        'کاشی آبی، سی‌وسه طاق، رودی که آب ندارد.',
        'شش ساله‌ای و خودکاری در دست داری که اجازه نداشتی.',
        'این بار کسی جلویت را نمی‌گیرد.',
      ],
    },
  },
  {
    theme: 'magenta',
    art: ART.chair,
    chord: [174.6, 220, 261.6],
    en: {
      title: 'FOUR — THE BROTHER',
      lines: [
        'A chair scrapes the floor. Someone sits down without asking.',
        'Radman used to steal your pens. Now he steals your deadlines.',
        'The screen turns the colour of a Daredevil hallway at 2am.',
        'He says nothing. He does not have to.',
      ],
    },
    fa: {
      title: 'چهار — برادر',
      lines: [
        'صندلی روی زمین کشیده می‌شود. کسی بی‌اجازه می‌نشیند.',
        'رادمان قبلاً خودکارهایت را می‌دزدید. حالا ددلاین‌هایت را می‌دزدد.',
        'صفحه رنگ راهروی دردویل را می‌گیرد، ساعت دو صبح.',
        'چیزی نمی‌گوید. لازم هم نیست.',
      ],
    },
  },
  {
    theme: 'bone',
    art: ART.door,
    chord: [146.8, 220, 293.7],
    en: {
      title: 'FIVE — THE DOOR',
      lines: [
        'The last room is empty except for a door and a chair.',
        'Your father sits down first. He says: "Go on. Open them."',
        '"I remember all thirty. I was there for most of them."',
        'Thirty memories. One hand on your shoulder.',
      ],
    },
    fa: {
      title: 'پنج — در',
      lines: [
        'اتاق آخر خالی است، جز یک در و یک صندلی.',
        'پدرت اول می‌نشیند. می‌گوید: «برو. بازشان کن.»',
        '«هر سی تا را یادم است. بیشترشان را من بودم.»',
        'سی خاطره. یک دست روی شانه‌ات.',
      ],
    },
  },
];

const TEXT = {
  en: {
    soundOff: '  sound is off. type "sound on" and run story again for the full thing.',
    stop: '  story stopped. the room stays where it is.',
    next: '  [ Enter ] next chapter   ·   [ Ctrl+C ] stop',
    endTitle: 'THE END — THE ROOM IS YOURS',
    end: [
      'The monitor settles back to amber. The chair is empty again.',
      'Thirty memories are still locked inside it. Only people who know you can open them.',
    ],
    hints: 'ask — the thirty questions   ·   dad — help when stuck   ·   snake / ttt / guess — the games in these colours',
  },
  fa: {
    soundOff: '  صدا خاموش است. بنویس sound on و داستان را دوباره اجرا کن تا کاملش را ببینی.',
    stop: '  داستان متوقف شد. اتاق همان‌جا می‌ماند.',
    next: '  [ Enter ] فصل بعد   ·   [ Ctrl+C ] توقف',
    endTitle: 'پایان — اتاق مال توست',
    end: [
      'مانیتور به کهربایی برمی‌گردد. صندلی دوباره خالی است.',
      'سی خاطره هنوز داخلش قفل است. فقط کسانی که تو را می‌شناسند بازش می‌کنند.',
    ],
    hints: 'ask — سی سؤال   ·   dad — کمک وقتی گیر کردی   ·   snake / ttt / guess — بازی‌ها با همین رنگ‌ها',
  },
};

const txt = () => TEXT[getLang()] || TEXT.en;
const chapterText = (chapter) => chapter[getLang()] || chapter.en;

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

export async function playStory(term, { startChapter = 0 } = {}) {
  const previousTheme = term.theme;
  const copy = txt();

  if (!term.sound) {
    term.println(copy.soundOff, 'dim');
    term.println('');
  }

  for (let i = startChapter; i < CHAPTERS.length; i++) {
    const chapter = CHAPTERS[i];
    const text = chapterText(chapter);
    const isLast = i === CHAPTERS.length - 1;

    term.setTheme(chapter.theme);
    term.clear();
    chord(term, chapter.chord);
    term.screen.classList.add('chapter-flash');
    await term.sleep(240);
    term.screen.classList.remove('chapter-flash');

    term.println(`  ${text.title}`, 'bright');
    term.println('');

    const art = term.println(chapter.art, 'dim');
    await term.sleep(260);
    if (!art.isConnected) return;

    term.println('');
    for (const line of text.lines) {
      await typeLine(term, '  ' + line, '', 15);
      await term.sleep(220);
      if (!term.busy && !term.captureKeyed) {
        /* the terminal was reset mid-story */
        term.setTheme(previousTheme);
        return;
      }
    }

    term.println('');
    term.println(isLast ? copy.next : copy.next, 'dim');

    const ok = await waitStep(term);
    if (!ok) {
      term.println(copy.stop, 'dim');
      term.setTheme(previousTheme);
      return;
    }
  }

  term.clear();
  chord(term, [261.6, 329.6, 392, 523.3]);
  term.println(`  ${copy.endTitle}`, 'ok');
  term.println('');
  for (const line of copy.end) {
    await typeLine(term, '  ' + line, 'bright', 14);
    await term.sleep(200);
  }
  term.println('');
  term.println(`  ${copy.hints}`, 'dim');
  term.println('');
  term.setTheme(previousTheme);
  term.refreshPrompt();
}

export const STORY_CHAPTERS = CHAPTERS;
export const STORY_TEXT = TEXT;
