import { memo } from 'react'
import { PauseCircle, PlayCircle } from 'lucide-react'
import { LoopSet, INSTRUMENTS } from '../types'

interface LoopSetTabsProps {
  loopSets: LoopSet[]
  activeEditIndex: number
  currentPlayingIndex: number
  isPlaying: boolean
  onSelectTab: (i: number) => void
  onSetQty: (i: number, qty: number) => void
  onToggleMute: (i: number) => void
}

function hasActiveSteps(set: LoopSet): boolean {
  return INSTRUMENTS.some((inst) =>
    set.pattern[inst].some((row) => row.some(Boolean))
  )
}

export const LoopSetTabs = memo(function LoopSetTabs({
  loopSets,
  activeEditIndex,
  currentPlayingIndex,
  isPlaying,
  onSelectTab,
  onSetQty,
  onToggleMute,
}: LoopSetTabsProps) {
  return (
    <div className="flex flex-col gap-2 mb-6">
      {/* Tab row */}
      <div className="flex bg-white rounded-xl border border-stone-100 overflow-hidden shadow-sm">
        {loopSets.map((set, i) => {
          const isActiveEdit = i === activeEditIndex
          const isCurrentlyPlaying = isPlaying && i === currentPlayingIndex

          return (
            <button
              key={i}
              onClick={() => onSelectTab(i)}
              className={[
                'flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-all select-none',
                set.muted ? 'opacity-40' : '',
                isActiveEdit
                  ? 'bg-stone-800 text-white'
                  : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50',
              ].join(' ')}
            >
              {isCurrentlyPlaying && !set.muted && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 animate-pulse" />
              )}
              {(!isCurrentlyPlaying || set.muted) && isPlaying && (
                <span className="w-1.5 h-1.5 shrink-0" />
              )}
              Loop {i + 1}
              {hasActiveSteps(set) && !isCurrentlyPlaying && (
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActiveEdit ? 'bg-white/40' : 'bg-stone-300'}`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Qty + mute row */}
      <div className="flex gap-2">
        {loopSets.map((set, i) => {
          const hasSteps = hasActiveSteps(set)
          return (
            <div
              key={i}
              className={[
                'flex-1 flex items-center gap-1.5 px-3 py-2 bg-white border rounded-lg text-xs transition-all shadow-sm',
                set.muted ? 'opacity-40' : '',
                hasSteps ? 'border-stone-200' : 'border-stone-100',
              ].join(' ')}
            >
              <span className="text-stone-300 text-[10px] font-medium select-none">×</span>
              <button
                onClick={() => onSetQty(i, set.qty - 1)}
                disabled={set.qty <= 1}
                className="text-stone-400 hover:text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed w-4 text-center leading-none"
              >
                −
              </button>
              <span className={['flex-1 text-center font-semibold tabular-nums', hasSteps ? 'text-stone-700' : 'text-stone-300'].join(' ')}>
                {set.qty}
              </span>
              <button
                onClick={() => onSetQty(i, set.qty + 1)}
                className="text-stone-400 hover:text-stone-700 w-4 text-center leading-none"
              >
                +
              </button>
              <button
                onClick={() => onToggleMute(i)}
                title={set.muted ? 'Unmute loop set' : 'Mute loop set'}
                className={[
                  'ml-auto transition-colors',
                  set.muted
                    ? 'text-orange-400 hover:text-orange-500'
                    : 'text-stone-300 hover:text-stone-500',
                ].join(' ')}
              >
                {set.muted ? <PlayCircle size={13} /> : <PauseCircle size={13} />}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
})
