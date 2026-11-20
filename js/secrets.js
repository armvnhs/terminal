/* 30 memories locked in the terminal — only people who know Arman can open them */

const KEY = 'retroterm.memories.v1';
const DAD_KEY = 'retroterm.dad.v1';

export const SECRETS = [
  {
    id: 'name',
    q: 'Start easy. What is my first name?',
    a: ['arman'],
    title: 'the name',
    memory: 'Arman. The first word of the whole story.',
    hint: 'Six letters. Starts with A, ends with n.',
  },
  {
    id: 'surname',
    q: 'And the family name that comes after it?',
    a: ['hagh shenas', 'haghshenas', 'hagh shennas', 'haghshenas'],
    title: 'the family name',
    memory: 'Hagh Shenas. Two words, one family, a lot of tea.',
    hint: 'Two words: the truth, and the one who knows it.',
  },
  {
    id: 'fullname',
    q: 'Say my full name in one breath.',
    a: ['arman hagh shenas', 'arman haghshenas', 'arman hagh shennas'],
    title: 'the whole name',
    memory: 'Arman Hagh Shenas — written on every sketchbook since 2001.',
    hint: 'First name, then family name. Nothing in between.',
  },
  {
    id: 'country',
    q: 'Which country do I come from?',
    a: ['iran'],
    title: 'the country',
    memory: 'Iran. The light there is warmer than any screen.',
    hint: 'Between Iraq and Afghanistan.',
  },
  {
    id: 'nationality',
    q: 'And what do you call me, passport-wise?',
    a: ['iranian', 'persian'],
    title: 'iranian',
    memory: 'Iranian, and never tired of explaining where that is.',
    hint: 'The country name, plus -ian.',
  },
  {
    id: 'city',
    q: 'Which city do I name when someone asks where I am from?',
    a: ['isfahan', 'esfahan'],
    title: 'isfahan',
    memory: 'Isfahan. Half the world, they say, and they are not wrong.',
    hint: 'Blue tiles, thirty-three arches, one river.',
  },
  {
    id: 'live',
    q: 'And which smaller city do I actually live in now?',
    a: ['shahin shahr', 'shahinshahr', 'shahin shahre'],
    title: 'shahin shahr',
    memory: 'Shahin Shahr. Quiet, fifteen minutes from Isfahan, good for drawing.',
    hint: 'The name means "king of the city". Two words.',
  },
  {
    id: 'province',
    q: 'Which province are both of those cities in?',
    a: ['isfahan', 'esfahan'],
    title: 'the province',
    memory: 'Same name as the city. This country likes to keep things simple.',
    hint: 'You already said it once.',
  },
  {
    id: 'brotherwho',
    q: 'Who is Radman to me?',
    a: ['brother', 'my brother', 'little brother', 'bro'],
    title: 'radman',
    memory: 'Radman. My brother. The only person allowed to interrupt a deadline.',
    hint: 'Not a friend. Not a cousin. Family.',
  },
  {
    id: 'brothername',
    q: 'The other way round: what is my brother called?',
    a: ['radman'],
    title: 'the brother',
    memory: 'Radman — two letters from my own name, and nothing like me.',
    hint: 'Starts with R, six letters.',
  },
  {
    id: 'brotherback',
    q: 'Now spell my brother\'s name backwards.',
    a: ['namdar'],
    title: 'namdar',
    memory: 'Radman backwards is Namdar. He still hates when I do that.',
    hint: 'R-a-d-m-a-n, read from the other end.',
  },
  {
    id: 'year',
    q: 'Which year was I born?',
    a: ['2001'],
    title: '2001',
    memory: '2001. A good year for a designer to arrive.',
    hint: 'Two thousand and ...',
  },
  {
    id: 'month',
    q: 'Which month? It was the middle of summer.',
    a: ['july'],
    title: 'july',
    memory: 'July. The hottest month, which explains most of my opinions.',
    hint: 'The seventh month.',
  },
  {
    id: 'day',
    q: 'Which day of that month?',
    a: ['28', '28th', 'twenty eighth', 'twentyeight'],
    title: 'the 28th',
    memory: 'The 28th. Two digits I have typed a thousand times.',
    hint: 'One day before the 29th.',
  },
  {
    id: 'birthday',
    q: 'Give me the whole date: day, month, year.',
    a: ['28 july 2001', '28th july 2001', 'july 28 2001', 'july 28th 2001'],
    title: 'the date',
    memory: '28 July 2001. Leo, apparently, though I never checked.',
    hint: 'Three pieces. You already know all three.',
  },
  {
    id: 'age',
    q: 'How old am I now, in 2026?',
    a: ['25', 'twenty five', 'twentyfive'],
    title: 'twenty-five',
    memory: 'Twenty-five, and still explaining that graphic design is not "making logos".',
    hint: '2026 minus 2001.',
  },
  {
    id: 'job',
    q: 'What do I do for a living?',
    a: ['graphic designer', 'designer'],
    title: 'graphic designer',
    memory: 'Graphic designer. Type, grid, colour, and a good argument.',
    hint: 'Two words. The first one starts with G.',
  },
  {
    id: 'field',
    q: 'And which field is that, in two words?',
    a: ['graphic design'],
    title: 'graphic design',
    memory: 'Graphic design: the job of making things look inevitable.',
    hint: 'Not painting. Not architecture.',
  },
  {
    id: 'tea',
    q: 'What is always next to my keyboard?',
    a: ['tea', 'chai'],
    title: 'tea',
    memory: 'Tea. Hot, strong, and always finished cold.',
    hint: 'Not coffee. Never coffee.',
  },
  {
    id: 'glasses',
    q: 'What do I put on before I look at anything?',
    a: ['glasses', 'spectacles', 'eyeglasses'],
    title: 'glasses',
    memory: 'Glasses. Without them, kerning is only a suggestion.',
    hint: 'Two lenses and a frame.',
  },
  {
    id: 'lotr',
    q: 'Which trilogy can I quote line by line?',
    a: ['lord of the rings', 'lotr', 'the lord of the rings'],
    title: 'lord of the rings',
    memory: 'Lord of the Rings. I still keep time in Shire years.',
    hint: 'One ring. Three films. New Zealand.',
  },
  {
    id: 'marvel',
    q: 'And which universe do I never skip?',
    a: ['marvel', 'mcu'],
    title: 'marvel',
    memory: 'Marvel. I defend the bad ones too. That is loyalty.',
    hint: 'Not DC.',
  },
  {
    id: 'daredevil',
    q: 'Who is my favourite character in that universe?',
    a: ['daredevil', 'dare devil'],
    title: 'daredevil',
    memory: 'Daredevil. A blind man who sees better than everyone. Of course.',
    hint: 'A lawyer by day, a red mask by night.',
  },
  {
    id: 'matt',
    q: 'What is his real name?',
    a: ['matt murdock', 'matthew murdock', 'murdock'],
    title: 'matt murdock',
    memory: 'Matt Murdock. Hell\'s Kitchen is not the nice part of town.',
    hint: 'First name Matt. Last name starts with M.',
  },
  {
    id: 'kitchen',
    q: 'Which neighbourhood does he protect?',
    a: ['hells kitchen', 'hell s kitchen', 'hells kitchen ny'],
    title: 'hell\'s kitchen',
    memory: 'Hell\'s Kitchen. A place I have never been and know too well.',
    hint: 'Named after a kitchen. In Manhattan.',
  },
  {
    id: 'language',
    q: 'What language do I think in?',
    a: ['persian', 'farsi'],
    title: 'persian',
    memory: 'Persian. The language of poetry, and of very slow haggling.',
    hint: 'Also called Farsi.',
  },
  {
    id: 'initials',
    q: 'What are my initials?',
    a: ['ah', 'a h', 'a.h.', 'a.h'],
    title: 'A.H.',
    memory: 'A.H. Two letters I have signed a thousand times.',
    hint: 'First letter of each name.',
  },
  {
    id: 'halfworld',
    q: 'Isfahan has a famous nickname. Which one?',
    a: ['half the world', 'half of the world', 'nesf e jahan', 'nesfe jahan', 'nesf-e jahan'],
    title: 'half the world',
    memory: 'Isfahan is half the world. The other half is still rendering.',
    hint: '"Isfahan is ... the world."',
  },
  {
    id: 'siblings',
    q: 'How many siblings do I have?',
    a: ['one', 'one brother', '1 brother', 'just one', 'a brother'],
    title: 'one brother',
    memory: 'One brother. Enough to keep the house loud and honest.',
    hint: 'Count the names you have already said.',
  },
  {
    id: 'pen',
    q: 'Last one, and the easiest: what is never far from my hand while I work?',
    a: ['pen', 'pencil'],
    title: 'the pen',
    memory: 'A pen. Screens are for output; the idea still starts on paper.',
    hint: 'It leaves ink, not pixels.',
  },
];

/* ── answer matching ─────────────────────────────────────── */
const norm = (s) => String(s == null ? '' : s)
  .toLowerCase()
  .replace(/[\u2019'`\u00b4]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/^(?:i am|im|it is|its|the|a|an|my)\s+/, '')
  .trim();

const squash = (s) => norm(s).replace(/\s+/g, '');

export function matches(secret, text) {
  const n = norm(text);
  if (!n) return false;
  return secret.a.some((ans) => norm(ans) === n || squash(ans) === squash(text));
}

/* ── progress storage ────────────────────────────────────── */
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

export function isFound(id) {
  return loadFound().includes(id);
}

export function pendingSecrets() {
  const found = loadFound();
  return SECRETS.filter((s) => !found.includes(s.id));
}

export function allFound() {
  return foundCount() >= SECRETS.length;
}

/** Check an answer for one specific question and unlock it if right */
export function submitAnswer(secret, text) {
  if (isFound(secret.id)) return { already: true, ok: false, count: foundCount(), total: SECRETS.length };
  if (!matches(secret, text)) return { ok: false, already: false, count: foundCount(), total: SECRETS.length };
  const found = loadFound();
  found.push(secret.id);
  saveFound(found);
  const count = foundCount();
  return { ok: true, already: false, count, total: SECRETS.length, all: count >= SECRETS.length };
}

/** Someone typed a fact instead of a command: which memory does it belong to? */
export function findAnyAnswer(text) {
  const found = [];
  for (const secret of SECRETS) {
    if (!matches(secret, text)) continue;
    if (!isFound(secret.id)) return { secret, found: false };
    found.push(secret);
  }
  return found.length ? { secret: found[0], found: true } : null;
}

/** Only the still-locked ones */
export function findByAnswer(text) {
  const hit = findAnyAnswer(text);
  return hit && !hit.found ? hit.secret : null;
}

export function resetSecrets() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(DAD_KEY);
  } catch { /* ignore */ }
}

/* ── the father ──────────────────────────────────────────── */
export function dadPresent() {
  try { return localStorage.getItem(DAD_KEY) === '1'; } catch { return false; }
}

export function dadArrives() {
  try { localStorage.setItem(DAD_KEY, '1'); } catch { /* ignore */ }
}
