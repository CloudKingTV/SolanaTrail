'use client'

interface ProgressBarProps {
  value: number
  max: number
  color?: 'green' | 'purple' | 'blue' | 'amber' | 'red'
  label?: string
  showValue?: boolean
}

const colorMap = {
  green: 'bg-sol-green',
  purple: 'bg-sol-purple',
  blue: 'bg-sol-blue',
  amber: 'bg-warning',
  red: 'bg-danger',
}

export function ProgressBar({
  value,
  max,
  color = 'green',
  label,
  showValue = false,
}: ProgressBarProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100))

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-sol-muted">{label}</span>}
          {showValue && (
            <span className="text-xs font-semibold text-sol-text">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="w-full h-2 bg-sol-darker rounded-full overflow-hidden border border-sol-border">
        <div
          className={`h-full ${colorMap[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
