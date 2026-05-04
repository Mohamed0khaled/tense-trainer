import { useQuizStore } from '../store/useQuizStore'

const ThemeToggle = () => {
  const theme = useQuizStore((state) => state.settings.theme)
  const toggleTheme = useQuizStore((state) => state.toggleTheme)

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-black/10 bg-panel px-3 py-1 text-xs font-semibold text-muted shadow-card transition hover:-translate-y-0.5"
    >
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  )
}

export default ThemeToggle
