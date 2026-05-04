# Tense Trainer

A modern, interactive web app to train and evaluate English tenses using uploaded JSON question files.

## Features
- JSON upload with schema validation and drag-and-drop
- Quiz engine with shuffled questions and choices
- Optional per-question timer
- Scoring with streak bonuses and penalties
- Results dashboard with accuracy and weak tense insights
- Mistake review with explanations
# Tense Trainer

An interactive, game-like English tense trainer. Upload JSON question packs, play timed rounds, and review analytics with weak-tense insights, streak bonuses, XP, and badges.

## Features
- JSON upload with schema validation and drag-and-drop
- Quiz modes: full run, random, weak areas, daily challenge
- Timer per question, streak bonuses, score and XP system
- Results dashboard with accuracy per tense chart
- Mistake review with explanations
- Dark/light theme toggle and smooth motion

## Tech stack
- React + TypeScript (Vite)
- Tailwind CSS
- Zustand state + localStorage persistence
- Framer Motion for transitions
- Recharts for analytics

## Run locally
```bash
npm install
npm run dev
```

## Deploy to GitHub Pages (project site)
1. Create a GitHub repo named `tense-trainer` under your account.
2. Push this project to the repo.
3. In the repo settings, set Pages source to "GitHub Actions".
4. Push to `main` to deploy. The site will be at:
  https://Mohamed0khaled.github.io/tense-trainer/

## Project structure
```
.
├── public/
│   └── sample-questions.json
├── src/
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── tailwind.config.js
└── postcss.config.js
```

## JSON schema (required)
```json
{
  "level": 1,
  "title": "My Tense Pack",
  "description": "Short description",
  "total_questions": 2,
  "questions": [
    {
      "id": 1,
      "tense": "Present Simple",
      "question": "She ___ every day.",
      "choices": ["work", "works"],
      "correct_answer": "works",
      "wrong_answer_notes": {
        "work": "Third-person singular needs -s."
      },
      "question_note": null
    }
  ]
}
```

## Example JSON loader
```ts
const response = await fetch('/sample-questions.json')
const data = await response.json()
const result = validateQuizFile(data)
if (result.valid && result.quiz) {
  loadQuiz(result.quiz, 'Sample dataset')
}
```
      "question": string,
      "choices": [string],
      "correct_answer": string,
      "wrong_answer_notes": { key: explanation },
      "question_note": string | null
    }
  ]
}

Use public/sample-questions.json as a starter template.
