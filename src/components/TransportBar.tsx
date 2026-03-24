import { GenreName } from '../types'

const GENRES: GenreName[] = ['techno', 'house', 'trance', 'acid']

interface TransportBarProps {
  isPlaying: boolean
  bpm: number
  volume: number
  activeGenre: GenreName | null
  onTogglePlay: () => void
  onBpmChange: (bpm: number) => void
  onVolumeChange: (vol: number) => void
  onClearAll: () => void
  onLoadDemo: () => void
  onRandomize: () => void
  onGenreSelect: (g: GenreName) => void
}

export function TransportBar({
  isPlaying,
  bpm,
  volume,
  activeGenre,
  onTogglePlay,
  onBpmChange,
  onVolumeChange,
  onClearAll,
  onLoadDemo,
  onRandomize,
  onGenreSelect,
}: TransportBarProps) {
  return (
    <div className="flex flex-col items-center gap-3 pb-8">
    <div className="flex flex-wrap items-center justify-center gap-5">
      {/* Play / Stop */}
      <button
        onClick={onTogglePlay}
        className={[
          'flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all',
          isPlaying
            ? 'bg-stone-800 text-white hover:bg-stone-700'
            : 'bg-stone-100 text-stone-700 hover:bg-stone-200',
        ].join(' ')}
      >
        {isPlaying ? (
          <>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor">
              <rect x="0" y="0" width="3" height="9" rx="1" />
              <rect x="6" y="0" width="3" height="9" rx="1" />
            </svg>
            Stop
          </>
        ) : (
          <>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor">
              <polygon points="0,0 9,4.5 0,9" />
            </svg>
            Play
          </>
        )}
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-stone-200" />

      {/* BPM */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-stone-400 select-none">BPM</span>
        <button
          onClick={() => onBpmChange(bpm - 1)}
          className="w-6 h-6 rounded-full text-stone-400 hover:bg-stone-100 text-sm flex items-center justify-center transition-colors"
        >−</button>
        <span className="w-9 text-center text-sm font-semibold text-stone-700 tabular-nums">{bpm}</span>
        <button
          onClick={() => onBpmChange(bpm + 1)}
          className="w-6 h-6 rounded-full text-stone-400 hover:bg-stone-100 text-sm flex items-center justify-center transition-colors"
        >+</button>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-stone-200" />

      {/* Master Volume */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-stone-400 select-none">Vol</span>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-20 cursor-pointer"
        />
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-stone-200" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClearAll}
          className="px-3 py-1.5 rounded-full text-xs font-medium text-stone-500 border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onLoadDemo}
          className="px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
        >
          Load Demo
        </button>
        <button
          onClick={onRandomize}
          className="px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
        >
          Randomize
        </button>
      </div>
    </div>

    {/* Genre pills */}
    <div className="flex items-center gap-2">
      <span className="text-xs text-stone-400 select-none">Style:</span>
      {GENRES.map((g) => (
        <button
          key={g}
          onClick={() => onGenreSelect(g)}
          className={[
            'px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors',
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
  )
}
