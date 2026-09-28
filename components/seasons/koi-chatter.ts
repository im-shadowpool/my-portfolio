/*
  What the koi say: sarcastic, a little desi, never mean.

  `{name}` is the speaker, `{other}` the fish it's talking to or about.
  Scenes are little plays: each line starts with who says it ("a: …") and
  `{a}`, `{b}`, `{c}` are replaced with those fishes' names. `{fact}` is a
  fact about the site's owner, passed in from the page.

  Edit freely; the pond picks lines at random.
*/

export const LINES = {
  firstNudge: ["psst… tap the water 👀", "oh a visitor!! act natural everyone", "hello there. snacks, please?"],
  hungry: [
    "so. hungry. 😩",
    "tap the water. please. i'm begging.",
    "*stares at you with big sad fish eyes*",
    "hello? snacks?? anyone??",
    "anything. even the boring pellets.",
    "i've been manifesting pellets for 20 minutes",
    "i can see you scrolling. i can SEE you.",
    "feed me and i'll tell you a secret 🤫",
  ],
  eat: [
    "needs more masala",
    "better than hostel mess food, i'll give you that",
    "tastes like cardboard. i love it.",
    "chef, where's the chutney?",
    "5 stars ⭐ (i rate everything 5 stars)",
    "crunchy. 10/10. would steal again.",
    "worth every rupee",
  ],
  full: ["i'm stuffed… ok one more", "i am 40% pellet now", "food coma incoming. don't wake me for anything less than biryani."],
  relief: [
    "FINALLY. the protest worked 📢",
    "faith in humanity: restored (partially)",
    "took you long enough, boss",
    "see? a little drama and they feed you",
  ],
  stolenFrom: [
    "bro. BRO. that was mine 😤",
    "{other}. seriously?",
    "i saw it first!!",
    "unbelievable. again.",
    "i'm telling mummy",
    "this is why nobody invites you anywhere, {other}",
  ],
  thief: [
    "first come first serve, uncle ✨",
    "sorry not sorry 💅",
    "should've swum faster, {other}",
    "smart work, not hard work",
    "skill issue",
    "i don't know what you're talking about 😇",
  ],
  spooked: ["hey! watch it!", "mummy!!", "personal space please!!", "hands off the merchandise", "i'm calling the pond police 🚨"],
  bump: ["oops", "watch it!", "excuse u", "{other}, lane discipline pls", "you drive like Bengaluru traffic, {other}"],
  boop: [
    "hi! i'm {name} 👋",
    "boop received",
    "that tickles",
    "do you boop every fish you meet?",
    "that's my good side, thank you",
    "yes? how can i help you?",
  ],
  boopLove: ["ok ok, i like you too ❤️", "we're besties now 💕", "i'm telling everyone we're engaged"],
  idle: [
    "blub.",
    "been going in circles for hours",
    "i'm not lost, i'm exploring",
    "i have the memory of a… wait what",
    "pond life is so peaceful. i hate it.",
    "*does a little flip*",
    "need chai. immediately.",
  ],
  /** Generic sarcasm after a fact about the site's owner. */
  factReaction: [
    "who asked? 🙄",
    "cool story. anyway.",
    "breaking news: nobody cares",
    "wow. should we clap? 👏 (no hands)",
    "put that on LinkedIn, {other}",
    "{other} is basically Saipavan's PR team",
    "ok uncle, calm down",
    "relatives at every wedding be like",
  ],
  /** Someone sticks up for the owner after the sarcasm. */
  comeback: [
    "at least he has a job. what do you do? swim?",
    "says the fish who got lost in a 3-metre pond",
    "jealousy is not a good colour on you, {other}",
    "you literally live on his website. respect.",
    "he feeds us. sometimes. that's more than you do.",
    "you failed the swim test, {other}. twice.",
  ],
  /** And the sarcastic one gets the last word. */
  lastWord: ["hmph.", "whatever 🙄", "fine. he's ok. i guess.", "i'm not crying, the water is wet", "ok that one hurt"],
  secret: [
    "psst… type “hire” somewhere 🤫",
    "rumour says: ↑↑↓↓←→←→BA",
    "feed one of us a LOT. something happens.",
    "boop me five times. i dare you.",
  ],
  winter: ["brrr 🥶 someone bring a blanket", "the camellias are pretty. and cold. mostly cold.", "who needs AC when you live in a freezer"],
  summer: ["this water is basically soup", "it is SO hot today ☀️", "hydrangea season 💙 very aesthetic, very hot"],
  spring: ["the petals keep landing on my head 🌸", "a petal just called me pretty. i'm blushing."],
  autumn: ["crunchy leaf season 🍁", "a leaf just hit me. rude.", "pumpkin spice pellets when?"],
  night: ["shh… it's night mode", "zzz", "can't sleep. thinking about pellets.", "who turned off the sun"],
  dragon: ["i… i feel different", "I AM THE DRAGON NOW 🐉"],
  golden: ["✨ did someone call for a legendary koi?", "don't mind me. just shining."],
  hire: ["HIRE SAIPAVAN!!", "do it. do it. do it.", "unanimous vote 🗳️", "HR, are you seeing this?"],
};

/** Sharper reactions for particular facts, matched by keyword. */
export const FACT_REACTIONS: { match: RegExp; lines: string[] }[] = [
  { match: /GATE/i, lines: ["GATE qualified? cool. my uncle asks that at every wedding", "and here i am, didn't qualify for the pond swim team"] },
  { match: /load time|0\.98/i, lines: ["0.98s? my attention span is shorter", "Sharma ji's son did it in 0.5s", "fast website, slow feeding. interesting priorities."] },
  { match: /open to work/i, lines: ["HR, are you seeing this? 👀", "tell recruiters the fish sent you"] },
  { match: /learning/i, lines: ["learning Java… in this economy?", "i'm also learning. to swim backwards."] },
  { match: /reading|reads/i, lines: ["reading books? on purpose?", "i read the water. it said nothing."] },
  { match: /chess/i, lines: ["chess? i can't even play ludo. no hands.", "checkmate is my ex's name"] },
  { match: /five blogs/i, lines: ["five blogs. zero chill.", "and i can't even manage one fin at a time"] },
  { match: /email/i, lines: ["go on, email. we'll wait 👀", "email him. then feed us. in that order."] },
  { match: /Lead Web Developer|Juzgrow/i, lines: ["lead developer? can he lead us to food?", "fancy title. do they pay in pellets?"] },
];

/** Little plays between the fish. */
export const SCENES: string[][] = [
  [
    "a: my parents wanted me to be a doctor fish",
    "b: and?",
    "a: now i'm a koi on a portfolio website",
    "c: what will the relatives say 😭",
    "b: log are busy scrolling, relax",
  ],
  [
    "a: you know what this pond needs? chai",
    "b: fish drinking chai?",
    "a: cutting chai. half cup. we're not rich.",
    "c: and Parle-G for dipping",
    "b: who's dipping? you'll dissolve, {c}",
    "c: worth it",
  ],
  [
    "a: an aunty fish asked me what package i get",
    "b: what did you say?",
    "a: three pellets a day plus benefits",
    "c: benefits??",
    "a: the pond. it's the pond.",
  ],
  [
    "a: {b}, when are you getting married, dear?",
    "b: i'm a fish",
    "a: that's what they all say",
    "c: a proposal came from the next pond 👀",
    "b: i'm swimming away from this conversation",
  ],
  [
    "a: i'm on a diet",
    "b: since when?",
    "a: since nobody fed us",
    "c: intermittent fasting, but make it involuntary",
  ],
  [
    "a: i'm launching a startup",
    "b: what does it do?",
    "a: pellets. but on blockchain.",
    "c: funded. here's two bubbles 🫧",
    "b: this is how bubbles burst, {c}",
  ],
  [
    "a: i failed the swim test",
    "b: {a}. you're a fish.",
    "a: Sharma ji's koi topped it",
    "c: there's always a Sharma ji",
  ],
  [
    "a: the visitor has been watching us for a while",
    "b: act busy",
    "c: *swims in a very purposeful circle*",
    "a: nailed it",
  ],
  [
    "a: should we tell the visitor to hire Saipavan?",
    "b: they're on his portfolio, genius. they know.",
    "a: subtle reminder then",
    "c: HIRE SAIPAVAN (subtly)",
  ],
  [
    "a: {c}, move. you're swimming like Bengaluru traffic",
    "c: at least Bengaluru traffic moves. sometimes.",
    "b: no it doesn't",
  ],
  [
    "a: i work from pond now",
    "b: you don't work",
    "a: i work from pond. on myself. 🧘",
    "c: so… nothing",
    "a: self-care is not nothing, {c}",
  ],
  [
    "a: rate my swimming 1–10",
    "b: 4",
    "a: wow. ok. wow.",
    "c: generous, honestly",
  ],
  [
    "a: what if we're just fish on someone's website",
    "b: don't.",
    "c: i need to lie down",
    "a: we can't lie down. we're fish.",
  ],
  [
    "a: tell me something about Saipavan",
    "b: {fact}",
    "c: who asked? 🙄",
    "a: I asked, {c}. literally just now.",
  ],
];

/** When the visitor forgets to feed them for a whole minute. */
export const PROTESTS: string[][] = [
  [
    "a: comrades. it has been a minute.",
    "b: NO FOOD. NO PEACE. 📢",
    "c: is this a pond or a fasting camp?",
    "a: NO HUMANITY LEFT ON THIS WEBSITE",
    "b: the last pellets tasted like hostel mess anyway",
    "c: one star. would still eat again ⭐",
  ],
  [
    "a: hello?? is anyone out there??",
    "b: they're reading the About section instead of feeding us",
    "c: the audacity",
    "a: WE WANT PELLETS 📢",
    "b: WITH MASALA",
    "c: and a little chutney, if it's not too much trouble",
  ],
];

export type LineKind = keyof typeof LINES;

export const pickFrom = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

export function line(kind: LineKind, name: string, other = "") {
  return pickFrom(LINES[kind]).replace("{name}", name).replace("{other}", other);
}

/** A sarcastic reaction that fits the fact, when there is one. */
export function reactTo(fact: string, speaker: string, other: string) {
  const specific = FACT_REACTIONS.find((r) => r.match.test(fact));
  const text = specific && Math.random() < 0.75 ? pickFrom(specific.lines) : line("factReaction", speaker, other);
  return text.replace("{other}", other);
}
