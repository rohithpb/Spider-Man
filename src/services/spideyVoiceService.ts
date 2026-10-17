/**
 * Peter Parker / Spider-Man Voice & Audio Engine
 * Provides authentic youthful, energetic speech synthesis modeled after
 * Peter Parker in the Spider-Man movies (Tom Holland / Andrew Garfield / Tobey Maguire styles),
 * accompanied by Stark suit comm-link SFX, audio equalizer cues, and microphone voice input.
 */

export type VoicePersona = 'mcu_holland' | 'comic_classic' | 'witty_andrew'

export interface VoiceSettings {
  enabled: boolean
  persona: VoicePersona
  volume: number // 0 to 1
  rate: number // 0.8 to 1.5
  pitch: number // 0.8 to 1.6
  suitSfx: boolean
  selectedVoiceURI: string | null
}

const SETTINGS_KEY = 'spidey_voice_settings'

const DEFAULT_SETTINGS: VoiceSettings = {
  enabled: true,
  persona: 'mcu_holland',
  volume: 1.0,
  rate: 1.1, // energetic, youthful Queens pace
  pitch: 1.22, // slightly elevated, clear, youthful teen/young adult pitch
  suitSfx: true,
  selectedVoiceURI: null,
}

// Preset definitions tailored for Peter Parker movie voices
export const VOICE_PRESETS: Record<
  VoicePersona,
  { name: string; actor: string; description: string; pitch: number; rate: number }
> = {
  mcu_holland: {
    name: 'MCU Peter Parker',
    actor: 'Tom Holland Style',
    description: 'Youthful, energetic, upbeat, fast-talking Queens hero with quick wit',
    pitch: 1.22,
    rate: 1.12,
  },
  witty_andrew: {
    name: 'The Amazing Spider-Man',
    actor: 'Andrew Garfield Style',
    description: 'Slightly cheeky, witty, rapid-fire banter and sharp comedic timing',
    pitch: 1.12,
    rate: 1.16,
  },
  comic_classic: {
    name: 'Friendly Neighborhood Spidey',
    actor: 'Tobey Maguire / Classic Style',
    description: 'Earnest, warm, responsible, heartfelt and reassuring delivery',
    pitch: 1.05,
    rate: 1.02,
  },
}

class SpideyVoiceService {
  private settings: VoiceSettings = DEFAULT_SETTINGS
  private synth: SpeechSynthesis | null = null
  private voices: SpeechSynthesisVoice[] = []
  private isSpeakingState = false
  private currentSpokenId: string | null = null
  private listeners: Set<() => void> = new Set()
  private audioCtx: AudioContext | null = null
  private recognition: any = null
  private isListeningState = false
  private queueTimeout: any = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadSettings()
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis
        this.initVoices()
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.initVoices()
        }
      }
    }
  }

  // ------------------------------------------------
  // Settings Management
  // ------------------------------------------------

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        this.settings = { ...DEFAULT_SETTINGS, ...parsed }
      }
    } catch {
      this.settings = { ...DEFAULT_SETTINGS }
    }
  }

  public saveSettings(newSettings: Partial<VoiceSettings>): void {
    this.settings = { ...this.settings, ...newSettings }
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings))
    } catch {
      // ignore
    }
    this.notify()
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void {
    this.listeners.forEach((l) => l())
  }

  // ------------------------------------------------
  // Voice Selection & Customization
  // ------------------------------------------------

  private initVoices(): void {
    if (!this.synth) return
    this.voices = this.synth.getVoices()
    this.notify()
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices
  }

  /**
   * Find the most authentic youthful American male voice for Peter Parker
   */
  public getBestSpideyVoice(): SpeechSynthesisVoice | null {
    if (!this.voices.length) {
      if (this.synth) this.voices = this.synth.getVoices()
    }
    if (!this.voices.length) return null

    // If user explicitly picked a voice
    if (this.settings.selectedVoiceURI) {
      const match = this.voices.find((v) => v.voiceURI === this.settings.selectedVoiceURI)
      if (match) return match
    }

    // Top tier voices in Windows/Edge/Chrome/Safari that sound like a young American man
    const preferredNames = [
      'Microsoft Guy Online (Natural)',
      'Microsoft Guy',
      'Microsoft Christopher Online (Natural)',
      'Microsoft Christopher',
      'Google US English',
      'Microsoft David Desktop',
      'Microsoft David',
      'Alex',
      'Daniel',
      'Evan',
      'Nathan',
      'Tom',
    ]

    for (const name of preferredNames) {
      const match = this.voices.find(
        (v) => v.name.toLowerCase().includes(name.toLowerCase()) && v.lang.startsWith('en')
      )
      if (match) return match
    }

    // Fallback: any en-US voice that is male or natural
    const enUsMale = this.voices.find(
      (v) =>
        v.lang === 'en-US' &&
        (v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('guy'))
    )
    if (enUsMale) return enUsMale

    // Fallback: any en-US voice
    const enUs = this.voices.find((v) => v.lang === 'en-US')
    if (enUs) return enUs

    // Fallback: any English voice
    const anyEn = this.voices.find((v) => v.lang.startsWith('en'))
    if (anyEn) return anyEn

    return this.voices[0] || null
  }

  // ------------------------------------------------
  // Web Audio Suit Sound Effects (Spider-Comm Chirp)
  // ------------------------------------------------

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  /**
   * Play high-tech comm-link transmission chirp (Stark-tech suit audio indicator)
   */
  public playSuitChirp(type: 'open' | 'close' | 'web' = 'open'): void {
    if (!this.settings.suitSfx) return
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime

      if (type === 'web') {
        // Web shooter whoosh sound
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(450, now)
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18)

        gain.gain.setValueAtTime(0.18, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.18)
        return
      }

      // High-tech radio comm-link chirp
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc2.type = 'sine'

      if (type === 'open') {
        // Ascending double beep: 1500Hz -> 2200Hz
        osc1.frequency.setValueAtTime(1550, now)
        osc1.frequency.exponentialRampToValueAtTime(1950, now + 0.05)
        osc2.frequency.setValueAtTime(2200, now + 0.05)
        osc2.frequency.exponentialRampToValueAtTime(2600, now + 0.11)
      } else {
        // Gentle confirmation close chirp: 2100Hz -> 1400Hz
        osc1.frequency.setValueAtTime(2200, now)
        osc1.frequency.exponentialRampToValueAtTime(1500, now + 0.08)
      }

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + (type === 'open' ? 0.12 : 0.09))

      osc1.connect(gain)
      if (type === 'open') osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc1.stop(now + 0.12)
      if (type === 'open') {
        osc2.start(now + 0.04)
        osc2.stop(now + 0.12)
      }
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // ------------------------------------------------
  // Text Sanitization for Natural Spoken Dialogue
  // ------------------------------------------------

  /**
   * Clean message text so Peter Parker speaks naturally like in the movies
   * (e.g. removing emojis, expanding contractions, softening punctuation)
   */
  public cleanTextForSpeech(text: string): string {
    let clean = text
    // Remove emojis
    clean = clean.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ''
    )

    // Expand / normalize common conversational terms
    clean = clean.replace(/PG-13/gi, 'PG thirteen')
    clean = clean.replace(/\bPG\b/g, 'P G')
    clean = clean.replace(/comm-link/gi, 'comm link')
    clean = clean.replace(/NYC/gi, 'New York City')
    clean = clean.replace(/\bhrs\b/gi, 'hours')
    clean = clean.replace(/\byrs\b/gi, 'years')
    clean = clean.replace(/BND-(\d+)/gi, 'Incident dispatch $1')
    clean = clean.replace(/EmailJS/gi, 'Email')

    // Clean markdown and brackets
    clean = clean.replace(/[*_#`~[\]]/g, '')
    // Replace multiple spaces
    clean = clean.replace(/\s+/g, ' ').trim()

    return clean
  }

  // ------------------------------------------------
  // Speech Synthesis Core
  // ------------------------------------------------

  private speechQueue: Array<{ text: string; id?: string }> = []

  public isSpeaking(): boolean {
    return this.isSpeakingState
  }

  public getCurrentSpokenId(): string | null {
    return this.currentSpokenId
  }

  /**
   * Speak a sequence of lines in order
   */
  public speakSequence(items: Array<{ text: string; id?: string }>): void {
    if (!this.synth || !this.settings.enabled || items.length === 0) return
    this.stop()
    this.speechQueue = [...items]
    this.processQueue()
  }

  private processQueue(): void {
    if (this.speechQueue.length === 0) {
      this.isSpeakingState = false
      this.currentSpokenId = null
      this.notify()
      return
    }

    const nextItem = this.speechQueue.shift()!
    this.speak(nextItem.text, nextItem.id, () => {
      // Small natural pause between sentences like Peter Parker catching his breath
      this.queueTimeout = setTimeout(() => {
        this.queueTimeout = null
        this.processQueue()
      }, 250)
    })
  }

  /**
   * Speak a line in Peter Parker's voice
   * @param text The text to speak
   * @param messageId Unique id of the chat message (for highlighting in UI)
   * @param onComplete Optional completion callback
   */
  public speak(
    text: string,
    messageId?: string,
    onComplete?: () => void
  ): boolean {
    if (!this.synth || !this.settings.enabled) return false

    // If not processing queue, cancel previous
    if (this.speechQueue.length === 0) {
      this.stop()
    }

    const sanitized = this.cleanTextForSpeech(text)
    if (!sanitized) {
      if (onComplete) onComplete()
      return false
    }

    const utterance = new SpeechSynthesisUtterance(sanitized)
    const voice = this.getBestSpideyVoice()
    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang
    }

    // Apply preset and custom tuning
    const preset = VOICE_PRESETS[this.settings.persona] || VOICE_PRESETS.mcu_holland
    utterance.pitch = Math.min(2.0, Math.max(0.5, this.settings.pitch || preset.pitch))
    utterance.rate = Math.min(2.0, Math.max(0.5, this.settings.rate || preset.rate))
    utterance.volume = Math.min(1.0, Math.max(0, this.settings.volume))

    this.isSpeakingState = true
    this.currentSpokenId = messageId || null
    this.notify()

    // Suit comm-link opening chirp
    this.playSuitChirp('open')

    utterance.onend = () => {
      this.isSpeakingState = false
      this.currentSpokenId = null
      this.playSuitChirp('close')
      this.notify()
      if (onComplete) onComplete()
    }

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('Spidey SpeechSynthesis error:', e)
      }
      this.isSpeakingState = false
      this.currentSpokenId = null
      this.notify()
      if (onComplete) onComplete()
    }

    try {
      this.synth.speak(utterance)
      return true
    } catch (err) {
      console.warn('Failed to call synth.speak:', err)
      this.isSpeakingState = false
      this.currentSpokenId = null
      this.notify()
      if (onComplete) onComplete()
      return false
    }
  }

  /**
   * Stop current speech and clear queue immediately
   */
  public stop(): void {
    if (this.queueTimeout) {
      clearTimeout(this.queueTimeout)
      this.queueTimeout = null
    }
    this.speechQueue = []
    if (this.synth) {
      try {
        this.synth.cancel()
      } catch {
        // ignore
      }
    }
    this.isSpeakingState = false
    this.currentSpokenId = null
    this.notify()
  }

  /**
   * Preview Peter Parker voice with an iconic movie quote
   */
  public testVoice(persona?: VoicePersona): void {
    const targetPersona = persona || this.settings.persona
    const quotes: Record<VoicePersona, string> = {
      mcu_holland:
        "Hey! It's your friendly neighborhood Spider-Man. Just swinging by to see how I can help you out today!",
      witty_andrew:
        "You know, you have a very suspicious mind, but hey, you found Spider-Man! What's the trouble?",
      comic_classic:
        "Whatever life holds in store for me, I will never forget these words: with great power comes great responsibility.",
    }

    const savedPitch = this.settings.pitch
    const savedRate = this.settings.rate
    const savedPersona = this.settings.persona

    const preset = VOICE_PRESETS[targetPersona]
    this.settings.pitch = preset.pitch
    this.settings.rate = preset.rate
    this.settings.persona = targetPersona

    this.speak(quotes[targetPersona], 'test-quote', () => {
      // restore custom if wanted
      this.settings.pitch = savedPitch
      this.settings.rate = savedRate
      this.settings.persona = savedPersona
    })
  }

  // ------------------------------------------------
  // Speech Recognition (Talk to Peter Parker)
  // ------------------------------------------------

  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  }

  public isListening(): boolean {
    return this.isListeningState
  }

  public startListening(
    onResult: (text: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.isSpeechRecognitionSupported()) {
      if (onError) onError('Speech recognition not supported in this browser')
      return false
    }

    try {
      const SpeechRecognitionClass =
        (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      this.recognition = new SpeechRecognitionClass()
      this.recognition.continuous = false
      this.recognition.interimResults = true
      this.recognition.lang = 'en-US'

      this.recognition.onstart = () => {
        this.isListeningState = true
        this.playSuitChirp('web')
        this.notify()
      }

      this.recognition.onresult = (event: any) => {
        let interim = ''
        let final = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            final += transcript
          } else {
            interim += transcript
          }
        }

        if (final) {
          onResult(final.trim(), true)
        } else if (interim) {
          onResult(interim.trim(), false)
        }
      }

      this.recognition.onerror = (event: any) => {
        this.isListeningState = false
        this.notify()
        if (onError) onError(event.error || 'Speech recognition error')
      }

      this.recognition.onend = () => {
        this.isListeningState = false
        this.notify()
      }

      this.recognition.start()
      return true
    } catch (err: any) {
      this.isListeningState = false
      this.notify()
      if (onError) onError(err?.message || 'Failed to start speech recognition')
      return false
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListeningState) {
      try {
        this.recognition.stop()
      } catch {
        // ignore
      }
    }
    this.isListeningState = false
    this.notify()
  }
}

export const spideyVoice = new SpideyVoiceService()
