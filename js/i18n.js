/* one terminal, two languages */

const KEY = 'retroterm.lang.v1';

let lang = (() => {
  try { return localStorage.getItem(KEY) === 'fa' ? 'fa' : 'en'; } catch { return 'en'; }
})();

export function getLang() { return lang; }
export function isFa() { return lang === 'fa'; }
export const t = (en, fa) => (lang === 'fa' ? fa : en);

export function applyLang() {
  const fa = lang === 'fa';
  try {
    document.documentElement.lang = fa ? 'fa' : 'en';
    document.body.dataset.lang = fa ? 'fa' : 'en';
  } catch { /* ignore */ }
}

export function setLang(next, term) {
  lang = next === 'fa' ? 'fa' : 'en';
  try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
  applyLang();
  if (term && typeof term.refreshPrompt === 'function') term.refreshPrompt();
  return lang;
}

/* ── persian names for the commands ──────────────────────── */
export const FA_COMMANDS = {
  'فهرست': 'ls', 'پوشه': 'cd', 'مسیر': 'pwd', 'بخوان': 'cat', 'سر': 'head', 'ته': 'tail',
  'بساز': 'touch', 'پوشه‌بساز': 'mkdir', 'حذف': 'rm', 'کپی': 'cp', 'جابه‌جا': 'mv',
  'جستجو': 'find', 'درخت': 'tree', 'جستار': 'grep', 'شمارش': 'wc', 'مرتب': 'sort',
  'یکتا': 'uniq', 'معکوس': 'rev', 'بگو': 'echo', 'حساب': 'calc', 'من': 'whoami',
  'میزبان': 'hostname', 'کاربر': 'user', 'شناسه': 'id', 'سیستم': 'uname', 'تاریخ': 'date',
  'روشنایی': 'uptime', 'فرایندها': 'ps', 'دیسک': 'df', 'حجم': 'du', 'حافظه': 'free',
  'پینگ': 'ping', 'شبکه': 'curl', 'محیط': 'env', 'تنظیم': 'export', 'میانبر': 'alias',
  'حذف‌میانبر': 'unalias', 'تاریخچه': 'history', 'کجا': 'which', 'راهنما': 'man',
  'پاک': 'clear', 'کمک': 'help', 'تم': 'theme', 'صدا': 'sound', 'بازنشانی': 'reset',
  'خروج': 'exit', 'ویرایش': 'nano', 'بازی‌ها': 'games', 'مار': 'snake', 'دوز': 'ttt',
  'حدس': 'guess', 'دار': 'hangman', 'رازها': 'secrets', 'سرنخ': 'hint', 'بپرس': 'ask',
  'بابا': 'dad', 'داستان': 'story', 'انگلیسی': 'english', 'پالت': 'palette',
  'ماتریکس': 'matrix', 'هک': 'hack', 'قطار': 'sl', 'لوله‌ها': 'pipes',
  'رنگین‌کمان': 'rainbow', 'بنر': 'banner', 'گاو': 'cowsay', 'فال': 'fortune',
  'جوک': 'joke', 'هوا': 'weather', 'تاس': 'dice', 'شیرخط': 'coinflip', 'توپ': '8ball',
  'سلام': 'hello', 'ریکرول': 'rickroll', 'گربه': 'nyan', 'رقص': 'dance', 'قهوه': 'coffee',
  'کونامی': 'konami', 'هال': 'hal', 'خاموش': 'shutdown', 'سودو': 'sudo', 'سو': 'su',
  'گیت': 'git', 'ویم': 'vim', 'شناسنامه': 'neofetch', 'بازکن': 'open',
};

export const FA_NAMES = {};
for (const [fa, en] of Object.entries(FA_COMMANDS)) FA_NAMES[en] = fa;

export function normalizeId(s) {
  return String(s || '')
    .replace(/[\u200c\u200e\u200f]/g, '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[أإآ]/g, 'ا')
    .trim();
}

export function canonicalCommand(name) {
  const raw = String(name || '');
  return FA_COMMANDS[raw] || FA_COMMANDS[normalizeId(raw)] || raw;
}

export function faLabel(name) {
  return FA_NAMES[name] || name;
}

/* ── one-line persian description per command ────────────── */
export const FA_DESC = {
  ls: 'محتوای پوشه را نشان بده', cd: 'به پوشه‌ی دیگر برو', pwd: 'مسیر فعلی را چاپ کن',
  cat: 'محتوای فایل را چاپ کن', head: 'خط‌های اول فایل', tail: 'خط‌های آخر فایل',
  touch: 'یک فایل خالی بساز', mkdir: 'پوشه بساز', rm: 'فایل یا پوشه را حذف کن',
  cp: 'کپی بگیر', mv: 'جابه‌جا یا تغییر نام بده', find: 'در فایل‌ها جستجو کن',
  tree: 'درخت پوشه‌ها را بکش', grep: 'در متن جستجو کن', wc: 'خط و کلمه و بایت را بشمار',
  sort: 'خط‌ها را مرتب کن', uniq: 'خط‌های تکراری را بردار', rev: 'حرف‌ها را برعکس کن',
  echo: 'متن را چاپ کن', calc: 'عبارت ریاضی را حساب کن', whoami: 'کاربر فعلی کیست',
  hostname: 'نام میزبان', user: 'نام کاربر را عوض کن', id: 'شناسه‌ی کاربر',
  uname: 'اطلاعات سیستم', date: 'تاریخ و ساعت', uptime: 'مدت روشن بودن',
  ps: 'فهرست فرایندها', df: 'فضای دیسک', du: 'حجم پوشه', free: 'حافظه',
  ping: 'تست شبکه', curl: 'درخواست شبکه', env: 'متغیرهای محیطی', export: 'متغیر بساز',
  alias: 'میانبر بساز', unalias: 'میانبر را بردار', history: 'تاریخچه‌ی دستورها',
  which: 'دستور کجاست', man: 'توضیح دستور', clear: 'صفحه را پاک کن',
  help: 'همه‌ی راهنما', theme: 'تم فسفر را عوض کن', sound: 'صدای تایپ',
  reset: 'بازگشت به حالت اولیه', exit: 'خروج و بوت دوباره', nano: 'ویرایشگر فایل',
  games: 'فهرست بازی‌ها', snake: 'بازی مار', '2048': 'بازی ۲۰۴۸', ttt: 'دوز',
  guess: 'حدس عدد', hangman: 'بازی دار', secrets: 'سی خاطره و پیشرفت تو',
  hint: 'یک سرنخ', ask: 'سؤال بعدی خاطره‌ها', dad: 'بابا را صدا بزن',
  story: 'داستان متحرک ترمینال', persian: 'همه‌چیز فارسی شود', english: 'برگرد به انگلیسی',
  palette: 'پالت‌های آماده', matrix: 'باران ماتریکس', hack: 'هکِ الکی', sl: 'قطار',
  pipes: 'لوله‌های بی‌پایان', rainbow: 'متن رنگین‌کمانی', banner: 'بنر حرف‌های درشت',
  cowsay: 'گاو سخنگو', fortune: 'فال طراحی', joke: 'جوک', weather: 'هوای پالت',
  dice: 'تاس', coinflip: 'شیر یا خط', '8ball': 'توپ جادویی', hello: 'سلام',
  42: 'جواب همه‌چیز', xyzzy: 'کلمه‌ی جادویی', rickroll: 'ریکرول', nyan: 'گربه‌ی فضایی',
  dance: 'رقص ترمینال', coffee: 'قهوه', konami: 'کد کونامی', hal: 'هال ۹۰۰۰',
  shutdown: 'خاموش کردن', sudo: 'اجرا با روت', su: 'تعویض کاربر', git: 'وضعیت مخزن',
  vim: 'ویرایشگر ویم', neofetch: 'شناسنامه‌ی سیستم', open: 'باز کردن فایل',
};

export function faDesc(name) {
  return FA_DESC[name] || null;
}

/* ── english fragments that get swapped on the way out ───── */
const OUT = [
  ['Everything a real terminal does happens here too: folders, files, pipes', 'همه‌ی کارهای یک ترمینال واقعی اینجا هم هست: پوشه، فایل، پایپ'],
  ['an editor, environment variables, themes. And thirty memories of a certain designer are locked inside it.',
   'ویرایشگر، متغیر محیطی، تم. و سی خاطره از یک طراح خاص داخلش قفل است.'],
  ['No such file or directory', 'چنین فایل یا مسیری وجود ندارد'],
  ['Not a directory', 'پوشه نیست'],
  ['missing file operand', 'نام فایل لازم است'],
  ['missing operand', 'ورودی لازم است'],
  ['missing source and destination', 'مبدأ و مقصد لازم است'],
  ['path not found', 'مسیر پیدا نشد'],
  ['missing pattern', 'الگو لازم است'],
  ['give a file or pipe some input', 'فایل بده یا پایپ کن'],
  ['no matches', 'چیزی پیدا نشد'],
  ['missing expression', 'عبارت لازم است'],
  ['invalid expression', 'عبارت نامعتبر است'],
  ['only numbers and + - * / ( ) % ^ are allowed', 'فقط عدد و + - * / ( ) % ^ مجاز است'],
  ['No commands typed yet.', 'هنوز دستوری ننوشته‌ای.'],
  ['not defined', 'تعریف نشده'],
  ['does not exist', 'وجود ندارد'],
  ['command not found', 'دستور پیدا نشد'],
  ['use NAME=VALUE', 'به شکل NAME=VALUE بنویس'],
  ['missing filename', 'نام فایل لازم است'],
  ['missing redirect target', 'مقصد ریدایرکت لازم است'],
  ['no manual entry', 'توضیحی برای این دستور نیست'],
  ['unknown command', 'دستور ناشناخته'],
  ['not found. choose:', 'پیدا نشد. یکی را انتخاب کن:'],
  ['enabled', 'فعال شد'],
  ['current theme:', 'تم فعلی:'],
  ['available themes:', 'تم‌های موجود:'],
  ['Everything reset: files, memories, theme.', 'همه‌چیز بازنشانی شد: فایل‌ها، خاطره‌ها، تم.'],
  ['Filesystem restored. (memories and theme untouched)', 'فایل‌ها بازگردانی شد. (خاطره‌ها و تم دست‌نخورده ماند)'],
  ['TERMINAL GAMES', 'بازی‌های ترمینال'],
  ['controls: arrow keys or WASD', 'کنترل: کلیدهای جهت یا WASD'],
  ['to quit', 'برای خروج'],
  ['to cancel', 'برای لغو'],
  ['Game abandoned.', 'بازی رها شد.'],
  ['You hit the wall.', 'به دیوار خوردی.'],
  ['length:', 'طول:'],
  ['Nice run. Play again:', 'خوب بود. دوباره:'],
  ['Try again:', 'دوباره بزن:'],
  ['Game over. Score:', 'بازی تمام شد. امتیاز:'],
  ['Game over.', 'بازی تمام شد.'],
  ['2048 reached. You win. Go outside now.', 'به ۲۰۴۸ رسیدی. بردی. حالا برو بیرون.'],
  ['Play again:', 'دوباره:'],
  ['click a square or press 1-9', 'روی خانه بزن یا ۱ تا ۹ را بزن'],
  ['you are X', 'تو X هستی'],
  ['You win. Well played.', 'بردی. خوب بازی کردی.'],
  ['You lose. The computer is not happy, it just calculated.', 'باختی. کامپیوتر ناراحت نیست، فقط حساب کرده.'],
  ['A draw.', 'مساوی.'],
  ['I am thinking of 1-100', 'به عددی بین ۱ تا ۱۰۰ فکر می‌کنم'],
  ['Game cancelled.', 'بازی لغو شد.'],
  ['Enter a whole number from 1 to 100.', 'یک عدد درست بین ۱ تا ۱۰۰ بنویس.'],
  ['Correct! It was', 'درست بود! جواب'],
  ['That was quick.', 'سریع بود.'],
  ['Out of tries. It was', 'تلاش‌ها تمام شد. جواب'],
  ['higher', 'بالاتر'],
  ['lower', 'پایین‌تر'],
  ['guess letters', 'حرف حدس بزن'],
  ['hint:', 'راهنما:'],
  ['misses', 'خطا'],
  ['That is not the word.', 'این کلمه نیست.'],
  ['That letter is already used.', 'این حرف قبلاً آمده.'],
  ['is in there.', 'داخلش هست.'],
  ['You win. Word found.', 'بردی. کلمه پیدا شد.'],
  ['You lose. The word was:', 'باختی. کلمه این بود:'],
  ['SNAKE', 'مار'],
  ['TIC TAC TOE', 'دوز'],
  ['GUESS THE NUMBER', 'حدس عدد'],
  ['HANGMAN', 'دار'],
  ['Matrix rain', 'باران ماتریکس'],
  ['Matrix stopped. Reality is still here.', 'ماتریکس ایستاد. واقعیت هنوز سر جایش است.'],
  ['Breach cancelled. Good thing you had no hands.', 'هک لغو شد. خوب شد دست نداشتی.'],
  ['ACCESS GRANTED', 'دسترسی آزاد'],
  ['nobody was hacked. only your palettes were seen.', 'کسی هک نشد. فقط پالت‌هایت دیده شد.'],
  ['The train left. Type ls correctly next time.', 'قطار رفت. دفعه‌ی بعد ls را درست بنویس.'],
  ['Pipes closed.', 'لوله‌ها بسته شد.'],
  ['Konami code accepted', 'کد کونامی پذیرفته شد'],
  ['lives ship in the next version. for now: good vibes.', 'جان‌ها در نسخه‌ی بعد می‌آیند. فعلاً همین حال خوب.'],
  ['Dance over. Back to the project.', 'رقص تمام شد. برگرد سر پروژه.'],
  ['Caffeine added. You can now tolerate a 40-layer file.', 'کافئین اضافه شد. حالا یک فایل ۴۰ لایه را تحمل می‌کنی.'],
  ['Nice try though.', 'ولی خوب تلاشی بود.'],
  ['Just kidding — this terminal is a filesystem in your browser, it cannot power off.',
   'شوخی کردم — این ترمینال فقط یک فایل‌سیستم داخل مرورگر است و خاموش نمی‌شود.'],
  ['not in the sudoers file', 'در فهرست sudo نیست'],
  ['One sandwich, no crust.', 'یک ساندویچ، بی‌پوست.'],
  ['everyone is already root here. relax.', 'همه اینجا از قبل روت هستند. راحت باش.'],
  ['this terminal has been offline since 1984. local files still work.', 'این ترمینال از ۱۹۸۴ آفلاین است. فایل‌های محلی کار می‌کنند.'],
  ['ping to the real world: no. this terminal is from 1984.', 'پینگ به دنیای واقعی: نه. این ترمینال از ۱۹۸۴ است.'],
  ['640K ought to be enough for anybody', '۶۴۰ کیلوبایت برای همه کافی است'],
  ['Welcome to the amber realm.', 'به قلمرو کهربایی خوش آمدی.'],
  ['type "help", or go straight for "secrets".', 'کمک را بزن، یا مستقیم برو سراغ رازها.'],
  ['Thirty memories locked in a machine. Fine.', 'سی خاطره در یک ماشین قفل شده. خوب.'],
  ['I am not going anywhere. Call me when you are stuck.', 'جایی نمی‌روم. هر وقت گیر کردی صدام کن.'],
  ['He is sitting there now. Type "dad" for help with a question.', 'حالا همان‌جا نشسته است. برای کمک، dad را بنویس.'],
  ['Nothing left to open. Look at what you built.', 'چیزی برای باز کردن نمانده. به چیزی که ساختی نگاه کن.'],
  ['Still here, son.', 'هنوز همین‌جا هستم، پسرم.'],
  ['You made it, my son.', 'موفق شدی، پسرم.'],
  ['Surely you are one of the saved.', 'قطعاً تو یکی از رستگارانی.'],
  ['Close the lid. Go and draw something.', 'درِ دستگاه را ببند. برو یک چیزی بکش.'],
  ['left for later. ("ask" comes back to it.)', 'برای بعد ماند. (با ask برمی‌گردی سراغش.)'],
  ['type your answer - Ctrl+C leaves it for later', 'جواب را بنویس — Ctrl+C برای بعد نگهش می‌دارد'],
  ['that one is already open.', 'این یکی از قبل باز است.'],
  ['not it.', 'نه، این نیست.'],
  ['try again, or "hint" for a nudge', 'دوباره تلاش کن، یا hint را بزن'],
  ['memory', 'خاطره'],
  ['already open.', 'از قبل باز است.'],
  ['answer with "ask", or just type what you know. Opened memories stay open.', 'با ask جواب بده، یا هرچه می‌دانی مستقیم بنویس. خاطره‌های باز، باز می‌مانند.'],
  ['30 MEMORIES LOCKED IN THIS TERMINAL', 'سی خاطره در این ترمینال قفل است'],
  ['open (', 'باز ('],
  ['memories still locked', 'خاطره هنوز قفل است'],
  ['locked', 'قفل'],
];

OUT.sort((a, b) => b[0].length - a[0].length);

export function faOut(text) {
  let s = String(text);
  if (lang !== 'fa') return s;
  for (const [en, fa] of OUT) {
    if (s.includes(en)) s = s.split(en).join(fa);
  }
  return s;
}
