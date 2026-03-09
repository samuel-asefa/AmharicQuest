import { VocabularyItem } from "./types";

export const fidelData = [
    {
        basePhonetic: 'h',
        family: [
            { char: 'ሀ', phonetic: 'ha' },
            { char: 'ሁ', phonetic: 'hu' },
            { char: 'ሂ', phonetic: 'hi' },
            { char: 'ሃ', phonetic: 'ha*' },
            { char: 'ሄ', phonetic: 'he' },
            { char: 'ህ', phonetic: 'h' },
            { char: 'ሆ', phonetic: 'ho' }
        ]
    },
    {
        basePhonetic: 'l',
        family: [
            { char: 'ለ', phonetic: 'le' },
            { char: 'ሉ', phonetic: 'lu' },
            { char: 'ሊ', phonetic: 'li' },
            { char: 'ላ', phonetic: 'la' },
            { char: 'ሌ', phonetic: 'le*' },
            { char: 'ል', phonetic: 'l' },
            { char: 'ሎ', phonetic: 'lo' }
        ]
    },
    {
        basePhonetic: 'm',
        family: [
            { char: 'መ', phonetic: 'me' },
            { char: 'ሙ', phonetic: 'mu' },
            { char: 'ሚ', phonetic: 'mi' },
            { char: 'ማ', phonetic: 'ma' },
            { char: 'ሜ', phonetic: 'me*' },
            { char: 'ም', phonetic: 'm' },
            { char: 'ሞ', phonetic: 'mo' }
        ]
    },
    {
        basePhonetic: 'r',
        family: [
            { char: 'ረ', phonetic: 're' },
            { char: 'ሩ', phonetic: 'ru' },
            { char: 'ሪ', phonetic: 'ri' },
            { char: 'ራ', phonetic: 'ra' },
            { char: 'ሬ', phonetic: 're*' },
            { char: 'ር', phonetic: 'r' },
            { char: 'ሮ', phonetic: 'ro' }
        ]
    },
    {
        basePhonetic: 's',
        family: [
            { char: 'ሰ', phonetic: 'se' },
            { char: 'ሱ', phonetic: 'su' },
            { char: 'ሲ', phonetic: 'si' },
            { char: 'ሳ', phonetic: 'sa' },
            { char: 'ሴ', phonetic: 'se*' },
            { char: 'ስ', phonetic: 's' },
            { char: 'ሶ', phonetic: 'so' }
        ]
    },
    {
        basePhonetic: 'sh',
        family: [
            { char: 'ሸ', phonetic: 'she' },
            { char: 'ሹ', phonetic: 'shu' },
            { char: 'ሺ', phonetic: 'shi' },
            { char: 'ሻ', phonetic: 'sha' },
            { char: 'ሼ', phonetic: 'she*' },
            { char: 'ሽ', phonetic: 'sh' },
            { char: 'ሾ', phonetic: 'sho' }
        ]
    },
    {
        basePhonetic: 'q',
        family: [
            { char: 'ቀ', phonetic: 'qe' },
            { char: 'ቁ', phonetic: 'qu' },
            { char: 'ቂ', phonetic: 'qi' },
            { char: 'ቃ', phonetic: 'qa' },
            { char: 'ቄ', phonetic: 'qe*' },
            { char: 'ቅ', phonetic: 'q' },
            { char: 'ቆ', phonetic: 'qo' }
        ]
    },
    {
        basePhonetic: 'b',
        family: [
            { char: 'በ', phonetic: 'be' },
            { char: 'ቡ', phonetic: 'bu' },
            { char: 'ቢ', phonetic: 'bi' },
            { char: 'ባ', phonetic: 'ba' },
            { char: 'ቤ', phonetic: 'be*' },
            { char: 'ብ', phonetic: 'b' },
            { char: 'ቦ', phonetic: 'bo' }
        ]
    },
    {
        basePhonetic: 't',
        family: [
            { char: 'ተ', phonetic: 'te' },
            { char: 'ቱ', phonetic: 'tu' },
            { char: 'ቲ', phonetic: 'ti' },
            { char: 'ታ', phonetic: 'ta' },
            { char: 'ቴ', phonetic: 'te*' },
            { char: 'ት', phonetic: 't' },
            { char: 'ቶ', phonetic: 'to' }
        ]
    },
    {
        basePhonetic: 'n',
        family: [
            { char: 'ነ', phonetic: 'ne' },
            { char: 'ኑ', phonetic: 'nu' },
            { char: 'ኒ', phonetic: 'ni' },
            { char: 'ና', phonetic: 'na' },
            { char: 'ኔ', phonetic: 'ne*' },
            { char: 'ን', phonetic: 'n' },
            { char: 'ኖ', phonetic: 'no' }
        ]
    },
    {
        basePhonetic: 'a',
        family: [
            { char: 'አ', phonetic: 'a' },
            { char: 'ኡ', phonetic: 'u' },
            { char: 'ኢ', phonetic: 'i' },
            { char: 'ኣ', phonetic: 'a*' },
            { char: 'ኤ', phonetic: 'e' },
            { char: 'እ', phonetic: 'e/null' },
            { char: 'ኦ', phonetic: 'o' }
        ]
    },
    {
        basePhonetic: 'k',
        family: [
            { char: 'ከ', phonetic: 'ke' },
            { char: 'ኩ', phonetic: 'ku' },
            { char: 'ኪ', phonetic: 'ki' },
            { char: 'ካ', phonetic: 'ka' },
            { char: 'ኬ', phonetic: 'ke*' },
            { char: 'ክ', phonetic: 'k' },
            { char: 'ኮ', phonetic: 'ko' }
        ]
    },
    {
        basePhonetic: 'w',
        family: [
            { char: 'ወ', phonetic: 'we' },
            { char: 'ዉ', phonetic: 'wu' },
            { char: 'ዊ', phonetic: 'wi' },
            { char: 'ዋ', phonetic: 'wa' },
            { char: 'ዌ', phonetic: 'we*' },
            { char: 'ው', phonetic: 'w' },
            { char: 'ዎ', phonetic: 'wo' }
        ]
    },
    {
        basePhonetic: 'y',
        family: [
            { char: 'የ', phonetic: 'ye' },
            { char: 'ዩ', phonetic: 'yu' },
            { char: 'ዪ', phonetic: 'yi' },
            { char: 'ያ', phonetic: 'ya' },
            { char: 'ዬ', phonetic: 'ye*' },
            { char: 'ይ', phonetic: 'y' },
            { char: 'ዮ', phonetic: 'yo' }
        ]
    },
    {
        basePhonetic: 'd',
        family: [
            { char: 'ደ', phonetic: 'de' },
            { char: 'ዱ', phonetic: 'du' },
            { char: 'ዲ', phonetic: 'di' },
            { char: 'ዳ', phonetic: 'da' },
            { char: 'ዴ', phonetic: 'de*' },
            { char: 'ድ', phonetic: 'd' },
            { char: 'ዶ', phonetic: 'do' }
        ]
    },
    {
        basePhonetic: 'g',
        family: [
            { char: 'ገ', phonetic: 'ge' },
            { char: 'ጉ', phonetic: 'gu' },
            { char: 'ጊ', phonetic: 'gi' },
            { char: 'ጋ', phonetic: 'ga' },
            { char: 'ጌ', phonetic: 'ge*' },
            { char: 'ግ', phonetic: 'g' },
            { char: 'ጎ', phonetic: 'go' }
        ]
    }
];

export const vocabularyData: VocabularyItem[] = [
    { id: '1', amharic: 'ሰላም', english: 'Hello', phonetic: 'Salam', category: 'Greetings' },
    { id: '2', amharic: 'አመሰግናለሁ', english: 'Thank you', phonetic: 'Ameseginalehu', category: 'Greetings' },
    { id: '3', amharic: 'ውሃ', english: 'Water', phonetic: 'Wuha', category: 'Food' },
    { id: '4', amharic: 'እናት', english: 'Mother', phonetic: 'Enat', category: 'Family' },
    { id: '5', amharic: 'አባት', english: 'Father', phonetic: 'Abat', category: 'Family' },
    { id: '6', amharic: 'እንደምን አለህ', english: 'How are you? (M)', phonetic: 'Endemin aleh', category: 'Greetings' },
    { id: '7', amharic: 'እንደምን አለሽ', english: 'How are you? (F)', phonetic: 'Endemin alesh', category: 'Greetings' },
    { id: '8', amharic: 'አዎ', english: 'Yes', phonetic: 'Awo', category: 'Basic' },
    { id: '9', amharic: 'አይ', english: 'No', phonetic: 'Aye', category: 'Basic' },
    { id: '10', amharic: 'ቤት', english: 'House', phonetic: 'Bet', category: 'Places' }
];

export const mockLessonsData = [
    {
        id: "lesson-1",
        title: "Basic Greetings",
        description: "Learn how to say hello and ask how people are doing.",
        category: "Conversational",
        difficulty: "beginner" as const,
        xpReward: 50,
        items: vocabularyData.filter(v => v.category === "Greetings")
    },
    {
        id: "lesson-2",
        title: "Essential Words",
        description: "The most important words you'll need like yes and no.",
        category: "Vocabulary",
        difficulty: "beginner" as const,
        xpReward: 30,
        items: vocabularyData.filter(v => v.category === "Basic")
    },
    {
        id: "lesson-3",
        title: "Family Members",
        description: "Identify family members such as mother and father.",
        category: "Vocabulary",
        difficulty: "beginner" as const,
        xpReward: 40,
        items: vocabularyData.filter(v => v.category === "Family")
    }
];
