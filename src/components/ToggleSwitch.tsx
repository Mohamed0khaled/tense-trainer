interface ToggleSwitchProps {
  label: string
  enabled: boolean
  onChange: (next: boolean) => void
}

const ToggleSwitch = ({ label, enabled, onChange }: ToggleSwitchProps) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-panel px-4 py-3 text-left text-sm shadow-card transition hover:-translate-y-0.5"
    >
      <span className="font-semibold text-ink">{label}</span>
      <span
        className={`h-6 w-11 rounded-full p-1 transition ${
          enabled ? 'bg-brand' : 'bg-black/20'
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  )
}

export default ToggleSwitch
