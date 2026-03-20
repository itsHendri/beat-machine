export type InstrumentName = 'drums' | 'bass' | 'synth' | 'strings' | 'impact'
export type GenreName = 'techno' | 'house' | 'trance' | 'acid'

export interface InstrumentSound {
  filterFreq: number  // 0–100 (maps 200Hz–8000Hz log scale)
  reverbWet:  number  // 0–100 (maps 0.0–0.8)
  drive:      number  // 0–100 (maps 0.0–0.8)
}

export const DEFAULT_SOUND: InstrumentSound = { filterFreq: 80, reverbWet: 30, drive: 0 }

export const GENRE_PRESETS: Record<GenreName, Record<InstrumentName, InstrumentSound>> = {
  techno: {
    drums:   { filterFreq: 85, reverbWet: 10, drive: 60 },
    bass:    { filterFreq: 30, reverbWet:  5, drive: 55 },
    synth:   { filterFreq: 40, reverbWet: 15, drive: 30 },
    strings: { filterFreq: 45, reverbWet: 35, drive:  5 },
    impact:  { filterFreq: 60, reverbWet: 10, drive: 70 },
  },
  house: {
    drums:   { filterFreq: 75, reverbWet: 25, drive: 20 },
    bass:    { filterFreq: 55, reverbWet: 20, drive: 10 },
    synth:   { filterFreq: 65, reverbWet: 35, drive:  5 },
    strings: { filterFreq: 60, reverbWet: 55, drive:  0 },
    impact:  { filterFreq: 55, reverbWet: 20, drive: 20 },
  },
  trance: {
    drums:   { filterFreq: 75, reverbWet: 30, drive: 10 },
    bass:    { filterFreq: 70, reverbWet: 40, drive:  5 },
    synth:   { filterFreq: 90, reverbWet: 65, drive:  0 },
    strings: { filterFreq: 85, reverbWet: 75, drive:  0 },
    impact:  { filterFreq: 65, reverbWet: 35, drive: 10 },
  },
  acid: {
    drums:   { filterFreq: 65, reverbWet: 10, drive: 40 },
    bass:    { filterFreq: 40, reverbWet:  5, drive: 75 },
    synth:   { filterFreq: 50, reverbWet: 10, drive: 45 },
    strings: { filterFreq: 55, reverbWet: 30, drive: 10 },
    impact:  { filterFreq: 55, reverbWet: 10, drive: 65 },
  },
}

export const INSTRUMENTS: InstrumentName[] = ['drums', 'bass', 'synth', 'strings', 'impact']

export const STEPS = 16
export const ROWS = 6

export type PatternGrid = Record<InstrumentName, boolean[][]>

export const LOOP_SET_COUNT = 4

export interface LoopSet {
  pattern: PatternGrid
  qty: number    // how many times to play before advancing (min 1)
  muted: boolean // if true, skip during playback
}

export const INSTRUMENT_LABELS: Record<InstrumentName, string> = {
  drums: 'Drums',
  bass: 'Bass',
  synth: 'Synth',
  strings: 'Strings',
  impact: 'Impact',
}

export const ROW_LABELS: Record<InstrumentName, string[]> = {
  drums: ['Kick', 'Snare', 'HiHat', 'Open HH', 'Clap', 'Rim'],
  bass: ['C2', 'D2', 'E2', 'F2', 'G2', 'A2'],
  synth: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
  strings: ['C3', 'E3', 'G3', 'A3', 'B3', 'D4'],
  impact: ['Hit 1', 'Hit 2', 'Hit 3', 'Hit 4', 'Hit 5', 'Hit 6'],
}

export const INSTRUMENT_COLORS: Record<InstrumentName, string> = {
  drums: 'orange',
  bass: 'indigo',
  synth: 'violet',
  strings: 'emerald',
  impact: 'rose',
}
