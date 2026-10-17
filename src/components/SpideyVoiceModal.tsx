import React, { useState, useEffect } from 'react'
import {
  X,
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  Play,
  Square,
  Sparkles,
  Check,
  User,
  Zap,
  Mic,
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  spideyVoice,
  VoiceSettings,
  VoicePersona,
  VOICE_PRESETS,
} from '../services/spideyVoiceService'

interface SpideyVoiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SpideyVoiceModal: React.FC<SpideyVoiceModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<VoiceSettings>(spideyVoice.getSettings())
  const [isSpeaking, setIsSpeaking] = useState(spideyVoice.isSpeaking())
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [savedFeedback, setSavedFeedback] = useState(false)

  useEffect(() => {
    setSettings(spideyVoice.getSettings())
    setAvailableVoices(spideyVoice.getAvailableVoices())

    const unsubscribe = spideyVoice.subscribe(() => {
      setSettings(spideyVoice.getSettings())
      setIsSpeaking(spideyVoice.isSpeaking())
      setAvailableVoices(spideyVoice.getAvailableVoices())
    })

    return () => unsubscribe()
  }, [isOpen])

  if (!isOpen) return null

  const handlePersonaSelect = (persona: VoicePersona) => {
    const preset = VOICE_PRESETS[persona]
    const updated = {
      ...settings,
      persona,
      pitch: preset.pitch,
      rate: preset.rate,
    }
    setSettings(updated)
    spideyVoice.saveSettings(updated)
  }

  const handlePitchChange = (pitch: number) => {
    const updated = { ...settings, pitch }
    setSettings(updated)
    spideyVoice.saveSettings(updated)
  }

  const handleRateChange = (rate: number) => {
    const updated = { ...settings, rate }
    setSettings(updated)
    spideyVoice.saveSettings(updated)
  }

  const handleVolumeChange = (volume: number) => {
    const updated = { ...settings, volume }
    setSettings(updated)
    spideyVoice.saveSettings(updated)
  }

  const handleToggleEnabled = () => {
    const updated = { ...settings, enabled: !settings.enabled }
    setSettings(updated)
    spideyVoice.saveSettings(updated)
    if (!updated.enabled) {
      spideyVoice.stop()
    }
  }

  const handleToggleSfx = () => {
    const updated = { ...settings, suitSfx: !settings.suitSfx }
    setSettings(updated)
    spideyVoice.saveSettings(updated)
    if (updated.suitSfx) {
      spideyVoice.playSuitChirp('open')
    }
  }

  const handleVoiceSelect = (voiceURI: string) => {
    const updated = {
      ...settings,
      selectedVoiceURI: voiceURI === 'auto' ? null : voiceURI,
    }
    setSettings(updated)
    spideyVoice.saveSettings(updated)
  }

  const handleTestVoice = () => {
    if (isSpeaking) {
      spideyVoice.stop()
    } else {
      spideyVoice.testVoice(settings.persona)
    }
  }

  const handleSaveAndClose = () => {
    spideyVoice.saveSettings(settings)
    setSavedFeedback(true)
    setTimeout(() => {
      setSavedFeedback(false)
      onClose()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-web-shoot">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl border border-red-500/30 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-950 via-slate-900 to-sky-950 border-b border-red-900/40 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 border border-red-400 flex items-center justify-center shadow-spider-glow flex-shrink-0">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white uppercase tracking-wide">
                  Peter Parker Voice Synthesizer
                </h3>
                <Badge variant="spidey" className="text-[10px] py-0 px-1.5">
                  AUDIO LAB
                </Badge>
              </div>
              <p className="text-xs text-sky-400">
                Fine-tuned speech synthesis modeled after Spider-Man in the movies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-liquid-glass btn-liquid-dark p-2 text-slate-300 hover:text-white rounded-xl transition-all"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-6 overflow-y-auto text-sm text-slate-200">
          {/* Master Enable Voice Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  settings.enabled
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {settings.enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold text-white text-sm">Spidey Voice Narration</p>
                <p className="text-xs text-slate-400">
                  Spider-Man speaks every response aloud in real-time
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleEnabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enabled ? 'bg-red-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Movie Voice Persona Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>Select Peter Parker Movie Style</span>
              </label>
              <span className="text-[11px] text-sky-400 font-mono">
                {VOICE_PRESETS[settings.persona].actor}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(Object.keys(VOICE_PRESETS) as VoicePersona[]).map((key) => {
                const preset = VOICE_PRESETS[key]
                const isSelected = settings.persona === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handlePersonaSelect(key)}
                    className={`p-3.5 rounded-2xl text-left border transition-all relative ${
                      isSelected
                        ? 'bg-red-950/60 border-red-500 shadow-spider-glow text-white'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <p className="text-xs font-bold text-white mb-0.5">{preset.name}</p>
                    <p className="text-[10px] font-semibold text-sky-400 mb-1.5">
                      {preset.actor}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {preset.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Acoustic Fine-Tuning Sliders */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                <span>Acoustic Frequency Tuning</span>
              </span>
              <span className="text-[11px] text-slate-400">Custom Pitch & Tempo</span>
            </div>

            {/* Pitch */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Vocal Pitch (Youthful Register)</span>
                <span className="font-mono text-sky-400">{settings.pitch.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.02"
                value={settings.pitch}
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Deeper Hero</span>
                <span>Standard</span>
                <span>Youthful Queens Teen</span>
              </div>
            </div>

            {/* Speaking Rate / Pace */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Speech Cadence (Energetic Tempo)</span>
                <span className="font-mono text-sky-400">{settings.rate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.4"
                step="0.02"
                value={settings.rate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Relaxed</span>
                <span>1.0x Normal</span>
                <span>Breezy / Fast-Talking</span>
              </div>
            </div>

            {/* Volume */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Transmission Volume</span>
                <span className="font-mono text-sky-400">
                  {Math.round(settings.volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={settings.volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
          </div>

          {/* Stark Suit Radio Chirp SFX */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-sky-400" />
              <div>
                <p className="text-xs font-bold text-white">Stark Suit Comm-Link SFX</p>
                <p className="text-[11px] text-slate-400">
                  Play high-tech radio audio chirp when Spider-Man transmits
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleSfx}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                settings.suitSfx ? 'bg-sky-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  settings.suitSfx ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* System TTS Voice Selector */}
          {availableVoices.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Target Audio Synthesis Voice Engine
              </label>
              <select
                value={settings.selectedVoiceURI || 'auto'}
                onChange={(e) => handleVoiceSelect(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="auto">
                  ⚡ Auto-Detected Best Young American Male Voice (Recommended)
                </option>
                {availableVoices
                  .filter((v) => v.lang.startsWith('en'))
                  .map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTestVoice}
            className={`border-red-500/50 text-white gap-2 text-xs ${
              isSpeaking ? 'bg-red-600/30 text-red-200' : 'hover:bg-red-950/60'
            }`}
          >
            {isSpeaking ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Speaking</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Spidey Voice</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="spidey"
            size="sm"
            onClick={handleSaveAndClose}
            className="text-xs px-5 shadow-spider-glow"
          >
            {savedFeedback ? 'Saved!' : 'Apply Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}
