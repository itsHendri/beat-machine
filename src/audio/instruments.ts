import * as Tone from 'tone'
import { InstrumentName } from '../types'

export type SynthVoice = {
  trigger: (time: Tone.Unit.Seconds) => void
  dispose: () => void
}

function makeDrumVoices(dest: Tone.ToneAudioNode): SynthVoice[] {
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.05, octaves: 6,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.1 },
  }).connect(dest)

  const snare = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 },
  }).connect(dest)

  const closedHat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
    harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
  }).connect(dest)

  const openHat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.3, release: 0.1 },
    harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
  }).connect(dest)

  const clap = new Tone.NoiseSynth({
    noise: { type: 'pink' },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.05 },
  }).connect(dest)

  const rim = new Tone.MembraneSynth({
    pitchDecay: 0.008, octaves: 2,
    envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
  }).connect(dest)

  return [
    { trigger: (t) => kick.triggerAttackRelease('C1', '8n', t), dispose: () => kick.dispose() },
    { trigger: (t) => snare.triggerAttackRelease('8n', t), dispose: () => snare.dispose() },
    { trigger: (t) => closedHat.triggerAttackRelease('16n', t), dispose: () => closedHat.dispose() },
    { trigger: (t) => openHat.triggerAttackRelease('8n', t), dispose: () => openHat.dispose() },
    { trigger: (t) => clap.triggerAttackRelease('8n', t), dispose: () => clap.dispose() },
    { trigger: (t) => rim.triggerAttackRelease('G2', '16n', t), dispose: () => rim.dispose() },
  ]
}

function makeBassVoices(dest: Tone.ToneAudioNode): SynthVoice[] {
  return ['C2', 'D2', 'E2', 'F2', 'G2', 'A2'].map((note) => {
    const synth = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      filter: { frequency: 500, type: 'lowpass', rolloff: -24 },
      filterEnvelope: { attack: 0.001, decay: 0.2, sustain: 0.1, release: 0.1, baseFrequency: 200, octaves: 2 },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.1 },
    }).connect(dest)
    return { trigger: (t) => synth.triggerAttackRelease(note, '16n', t), dispose: () => synth.dispose() }
  })
}

function makeSynthVoices(dest: Tone.ToneAudioNode): SynthVoice[] {
  return ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'].map((note) => {
    const synth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.4 },
    }).connect(dest)
    return { trigger: (t) => synth.triggerAttackRelease(note, '8n', t), dispose: () => synth.dispose() }
  })
}

function makeStringVoices(dest: Tone.ToneAudioNode): SynthVoice[] {
  return ['C3', 'E3', 'G3', 'A3', 'B3', 'D4'].map((note) => {
    const synth = new Tone.AMSynth({
      harmonicity: 1,
      envelope: { attack: 0.3, decay: 0.2, sustain: 0.7, release: 1.0 },
      modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 },
    }).connect(dest)
    return { trigger: (t) => synth.triggerAttackRelease(note, '4n', t), dispose: () => synth.dispose() }
  })
}

function makeImpactVoices(dest: Tone.ToneAudioNode): SynthVoice[] {
  return ['C2', 'G2', 'C3', 'G3', 'C4', 'G4'].map((note) => {
    const synth = new Tone.MembraneSynth({
      pitchDecay: 0.2, octaves: 8,
      envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.2 },
    }).connect(dest)
    return { trigger: (t) => synth.triggerAttackRelease(note, '8n', t), dispose: () => synth.dispose() }
  })
}

export function createInstrumentVoices(instrument: InstrumentName, dest: Tone.ToneAudioNode): SynthVoice[] {
  switch (instrument) {
    case 'drums': return makeDrumVoices(dest)
    case 'bass': return makeBassVoices(dest)
    case 'synth': return makeSynthVoices(dest)
    case 'strings': return makeStringVoices(dest)
    case 'impact': return makeImpactVoices(dest)
  }
}
