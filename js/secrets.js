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

/* ── persian versions of the thirty questions ────────────── */
const FA_MEM = {
  name: { title: 'اسم', q: 'شروع آسان: اسم کوچک من چیست؟', memory: 'آرمان. اولین کلمه‌ی کل این داستان.', hint: 'شش حرف. با ا شروع می‌شود.', a: ['آرمان'] },
  surname: { title: 'فامیل', q: 'و فامیلی که بعدش می‌آید؟', memory: 'حق‌شناس. دو کلمه، یک خانواده، کلی چای.', hint: 'دو کلمه: حقیقت، و کسی که آن را می‌داند.', a: ['حق شناس', 'حق‌شناس'] },
  fullname: { title: 'اسم کامل', q: 'اسم کامل من را یک‌نفس بگو.', memory: 'آرمان حق‌شناس — روی هر دفتر طراحی از ۲۰۰۱.', hint: 'اسم کوچک و فامیلی، بی‌چیز اضافه.', a: ['آرمان حق شناس', 'آرمان حق‌شناس'] },
  country: { title: 'کشور', q: 'از کدام کشور آمده‌ام؟', memory: 'ایران. نور آن‌جا از هر صفحه‌ای گرم‌تر است.', hint: 'بین عراق و افغانستان.', a: ['ایران'] },
  nationality: { title: 'ایرانی', q: 'از نظر پاسپورت چه هستم؟', memory: 'ایرانی، و هیچ‌وقت خسته از توضیح دادن.', hint: 'نام کشور، به‌اضافه‌ی «ی».', a: ['ایرانی'] },
  city: { title: 'اصفهان', q: 'وقتی می‌پرسند اهل کجایی، کدام شهر را می‌گویم؟', memory: 'اصفهان. نصف جهان، می‌گویند، و دروغ نمی‌گویند.', hint: 'کاشی آبی، سی‌وسه پل.', a: ['اصفهان'] },
  live: { title: 'شاهین‌شهر', q: 'و الان در کدام شهر کوچک‌تر زندگی می‌کنم؟', memory: 'شاهین‌شهر. آرام، پانزده دقیقه تا اصفهان، خوب برای کشیدن.', hint: 'یعنی «شاه شهر». دو کلمه.', a: ['شاهین شهر', 'شاهینشهر', 'شاهین‌شهر'] },
  province: { title: 'استان', q: 'این دو شهر در کدام استان‌اند؟', memory: 'هم‌نام با شهر. این کشور همه‌چیز را ساده نگه می‌دارد.', hint: 'همان اسمی که قبلاً گفتی.', a: ['اصفهان'] },
  brotherwho: { title: 'رادمان', q: 'رادمان برای من کیست؟', memory: 'رادمان. برادرم. تنها کسی که اجازه دارد ددلاین را قطع کند.', hint: 'دوست نیست. پسرخاله نیست. خانواده است.', a: ['برادر', 'برادرم'] },
  brothername: { title: 'برادر', q: 'برعکسش: اسم برادرم چیست؟', memory: 'رادمان — دو حرف از اسم من، و هیچ شبیه من.', hint: 'با ر شروع می‌شود، شش حرف.', a: ['رادمان'] },
  brotherback: { title: 'نامدار', q: 'اسم برادرم را برعکس بنویس.', memory: 'رادمان برعکس می‌شود نامدار. هنوز از این کار بدم می‌آید.', hint: 'ر-ا-د-م-ا-ن، از آخر.', a: ['نامدار'] },
  year: { title: '۲۰۰۱', q: 'در چه سالی به دنیا آمدم؟', memory: '۲۰۰۱. سال خوبی برای رسیدن یک طراح.', hint: 'دو هزار و ...', a: ['2001', '۲۰۰۱'] },
  month: { title: 'جولای', q: 'چه ماهی؟ وسط تابستان بود.', memory: 'جولای. گرم‌ترین ماه، که خیلی چیزها را توضیح می‌دهد.', hint: 'ماه هفتم میلادی.', a: ['جولای', 'ژوئیه'] },
  day: { title: 'بیست‌وهشتم', q: 'کدام روز از آن ماه؟', memory: 'بیست‌وهشتم. دو رقمی که هزار بار نوشته‌ام.', hint: 'یک روز قبل از ۲۹.', a: ['28', '۲۸', 'بیست و هشتم'] },
  birthday: { title: 'تاریخ کامل', q: 'تاریخ کامل: روز، ماه، سال.', memory: '۲۸ جولای ۲۰۰۱. اسد، ظاهراً.', hint: 'سه تکه. هر سه را می‌دانی.', a: ['28 جولای 2001', '۲۸ جولای ۲۰۰۱', '28 july 2001'] },
  age: { title: 'بیست‌وپنج', q: 'در ۲۰۲۶ چند ساله‌ام؟', memory: 'بیست‌وپنج، و هنوز توضیح می‌دهم گرافیک دیزاین «لوگو ساختن» نیست.', hint: '۲۰۲۶ منهای ۲۰۰۱.', a: ['25', '۲۵', 'بیست و پنج'] },
  job: { title: 'گرافیک دیزاینر', q: 'شغلم چیست؟', memory: 'گرافیک دیزاینر. تایپ، گرید، رنگ و یک بحث خوب.', hint: 'دو کلمه. اولی با گ شروع می‌شود.', a: ['گرافیک دیزاینر', 'طراح گرافیک', 'دیزاینر'] },
  field: { title: 'گرافیک دیزاین', q: 'و آن رشته، در دو کلمه؟', memory: 'گرافیک دیزاین: کارِ اجتناب‌ناپذیر کردن چیزها.', hint: 'نه نقاشی. نه معماری.', a: ['گرافیک دیزاین', 'گرافیک'] },
  tea: { title: 'چای', q: 'همیشه کنار کیبورد من چیست؟', memory: 'چای. داغ، پررنگ، و همیشه سرد تمام می‌شود.', hint: 'قهوه نه. هیچ‌وقت قهوه.', a: ['چای'] },
  glasses: { title: 'عینک', q: 'قبل از دیدن هر چیزی چه می‌گذارم؟', memory: 'عینک. بدون آن، کرنینگ فقط یک پیشنهاد است.', hint: 'دو عدسی و یک فریم.', a: ['عینک'] },
  lotr: { title: 'ارباب حلقه‌ها', q: 'کدام سه‌گانه را خط‌به‌خط از حفظ‌ام؟', memory: 'ارباب حلقه‌ها. هنوز زمان را با سال‌های شایر می‌شمارم.', hint: 'یک حلقه. سه فیلم. نیوزیلند.', a: ['ارباب حلقه ها', 'ارباب حلقه‌ها', 'lord of the rings'] },
  marvel: { title: 'مارول', q: 'و کدام جهان را هیچ‌وقت جا نمی‌اندازم؟', memory: 'مارول. از فیلم‌های بدش هم دفاع می‌کنم. این وفاداری است.', hint: 'دی‌سی نه.', a: ['مارول'] },
  daredevil: { title: 'دردویل', q: 'شخصیت محبوبم در آن جهان کیست؟', memory: 'دردویل. مردی نابینا که بهتر از همه می‌بیند. طبیعی است.', hint: 'وکیل روز، ماسک قرمز شب.', a: ['دردویل'] },
  matt: { title: 'مت مأرداک', q: 'اسم واقعی‌اش چیست؟', memory: 'مت مأرداک. هلز کیچن محله‌ی خوب شهر نیست.', hint: 'اسم کوچک مت. فامیل با م.', a: ['مت مأرداک', 'مت مورداک', 'مأرداک'] },
  kitchen: { title: 'هلز کیچن', q: 'از کدام محله محافظت می‌کند؟', memory: 'هلز کیچن. جایی که نرفته‌ام و خوب می‌شناسم.', hint: 'به نام آشپزخانه، در منهتن.', a: ['هلز کیچن'] },
  language: { title: 'فارسی', q: 'با چه زبانی فکر می‌کنم؟', memory: 'فارسی. زبان شعر و چانه‌زنی آرام.', hint: 'همان زبانی که همین حالا می‌خوانی.', a: ['فارسی', 'persian'] },
  initials: { title: 'آ.ح.', q: 'حروف اول اسمم چیست؟', memory: 'آ.ح. دو حرفی که هزار بار امضا کرده‌ام.', hint: 'حرف اول اسم و فامیل.', a: ['آح', 'ا ح', 'ah'] },
  halfworld: { title: 'نصف جهان', q: 'اصفهان یک لقب معروف دارد. چه؟', memory: 'اصفهان نصف جهان است. نصف دیگر هنوز رندر می‌شود.', hint: '«اصفهان ... جهان است.»', a: ['نصف جهان'] },
  siblings: { title: 'یک برادر', q: 'چند خواهر و برادر دارم؟', memory: 'یک برادر. کافی برای اینکه خانه پرصدا و صادق بماند.', hint: 'اسم‌هایی که تا حالا گفتی را بشمار.', a: ['یک', 'یک برادر'] },
  pen: { title: 'خودکار', q: 'آخرین و آسان‌ترین: چه چیزی موقع کار از دستم دور نیست؟', memory: 'خودکار. صفحه برای خروجی است؛ ایده از کاغذ شروع می‌شود.', hint: 'جوهر می‌گذارد، پیکسل نه.', a: ['خودکار', 'مداد', 'قلم'] },
};

/** Merge the persian fields for the active language */
export function loc(secret, lang = 'en') {
  if (!secret) return secret;
  const fa = FA_MEM[secret.id];
  if (lang !== 'fa' || !fa) return secret;
  return { ...secret, ...fa, a: [...secret.a, ...(fa.a || [])] };
}

/* ── answer matching ─────────────────────────────────────── */
const toAsciiDigits = (s) => s.replace(/[\u06f0-\u06f9]/g, (d) => String(d.charCodeAt(0) - 0x06f0));

const norm = (s) => toAsciiDigits(String(s == null ? '' : s))
  .toLowerCase()
  .replace(/[\u200c\u200e\u200f]/g, ' ')
  .replace(/[ي]/g, 'ی')
  .replace(/[ك]/g, 'ک')
  .replace(/[\u2019'`\u00b4]/g, '')
  .replace(/[^\p{L}\p{N}]+/gu, ' ')
  .trim()
  .replace(/^(?:i am|im|it is|its|the|a|an|my)\s+/, '')
  .trim();

const squash = (s) => norm(s).replace(/\s+/g, '');

export function matches(secret, text, lang = 'en') {
  const n = norm(text);
  if (!n) return false;
  const target = loc(secret, lang);
  return target.a.some((ans) => norm(ans) === n || squash(ans) === squash(text));
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
export function submitAnswer(secret, text, lang = 'en') {
  if (isFound(secret.id)) return { already: true, ok: false, count: foundCount(), total: SECRETS.length };
  if (!matches(secret, text, lang)) return { ok: false, already: false, count: foundCount(), total: SECRETS.length };
  const found = loadFound();
  found.push(secret.id);
  saveFound(found);
  const count = foundCount();
  return { ok: true, already: false, count, total: SECRETS.length, all: count >= SECRETS.length };
}

/** Someone typed a fact instead of a command: find the question it answers */
export function findByAnswer(text, lang = 'en') {
  for (const secret of SECRETS) {
    if (!isFound(secret.id) && matches(secret, text, lang)) return secret;
  }
  return null;
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
