import { memo } from 'react'
import { Drum, Guitar, Piano, Music2, Zap, Copy, ClipboardPaste, Shuffle } from 'lucide-react'
import { TrackRow } from './TrackRow'
import { InstrumentName, InstrumentSound, INSTRUMENT_LABELS, ROW_LABELS, INSTRUMENT_COLORS } from '../types'

const ICON_COLOR: Record<string, string> = {
  orange: 'text-orange-400',
  indigo: 'text-indigo-400',
  violet: 'text-violet-400',
  emerald: 'text-emerald-400',
  rose: 'text-rose-400',
}

const LABEL_TEXT_COLOR: Record<string, string> = {
  orange: 'text-orange-400',
  indigo: 'text-indigo-400',
  violet: 'text-violet-400',
  emerald: 'text-emerald-400',
  rose: 'text-rose-400',
}

const SLIDER_COLOR: Record<string, string> = {
  orange: 'accent-orange-400',
  indigo: 'accent-indigo-400',
  violet: 'accent-violet-400',
  emerald: 'accent-emerald-400',
  rose: 'accent-rose-400',
}

function InstrumentIcon({ instrument }: { instrument: InstrumentName }) {
  const size = 16
  switch (instrument) {
    case 'drums':   return <Drum size={size} />
    case 'bass':    return <Guitar size={size} />
    case 'synth':   return <Piano size={size} />
    case 'strings': return <Music2 size={size} />
    case 'impact':  return <Zap size={size} />
  }
}

interface InstrumentSectionProps {
  instrument: InstrumentName
  rows: boolean[][]
  currentStep: number
  volume: number
  sound: InstrumentSound
  onToggle: (instrument: InstrumentName, row: number, step: number) => void
  onVolumeChange: (instrument: InstrumentName, value: number) => void
  onSoundChange: (instrument: InstrumentName, param: keyof InstrumentSound, value: number) => void
  onClear: (instrument: InstrumentName) => void
  onRandomize: (instrument: InstrumentName) => void
  onCopy: (instrument: InstrumentName) => void
  onPaste: (instrument: InstrumentName) => void
  canPaste: boolean
}

export const InstrumentSection = memo(function InstrumentSection({
  instrument,
  rows,
  currentStep,
  volume,
  sound,
  onToggle,
  onVolumeChange,
  onSoundChange,
  onClear,
  onRandomize,
  onCopy,
  onPaste,
  canPaste,
}: InstrumentSectionProps) {
  const color = INSTRUMENT_COLORS[instrument]
  const iconClass = ICON_COLOR[color] ?? 'text-stone-400'
  const labelClass = LABEL_TEXT_COLOR[color] ?? 'text-stone-400'
  const sliderClass = SLIDER_COLOR[color] ?? 'accent-stone-400'

  return (
    <div className="flex flex-col gap-4">
      {/* Header: icon + name + copy/paste left, randomize + clear right */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={iconClass}>
            <InstrumentIcon instrument={instrument} />
          </span>
          <span className={`text-base font-semibold uppercase tracking-[1px] select-none ${labelClass}`}>
            {INSTRUMENT_LABELS[instrument]}
          </span>
          {/* Icon-only — aria-label required (accessibility skill: icon-only buttons) */}
          <button
            onClick={() => onCopy(instrument)}
            aria-label={`Copy ${INSTRUMENT_LABELS[instrument]} pattern`}
            className="border border-stone-200 rounded-full w-9 h-9 text-stone-400 hover:border-stone-300 hover:text-stone-600 transition-colors select-none flex items-center justify-center"
          >
            <Copy size={12} aria-hidden="true" />
          </button>
          <button
            onClick={() => onPaste(instrument)}
            disabled={!canPaste}
            aria-label={canPaste ? `Paste to ${INSTRUMENT_LABELS[instrument]}` : 'Nothing copied yet'}
            className="border border-stone-200 rounded-full w-9 h-9 transition-colors select-none disabled:opacity-30 disabled:cursor-not-allowed text-stone-400 hover:border-stone-300 hover:text-stone-600 disabled:hover:border-stone-200 disabled:hover:text-stone-400 flex items-center justify-center"
          >
            <ClipboardPaste size={12} aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRandomize(instrument)}
            className="border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-500 hover:border-stone-300 hover:text-stone-700 transition-colors select-none flex items-center gap-1.5"
          >
            <Shuffle size={11} />
            Randomize
          </button>
          <button
            onClick={() => onClear(instrument)}
            className="border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-500 hover:border-stone-300 hover:text-stone-700 transition-colors select-none"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Sound shape sliders: Filter, Reverb, Drive — values shown inline (motion-design: feedback) */}
      <div className="flex items-center gap-6">
        <span className="w-14 shrink-0" /> {/* align with row labels */}
        {([
          ['filterFreq', 'Filter', 'Brightness — left: dark, right: bright'] as const,
          ['reverbWet',  'Reverb', 'Space — left: dry, right: wet'         ] as const,
          ['drive',      'Drive',  'Distortion — left: clean, right: gritty'] as const,
        ]).map(([param, label, description]) => (
          <label key={param} className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs font-medium text-stone-500 w-14 shrink-0 select-none tabular-nums">
              {label} <span className="text-stone-300">{sound[param]}</span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={sound[param]}
              aria-label={`${INSTRUMENT_LABELS[instrument]} ${label}: ${description}`}
              onChange={(e) => onSoundChange(instrument, param, Number(e.target.value))}
              className={`flex-1 cursor-pointer ${sliderClass}`}
              style={{ height: 2 }}
            />
          </label>
        ))}
      </div>

      {/* Step rows */}
      <div className="flex flex-col gap-2">
        {rows.map((stepRow, rowIndex) => (
          <TrackRow
            key={rowIndex}
            instrument={instrument}
            row={rowIndex}
            label={ROW_LABELS[instrument][rowIndex]}
            steps={stepRow}
            currentStep={currentStep}
            onToggle={onToggle}
          />
        ))}
      </div>

      {/* Volume slider — horizontal at bottom */}
      <div className="flex items-center gap-2">
        <span className="w-14 text-right text-xs font-medium text-stone-400 shrink-0 select-none tabular-nums">
          Vol <span className="text-stone-300">{volume}</span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          aria-label={`${INSTRUMENT_LABELS[instrument]} volume`}
          onChange={(e) => onVolumeChange(instrument, Number(e.target.value))}
          className={`flex-1 cursor-pointer ${sliderClass}`}
        />
      </div>
    </div>
  )
})
