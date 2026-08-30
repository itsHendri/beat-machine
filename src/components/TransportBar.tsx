import { useRef, useEffect } from 'react'
import { GenreName } from '../types'

const GENRES: GenreName[] = ['techno', 'house', 'trance', 'acid']

interface TransportBarProps {
  isPlaying: boolean
  bpm: number
  volume: number
  activeGenre: GenreName | null
  isRecording: boolean
  onTogglePlay: () => void
  onBpmChange: (bpm: number) => void
  onVolumeChange: (vol: number) => void
  onClearAll: () => void
  onLoadDemo: () => void
  onRandomize: () => void
  onGenreSelect: (g: GenreName) => void
  onStartRecording: () => void
  onStopRecording: () => void
}

export function TransportBar({
  isPlaying,
  bpm,
  volume,
  activeGenre,
  isRecording,
  onTogglePlay,
  onBpmChange,
  onVolumeChange,
  onClearAll,
  onLoadDemo,
  onRandomize,
  onGenreSelect,
  onStartRecording,
  onStopRecording,
}: TransportBarProps) {
  const bpmRef = useRef(bpm)
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const repeatTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { bpmRef.current = bpm }, [bpm])

  const startHold = (direction: 1 | -1) => {
    const next = Math.max(20, Math.min(300, bpmRef.current + direction))
    onBpmChange(next)
    pressTimer.current = setTimeout(() => {
      repeatTimer.current = setInterval(() => {
        onBpmChange(Math.max(20, Math.min(300, bpmRef.current + direction)))
      }, 80)
    }, 400)
  }

  const stopHold = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current)
    if (repeatTimer.current) clearInterval(repeatTimer.current)
  }

  return (
    <div className="flex flex-col items-center gap-3 pb-6 mb-2 border-b border-stone-200">
    <div className="flex flex-wrap items-center justify-center gap-5">
      {/* Play / Stop — primary action */}
      <button
        onClick={onTogglePlay}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all shadow-sm bg-stone-800 text-white hover:bg-stone-700"
      >
        {isPlaying ? (
          <>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor" aria-hidden="true">
              <rect x="0" y="0" width="3" height="9" rx="1" />
              <rect x="6" y="0" width="3" height="9" rx="1" />
            </svg>
            Stop
          </>
        ) : (
          <>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor" aria-hidden="true">
              <polygon points="0,0 9,4.5 0,9" />
            </svg>
            Play
          </>
        )}
      </button>

      {/* Record */}
      <button
        onClick={isRecording ? onStopRecording : onStartRecording}
        aria-label={isRecording ? 'Stop recording and download' : 'Record audio'}
        aria-pressed={isRecording}
        className={[
          'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all shadow-sm',
          isRecording
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-stone-100 text-stone-600 hover:bg-stone-200',
        ].join(' ')}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${isRecording ? 'bg-white animate-pulse' : 'bg-red-400'}`} aria-hidden="true" />
        {isRecording ? 'Stop & Save' : 'Record'}
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-stone-200" aria-hidden="true" />

      {/* BPM — hold to repeat (accessibility: larger targets) */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-stone-400 select-none">BPM</span>
        <button
          aria-label="Decrease BPM"
          onMouseDown={() => startHold(-1)}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          className="w-8 h-8 rounded-full text-stone-500 hover:bg-stone-100 text-base flex items-center justify-center transition-colors select-none"
        >−</button>
        <span className="w-9 text-center text-sm font-bold text-stone-700 tabular-nums" aria-label={`BPM: ${bpm}`}>{bpm}</span>
        <button
          aria-label="Increase BPM"
          onMouseDown={() => startHold(1)}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          className="w-8 h-8 rounded-full text-stone-500 hover:bg-stone-100 text-base flex items-center justify-center transition-colors select-none"
        >+</button>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-stone-200" aria-hidden="true" />

      {/* Master Volume */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-stone-400 select-none">Vol</span>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          aria-label="Master volume"
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-20 cursor-pointer accent-stone-700"
        />
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-stone-200" aria-hidden="true" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClearAll}
          className="px-3 py-1.5 rounded-full text-xs font-medium text-stone-400 border border-stone-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={onLoadDemo}
          className="px-3 py-1.5 rounded-full text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
        >
          Load Demo
        </button>
        <button
          onClick={onRandomize}
          className="px-3 py-1.5 rounded-full text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
        >
          Randomize
        </button>
      </div>
    </div>

    {/* Genre pills — renamed from "Style" (content-ux-writing: clearer terminology) */}
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-stone-400 select-none">Genre</span>
      <div className="flex items-center gap-1.5">
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => onGenreSelect(g)}
            aria-pressed={activeGenre === g}
            className={[
              'px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all',
              activeGenre === g
                ? 'bg-stone-800 text-white'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200',
            ].join(' ')}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
    </div>
  )
}
