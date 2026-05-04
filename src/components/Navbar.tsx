import { NavLink } from 'react-router-dom'
import { useQuizStore } from '../store/useQuizStore'
import SoundToggle from './SoundToggle'
import ThemeToggle from './ThemeToggle'

const navLinkBase =
  'rounded-full px-3 py-1.5 text-sm font-semibold transition hover:bg-panelStrong'

const Navbar = () => {
  const quizLoaded = useQuizStore((state) => Boolean(state.quiz))

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-panel backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-white shadow-card">
            TT
          </div>
          <div>
            <p className="font-display text-lg font-semibold">Tense Trainer</p>
            <p className="text-xs text-muted">Play, learn, master</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-1 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? 'bg-panelStrong text-ink' : 'text-muted'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? 'bg-panelStrong text-ink' : 'text-muted'}`
            }
          >
            Upload
          </NavLink>
          <NavLink
            to="/game"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? 'bg-panelStrong text-ink' : 'text-muted'}`
            }
          >
            Game
          </NavLink>
          <NavLink
            to="/results"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? 'bg-panelStrong text-ink' : 'text-muted'}`
            }
          >
            Results
          </NavLink>
          <NavLink
            to="/review"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? 'bg-panelStrong text-ink' : 'text-muted'}`
            }
          >
            Review
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {quizLoaded && (
            <span className="rounded-full bg-brandSoft px-3 py-1 text-xs font-semibold text-brand">
              Quiz ready
            </span>
          )}
          <SoundToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Navbar
