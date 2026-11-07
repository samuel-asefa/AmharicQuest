<h2 align="center"><em><code>AmharicQuest</code></em></h2>

<p align="center">A game-like way to learn Amharic: master the Fidel script, build your vocabulary, and journey across Ethiopia one lesson at a time.</p>

## Features
- **The Journey** — 12 lessons laid out as stops on a winding road across Ethiopia, from Addis Ababa to the Simien Mountains. Finish one stop to unlock the next.
- **Lesson player** — flip-card introductions, multiple-choice quizzes in both directions, a "match the pairs" round, and missed questions coming back for a second chance. Ends with a celebration, XP, accuracy, and your best combo.
- **Fidel explorer** — all 34 letter families × 7 vowel orders (238 characters). An animated "how it works" demo, a vowel-order switcher, a full chart with crosshair highlighting, search by sound or by pasting a character, and a detail panel for every family.
- **Practice** — Meaning match, Say it in Amharic, Fidel drill, and a 60-second Speed round, with topic filters, combos, and a session summary.
- **Progress** — XP, levels with titles, daily goals, a real day-by-day streak, a 14-day activity chart, and 12 badges.
- **Polish** — light and dark themes, synthesized sound effects (toggleable), keyboard shortcuts (1–4 to answer, Enter to continue, Space to flip), reduced-motion support, and a fully responsive layout.
- **Accounts** — optional Firebase email sign-in. Progress is saved on the device, so guests can learn without an account.

---

## Content

### Fidel
All 34 Ge'ez consonant families, each with their 7 vowel orders (ä, u, i, a, e, ə, o) — 238 characters with consistent romanization and pronunciation hints. Families that share a sound (ሀ/ሐ/ኀ, ሰ/ሠ, አ/ዐ, ጸ/ፀ) are marked as such.

### Vocabulary
| Category | Words |
|---|---|
| Greetings | 5 |
| Basic | 4 |
| Family | 5 |
| Numbers | 10 |
| Food | 6 |
| Colors | 6 |
| Body | 6 |
| Objects, Animals & Places | 6 |
| Verbs | 6 |
| Adjectives | 4 |
| Time | 4 |
| Phrases | 5 |

### Lessons
12 lessons in three units — *First Steps*, *Everyday Life*, and *Getting Fluent* — each rewarding 30–80 XP, plus a 10 XP bonus for a perfect run.

---

## Running locally

```bash
npm install
npm run dev
```

Firebase sign-in needs the `NEXT_PUBLIC_FIREBASE_*` variables in `.env.local`. Without them the app still works in guest mode.
