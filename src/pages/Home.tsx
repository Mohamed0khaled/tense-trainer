import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BadgePill from '../components/BadgePill'
import PageTransition from '../components/PageTransition'
import StatCard from '../components/StatCard'
import ToggleSwitch from '../components/ToggleSwitch'
import XPBadge from '../components/XPBadge'
import { useQuizStore } from '../store/useQuizStore'
import { getWeakTenses } from '../utils/analytics'
import { validateQuizFile } from '../utils/validation'

const modeOptions = [
  { value: 'all', label: 'Full run', description: 'Play the full set in a fresh order.' },
  { value: 'random', label: 'Random quiz', description: 'Shuffle a short burst of questions.' },
  { value: 'weak', label: 'Weak areas', description: 'Only your lowest scoring tenses.' },
  { value: 'daily', label: 'Daily challenge', description: 'One fresh set per day.' },
] as const

const Home = () => {
  const navigate = useNavigate()
  const quiz = useQuizStore((state) => state.quiz)
  const player = useQuizStore((state) => state.player)
  const stats = useQuizStore((state) => state.stats)
  const settings = useQuizStore((state) => state.settings)
  const loadQuiz = useQuizStore((state) => state.loadQuiz)
  const startQuiz = useQuizStore((state) => state.startQuiz)
  const updateSettings = useQuizStore((state) => state.updateSettings)

  const weakAreas = useMemo(() => getWeakTenses(stats, 3), [stats])

  const handleStart = (mode?: typeof settings.mode) => {
    if (!quiz) {
      navigate('/upload')
      return
    }
    startQuiz(mode)
    navigate('/game')
  }

  const handleLoadSample = async () => {
    const response = await fetch('/sample-questions.json')
    const data = await response.json()
    const validation = validateQuizFile(data)
    if (validation.valid && validation.quiz) {
      loadQuiz(validation.quiz, 'Sample dataset')
    }
  }

  return (
    <PageTransition>
      <section className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="glass rounded-[32px] p-8 md:p-10">
          <span className="rounded-full bg-brandSoft px-3 py-1 text-xs font-semibold text-brand">
            Smart tense coaching
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Master English tenses with a game that feels alive.
          </h1>
          <p className="mt-4 text-base text-muted">
            Upload your own JSON question pack, then play a rapid-fire quiz with streak
            bonuses, adaptive practice, and real-time analytics.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/upload')}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
            >
              Upload quiz file
            </button>
            <button
              type="button"
              onClick={handleLoadSample}
              className="rounded-full border border-black/10 bg-panel px-5 py-3 text-sm font-semibold text-ink shadow-card transition hover:-translate-y-0.5"
            >
              Load sample set
            </button>
            <button
              type="button"
              onClick={() => handleStart()}
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5"
            >
              Start now
            </button>
          </div>

          {quiz && (
            <div className="mt-8 grid gap-4 rounded-3xl border border-black/10 bg-panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-muted">Loaded set</p>
                  <p className="text-lg font-semibold text-ink">{quiz.title}</p>
                  <p className="text-xs text-muted">{quiz.description}</p>
                </div>
                <span className="rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-accentStrong">
                  {quiz.total_questions} questions
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4">
          <XPBadge xp={player.xp} level={player.level} />
          <div className="grid gap-3">
            {modeOptions.map((option) => {
              const disabled = option.value === 'weak' && weakAreas.length === 0
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => updateSettings({ mode: option.value })}
                  className={`rounded-3xl border px-5 py-4 text-left shadow-card transition hover:-translate-y-0.5 ${
                    settings.mode === option.value
                      ? 'border-brand bg-brandSoft'
                      : 'border-black/10 bg-panel'
                  } ${disabled ? 'opacity-50' : ''}`}
                >
                  <p className="text-sm font-semibold text-ink">{option.label}</p>
                  <p className="text-xs text-muted">{option.description}</p>
                </button>
              )
            })}
          </div>

          <div className="grid gap-3">
            <ToggleSwitch
              label="Timer per question"
              enabled={settings.timerEnabled}
              onChange={(value) => updateSettings({ timerEnabled: value })}
            />
            <div className="rounded-2xl border border-black/10 bg-panel px-4 py-3 shadow-card">
              <label className="text-xs font-semibold text-muted">Time per question (seconds)</label>
              <input
                type="number"
                min={10}
                max={90}
                value={settings.timePerQuestion}
                onChange={(event) =>
                  updateSettings({ timePerQuestion: Number(event.target.value) || 20 })
                }
                className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm font-semibold text-ink"
              />
            </div>
            <div className="rounded-2xl border border-black/10 bg-panel px-4 py-3 shadow-card">
              <label className="text-xs font-semibold text-muted">Random/daily question count</label>
              <select
                value={settings.questionCount}
                onChange={(event) =>
                  updateSettings({ questionCount: Number(event.target.value) })
                }
                className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm font-semibold text-ink"
              >
                {[8, 10, 12, 15, 20].map((count) => (
                  <option key={count} value={count}>
                    {count} questions
                  </option>
                ))}
              </select>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={() => handleStart(settings.mode)}
            className="rounded-3xl bg-brand px-6 py-4 text-sm font-semibold text-white shadow-soft"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            Start {settings.mode} mode
          </motion.button>

          <div className="grid gap-3 rounded-3xl border border-black/10 bg-panel p-5 shadow-card">
            <p className="text-sm font-semibold text-ink">Weakest tenses</p>
            {weakAreas.length === 0 ? (
              <p className="text-xs text-muted">Play at least one quiz to unlock insights.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {weakAreas.map((item) => (
                  <BadgePill key={item.tense} label={`${item.tense} ${Math.round(item.accuracy * 100)}%`} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <StatCard label="Streak bonus" value="Up to +8" />
        <StatCard label="Penalty" value="-3 per miss" />
        <StatCard label="Daily XP boost" value="+30 XP" />
      </section>
    </PageTransition>
  )
}

export default Home
