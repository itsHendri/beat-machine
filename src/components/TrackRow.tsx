import { memo } from 'react'
import { StepButton } from './StepButton'
import { InstrumentName, INSTRUMENT_COLORS } from '../types'

interface TrackRowProps {
  instrument: InstrumentName
  row: number
  label: string
  steps: boolean[]
  currentStep: number
  onToggle: (instrument: InstrumentName, row: number, step: number) => void
}

export const TrackRow = memo(function TrackRow({
  instrument,
  row,
  label,
  steps,
  currentStep,
  onToggle,
}: TrackRowProps) {
  const color = INSTRUMENT_COLORS[instrument]

  // Split 16 steps into 4 groups of 4
  const groups = [
    steps.slice(0, 4),
    steps.slice(4, 8),
    steps.slice(8, 12),
    steps.slice(12, 16),
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="w-14 text-right text-xs text-stone-400 shrink-0 select-none" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}>
        {label}
      </span>
      {/* gap-8 (32px) between halves, gap-4 (16px) between groups within a half, gap-1 (4px) between steps */}
      <div className="flex items-center gap-8">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-4">
            {[0, 1].map((pair) => {
              const groupIndex = half * 2 + pair
              const group = groups[groupIndex]
              const stepOffset = groupIndex * 4
              return (
                <div key={pair} className="flex items-center gap-1">
                  {group.map((active, i) => {
                    const step = stepOffset + i
                    return (
                      <StepButton
                        key={step}
                        active={active}
                        isCurrentStep={currentStep === step}
                        color={color}
                        onToggle={() => onToggle(instrument, row, step)}
                      />
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
})
