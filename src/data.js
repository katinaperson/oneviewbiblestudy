export const BOOKS = [
  {name:"Genesis",chapters:50,t:"OT"},{name:"Exodus",chapters:40,t:"OT"},{name:"Leviticus",chapters:27,t:"OT"},
  {name:"Numbers",chapters:36,t:"OT"},{name:"Deuteronomy",chapters:34,t:"OT"},{name:"Joshua",chapters:24,t:"OT"},
  {name:"Judges",chapters:21,t:"OT"},{name:"Ruth",chapters:4,t:"OT"},{name:"1 Samuel",chapters:31,t:"OT"},
  {name:"2 Samuel",chapters:24,t:"OT"},{name:"1 Kings",chapters:22,t:"OT"},{name:"2 Kings",chapters:25,t:"OT"},
  {name:"1 Chronicles",chapters:29,t:"OT"},{name:"2 Chronicles",chapters:36,t:"OT"},{name:"Ezra",chapters:10,t:"OT"},
  {name:"Nehemiah",chapters:13,t:"OT"},{name:"Esther",chapters:10,t:"OT"},{name:"Job",chapters:42,t:"OT"},
  {name:"Psalms",chapters:150,t:"OT"},{name:"Proverbs",chapters:31,t:"OT"},{name:"Ecclesiastes",chapters:12,t:"OT"},
  {name:"Song of Solomon",chapters:8,t:"OT"},{name:"Isaiah",chapters:66,t:"OT"},{name:"Jeremiah",chapters:52,t:"OT"},
  {name:"Lamentations",chapters:5,t:"OT"},{name:"Ezekiel",chapters:48,t:"OT"},{name:"Daniel",chapters:12,t:"OT"},
  {name:"Hosea",chapters:14,t:"OT"},{name:"Joel",chapters:3,t:"OT"},{name:"Amos",chapters:9,t:"OT"},
  {name:"Obadiah",chapters:1,t:"OT"},{name:"Jonah",chapters:4,t:"OT"},{name:"Micah",chapters:7,t:"OT"},
  {name:"Nahum",chapters:3,t:"OT"},{name:"Habakkuk",chapters:3,t:"OT"},{name:"Zephaniah",chapters:3,t:"OT"},
  {name:"Haggai",chapters:2,t:"OT"},{name:"Zechariah",chapters:14,t:"OT"},{name:"Malachi",chapters:4,t:"OT"},
  {name:"Matthew",chapters:28,t:"NT"},{name:"Mark",chapters:16,t:"NT"},{name:"Luke",chapters:24,t:"NT"},
  {name:"John",chapters:21,t:"NT"},{name:"Acts",chapters:28,t:"NT"},{name:"Romans",chapters:16,t:"NT"},
  {name:"1 Corinthians",chapters:16,t:"NT"},{name:"2 Corinthians",chapters:13,t:"NT"},{name:"Galatians",chapters:6,t:"NT"},
  {name:"Ephesians",chapters:6,t:"NT"},{name:"Philippians",chapters:4,t:"NT"},{name:"Colossians",chapters:4,t:"NT"},
  {name:"1 Thessalonians",chapters:5,t:"NT"},{name:"2 Thessalonians",chapters:3,t:"NT"},{name:"1 Timothy",chapters:6,t:"NT"},
  {name:"2 Timothy",chapters:4,t:"NT"},{name:"Titus",chapters:3,t:"NT"},{name:"Philemon",chapters:1,t:"NT"},
  {name:"Hebrews",chapters:13,t:"NT"},{name:"James",chapters:5,t:"NT"},{name:"1 Peter",chapters:5,t:"NT"},
  {name:"2 Peter",chapters:3,t:"NT"},{name:"1 John",chapters:5,t:"NT"},{name:"2 John",chapters:1,t:"NT"},
  {name:"3 John",chapters:1,t:"NT"},{name:"Jude",chapters:1,t:"NT"},{name:"Revelation",chapters:22,t:"NT"}
];

export const STYLE_BOOKS = {
  book: null,
  balanced: null,
  chronological: ["Genesis","Job","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","Psalms","1 Kings","1 Chronicles","2 Chronicles","Proverbs","Ecclesiastes","Song of Solomon","2 Kings","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"],
  "psalms-proverbs": ["Psalms","Proverbs"],
  gospels: ["Matthew","Mark","Luke","John"],
  epistles: ["Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude"]
};

export const TAGS = [
  {id:'bible-study', name:'Bible Study', color:'#C4879A'},
  {id:'devotion',    name:'Devotion',    color:'#B8975A'},
  {id:'sermon',      name:'Sermon',      color:'#8BA8C4'},
  {id:'prayer',      name:'Prayer',      color:'#8BB89A'},
  {id:'gratitude',   name:'Gratitude',   color:'#B08BC4'}
];

export const STYLE_NAMES = {
  book:'Book-at-a-Time',
  balanced:'OT + NT Balanced',
  chronological:'Chronological',
  'psalms-proverbs':'Psalms & Proverbs',
  gospels:'Gospels Focus',
  epistles:"Paul's Epistles"
};

export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const DAYS_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const DAYS_SHORT3 = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const DAYS_SHORT2 = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export function midnight(d) { const n = new Date(d); n.setHours(0,0,0,0); return n; }
export function dk(d) { return d.toISOString().split('T')[0]; }
export function buildRefLabel(book, chapter, verse) {
  if (!book) return '';
  let r = book;
  if (chapter) r += ' ' + chapter;
  if (verse) r += ':' + verse;
  return r;
}
export function fmtSz(b) {
  if(b<1024) return b+'B';
  if(b<1048576) return Math.round(b/1024)+'KB';
  return (b/1048576).toFixed(1)+'MB';
}

export const OT = BOOKS.filter(b=>b.t==="OT");
export const NT = BOOKS.filter(b=>b.t==="NT");
