import type { Question } from '../types/quiz'

interface QuestionCardProps {
  question: Question
  choices: string[]
  selected: string | null
  showAnswer: boolean
  onSelect: (choice: string) => void
}

const QuestionCard = ({
  question,
  choices,
  selected,
  showAnswer,
  onSelect,
}: QuestionCardProps) => {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-brandSoft px-3 py-1 text-xs font-semibold text-brand">
          {question.tense}
        </span>
        {question.question_note && (
          <span className="text-xs text-muted">{question.question_note}</span>
        )}
      </div>

      <h2 className="mt-4 text-2xl font-semibold text-ink">
        {question.question}
      </h2>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {choices.map((choice) => {
          const isCorrect = choice === question.correct_answer
          const isSelected = choice === selected
          const showState = showAnswer && (isCorrect || isSelected)
          const stateClass = showState
            ? isCorrect
              ? 'border-success bg-successSoft text-success'
              : 'border-danger bg-dangerSoft text-danger'
            : 'border-black/10 bg-panel text-ink'

          return (
            <button
              type="button"
              key={choice}
              onClick={() => onSelect(choice)}
              className={`rounded-2xl border px-4 py-3 text-left font-semibold transition hover:-translate-y-0.5 ${stateClass}`}
              disabled={showAnswer}
            >
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuestionCard
