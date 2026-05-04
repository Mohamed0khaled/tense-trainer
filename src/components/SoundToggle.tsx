import { useQuizStore } from '../store/useQuizStore'

const SoundToggle = () => {
  const soundEnabled = useQuizStore((state) => state.settings.soundEnabled)
  const updateSettings = useQuizStore((state) => state.updateSettings)

  return (
    <button
      type="button"
      onClick={() => updateSettings({ soundEnabled: !soundEnabled })}
      className="rounded-full border border-black/10 bg-panel px-3 py-1 text-xs font-semibold text-muted shadow-card transition hover:-translate-y-0.5"
    >
      {soundEnabled ? 'Sound on' : 'Sound off'}
    </button>
  )
}

export default SoundToggle
