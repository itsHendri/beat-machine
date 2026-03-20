import { memo } from 'react'
import { InstrumentSection } from './InstrumentSection'
import { INSTRUMENTS, InstrumentName, InstrumentSound, PatternGrid } from '../types'

interface SequencerGridProps {
  pattern: PatternGrid
  currentStep: number
  instrumentVolumes: Record<InstrumentName, number>
  instrumentSounds: Record<InstrumentName, InstrumentSound>
  onToggle: (instrument: InstrumentName, row: number, step: number) => void
  onInstrumentVolumeChange: (instrument: InstrumentName, value: number) => void
  onInstrumentSoundChange: (instrument: InstrumentName, param: keyof InstrumentSound, value: number) => void
  onClearInstrument: (instrument: InstrumentName) => void
  onRandomizeInstrument: (instrument: InstrumentName) => void
  onCopyInstrument: (instrument: InstrumentName) => void
  onPasteInstrument: (instrument: InstrumentName) => void
  canPaste: boolean
}

export const SequencerGrid = memo(function SequencerGrid({
  pattern,
  currentStep,
  instrumentVolumes,
  instrumentSounds,
  onToggle,
  onInstrumentVolumeChange,
  onInstrumentSoundChange,
  onClearInstrument,
  onRandomizeInstrument,
  onCopyInstrument,
  onPasteInstrument,
  canPaste,
}: SequencerGridProps) {
  return (
    <div className="flex flex-col gap-4">
      {INSTRUMENTS.map((inst, i) => (
        <div key={inst}>
          <InstrumentSection
            instrument={inst}
            rows={pattern[inst]}
            currentStep={currentStep}
            volume={instrumentVolumes[inst]}
            sound={instrumentSounds[inst]}
            onToggle={onToggle}
            onVolumeChange={onInstrumentVolumeChange}
            onSoundChange={onInstrumentSoundChange}
            onClear={onClearInstrument}
            onRandomize={onRandomizeInstrument}
            onCopy={onCopyInstrument}
            onPaste={onPasteInstrument}
            canPaste={canPaste}
          />
          {i < INSTRUMENTS.length - 1 && (
            <div className="mt-4 border-t border-stone-100" />
          )}
        </div>
      ))}
    </div>
  )
})
