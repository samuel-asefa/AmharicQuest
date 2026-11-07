/**
 * The Fidel (ፊደል): 34 consonant families × 7 vowel orders = 238 characters.
 * Romanization is generated from each family's consonant plus the order's vowel,
 * so it stays consistent across the whole chart.
 */

export interface VowelOrder {
  order: number;
  label: string;
  vowel: string;
  hint: string;
}

export const VOWEL_ORDERS: VowelOrder[] = [
  { order: 1, label: '1st', vowel: 'ä', hint: 'e in “her”' },
  { order: 2, label: '2nd', vowel: 'u', hint: 'oo in “food”' },
  { order: 3, label: '3rd', vowel: 'i', hint: 'ee in “see”' },
  { order: 4, label: '4th', vowel: 'a', hint: 'a in “father”' },
  { order: 5, label: '5th', vowel: 'e', hint: 'ay in “say”' },
  { order: 6, label: '6th', vowel: 'ə', hint: 'i in “bit”, or silent' },
  { order: 7, label: '7th', vowel: 'o', hint: 'o in “go”' },
];

export interface FidelForm {
  char: string;
  roman: string;
  order: number;
}

export interface FidelFamily {
  id: number;
  /** Romanized consonant ('' for the vowel carriers አ and ዐ). */
  consonant: string;
  /** Short pronunciation guide. */
  hint: string;
  /** If this family sounds the same as another, that family's id. */
  variantOf?: number;
  forms: FidelForm[];
}

const RAW: [chars: string, consonant: string, hint: string, variantOf?: number][] = [
  ['ሀሁሂሃሄህሆ', 'h', 'h as in “hat”'],
  ['ለሉሊላሌልሎ', 'l', 'l as in “lamp”'],
  ['ሐሑሒሓሔሕሖ', 'h', 'Same sound as ሀ', 0],
  ['መሙሚማሜምሞ', 'm', 'm as in “moon”'],
  ['ሠሡሢሣሤሥሦ', 's', 'Same sound as ሰ', 6],
  ['ረሩሪራሬርሮ', 'r', 'A lightly rolled r'],
  ['ሰሱሲሳሴስሶ', 's', 's as in “sun”'],
  ['ሸሹሺሻሼሽሾ', 'sh', 'sh as in “shoe”'],
  ['ቀቁቂቃቄቅቆ', 'q', 'A sharp k, popped from the throat'],
  ['በቡቢባቤብቦ', 'b', 'b as in “bed”'],
  ['ቨቩቪቫቬቭቮ', 'v', 'v as in “van” (loanwords)'],
  ['ተቱቲታቴትቶ', 't', 't as in “top”'],
  ['ቸቹቺቻቼችቾ', 'ch', 'ch as in “church”'],
  ['ኀኁኂኃኄኅኆ', 'h', 'Same sound as ሀ', 0],
  ['ነኑኒናኔንኖ', 'n', 'n as in “net”'],
  ['ኘኙኚኛኜኝኞ', 'ny', 'ny as in “canyon”'],
  ['አኡኢኣኤእኦ', '', 'A vowel carrier with no consonant'],
  ['ከኩኪካኬክኮ', 'k', 'k as in “kite”'],
  ['ኸኹኺኻኼኽኾ', 'kh', 'A breathy, raspy h (rare)'],
  ['ወዉዊዋዌውዎ', 'w', 'w as in “water”'],
  ['ዐዑዒዓዔዕዖ', '', 'Same sound as አ', 16],
  ['ዘዙዚዛዜዝዞ', 'z', 'z as in “zoo”'],
  ['ዠዡዢዣዤዥዦ', 'zh', 's as in “measure”'],
  ['የዩዪያዬይዮ', 'y', 'y as in “yes”'],
  ['ደዱዲዳዴድዶ', 'd', 'd as in “dog”'],
  ['ጀጁጂጃጄጅጆ', 'j', 'j as in “jam”'],
  ['ገጉጊጋጌግጎ', 'g', 'g as in “go”'],
  ['ጠጡጢጣጤጥጦ', "t'", 'An ejective t — a crisp, popped t'],
  ['ጨጩጪጫጬጭጮ', "ch'", 'An ejective ch — a crisp, popped ch'],
  ['ጰጱጲጳጴጵጶ', "p'", 'An ejective p (rare)'],
  ['ጸጹጺጻጼጽጾ', "ts'", 'An ejective ts — like “ts” with a pop'],
  ['ፀፁፂፃፄፅፆ', "ts'", 'Same sound as ጸ', 30],
  ['ፈፉፊፋፌፍፎ', 'f', 'f as in “fun”'],
  ['ፐፑፒፓፔፕፖ', 'p', 'p as in “pen”'],
];

export const FIDEL: FidelFamily[] = RAW.map(([chars, consonant, hint, variantOf], id) => ({
  id,
  consonant,
  hint,
  variantOf,
  forms: Array.from(chars).map((char, i) => ({
    char,
    order: i + 1,
    roman: consonant + VOWEL_ORDERS[i].vowel,
  })),
}));

export const FIDEL_COUNT = FIDEL.length * VOWEL_ORDERS.length;

/** Look up any Fidel character → its romanization. */
export const CHAR_ROMAN: Record<string, string> = Object.fromEntries(
  FIDEL.flatMap((f) => f.forms.map((form) => [form.char, form.roman])),
);

/** Display name for a family's sound, e.g. "sh" or "vowel". */
export function familyLabel(f: FidelFamily) {
  return f.consonant || 'vowel';
}
