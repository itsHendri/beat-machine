import { TransportBar } from './components/TransportBar'
import { SequencerGrid } from './components/SequencerGrid'
import { LoopSetTabs } from './components/LoopSetTabs'
import { useSequencer } from './hooks/useSequencer'
import { INSTRUMENTS } from './types'

export default function App() {
  const {
    loopSets,
    activePattern,
    activeEditIndex,
    currentPlayingIndex,
    isPlaying,
    bpm,
    volume,
    instrumentVolumes,
    currentStep,
    activeGenre,
    instrumentSounds,
    setActiveEditIndex,
    setLoopSetQty,
    toggleLoopSetMute,
    toggleStep,
    togglePlay,
    setBpm,
    setVolume,
    setInstrumentVolume,
    setInstrumentSound,
    applyGenre,
    clearAll,
    clearInstrument,
    loadDemo,
    randomize,
    randomizeInstrument,
    clipboard,
    copyInstrument,
    pasteInstrument,
    isRecording,
    startRecording,
    stopRecording,
  } = useSequencer()

  const hasAnySteps = INSTRUMENTS.some((inst) =>
    activePattern[inst].some((row) => row.some(Boolean))
  )

  return (
    <div className="bg-[#F3F6F8] h-screen overflow-y-auto overflow-x-hidden">
      {/* Sticky transport — outer div is the scroll container so sticky works */}
      <div className="sticky top-0 z-10 bg-[#F3F6F8] flex justify-center px-8 pt-8">
        <div className="w-full max-w-4xl">
          <TransportBar
            isPlaying={isPlaying}
            bpm={bpm}
            volume={volume}
            activeGenre={activeGenre}
            isRecording={isRecording}
            onTogglePlay={togglePlay}
            onBpmChange={setBpm}
            onVolumeChange={setVolume}
            onClearAll={clearAll}
            onLoadDemo={loadDemo}
            onRandomize={randomize}
            onGenreSelect={applyGenre}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
          />
          {!hasAnySteps && (
            <p className="text-center text-xs text-stone-400 pb-6 select-none">
              Click any square to add a beat — or try{' '}
              <button onClick={loadDemo} className="underline hover:text-stone-600 transition-colors">
                Load Demo
              </button>{' '}
              to hear an example.
            </p>
          )}
        </div>
      </div>
      {/* Scrollable content */}
      <div className="flex justify-center px-8 pb-16">
        <div className="w-full max-w-4xl">
          <LoopSetTabs
            loopSets={loopSets}
            activeEditIndex={activeEditIndex}
            currentPlayingIndex={currentPlayingIndex}
            isPlaying={isPlaying}
            onSelectTab={setActiveEditIndex}
            onSetQty={setLoopSetQty}
            onToggleMute={toggleLoopSetMute}
          />
          <SequencerGrid
            pattern={activePattern}
            currentStep={activeEditIndex === currentPlayingIndex ? currentStep : -1}
            instrumentVolumes={instrumentVolumes}
            instrumentSounds={instrumentSounds}
            onToggle={toggleStep}
            onInstrumentVolumeChange={setInstrumentVolume}
            onInstrumentSoundChange={setInstrumentSound}
            onClearInstrument={clearInstrument}
            onRandomizeInstrument={randomizeInstrument}
            onCopyInstrument={copyInstrument}
            onPasteInstrument={pasteInstrument}
            canPaste={clipboard !== null}
          />
        </div>
      </div>
    </div>
  )
}
