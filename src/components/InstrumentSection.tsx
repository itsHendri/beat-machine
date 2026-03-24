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
  orange: 'text-orange-500',
  indigo: 'text-indigo-500',
  violet: 'text-violet-500',
  emerald: 'text-emerald-500',
  rose: 'text-rose-500',
}

const ACCENT_BORDER: Record<string, string> = {
  orange: 'border-l-orange-400',
  indigo: 'border-l-indigo-400',
  violet: 'border-l-violet-400',
  emerald: 'border-l-emerald-400',
  rose: 'border-l-rose-400',
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
  const labelClass = LABEL_TEXT_COLOR[color] ?? 'text-stone-500'
  const sliderClass = SLIDER_COLOR[color] ?? 'accent-stone-400'
  const accentClass = ACCENT_BORDER[color] ?? 'border-l-stone-300'

  return (
    <div className={`bg-white rounded-xl border border-stone-100 border-l-4 ${accentClass} p-4 sm:p-5 flex flex-col gap-3 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className={iconClass}>
            <InstrumentIcon instrument={instrument} />
          </span>
          <span className={`text-sm font-bold uppercase tracking-widest select-none ${labelClass}`}>
            {INSTRUMENT_LABELS[instrument]}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onCopy(instrument)}
            className="border border-stone-200 rounded-full px-2.5 py-1 text-xs font-medium text-stone-400 hover:border-stone-300 hover:text-stone-600 transition-colors select-none flex items-center gap-1"
          >
            <Copy size={10} />
            Copy
          </button>
          <button
            onClick={() => onPaste(instrument)}
            disabled={!canPaste}
            className="border border-stone-200 rounded-full px-2.5 py-1 text-xs font-medium transition-colors select-none disabled:opacity-30 disabled:cursor-not-allowed text-stone-400 hover:border-stone-300 hover:text-stone-600 disabled:hover:border-stone-200 disabled:hover:text-stone-400 flex items-center gap-1"
          >
            <ClipboardPaste size={10} />
            Paste
          </button>
          <button
            onClick={() => onRandomize(instrument)}
            className="border border-stone-200 rounded-full px-2.5 py-1 text-xs font-medium text-stone-400 hover:border-stone-300 hover:text-stone-600 transition-colors select-none flex items-center gap-1"
          >
            <Shuffle size={10} />
            Randomize
          </button>
          <button
            onClick={() => onClear(instrument)}
            className="border border-stone-200 rounded-full px-2.5 py-1 text-xs font-medium text-stone-400 hover:border-stone-300 hover:text-stone-600 transition-colors select-none"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Sound shape sliders: Filter, Reverb, Drive */}
      <div className="flex items-center gap-4 overflow-x-auto">
        <span className="w-14 shrink-0" />
        {([
          ['filterFreq', 'Filter'] as const,
          ['reverbWet',  'Reverb'] as const,
          ['drive',      'Drive' ] as const,
        ]).map(([param, label]) => (
          <label key={param} className="flex items-center gap-2 flex-1 min-w-[80px]">
            <span className="text-[10px] font-medium text-stone-400 w-8 shrink-0 select-none">{label}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={sound[param]}
              onChange={(e) => onSoundChange(instrument, param, Number(e.target.value))}
              className={`flex-1 cursor-pointer ${sliderClass}`}
              style={{ height: 2 }}
            />
          </label>
        ))}
      </div>

      {/* Step rows — scrollable on small screens */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex flex-col gap-1.5 min-w-max">
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
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-2">
        <span className="w-14 text-right text-xs font-medium text-stone-400 shrink-0 select-none">Vol</span>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => onVolumeChange(instrument, Number(e.target.value))}
          className={`flex-1 cursor-pointer ${sliderClass}`}
          title={`${INSTRUMENT_LABELS[instrument]} volume: ${volume}`}
        />
      </div>
    </div>
  )
})
