interface BadgePillProps {
  label: string
}

const BadgePill = ({ label }: BadgePillProps) => {
  return (
    <span className="rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-accentStrong">
      {label}
    </span>
  )
}

export default BadgePill
