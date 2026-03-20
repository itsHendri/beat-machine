import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_SOUND, GENRE_PRESETS, GenreName, INSTRUMENTS, InstrumentName, InstrumentSound, LoopSet, LOOP_SET_COUNT, PatternGrid, ROWS, STEPS } from '../types'
import { AudioEngine } from '../audio/engine'
import { emptyGrid, emptyLoopSet, DEMO_PATTERN, PRESET_PATTERNS } from '../audio/patterns'

type InstrumentVolumes = Record<InstrumentName, number>

function cloneGrid(grid: PatternGrid): PatternGrid {
  return Object.fromEntries(
    INSTRUMENTS.map((inst) => [inst, grid[inst].map((row) => [...row])])
  ) as PatternGrid
}

function cloneLoopSets(sets: LoopSet[]): LoopSet[] {
  return sets.map((s) => ({ pattern: cloneGrid(s.pattern), qty: s.qty, muted: s.muted }))
}

function defaultVolumes(): InstrumentVolumes {
  return Object.fromEntries(INSTRUMENTS.map((inst) => [inst, 80])) as InstrumentVolumes
}

function defaultLoopSets(): LoopSet[] {
  return Array.from({ length: LOOP_SET_COUNT }, emptyLoopSet)
}

export function useSequencer() {
  const [loopSets, setLoopSets] = useState<LoopSet[]>(defaultLoopSets)
  const [activeEditIndex, setActiveEditIndex] = useState(0)
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpmState] = useState(120)
  const [volume, setVolumeState] = useState(80)
  const [instrumentVolumes, setInstrumentVolumesState] = useState<InstrumentVolumes>(defaultVolumes)
  const [activeGenre, setActiveGenre] = useState<GenreName | null>(null)
  const [instrumentSounds, setInstrumentSounds] = useState<Record<InstrumentName, InstrumentSound>>(
    () => Object.fromEntries(INSTRUMENTS.map((i) => [i, { ...DEFAULT_SOUND }])) as Record<InstrumentName, InstrumentSound>
  )
  const [currentStep, setCurrentStep] = useState(-1)

  const loopSetsRef = useRef<LoopSet[]>(loopSets)
  useEffect(() => { loopSetsRef.current = loopSets }, [loopSets])

  const engineRef = useRef<AudioEngine | null>(null)
  const engineInitialized = useRef(false)

  useEffect(() => {
    if (engineInitialized.current) return
    engineInitialized.current = true
    engineRef.current = new AudioEngine()
    return () => {
      engineRef.current?.dispose()
      engineRef.current = null
      engineInitialized.current = false
    }
  }, [])

  const toggleStep = useCallback((instrument: InstrumentName, row: number, step: number) => {
    setLoopSets((prev) => {
      const next = cloneLoopSets(prev)
      next[activeEditIndex].pattern[instrument][row][step] = !next[activeEditIndex].pattern[instrument][row][step]
      return next
    })
  }, [activeEditIndex])

  const play = useCallback(async () => {
    const engine = engineRef.current
    if (!engine) return
    setCurrentPlayingIndex(0)
    await engine.start(
      loopSetsRef,
      bpm,
      (step) => setCurrentStep(step),
      (idx) => setCurrentPlayingIndex(idx),
    )
    setIsPlaying(true)
    setCurrentStep(0)
  }, [bpm])

  const stop = useCallback(() => {
    engineRef.current?.stop()
    setIsPlaying(false)
    setCurrentStep(-1)
    setCurrentPlayingIndex(0)
  }, [])

  const togglePlay = useCallback(async () => {
    if (isPlaying) stop(); else await play()
  }, [isPlaying, play, stop])

  const setBpm = useCallback((value: number) => {
    const clamped = Math.max(60, Math.min(200, value))
    setBpmState(clamped)
    engineRef.current?.setBpm(clamped)
  }, [])

  const setVolume = useCallback((value: number) => {
    setVolumeState(value)
    engineRef.current?.setMasterVolume(value)
  }, [])

  const setInstrumentVolume = useCallback((instrument: InstrumentName, value: number) => {
    setInstrumentVolumesState((prev) => ({ ...prev, [instrument]: value }))
    engineRef.current?.setInstrumentVolume(instrument, value)
  }, [])

  const setLoopSetQty = useCallback((setIndex: number, qty: number) => {
    setLoopSets((prev) => {
      const next = cloneLoopSets(prev)
      next[setIndex].qty = Math.max(1, qty)
      return next
    })
  }, [])

  const toggleLoopSetMute = useCallback((setIndex: number) => {
    setLoopSets((prev) => {
      const next = cloneLoopSets(prev)
      next[setIndex].muted = !next[setIndex].muted
      return next
    })
  }, [])

  const setInstrumentSound = useCallback((inst: InstrumentName, param: keyof InstrumentSound, value: number) => {
    setInstrumentSounds((prev) => ({ ...prev, [inst]: { ...prev[inst], [param]: value } }))
    if (param === 'filterFreq') engineRef.current?.setInstrumentFilter(inst, value)
    if (param === 'reverbWet')  engineRef.current?.setInstrumentReverb(inst, value)
    if (param === 'drive')      engineRef.current?.setInstrumentDrive(inst, value)
  }, [])

  const applyGenre = useCallback((genre: GenreName) => {
    const preset = GENRE_PRESETS[genre]
    setActiveGenre(genre)
    setInstrumentSounds(
      Object.fromEntries(INSTRUMENTS.map((i) => [i, { ...preset[i] }])) as Record<InstrumentName, InstrumentSound>
    )
    engineRef.current?.applyGenrePreset(preset)
  }, [])

  const clearAll = useCallback(() => {
    setLoopSets((prev) => {
      const next = cloneLoopSets(prev)
      next[activeEditIndex].pattern = emptyGrid()
      return next
    })
  }, [activeEditIndex])

  const clearInstrument = useCallback((instrument: InstrumentName) => {
    setLoopSets((prev) => {
      const next = cloneLoopSets(prev)
      next[activeEditIndex].pattern[instrument] = Array.from(
        { length: ROWS },
        () => new Array<boolean>(STEPS).fill(false)
      )
      return next
    })
  }, [activeEditIndex])

  const loadDemo = useCallback(() => {
    setLoopSets((prev) => {
      const next = cloneLoopSets(prev)
      next[activeEditIndex].pattern = cloneGrid(DEMO_PATTERN)
      return next
    })
  }, [activeEditIndex])

  const [clipboard, setClipboard] = useState<boolean[][] | null>(null)

  const copyInstrument = useCallback((instrument: InstrumentName) => {
    setLoopSets((prev) => {
      const rows = prev[activeEditIndex].pattern[instrument]
      setClipboard(rows.map((row) => [...row]))
      return prev
    })
  }, [activeEditIndex])

  const pasteInstrument = useCallback((instrument: InstrumentName) => {
    setClipboard((clip) => {
      if (!clip) return clip
      setLoopSets((prev) => {
        const next = cloneLoopSets(prev)
        next[activeEditIndex].pattern[instrument] = clip.map((row) => [...row])
        return next
      })
      return clip
    })
  }, [activeEditIndex])

  const [randomizeIndex, setRandomizeIndex] = useState(0)

  const randomize = useCallback(() => {
    setLoopSets((prev) => {
      const next = cloneLoopSets(prev)
      next[activeEditIndex].pattern = cloneGrid(PRESET_PATTERNS[randomizeIndex % PRESET_PATTERNS.length])
      return next
    })
    setRandomizeIndex((i) => (i + 1) % PRESET_PATTERNS.length)
  }, [activeEditIndex, randomizeIndex])

  const [, setRandomizeInstrumentIndices] = useState<Record<InstrumentName, number>>(
    () => Object.fromEntries(INSTRUMENTS.map((i) => [i, 0])) as Record<InstrumentName, number>
  )

  const randomizeInstrument = useCallback((instrument: InstrumentName) => {
    setRandomizeInstrumentIndices((prev) => {
      const idx = prev[instrument]
      const srcRows = PRESET_PATTERNS[idx % PRESET_PATTERNS.length][instrument]
      setLoopSets((sets) => {
        const next = cloneLoopSets(sets)
        next[activeEditIndex].pattern[instrument] = srcRows.map((row) => [...row])
        return next
      })
      return { ...prev, [instrument]: (idx + 1) % PRESET_PATTERNS.length }
    })
  }, [activeEditIndex])

  // Safe pattern accessor for the currently edited loop set
  const activePattern = loopSets[activeEditIndex]?.pattern ?? emptyGrid()
  const safePattern: PatternGrid = Object.fromEntries(
    INSTRUMENTS.map((inst) => [
      inst,
      Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: STEPS }, (__, s) => activePattern[inst]?.[r]?.[s] ?? false)
      ),
    ])
  ) as PatternGrid

  return {
    loopSets,
    activePattern: safePattern,
    activeEditIndex,
    currentPlayingIndex,
    isPlaying,
    bpm,
    volume,
    instrumentVolumes,
    currentStep,
    setActiveEditIndex,
    setLoopSetQty,
    toggleLoopSetMute,
    activeGenre,
    instrumentSounds,
    setInstrumentSound,
    applyGenre,
    toggleStep,
    togglePlay,
    setBpm,
    setVolume,
    setInstrumentVolume,
    clearAll,
    clearInstrument,
    loadDemo,
    randomize,
    randomizeInstrument,
    clipboard,
    copyInstrument,
    pasteInstrument,
  }
}
