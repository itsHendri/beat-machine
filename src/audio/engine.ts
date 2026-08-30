import * as Tone from 'tone'
import { INSTRUMENTS, InstrumentName, InstrumentSound, LoopSet, ROWS } from '../types'
import { createInstrumentVoices, SynthVoice } from './instruments'

type Ref<T> = { current: T }

/** Returns true if any step is active in the given loop set */
function hasActiveSteps(set: LoopSet): boolean {
  return INSTRUMENTS.some((inst) =>
    set.pattern[inst].some((row) => row.some(Boolean))
  )
}

/** Find the next loop set index (after currentIdx) that has active steps and is not muted.
 *  Wraps around. Returns currentIdx if no other set qualifies. */
function findNextActiveSet(sets: LoopSet[], currentIdx: number): number {
  const count = sets.length
  for (let i = 1; i <= count; i++) {
    const idx = (currentIdx + i) % count
    if (!sets[idx].muted && hasActiveSteps(sets[idx])) return idx
  }
  return currentIdx
}

export class AudioEngine {
  private voices: Map<InstrumentName, SynthVoice[]> = new Map()
  private channelVolumes: Map<InstrumentName, Tone.Volume> = new Map()
  private filterNodes: Map<InstrumentName, Tone.Filter> = new Map()
  private reverbNodes: Map<InstrumentName, Tone.Reverb> = new Map()
  private driveNodes:  Map<InstrumentName, Tone.Distortion> = new Map()
  private sequence: Tone.Sequence<number> | null = null
  private recorder: Tone.Recorder | null = null
  private initialized = false
  private onStep: ((step: number) => void) | null = null

  // Loop-set chaining state
  private currentSetIdx = 0
  private iterationCount = 0
  private prevStep = -1

  async start(
    loopSetsRef: Ref<LoopSet[]>,
    bpm: number,
    onStep: (step: number) => void,
    onLoopSetChange: (index: number) => void,
  ): Promise<void> {
    await Tone.start()

    if (!this.initialized) {
      this.initialized = true
      for (const inst of INSTRUMENTS) {
        const vol    = new Tone.Volume(0).toDestination()
        const dist   = new Tone.Distortion(0).connect(vol)
        const reverb = new Tone.Reverb({ decay: 1.5, wet: 0.24 }).connect(dist)
        const filter = new Tone.Filter(5012, 'lowpass').connect(reverb)
        this.channelVolumes.set(inst, vol)
        this.filterNodes.set(inst, filter)
        this.reverbNodes.set(inst, reverb)
        this.driveNodes.set(inst, dist)
        this.voices.set(inst, createInstrumentVoices(inst, filter))
      }
    }

    this.onStep = onStep

    // Reset chaining state
    this.currentSetIdx = 0
    this.iterationCount = 0
    this.prevStep = -1

    const transport = Tone.getTransport()
    transport.bpm.value = bpm
    transport.cancel()
    transport.stop()
    transport.position = 0

    if (this.sequence) {
      this.sequence.dispose()
      this.sequence = null
    }

    this.sequence = new Tone.Sequence<number>(
      (time, step) => {
        const sets = loopSetsRef.current

        // Detect loop completion: step wraps from 15 → 0
        if (step === 0 && this.prevStep === 15) {
          this.iterationCount++
          const currentSet = sets[this.currentSetIdx]
          const targetQty = Math.max(1, currentSet.qty)

          if (this.iterationCount >= targetQty || currentSet.muted) {
            const nextIdx = findNextActiveSet(sets, this.currentSetIdx)
            if (nextIdx !== this.currentSetIdx) {
              this.currentSetIdx = nextIdx
              this.iterationCount = 0
              Tone.getDraw().schedule(() => onLoopSetChange(nextIdx), time)
            } else {
              // Only one active set — reset count so it keeps playing
              this.iterationCount = 0
            }
          }
        }
        this.prevStep = step

        // Trigger voices from the current set's pattern
        const pattern = sets[this.currentSetIdx].pattern
        for (const inst of INSTRUMENTS) {
          for (let row = 0; row < ROWS; row++) {
            if (pattern[inst][row][step]) {
              this.voices.get(inst)?.[row]?.trigger(time)
            }
          }
        }
        Tone.getDraw().schedule(() => { this.onStep?.(step) }, time)
      },
      Array.from({ length: 16 }, (_, i) => i),
      '16n',
    )

    this.sequence.start(0)
    transport.start()
  }

  stop(): void {
    Tone.getTransport().stop()
    this.sequence?.stop()
    this.onStep?.(-1)
    this.currentSetIdx = 0
    this.iterationCount = 0
    this.prevStep = -1
  }

  setBpm(bpm: number): void {
    Tone.getTransport().bpm.value = bpm
  }

  setMasterVolume(volume: number): void {
    Tone.getDestination().volume.value = volume === 0 ? -Infinity : 20 * Math.log10(volume / 100)
  }

  setInstrumentVolume(instrument: InstrumentName, volume: number): void {
    const vol = this.channelVolumes.get(instrument)
    if (vol) {
      vol.volume.value = volume === 0 ? -Infinity : 20 * Math.log10(volume / 100)
    }
  }

  // filterFreq 0–100 → 200–8000 Hz (logarithmic)
  private freqFromSlider(v: number): number { return 200 * Math.pow(40, v / 100) }
  // 0–100 → 0.0–0.8
  private wetFromSlider(v: number): number { return (v / 100) * 0.8 }

  setInstrumentFilter(inst: InstrumentName, value: number): void {
    const node = this.filterNodes.get(inst)
    if (node) node.frequency.value = this.freqFromSlider(value)
  }

  setInstrumentReverb(inst: InstrumentName, value: number): void {
    const node = this.reverbNodes.get(inst)
    if (node) node.wet.value = this.wetFromSlider(value)
  }

  setInstrumentDrive(inst: InstrumentName, value: number): void {
    const node = this.driveNodes.get(inst)
    if (node) node.wet.value = this.wetFromSlider(value)
  }

  async startRecording(): Promise<void> {
    this.recorder = new Tone.Recorder()
    Tone.getDestination().connect(this.recorder)
    await this.recorder.start()
  }

  async stopRecording(): Promise<Blob> {
    if (!this.recorder) throw new Error('Not recording')
    const blob = await this.recorder.stop()
    Tone.getDestination().disconnect(this.recorder)
    this.recorder.dispose()
    this.recorder = null
    return blob
  }

  applyGenrePreset(preset: Record<InstrumentName, InstrumentSound>): void {
    for (const inst of INSTRUMENTS) {
      this.setInstrumentFilter(inst, preset[inst].filterFreq)
      this.setInstrumentReverb(inst, preset[inst].reverbWet)
      this.setInstrumentDrive(inst, preset[inst].drive)
    }
  }

  dispose(): void {
    Tone.getTransport().stop()
    Tone.getTransport().cancel()
    this.sequence?.dispose()
    this.sequence = null
    this.voices.forEach((voices) => voices.forEach((v) => v.dispose()))
    this.voices.clear()
    this.filterNodes.forEach((n) => n.dispose())
    this.filterNodes.clear()
    this.reverbNodes.forEach((n) => n.dispose())
    this.reverbNodes.clear()
    this.driveNodes.forEach((n) => n.dispose())
    this.driveNodes.clear()
    this.channelVolumes.forEach((v) => v.dispose())
    this.channelVolumes.clear()
    this.initialized = false
  }
}
