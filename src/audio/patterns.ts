import { InstrumentName, LoopSet, PatternGrid, ROWS, STEPS } from '../types'

export function emptyGrid(): PatternGrid {
  const instruments: InstrumentName[] = ['drums', 'bass', 'synth', 'strings', 'impact']
  return Object.fromEntries(
    instruments.map((inst) => [inst, Array.from({ length: ROWS }, () => new Array<boolean>(STEPS).fill(false))])
  ) as PatternGrid
}

export function emptyLoopSet(): LoopSet {
  return { pattern: emptyGrid(), qty: 1, muted: false }
}

// Classic 4-on-the-floor demo pattern
export const DEMO_PATTERN: PatternGrid = (() => {
  const g = emptyGrid()

  // Drums: row0=Kick, row1=Snare, row2=ClosedHH, row3=OpenHH, row4=Clap, row5=Rim
  const setSteps = (inst: InstrumentName, row: number, steps: number[]) => {
    steps.forEach((s) => { g[inst][row][s] = true })
  }

  setSteps('drums', 0, [0, 4, 8, 12])              // kick: 4 on the floor
  setSteps('drums', 1, [4, 12])                      // snare: 2 and 4
  setSteps('drums', 2, [0, 2, 4, 6, 8, 10, 12, 14]) // closed hat: every 8th
  setSteps('drums', 3, [6, 14])                      // open hat: offbeat
  setSteps('drums', 4, [4, 12])                      // clap: with snare
  setSteps('drums', 5, [2, 10])                      // rim: syncopated

  setSteps('bass', 0, [0, 1, 8])     // C2
  setSteps('bass', 2, [4, 5])         // E2
  setSteps('bass', 4, [10, 11])       // G2

  setSteps('synth', 0, [0, 8])        // C4
  setSteps('synth', 3, [4, 6])        // G4
  setSteps('synth', 5, [12, 14])      // C5

  setSteps('strings', 0, [0])         // C3 chord hit
  setSteps('strings', 1, [0])         // E3
  setSteps('strings', 2, [0])         // G3 — Cmaj chord
  setSteps('strings', 0, [8])
  setSteps('strings', 3, [8])         // Am chord at bar 3
  setSteps('strings', 4, [8])

  setSteps('impact', 0, [0])          // big hit on beat 1
  setSteps('impact', 2, [8])          // mid hit on beat 3

  return g
})()

// ─── Preset patterns (cycled by the Randomize button) ───────────────────────

function makePreset(fn: (set: (inst: InstrumentName, row: number, steps: number[]) => void) => void): PatternGrid {
  const g = emptyGrid()
  const set = (inst: InstrumentName, row: number, steps: number[]) => {
    steps.forEach((s) => { g[inst][row][s] = true })
  }
  fn(set)
  return g
}

// Preset 1 — House: 4-on-the-floor, warm bass line, chord stabs
const PRESET_HOUSE = makePreset((s) => {
  s('drums', 0, [0, 4, 8, 12])
  s('drums', 1, [4, 12])
  s('drums', 2, [0, 2, 4, 6, 8, 10, 12, 14])
  s('drums', 3, [6, 14])
  s('bass',  0, [0, 8])       // C2
  s('bass',  2, [4])           // E2
  s('bass',  4, [10, 11])      // G2
  s('synth', 0, [0, 8])        // C4
  s('synth', 3, [4, 6])        // G4
  s('strings', 0, [0])
  s('strings', 1, [0])
  s('strings', 2, [0])
})

// Preset 2 — Techno: relentless kick, sparse stabs, industrial impact
const PRESET_TECHNO = makePreset((s) => {
  s('drums', 0, [0, 2, 4, 6, 8, 10, 12, 14]) // kick every 8th
  s('drums', 1, [4, 12])
  s('drums', 2, [0, 4, 8, 12])
  s('drums', 5, [2, 6, 10, 14])               // rim syncopated
  s('bass',  0, [0, 1])        // C2
  s('bass',  3, [8, 9])        // F2
  s('synth', 2, [0, 8])        // E4
  s('impact', 0, [0])
  s('impact', 2, [8])
})

// Preset 3 — Trance: busy hats, arp bass, soaring lead
const PRESET_TRANCE = makePreset((s) => {
  s('drums', 0, [0, 4, 8, 12])
  s('drums', 1, [4, 12])
  s('drums', 2, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) // every step
  s('drums', 3, [7, 15])
  s('bass',  0, [0])   // C2
  s('bass',  1, [2])   // D2
  s('bass',  2, [4])   // E2
  s('bass',  4, [6])   // G2
  s('bass',  5, [8])   // A2
  s('bass',  4, [10])  // G2
  s('bass',  2, [12])  // E2
  s('bass',  1, [14])  // D2
  s('synth', 5, [0, 8, 12])  // C5
  s('synth', 4, [4])          // A4
  s('strings', 0, [0])
  s('strings', 1, [0])
  s('strings', 2, [0])
  s('strings', 3, [8])
  s('strings', 4, [8])
})

// Preset 4 — Acid: off-beat bass, syncopated groove, distorted impact
const PRESET_ACID = makePreset((s) => {
  s('drums', 0, [0, 3, 8, 11])
  s('drums', 1, [4, 14])
  s('drums', 2, [0, 2, 6, 8, 10, 14])
  s('drums', 5, [3, 7, 11, 15])
  s('bass',  0, [0, 1, 13])  // C2
  s('bass',  2, [3, 11])     // E2
  s('bass',  3, [5, 9])      // F2
  s('bass',  4, [7])         // G2
  s('synth', 0, [0])         // C4
  s('synth', 2, [5])         // E4
  s('synth', 3, [9])         // G4
  s('impact', 1, [3])
  s('impact', 3, [11])
})

// Preset 5 — Breakbeat: syncopated kick/snare, swung feel
const PRESET_BREAKBEAT = makePreset((s) => {
  s('drums', 0, [0, 3, 6, 10])
  s('drums', 1, [2, 9, 14])
  s('drums', 2, [0, 2, 4, 6, 8, 10, 12, 14])
  s('drums', 3, [3, 11])
  s('drums', 4, [9])
  s('bass',  0, [0, 1])   // C2
  s('bass',  4, [6, 7])   // G2
  s('bass',  5, [10])     // A2
  s('synth', 3, [0])      // G4
  s('synth', 5, [6])      // C5
  s('synth', 2, [10])     // E4
  s('strings', 5, [0])    // D4
  s('strings', 3, [8])    // A3
})

export const PRESET_PATTERNS: PatternGrid[] = [
  PRESET_HOUSE, PRESET_TECHNO, PRESET_TRANCE, PRESET_ACID, PRESET_BREAKBEAT,
]
