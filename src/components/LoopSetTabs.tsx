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
    <div className="flex flex-col gap-2 mb-8">
      {/* Tab row */}
      <div className="flex">
        {loopSets.map((set, i) => {
          const isActiveEdit = i === activeEditIndex
          const isCurrentlyPlaying = isPlaying && i === currentPlayingIndex

          return (
            <button
              key={i}
              onClick={() => onSelectTab(i)}
              className={[
                'flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors select-none',
                set.muted ? 'opacity-40' : '',
                isActiveEdit
                  ? 'text-stone-800 border-b border-stone-800'
                  : 'text-stone-400 border-b border-stone-200 hover:text-stone-600',
              ].join(' ')}
            >
              {/* Playing indicator dot — only when synced */}
              {isCurrentlyPlaying && !set.muted && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 animate-pulse" />
              )}
              {/* Spacer to keep label centred when no dot */}
              {(!isCurrentlyPlaying || set.muted) && isPlaying && (
                <span className="w-1.5 h-1.5 shrink-0" />
              )}
              Loop Set {i + 1}
              {/* Has-steps dot when not playing */}
              {hasActiveSteps(set) && !isCurrentlyPlaying && (
                <span className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
              )}
            </button>
          )
        })}
      </div>

      {/* Qty + mute row */}
      <div className="flex gap-3">
        {loopSets.map((set, i) => {
          const hasSteps = hasActiveSteps(set)
          return (
            <div
              key={i}
              className={[
                'flex-1 flex items-center gap-2 px-3 py-2 border rounded-lg text-xs transition-all',
                set.muted ? 'opacity-40' : '',
                hasSteps
                  ? 'border-stone-200 text-stone-700'
                  : 'border-stone-100 text-stone-300',
              ].join(' ')}
            >
              <span className={hasSteps ? 'text-stone-400' : 'text-stone-300'}>Qty:</span>
              <button
                onClick={() => onSetQty(i, set.qty - 1)}
                disabled={set.qty <= 1}
                className="text-stone-400 hover:text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed w-4 text-center leading-none"
              >
                −
              </button>
              <span className={['flex-1 text-center font-medium', hasSteps ? 'text-stone-800' : 'text-stone-300'].join(' ')}>
                {set.qty}
              </span>
              <button
                onClick={() => onSetQty(i, set.qty + 1)}
                className="text-stone-400 hover:text-stone-700 w-4 text-center leading-none"
              >
                +
              </button>

              {/* Mute toggle */}
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
                {set.muted
                  ? <PlayCircle size={14} />
                  : <PauseCircle size={14} />
                }
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
})
