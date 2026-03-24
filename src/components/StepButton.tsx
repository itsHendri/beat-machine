import { memo } from 'react'

interface StepButtonProps {
  active: boolean
  isCurrentStep: boolean
  color: string
  onToggle: () => void
}

const COLOR_MAP: Record<string, { active: string; current: string }> = {
  orange: {
    active: 'bg-orange-400 border-orange-400 shadow-orange-200',
    current: 'ring-2 ring-orange-300',
  },
  indigo: {
    active: 'bg-indigo-500 border-indigo-500 shadow-indigo-200',
    current: 'ring-2 ring-indigo-300',
  },
  violet: {
    active: 'bg-violet-500 border-violet-500 shadow-violet-200',
    current: 'ring-2 ring-violet-300',
  },
  emerald: {
    active: 'bg-emerald-500 border-emerald-500 shadow-emerald-200',
    current: 'ring-2 ring-emerald-300',
  },
  rose: {
    active: 'bg-rose-500 border-rose-500 shadow-rose-200',
    current: 'ring-2 ring-rose-300',
  },
}

export const StepButton = memo(function StepButton({
  active,
  isCurrentStep,
  color,
  onToggle,
}: StepButtonProps) {
  const colors = COLOR_MAP[color] ?? COLOR_MAP['indigo']

  return (
    <button
      onClick={onToggle}
      className={[
        'w-7 h-7 rounded-md border transition-all duration-75 cursor-pointer',
        active
          ? `${colors.active} shadow-sm`
          : 'bg-stone-50 border-stone-200 hover:border-stone-300 hover:bg-stone-100',
        isCurrentStep ? colors.current : '',
      ].join(' ')}
      aria-pressed={active}
    />
  )
})
