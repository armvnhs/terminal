/* one emblem per memory, shown when it opens */

const EMBLEMS = {
  name: String.raw`
      /\
     /  \
    / /\ \
   /_/  \_\
`,
  surname: String.raw`
   .------.
  /  H S   \
  \        /
   '------'
`,
  fullname: String.raw`
  <================>
   A R M A N  H S
  <================>
`,
  country: String.raw`
  ~~~~~~~~~~~~~~
  --------------
  . . . . . . .
`,
  nationality: String.raw`
  +--------+
  |  o  o  |
  |   --   |
  +--------+
`,
  city: String.raw`
   _   _   _
  / \ / \ / \
  | | | | | |
  ===========
`,
  live: String.raw`
      /\
     /  \
    /____\
    | [] |
    |____|
`,
  province: String.raw`
       ___
     .'   '.
    /  ___  \
   |  |   |  |
   '--'---'--'
`,
  brotherwho: String.raw`
     o     o
    /|\   /|\
    / \   / \
`,
  brothername: String.raw`
     o     o
    /|\   /|\
     R     A
`,
  brotherback: String.raw`
    A  <-->  A
    R  <-->  R
`,
  year: String.raw`
  +---------+
  | 2 0 0 1 |
  +---------+
`,
  month: String.raw`
      \ | /
    -- (o) --
      / | \
`,
  day: String.raw`
   .--------.
   |   28   |
   '--------'
`,
  birthday: String.raw`
      i i
    .-----.
    |=====|
    '-----'
`,
  age: String.raw`
      i   i
    .-------.
    |  2 5  |
    '-------'
`,
  job: String.raw`
       /\
      /  \
     / /\ \
    /_/  \_\
    \  o  /
     \___/
`,
  field: String.raw`
   +--+--+--+
   |  |  |  |
   +--+--+--+
   |  |  |  |
   +--+--+--+
`,
  tea: String.raw`
    ( ( (
     \_/
    .---.
    |   |__
    '---'
`,
  glasses: String.raw`
   ___     ___
  /   \___/   \
  \___/   \___/
`,
  lotr: String.raw`
     .-------.
    /  .---.  \
   |  (  o  )  |
    \  '---'  /
     '-------'
`,
  marvel: String.raw`
   __      __
  /  \    /  \
 |    \  /    |
 |  |\ \/ /|  |
 |__| \__/ |__|
`,
  daredevil: String.raw`
    /\      /\
   /  \____/  \
  |   o    o   |
   \    __    /
    '--'  '--'
`,
  matt: String.raw`
      _____
     /     \
    /  /|\  \
   '----------'
    ---|---
`,
  kitchen: String.raw`
  +----------+
  | KITCHEN  |
  +-----|----+
        |
`,
  language: String.raw`
    ______
   /|    /|
  / |___/ |
  | /   | /
  |/____|/
`,
  initials: String.raw`
    A     H
   / \   | |
  /---\  |_|
 /     \  |
`,
  halfworld: String.raw`
     .---.
    /  |  \
   |---+---|
    \  |  /
     '---'
`,
  siblings: String.raw`
    o   o
   /|\ /|\
   / \  |
`,
  pen: String.raw`
     __
    /  \__
   /      \
   |  o    |
    \______/
`,
};

export function artOf(id) {
  return EMBLEMS[id] || '';
}

export const EMBLEM_COUNT = Object.keys(EMBLEMS).length;
