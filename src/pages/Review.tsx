import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import MistakeList from '../components/MistakeList'
import PageTransition from '../components/PageTransition'
import { useQuizStore } from '../store/useQuizStore'

const Review = () => {
  const navigate = useNavigate()
  const quiz = useQuizStore((state) => state.quiz)
  const session = useQuizStore((state) => state.session)

  const mistakes = useMemo(() => {
    if (!quiz) return []
    return session.answers
      .filter((answer) => !answer.correct)
      .map((answer) => {
        const question = quiz.questions.find(
          (item) => item.id === answer.questionId,
        )
        return {
          id: answer.questionId,
          tense: question?.tense ?? 'Unknown',
          prompt: question?.question ?? 'Question not found',
          selected: answer.selected,
          correct: answer.correctAnswer,
          explanation:
            question?.wrong_answer_notes[answer.selected] ??
            question?.question_note ??
            'No explanation provided.',
        }
      })
  }, [quiz, session.answers])

  if (!quiz || !session.isComplete) {
    return (
      <PageTransition>
        <div className="glass rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-ink">No mistakes to review</h2>
          <p className="mt-2 text-sm text-muted">Finish a quiz to unlock the review screen.</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-card"
          >
            Back to home
          </button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <section className="grid gap-6">
        <div className="glass rounded-3xl p-8">
          <h1 className="font-display text-3xl font-semibold text-ink">Mistake review</h1>
          <p className="mt-2 text-sm text-muted">
            Revisit your misses, read the explanations, and try again.
          </p>
        </div>

        <MistakeList items={mistakes} />
      </section>
    </PageTransition>
  )
}

export default Review
