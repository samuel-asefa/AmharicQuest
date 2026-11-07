import { vocabularyData } from './data';
import { FIDEL, VOWEL_ORDERS } from './fidel';
import { Lesson, VocabularyItem } from './types';
import { pick, shuffle } from './utils';

export interface ChoiceOption {
    id: string;
    label: string;
    sub?: string;
    geez: boolean;
}

export interface ChoiceQuestion {
    kind: 'choice';
    key: string;
    variant: 'meaning' | 'translate' | 'fidel-sound' | 'fidel-char';
    instruction: string;
    prompt: string;
    promptSub?: string;
    promptIsGeez: boolean;
    options: ChoiceOption[];
    answerId: string;
    /** What we show when the learner gets it wrong. */
    reveal: { label: string; detail?: string };
    wordId?: string;
}

export interface MatchQuestion {
    kind: 'match';
    key: string;
    pairs: { id: string; left: string; leftSub: string; right: string }[];
}

export type Question = ChoiceQuestion | MatchQuestion;

let counter = 0;
const nextKey = (prefix: string) => `${prefix}-${++counter}`;

/** Three distractors, preferring words from the same topic (they are harder to tell apart). */
function vocabChoices(item: VocabularyItem, field: 'english' | 'amharic', pool = vocabularyData) {
    const others = pool.filter((v) => v.id !== item.id);
    const same = shuffle(others.filter((v) => v.category === item.category));
    const rest = shuffle(others.filter((v) => v.category !== item.category));
    const seen = new Set([item[field]]);
    const picks: VocabularyItem[] = [];
    for (const v of [...same.slice(0, 2), ...rest, ...same.slice(2)]) {
        if (picks.length >= 3) break;
        if (seen.has(v[field])) continue;
        seen.add(v[field]);
        picks.push(v);
    }
    return shuffle([item, ...picks]);
}

export function meaningQuestion(item: VocabularyItem, pool?: VocabularyItem[]): ChoiceQuestion {
    return {
        kind: 'choice',
        key: nextKey('meaning'),
        variant: 'meaning',
        instruction: 'What does this mean?',
        prompt: item.amharic,
        promptSub: item.phonetic,
        promptIsGeez: true,
        options: vocabChoices(item, 'english', pool).map((v) => ({ id: v.id, label: v.english, geez: false })),
        answerId: item.id,
        reveal: { label: item.english, detail: `${item.amharic} · ${item.phonetic}` },
        wordId: item.id,
    };
}

export function translateQuestion(item: VocabularyItem, pool?: VocabularyItem[]): ChoiceQuestion {
    return {
        kind: 'choice',
        key: nextKey('translate'),
        variant: 'translate',
        instruction: 'How do you say this in Amharic?',
        prompt: item.english,
        promptIsGeez: false,
        options: vocabChoices(item, 'amharic', pool).map((v) => ({
            id: v.id,
            label: v.amharic,
            sub: v.phonetic,
            geez: true,
        })),
        answerId: item.id,
        reveal: { label: item.amharic, detail: `${item.phonetic} · ${item.english}` },
        wordId: item.id,
    };
}

export function fidelQuestion(): ChoiceQuestion {
    const family = pick(FIDEL);
    const form = pick(family.forms);
    const sameFamily = shuffle(family.forms.filter((f) => f.order !== form.order));
    const sameOrder = shuffle(FIDEL.filter((f) => f.id !== family.id).map((f) => f.forms[form.order - 1]));

    // Distractors must sound different, or the question would have two right answers.
    const seen = new Set([form.roman]);
    const picks = [];
    for (const f of [...sameFamily.slice(0, 2), ...sameOrder, ...sameFamily.slice(2)]) {
        if (picks.length >= 3) break;
        if (seen.has(f.roman)) continue;
        seen.add(f.roman);
        picks.push(f);
    }
    const options = shuffle([form, ...picks]);
    const order = VOWEL_ORDERS[form.order - 1];
    const reveal = {
        label: `${form.char} = ${form.roman}`,
        detail: `${order.label} order of ${family.forms[0].char} · vowel “${order.vowel}” as in ${order.hint}`,
    };

    if (Math.random() < 0.5) {
        return {
            kind: 'choice',
            key: nextKey('fidel'),
            variant: 'fidel-sound',
            instruction: 'What sound does this character make?',
            prompt: form.char,
            promptIsGeez: true,
            options: options.map((f) => ({ id: f.char, label: f.roman, geez: false })),
            answerId: form.char,
            reveal,
        };
    }
    return {
        kind: 'choice',
        key: nextKey('fidel'),
        variant: 'fidel-char',
        instruction: 'Which character makes this sound?',
        prompt: form.roman,
        promptSub: family.consonant ? family.hint : 'A pure vowel sound',
        promptIsGeez: false,
        options: options.map((f) => ({ id: f.char, label: f.char, geez: true })),
        answerId: form.char,
        reveal,
    };
}

export function matchQuestion(items: VocabularyItem[]): MatchQuestion {
    return {
        kind: 'match',
        key: nextKey('match'),
        pairs: shuffle(items)
            .slice(0, 5)
            .map((v) => ({ id: v.id, left: v.amharic, leftSub: v.phonetic, right: v.english })),
    };
}

/**
 * A lesson quiz: every word once (alternating direction), a few words again
 * the other way round, then a "match the pairs" round.
 */
export function buildLessonQuiz(lesson: Lesson): Question[] {
    const items = shuffle(lesson.items);
    const choice: ChoiceQuestion[] = items.map((item, i) =>
        i % 2 === 0 ? meaningQuestion(item) : translateQuestion(item),
    );
    const extraCount = Math.min(3, Math.max(0, 10 - items.length));
    items.slice(0, extraCount).forEach((item, i) => {
        choice.push(i % 2 === 0 ? translateQuestion(item) : meaningQuestion(item));
    });

    // Shuffle, then nudge apart any two questions about the same word that sit side by side.
    const ordered = shuffle(choice);
    for (let i = 1; i < ordered.length; i++) {
        if (ordered[i].wordId === ordered[i - 1].wordId) {
            const j = ordered.findIndex(
                (q, k) => k > i && q.wordId !== ordered[i - 1].wordId && q.wordId !== ordered[k - 1]?.wordId,
            );
            if (j > -1) [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
        }
    }

    const quiz: Question[] = [...ordered];
    if (lesson.items.length >= 3) quiz.push(matchQuestion(lesson.items));
    return quiz;
}

export type PracticeMode = 'meaning' | 'translate' | 'fidel' | 'sprint';

export function practiceQuestion(mode: PracticeMode, category: string | null, avoid?: string): ChoiceQuestion {
    if (mode === 'fidel') return fidelQuestion();
    if (mode === 'sprint') {
        const r = Math.random();
        if (r < 0.3) return fidelQuestion();
        return practiceQuestion(r < 0.65 ? 'meaning' : 'translate', null, avoid);
    }
    const pool = category ? vocabularyData.filter((v) => v.category === category) : vocabularyData;
    const candidates = pool.length > 1 ? pool.filter((v) => v.id !== avoid) : pool;
    const item = pick(candidates);
    return mode === 'meaning' ? meaningQuestion(item) : translateQuestion(item);
}

/** How many quiz steps buildLessonQuiz makes (before any retries). */
export function lessonQuizLength(lesson: Lesson) {
    const n = lesson.items.length;
    return n + Math.min(3, Math.max(0, 10 - n)) + (n >= 3 ? 1 : 0);
}
