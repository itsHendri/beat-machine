import { TransportBar } from './components/TransportBar'
import { SequencerGrid } from './components/SequencerGrid'
import { LoopSetTabs } from './components/LoopSetTabs'
import { useSequencer } from './hooks/useSequencer'

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
  } = useSequencer()

  return (
    <div className="bg-stone-50 flex justify-center p-8 pb-16">
      <div className="w-full max-w-4xl">
        <TransportBar
          isPlaying={isPlaying}
          bpm={bpm}
          volume={volume}
          activeGenre={activeGenre}
          onTogglePlay={togglePlay}
          onBpmChange={setBpm}
          onVolumeChange={setVolume}
          onClearAll={clearAll}
          onLoadDemo={loadDemo}
          onRandomize={randomize}
          onGenreSelect={applyGenre}
        />
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
  )
}
