import { Lesson, Unit, VocabularyItem } from './types';

export const vocabularyData: VocabularyItem[] = [
    // Greetings
    { id: '1', amharic: 'ሰላም', english: 'Hello / Peace', phonetic: 'Selam', category: 'Greetings' },
    { id: '2', amharic: 'አመሰግናለሁ', english: 'Thank you', phonetic: 'Ameseginalehu', category: 'Greetings' },
    { id: '6', amharic: 'እንደምን አለህ', english: 'How are you? (to a man)', phonetic: 'Endemin aleh', category: 'Greetings' },
    { id: '7', amharic: 'እንደምን አለሽ', english: 'How are you? (to a woman)', phonetic: 'Endemin alesh', category: 'Greetings' },
    { id: '58', amharic: 'ጤና ይስጥልኝ', english: 'Hello (formal)', phonetic: 'Tena yistilign', category: 'Greetings' },

    // Basics
    { id: '8', amharic: 'አዎ', english: 'Yes', phonetic: 'Awo', category: 'Basic' },
    { id: '9', amharic: 'አይ', english: 'No', phonetic: 'Ay', category: 'Basic' },
    { id: '61', amharic: 'እሺ', english: 'Okay', phonetic: 'Ishi', category: 'Basic' },
    { id: '62', amharic: 'ምንድን ነው?', english: 'What is it?', phonetic: 'Mindin new?', category: 'Basic' },

    // Family
    { id: '4', amharic: 'እናት', english: 'Mother', phonetic: 'Enat', category: 'Family' },
    { id: '5', amharic: 'አባት', english: 'Father', phonetic: 'Abat', category: 'Family' },
    { id: '63', amharic: 'ወንድም', english: 'Brother', phonetic: 'Wendim', category: 'Family' },
    { id: '64', amharic: 'እህት', english: 'Sister', phonetic: 'Ehit', category: 'Family' },
    { id: '65', amharic: 'ልጅ', english: 'Child', phonetic: 'Lij', category: 'Family' },

    // Numbers
    { id: '11', amharic: 'አንድ', english: 'One', phonetic: 'And', category: 'Numbers' },
    { id: '12', amharic: 'ሁለት', english: 'Two', phonetic: 'Hulet', category: 'Numbers' },
    { id: '13', amharic: 'ሶስት', english: 'Three', phonetic: 'Sost', category: 'Numbers' },
    { id: '14', amharic: 'አራት', english: 'Four', phonetic: 'Arat', category: 'Numbers' },
    { id: '15', amharic: 'አምስት', english: 'Five', phonetic: 'Amist', category: 'Numbers' },
    { id: '16', amharic: 'ስድስት', english: 'Six', phonetic: 'Sidist', category: 'Numbers' },
    { id: '17', amharic: 'ሰባት', english: 'Seven', phonetic: 'Sebat', category: 'Numbers' },
    { id: '18', amharic: 'ስምንት', english: 'Eight', phonetic: 'Simint', category: 'Numbers' },
    { id: '19', amharic: 'ዘጠኝ', english: 'Nine', phonetic: 'Zetegn', category: 'Numbers' },
    { id: '20', amharic: 'አስር', english: 'Ten', phonetic: 'Asir', category: 'Numbers' },

    // Food & drink
    { id: '3', amharic: 'ውሃ', english: 'Water', phonetic: 'Wuha', category: 'Food' },
    { id: '31', amharic: 'እንጀራ', english: 'Injera (flatbread)', phonetic: 'Injera', category: 'Food' },
    { id: '32', amharic: 'ቡና', english: 'Coffee', phonetic: 'Buna', category: 'Food' },
    { id: '33', amharic: 'ወተት', english: 'Milk', phonetic: 'Wetet', category: 'Food' },
    { id: '66', amharic: 'ዳቦ', english: 'Bread', phonetic: 'Dabo', category: 'Food' },
    { id: '67', amharic: 'ሻይ', english: 'Tea', phonetic: 'Shai', category: 'Food' },

    // Colors
    { id: '43', amharic: 'ቀይ', english: 'Red', phonetic: 'Qey', category: 'Colors' },
    { id: '44', amharic: 'ቢጫ', english: 'Yellow', phonetic: 'Bicha', category: 'Colors' },
    { id: '45', amharic: 'አረንጓዴ', english: 'Green', phonetic: 'Arenguade', category: 'Colors' },
    { id: '46', amharic: 'ሰማያዊ', english: 'Blue', phonetic: 'Semayawi', category: 'Colors' },
    { id: '47', amharic: 'ጥቁር', english: 'Black', phonetic: 'Tiqur', category: 'Colors' },
    { id: '48', amharic: 'ነጭ', english: 'White', phonetic: 'Nech', category: 'Colors' },

    // Body
    { id: '49', amharic: 'ራስ', english: 'Head', phonetic: 'Ras', category: 'Body' },
    { id: '50', amharic: 'ዓይን', english: 'Eye', phonetic: 'Ayn', category: 'Body' },
    { id: '51', amharic: 'እጅ', english: 'Hand', phonetic: 'Ej', category: 'Body' },
    { id: '52', amharic: 'እግር', english: 'Foot / Leg', phonetic: 'Egir', category: 'Body' },
    { id: '53', amharic: 'አፍ', english: 'Mouth', phonetic: 'Af', category: 'Body' },
    { id: '54', amharic: 'ጆሮ', english: 'Ear', phonetic: 'Joro', category: 'Body' },

    // Objects, animals & places
    { id: '10', amharic: 'ቤት', english: 'House', phonetic: 'Bet', category: 'Places' },
    { id: '34', amharic: 'ውሻ', english: 'Dog', phonetic: 'Wusha', category: 'Animals' },
    { id: '35', amharic: 'ድመት', english: 'Cat', phonetic: 'Dimet', category: 'Animals' },
    { id: '36', amharic: 'መጽሐፍ', english: 'Book', phonetic: 'Metsihaf', category: 'Objects' },
    { id: '37', amharic: 'ወንበር', english: 'Chair', phonetic: 'Wenber', category: 'Objects' },
    { id: '38', amharic: 'ጠረጴዛ', english: 'Table', phonetic: 'Terepeza', category: 'Objects' },

    // Verbs
    { id: '21', amharic: 'መብላት', english: 'To eat', phonetic: 'Meblat', category: 'Verbs' },
    { id: '22', amharic: 'መጠጣት', english: 'To drink', phonetic: 'Metetat', category: 'Verbs' },
    { id: '23', amharic: 'መሄድ', english: 'To go', phonetic: 'Mehed', category: 'Verbs' },
    { id: '24', amharic: 'መምጣት', english: 'To come', phonetic: 'Memtat', category: 'Verbs' },
    { id: '25', amharic: 'አውቃለሁ', english: 'I know', phonetic: 'Awqalehu', category: 'Verbs' },
    { id: '26', amharic: 'አላውቅም', english: "I don't know", phonetic: 'Alawqim', category: 'Verbs' },

    // Adjectives
    { id: '27', amharic: 'ትልቅ', english: 'Big', phonetic: 'Tiliq', category: 'Adjectives' },
    { id: '28', amharic: 'ትንሽ', english: 'Small', phonetic: 'Tinish', category: 'Adjectives' },
    { id: '29', amharic: 'ቆንጆ', english: 'Beautiful', phonetic: 'Konjo', category: 'Adjectives' },
    { id: '30', amharic: 'ጥሩ', english: 'Good', phonetic: 'Tiru', category: 'Adjectives' },

    // Time
    { id: '39', amharic: 'አሁን', english: 'Now', phonetic: 'Ahun', category: 'Time' },
    { id: '40', amharic: 'ነገ', english: 'Tomorrow', phonetic: 'Nege', category: 'Time' },
    { id: '41', amharic: 'ዛሬ', english: 'Today', phonetic: 'Zare', category: 'Time' },
    { id: '42', amharic: 'ትላንት', english: 'Yesterday', phonetic: 'Tilant', category: 'Time' },

    // Useful phrases
    { id: '55', amharic: 'እባክህ', english: 'Please (to a man)', phonetic: 'Ebakih', category: 'Phrases' },
    { id: '56', amharic: 'ይቅርታ', english: 'Sorry / Excuse me', phonetic: 'Yiqirta', category: 'Phrases' },
    { id: '57', amharic: 'ደህና ሁን', english: 'Goodbye (to a man)', phonetic: 'Dehna hun', category: 'Phrases' },
    { id: '59', amharic: 'ስንት ነው?', english: 'How much is it?', phonetic: 'Sint new?', category: 'Phrases' },
    { id: '60', amharic: 'አልገባኝም', english: "I don't understand", phonetic: 'Algebagnim', category: 'Phrases' },
];

export const VOCAB_CATEGORIES = Array.from(new Set(vocabularyData.map((v) => v.category)));

const byCategory = (...categories: string[]) =>
    vocabularyData.filter((v) => categories.includes(v.category));

export const units: Unit[] = [
    { id: 1, title: 'First Steps', subtitle: 'Greet people, count, and talk about family.', accent: 'jade' },
    { id: 2, title: 'Everyday Life', subtitle: 'Food, colors, your body, and the things around you.', accent: 'gold' },
    { id: 3, title: 'Getting Fluent', subtitle: 'Actions, descriptions, time, and handy phrases.', accent: 'lapis' },
];

export const lessons: Lesson[] = [
    {
        id: 'lesson-1',
        title: 'Basic Greetings',
        description: 'Say hello, thank people, and ask how they are doing.',
        unit: 1,
        place: { en: 'Addis Ababa', am: 'አዲስ አበባ' },
        glyph: 'ሰ',
        difficulty: 'beginner',
        xpReward: 50,
        items: byCategory('Greetings'),
    },
    {
        id: 'lesson-2',
        title: 'Essential Words',
        description: 'Yes, no, okay — the words you will use every single day.',
        unit: 1,
        place: { en: 'Bahir Dar', am: 'ባሕር ዳር' },
        glyph: 'አ',
        difficulty: 'beginner',
        xpReward: 30,
        items: byCategory('Basic'),
    },
    {
        id: 'lesson-3',
        title: 'Family Members',
        description: 'Talk about your mother, father, brothers, and sisters.',
        unit: 1,
        place: { en: 'Gondar', am: 'ጎንደር' },
        glyph: 'እ',
        difficulty: 'beginner',
        xpReward: 40,
        items: byCategory('Family'),
    },
    {
        id: 'lesson-4',
        title: 'Numbers 1–10',
        description: 'Count from one to ten like a local.',
        unit: 1,
        place: { en: 'Lalibela', am: 'ላሊበላ' },
        glyph: 'ስ',
        difficulty: 'beginner',
        xpReward: 60,
        items: byCategory('Numbers'),
    },
    {
        id: 'lesson-5',
        title: 'Food & Drink',
        description: 'Order coffee, injera, and everything in between.',
        unit: 2,
        place: { en: 'Jimma', am: 'ጅማ' },
        glyph: 'ቡ',
        difficulty: 'beginner',
        xpReward: 50,
        items: byCategory('Food'),
    },
    {
        id: 'lesson-10',
        title: 'Colors',
        description: 'Red, yellow, green — and the rest of the rainbow.',
        unit: 2,
        place: { en: 'Harar', am: 'ሐረር' },
        glyph: 'ቀ',
        difficulty: 'beginner',
        xpReward: 45,
        items: byCategory('Colors'),
    },
    {
        id: 'lesson-11',
        title: 'The Body',
        description: 'Head, eyes, hands, and feet.',
        unit: 2,
        place: { en: 'Hawassa', am: 'ሀዋሳ' },
        glyph: 'ራ',
        difficulty: 'beginner',
        xpReward: 45,
        items: byCategory('Body'),
    },
    {
        id: 'lesson-9',
        title: 'Objects & Animals',
        description: 'Everyday things, a home, and the animals around it.',
        unit: 2,
        place: { en: 'Arba Minch', am: 'አርባ ምንጭ' },
        glyph: 'ው',
        difficulty: 'beginner',
        xpReward: 60,
        items: byCategory('Objects', 'Animals', 'Places'),
    },
    {
        id: 'lesson-6',
        title: 'Common Verbs',
        description: 'Eat, drink, come, go — the actions behind every sentence.',
        unit: 3,
        place: { en: 'Axum', am: 'አክሱም' },
        glyph: 'መ',
        difficulty: 'intermediate',
        xpReward: 80,
        items: byCategory('Verbs'),
    },
    {
        id: 'lesson-7',
        title: 'Describing Things',
        description: 'Big, small, good, beautiful.',
        unit: 3,
        place: { en: 'Mekelle', am: 'መቀሌ' },
        glyph: 'ቆ',
        difficulty: 'intermediate',
        xpReward: 50,
        items: byCategory('Adjectives'),
    },
    {
        id: 'lesson-8',
        title: 'Time',
        description: 'Yesterday, today, tomorrow, and right now.',
        unit: 3,
        place: { en: 'Dire Dawa', am: 'ድሬ ዳዋ' },
        glyph: 'ዛ',
        difficulty: 'intermediate',
        xpReward: 45,
        items: byCategory('Time'),
    },
    {
        id: 'lesson-12',
        title: 'Useful Phrases',
        description: 'Please, sorry, goodbye, and how much is it?',
        unit: 3,
        place: { en: 'Simien Mountains', am: 'ሰሜን ተራሮች' },
        glyph: 'ይ',
        difficulty: 'intermediate',
        xpReward: 70,
        items: byCategory('Phrases'),
    },
];

/** Kept for older imports. */
export const mockLessonsData = lessons;

export function getLesson(id: string) {
    return lessons.find((l) => l.id === id);
}

export function lessonIndex(id: string) {
    return lessons.findIndex((l) => l.id === id);
}

/** A lesson is open once the one before it is done (or it was already done). */
export function isLessonUnlocked(index: number, completed: string[]) {
    if (index <= 0) return true;
    return completed.includes(lessons[index].id) || completed.includes(lessons[index - 1].id);
}

export function nextLessonFor(completed: string[]) {
    return lessons.find((l) => !completed.includes(l.id)) ?? null;
}

/** The same word all day, a new one tomorrow. */
export function wordOfTheDay(key: string) {
    let hash = 0;
    for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    return vocabularyData[hash % vocabularyData.length];
}
