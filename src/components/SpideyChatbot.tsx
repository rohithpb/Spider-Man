import React, { useState, useEffect, useRef } from 'react'
import {
  Send,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  MapPin,
  Mail,
  User,
  AlertCircle,
  Radio,
  RotateCcw,
  X,
  Volume2,
  VolumeX,
  Sliders,
  Play,
  Square,
  Mic,
  MicOff,
  Headphones,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { ChatMessage, GrievanceRequest, EmergencyCategory } from '../types'
import { sendSuperheroHelpEmail, getRecipientEmail } from '../services/emailService'
import {
  extractNameWithGemini,
  extractAgeWithGemini,
  extractLocationWithGemini,
  extractEmailWithGemini,
  hasGeminiApiKey,
} from '../services/geminiService'
import {
  spideyVoice,
  VoiceSettings,
  VOICE_PRESETS,
} from '../services/spideyVoiceService'
import { SpideyVoiceModal } from './SpideyVoiceModal'

interface SpideyChatbotProps {
  isOpen?: boolean
  onClose?: () => void
  onIncidentCreated?: (incident: GrievanceRequest) => void
  isFloating?: boolean
}

type ChatStep =
  | 'ask_name'
  | 'ask_age'
  | 'ask_location'
  | 'ask_email'
  | 'ask_category'
  | 'ask_grievance'
  | 'submitting'
  | 'completed'

export const SpideyChatbot: React.FC<SpideyChatbotProps> = ({
  isOpen = true,
  onClose,
  onIncidentCreated,
  isFloating = false,
}) => {
  const [step, setStep] = useState<ChatStep>('ask_name')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    email: '',
    category: 'grievance' as EmergencyCategory,
    grievance: '',
  })
  const [submittedIncident, setSubmittedIncident] = useState<GrievanceRequest | null>(null)
  const [emailStatus, setEmailStatus] = useState<string | null>(null)

  // Voice States
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(spideyVoice.getSettings())
  const [isSpeaking, setIsSpeaking] = useState(spideyVoice.isSpeaking())
  const [currentSpokenId, setCurrentSpokenId] = useState<string | null>(
    spideyVoice.getCurrentSpokenId()
  )
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [micFeedback, setMicFeedback] = useState<string | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  const chatFeedRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasTriggeredScrollGreeting = useRef(false)
  const isCurrentlyInViewRef = useRef(false)
  const greetingTimerRef = useRef<any>(null)
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false)

  const stepRef = useRef(step)
  const formDataRef = useRef(formData)
  useEffect(() => {
    stepRef.current = step
    formDataRef.current = formData
  }, [step, formData])

  const getCurrentQuestionText = (activeStep?: ChatStep, activeName?: string): string => {
    const s = activeStep || stepRef.current || step
    const n = activeName || formDataRef.current?.name || formData.name
    switch (s) {
      case 'ask_name':
        return "What's your name, neighbor?"
      case 'ask_age':
        return n ? `How old are you, ${n}?` : 'How old are you?'
      case 'ask_location':
        return 'Where in the city are you located right now?'
      case 'ask_email':
        return "What's your email so my emergency alert can reach you?"
      case 'ask_category':
        return 'What best matches your situation?'
      case 'ask_grievance':
        return 'So... tell me. How can I help you?'
      case 'submitting':
        return 'Dispatching your superhero alert to Spider-Man...'
      case 'completed':
        return 'Emergency alert dispatched to Spider-Man!'
      default:
        return "What's your name, neighbor?"
    }
  }

  const SUGGESTED_CHIPS: Record<ChatStep, string[]> = {
    ask_name: ["I'm Mary Jane Watson", 'Miles Morales from Brooklyn', 'Ned Leeds from Queens', 'Anonymous Citizen'],
    ask_age: ['16', '21', '28', '35+'],
    ask_location: ['Queens (Forest Hills)', 'Manhattan (Times Square)', 'Brooklyn (Near Bridge)', 'Midtown / Bronx'],
    ask_email: ['pbrohith2@gmail.com', 'citizen.help@nyc.gov', 'emergency@newyork.org'],
    ask_category: [],
    ask_grievance: [
      'There is an emergency rescue needed on 5th Avenue!',
      'Supervillain spotted attacking near Times Square!',
      'I lost my cat in the alley and need Spider-Man!',
      'I am feeling overwhelmed and need someone to listen.',
    ],
    submitting: [],
    completed: [],
  }

  const scrollToBottom = () => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTo({
        top: chatFeedRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Sync with Spidey Voice Engine
  useEffect(() => {
    const unsubscribe = spideyVoice.subscribe(() => {
      setVoiceSettings(spideyVoice.getSettings())
      setIsSpeaking(spideyVoice.isSpeaking())
      setCurrentSpokenId(spideyVoice.getCurrentSpokenId())
      setIsListening(spideyVoice.isListening())
    })
    return () => {
      unsubscribe()
      spideyVoice.stop()
      spideyVoice.stopListening()
    }
  }, [])

  // Automatically ask visible questions when user scrolls towards the chat section,
  // and STOP the voice automatically as soon as the user leaves/scrolls away from the chatbox!
  useEffect(() => {
    const handleEnterChat = () => {
      if (isCurrentlyInViewRef.current) return
      isCurrentlyInViewRef.current = true
      setHasScrolledIntoView(true)

      // 1. If conversation has not yet started, trigger initial greeting
      if (!hasTriggeredScrollGreeting.current) {
        hasTriggeredScrollGreeting.current = true
        setIsTyping(true)
        spideyVoice.playSuitChirp('open')

        if (greetingTimerRef.current) clearTimeout(greetingTimerRef.current)
        greetingTimerRef.current = setTimeout(() => {
          // If the user left while the timeout was waiting, cancel speaking!
          if (!isCurrentlyInViewRef.current) {
            setIsTyping(false)
            return
          }

          const greeting1: ChatMessage = {
            id: 'init-1',
            sender: 'spidey',
            text: "Hey! I'm Spider-Man. Just swinging by your corner of the web.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
          const greeting2: ChatMessage = {
            id: 'init-2',
            sender: 'spidey',
            text: "I help people in need of rescue, justice, or just someone who's ready to listen. What's your name, neighbor?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }

          setMessages([greeting1, greeting2])
          setIsTyping(false)
          setStep('ask_name')

          // Automatically speak questions with Peter Parker's movie voice!
          if (voiceSettings.enabled && isCurrentlyInViewRef.current) {
            spideyVoice.speakSequence([
              { text: greeting1.text, id: greeting1.id },
              { text: greeting2.text, id: greeting2.id },
            ])
          }
        }, 500)
      } else {
        // 2. If user already started conversation and scrolls BACK to chatbox, speak current question!
        const activeStep = stepRef.current
        if (voiceSettings.enabled && activeStep !== 'completed' && activeStep !== 'submitting') {
          const q = getCurrentQuestionText()
          if (q) {
            spideyVoice.speak(q)
          }
        }
      }
    }

    const handleLeaveChat = () => {
      if (!isCurrentlyInViewRef.current) return
      isCurrentlyInViewRef.current = false

      // Clear any pending greeting timer so it doesn't fire after leaving
      if (greetingTimerRef.current) {
        clearTimeout(greetingTimerRef.current)
        greetingTimerRef.current = null
      }

      // STOP THE VOICE AUTOMATICALLY when user leaves the chatbox!
      spideyVoice.stop()
    }

    const checkScrollPosition = () => {
      const target = containerRef.current || document.getElementById('help-portal')
      if (target) {
        const rect = target.getBoundingClientRect()
        // Approaching or visible on screen:
        // Top has reached the bottom 90% of screen, and bottom hasn't scrolled completely past
        const isNearOrVisible =
          rect.top <= window.innerHeight * 0.9 && rect.bottom >= 80

        if (isNearOrVisible) {
          handleEnterChat()
        } else {
          handleLeaveChat()
        }
      }
    }

    checkScrollPosition()

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleLeaveChat()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const target = containerRef.current || document.getElementById('help-portal')
    let observer: IntersectionObserver | null = null

    if (target && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            handleEnterChat()
          } else {
            handleLeaveChat()
          }
        },
        { threshold: [0, 0.1], rootMargin: '80px 0px -60px 0px' }
      )
      observer.observe(target)
    }

    window.addEventListener('scroll', checkScrollPosition, { passive: true })

    return () => {
      if (observer) observer.disconnect()
      window.removeEventListener('scroll', checkScrollPosition)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (greetingTimerRef.current) {
        clearTimeout(greetingTimerRef.current)
        greetingTimerRef.current = null
      }
      spideyVoice.stop()
    }
  }, [voiceSettings.enabled])

  const handleContainerInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true)
    }
  }

  const addMessage = (
    sender: 'spidey' | 'user',
    text: string,
    speakImmediately = true
  ): ChatMessage => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, newMessage])

    // Voice Peter Parker's response only when user is actively at the chatbox
    if (
      sender === 'spidey' &&
      speakImmediately &&
      voiceSettings.enabled &&
      isCurrentlyInViewRef.current
    ) {
      spideyVoice.speak(text, newMessage.id)
    }

    return newMessage
  }

  const processInput = async (trimmed: string) => {
    if (!trimmed || isTyping) return

    addMessage('user', trimmed)
    setInputValue('')
    setIsTyping(true)

    if (step === 'ask_name') {
      try {
        const cleanName = await extractNameWithGemini(trimmed)
        setFormData((prev) => ({ ...prev, name: cleanName }))
        setTimeout(() => {
          addMessage(
            'spidey',
            `Awesome to meet you, ${cleanName}! How old are you? (Just need to know if I should keep the science puns PG or PG-13! 🕷️)`
          )
          setIsTyping(false)
          setStep('ask_age')
        }, 600)
      } catch {
        setFormData((prev) => ({ ...prev, name: trimmed }))
        setTimeout(() => {
          addMessage(
            'spidey',
            `Awesome to meet you, ${trimmed}! How old are you? (Just need to know if I should keep the science puns PG or PG-13! 🕷️)`
          )
          setIsTyping(false)
          setStep('ask_age')
        }, 600)
      }
    } else if (step === 'ask_age') {
      try {
        const cleanAge = await extractAgeWithGemini(trimmed)
        setFormData((prev) => ({ ...prev, age: cleanAge }))
        setTimeout(() => {
          addMessage(
            'spidey',
            `Got it down! Where in the city (or anywhere on Earth) are you located right now? Street, neighborhood, or borough helps calculate my swing route!`
          )
          setIsTyping(false)
          setStep('ask_location')
        }, 600)
      } catch {
        const parsedAge = parseInt(trimmed, 10)
        const safeAge = isNaN(parsedAge) ? trimmed : parsedAge
        setFormData((prev) => ({ ...prev, age: String(safeAge) }))
        setTimeout(() => {
          addMessage(
            'spidey',
            `Got it down! Where in the city (or anywhere on Earth) are you located right now? Street, neighborhood, or borough helps calculate my swing route!`
          )
          setIsTyping(false)
          setStep('ask_location')
        }, 600)
      }
    } else if (step === 'ask_location') {
      try {
        const cleanLocation = await extractLocationWithGemini(trimmed)
        setFormData((prev) => ({ ...prev, location: cleanLocation }))
        setTimeout(() => {
          addMessage(
            'spidey',
            `Coordinates locked for ${cleanLocation}! What's your email address? That way my automatic comm-link can send you updates and alert my dispatch line!`
          )
          setIsTyping(false)
          setStep('ask_email')
        }, 600)
      } catch {
        setFormData((prev) => ({ ...prev, location: trimmed }))
        setTimeout(() => {
          addMessage(
            'spidey',
            `Coordinates locked for ${trimmed}! What's your email address? That way my automatic comm-link can send you updates and alert my dispatch line!`
          )
          setIsTyping(false)
          setStep('ask_email')
        }, 600)
      }
    } else if (step === 'ask_email') {
      const cleanEmail = await extractEmailWithGemini(trimmed)
      // Basic email check
      if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        setTimeout(() => {
          addMessage(
            'spidey',
            "Whoops! My spider-sense says that email address looks a bit tangled. Mind double-checking it so I know where to reach you?"
          )
          setIsTyping(false)
        }, 500)
        return
      }

      setFormData((prev) => ({ ...prev, email: cleanEmail }))

      setTimeout(() => {
        addMessage(
          'spidey',
          `Contact confirmed: ${cleanEmail}. Before we get down to brass tacks, what kind of situation are we looking at?`
        )
        setIsTyping(false)
        setStep('ask_category')
      }, 600)
    } else if (step === 'ask_grievance') {
      const grievanceText = trimmed
      setFormData((prev) => ({ ...prev, grievance: grievanceText }))
      setStep('submitting')

      const newIncident: GrievanceRequest = {
        id: `BND-${Date.now().toString().slice(-6)}`,
        name: formData.name,
        age: formData.age,
        location: formData.location,
        email: formData.email,
        category: formData.category,
        grievance: grievanceText,
        timestamp: new Date().toISOString(),
        status: 'dispatched',
        spiderTracerActive: true,
      }

      setSubmittedIncident(newIncident)
      if (onIncidentCreated) {
        onIncidentCreated(newIncident)
      }

      // Automatic Email Notification Trigger!
      try {
        setEmailStatus('Sending automatic email dispatch...')
        const emailResult = await sendSuperheroHelpEmail(newIncident)
        setEmailStatus(
          `Alert sent automatically to ${emailResult.recipient} (${
            emailResult.provider === 'emailjs' ? 'Live EmailJS' : 'Instant Dispatcher'
          })`
        )

        // Confetti celebration
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#E23636', '#0284C7', '#38BDF8', '#F59E0B'],
          })
        } catch {
          // ignore
        }

        setTimeout(() => {
          const msg1Text = `Hang tight, ${formData.name}! I've got your back. I just automatically fired off an emergency alert to my personal email comm-link: Subject: 🦸 Someone Needs Your Help!`
          const msg2Text = `A Spider-Tracer beacon has been calibrated for ${formData.location}. I'm swinging into action right now. Keep your head high and stay safe, neighbor! 🕸️`

          const m1 = addMessage('spidey', msg1Text, false)
          const m2 = addMessage('spidey', msg2Text, false)

          if (voiceSettings.enabled && isCurrentlyInViewRef.current) {
            spideyVoice.speakSequence([
              { text: msg1Text, id: m1.id },
              { text: msg2Text, id: m2.id },
            ])
          }

          setIsTyping(false)
          setStep('completed')
        }, 600)
      } catch (err) {
        console.error('Error in automatic dispatch:', err)
        addMessage(
          'spidey',
          `Your request has been securely queued in my dispatch log! Even with city interference, Spidey is on the way!`
        )
        setIsTyping(false)
        setStep('completed')
      }
    }
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || isTyping) return
    await processInput(trimmed)
  }

  const handleChipClick = async (chipText: string) => {
    if (isTyping) return
    await processInput(chipText)
  }

  const handleCategorySelect = (category: EmergencyCategory) => {
    setFormData((prev) => ({ ...prev, category }))
    addMessage('user', `Category: ${category.toUpperCase()}`)
    setIsTyping(true)

    // Exact prompt required: "So... tell me. How can I help you?"
    setTimeout(() => {
      addMessage('spidey', 'So... tell me. How can I help you?')
      setIsTyping(false)
      setStep('ask_grievance')
    }, 700)
  }

  const handleReset = () => {
    spideyVoice.stop()
    setMessages([])
    setStep('ask_name')
    setFormData({
      name: '',
      age: '',
      location: '',
      email: '',
      category: 'grievance',
      grievance: '',
    })
    setSubmittedIncident(null)
    setEmailStatus(null)

    setTimeout(() => {
      const resetText =
        "Fresh web line ready! Hey there, I'm Spider-Man. Who do I have the honor of helping today?"
      setMessages([
        {
          id: `reset-1`,
          sender: 'spidey',
          text: resetText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      if (voiceSettings.enabled) {
        spideyVoice.speak(resetText, 'reset-1')
      }
    }, 300)
  }

  const toggleVoiceEnabled = () => {
    const updated = !voiceSettings.enabled
    spideyVoice.saveSettings({ enabled: updated })
    if (!updated) {
      spideyVoice.stop()
    } else {
      spideyVoice.playSuitChirp('open')
    }
  }

  const toggleListening = () => {
    if (isListening) {
      spideyVoice.stopListening()
      setIsListening(false)
    } else {
      setMicFeedback(null)
      const ok = spideyVoice.startListening(
        (transcript) => {
          setInputValue(transcript)
        },
        (err) => {
          setMicFeedback(err)
          setTimeout(() => setMicFeedback(null), 3500)
        }
      )
      if (ok) {
        setIsListening(true)
      } else {
        setMicFeedback('Microphone not supported in this browser')
        setTimeout(() => setMicFeedback(null), 3500)
      }
    }
  }

  const activePreset = VOICE_PRESETS[voiceSettings.persona] || VOICE_PRESETS.mcu_holland

  if (!isOpen && isFloating) return null

  return (
    <div
      ref={containerRef}
      onClick={handleContainerInteraction}
      className={`relative flex flex-col rounded-3xl overflow-hidden border border-red-500/30 bg-slate-950/95 shadow-2xl backdrop-blur-2xl transition-all ${
        isFloating
          ? 'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-[94vw] sm:w-[420px] h-[520px] max-h-[calc(100dvh-5.5rem)]'
          : 'w-full h-[660px]'
      }`}
    >
      {/* Chat Header */}
      <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-red-950/90 via-slate-900 to-sky-950/90 border-b border-red-900/40 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-slate-900 flex-shrink-0 ${
                isSpeaking
                  ? 'border-red-400 ring-2 ring-red-500/80 shadow-[0_0_18px_rgba(239,68,68,0.9)] scale-105'
                  : 'border-red-400/80 shadow-spider-glow'
              }`}
            >
              <img
                src="/spidey-logo.jpg"
                alt="Spider-Man"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 ${
                isSpeaking ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                SPIDER-MAN DISPATCH CHAT
              </h3>
              <Badge variant="spidey" className="text-[9px] py-0 px-1.5">
                ACTIVE
              </Badge>
            </div>

            {/* Voice Status & Equalizer Bar */}
            <div className="flex items-center gap-2 mt-0.5">
              {isSpeaking ? (
                <div className="flex items-center gap-1.5">
                  {/* Dynamic Equalizer Bars */}
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-red-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-full" />
                    <span className="w-0.5 bg-sky-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
                    <span className="w-0.5 bg-red-500 rounded-full animate-[pulse_0.3s_ease-in-out_infinite] h-3" />
                    <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-2.5" />
                  </div>
                  <span className="text-[11px] text-red-400 font-bold tracking-wide animate-pulse">
                    Peter Parker Speaking...
                  </span>
                  <button
                    onClick={() => spideyVoice.stop()}
                    className="text-[10px] text-slate-400 hover:text-white underline ml-1 cursor-pointer"
                  >
                    Stop
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-sky-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                  <span>Comm-Link • {activePreset.name}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Header Audio Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
          {/* Voice Toggle Button */}
          <button
            onClick={toggleVoiceEnabled}
            className={`btn-liquid-glass p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
              voiceSettings.enabled
                ? 'btn-liquid-spidey text-red-200'
                : 'btn-liquid-dark text-slate-400 hover:text-white'
            }`}
            title={voiceSettings.enabled ? 'Peter Parker Voice: ON (Click to mute)' : 'Peter Parker Voice: MUTED (Click to enable)'}
          >
            {voiceSettings.enabled ? (
              <Volume2 className="w-4 h-4 text-red-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
            <span className="text-[11px] font-bold hidden sm:inline">
              {voiceSettings.enabled ? 'Voice ON' : 'Muted'}
            </span>
          </button>

          {/* Voice Synthesizer Settings Button */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="btn-liquid-glass btn-liquid-dark p-2 rounded-xl text-slate-300 hover:text-sky-300 transition-all"
            title="Peter Parker Voice Settings (Movie Persona, Pitch, Speed, SFX)"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Reset Conversation */}
          <button
            onClick={handleReset}
            className="btn-liquid-glass btn-liquid-dark p-2 rounded-xl text-slate-400 hover:text-white"
            title="Start new conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {isFloating && onClose && (
            <button
              onClick={onClose}
              className="btn-liquid-glass btn-liquid-dark p-2 rounded-xl text-slate-400 hover:text-red-400"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Voice Quick-Bar Strip */}
      <div className="px-4 py-2 bg-gradient-to-r from-red-950/70 via-slate-900/90 to-sky-950/70 border-b border-red-900/30 flex items-center justify-between text-xs flex-shrink-0">
        <div className="flex items-center gap-2">
          <Headphones className="w-3.5 h-3.5 text-red-400" />
          <span className="text-slate-300 text-[11px] font-medium hidden sm:inline">
            Voice Profile:
          </span>
          <span className="text-red-400 font-bold text-[11px]">
            {activePreset.name} ({activePreset.actor})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isSpeaking) {
                spideyVoice.stop()
              } else {
                spideyVoice.testVoice()
              }
            }}
            className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-[11px] text-white border border-red-700/50 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            {isSpeaking ? (
              <>
                <Square className="w-3 h-3 fill-current text-red-300" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current text-sky-400" />
                <span>Hear Spidey Quote</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Question Bar (Spidey automatically asks this when scrolling into view) */}
      {step !== 'completed' && (
        <div className="px-4 py-2 bg-gradient-to-r from-red-950/70 via-slate-900/95 to-sky-950/70 border-b border-red-500/30 flex items-center justify-between text-xs flex-shrink-0 animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[10px] font-black text-red-400 uppercase tracking-wider flex-shrink-0">
              Question On Screen:
            </span>
            <span className="text-white font-bold text-xs truncate">
              {getCurrentQuestionText()}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const q = getCurrentQuestionText()
              if (q) spideyVoice.speak(q)
            }}
            className="text-[11px] text-sky-400 hover:text-white flex items-center gap-1 font-semibold flex-shrink-0 cursor-pointer ml-2 hover:underline"
            title="Hear Spider-Man speak this question aloud"
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Ask Aloud</span>
          </button>
        </div>
      )}

      {/* Messages Feed */}
      <div ref={chatFeedRef} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 web-grid">
        {messages.map((msg) => {
          const isMsgBeingSpoken = isSpeaking && currentSpokenId === msg.id

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-end gap-2 max-w-[94%] sm:max-w-[82%] lg:max-w-[70%]">
                {msg.sender === 'spidey' && (
                  <div
                    className={`w-7 h-7 rounded-full overflow-hidden border flex-shrink-0 shadow-sm mb-1 bg-slate-900 transition-all ${
                      isMsgBeingSpoken
                        ? 'border-red-400 ring-2 ring-red-500/80 shadow-[0_0_12px_rgba(239,68,68,0.8)] scale-110'
                        : 'border-red-500/80'
                    }`}
                  >
                    <img
                      src="/spidey-logo.jpg"
                      alt="Spider-Man"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed transition-all relative group ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-sky-600 to-spidey-blue text-white rounded-br-xs shadow-md'
                      : isMsgBeingSpoken
                      ? 'bg-slate-900/95 text-white border-2 border-red-500/80 rounded-bl-xs shadow-spider-glow ring-2 ring-red-500/30'
                      : 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-bl-xs shadow-lg'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Per-Message Audio Playback Button */}
                {msg.sender === 'spidey' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isSpeaking && currentSpokenId === msg.id) {
                        spideyVoice.stop()
                      } else {
                        spideyVoice.speak(msg.text, msg.id)
                      }
                    }}
                    className={`p-1.5 rounded-xl transition-all flex items-center justify-center flex-shrink-0 mb-1 cursor-pointer ${
                      isMsgBeingSpoken
                        ? 'bg-red-500/30 text-red-300 border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] scale-110'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/60'
                    }`}
                    title={
                      isMsgBeingSpoken
                        ? 'Stop speaking'
                        : 'Hear Peter Parker read this aloud'
                    }
                  >
                    {isMsgBeingSpoken ? (
                      <Square className="w-3.5 h-3.5 fill-current text-red-400 animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-9 font-medium">
                {msg.timestamp}
              </span>
            </div>
          )
        })}

        {/* Category Option Buttons (When on ask_category step) */}
        {step === 'ask_category' && !isTyping && (
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-red-500/20 space-y-2.5 animate-web-shoot">
            <p className="text-xs font-semibold text-slate-300">
              Select what best matches your situation:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <button
                onClick={() => handleCategorySelect('emergency')}
                className="btn-liquid-glass btn-liquid-spidey p-3 text-left rounded-2xl text-xs font-bold text-white flex items-center gap-2.5"
              >
                <ShieldAlert className="w-4 h-4 text-red-300" />
                <span>Code Red Danger</span>
              </button>
              <button
                onClick={() => handleCategorySelect('crime')}
                className="btn-liquid-glass btn-liquid-amber p-3 text-left rounded-2xl text-xs font-bold text-white flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-amber-200" />
                <span>Crime / Supervillain</span>
              </button>
              <button
                onClick={() => handleCategorySelect('grievance')}
                className="btn-liquid-glass btn-liquid-web p-3 text-left rounded-2xl text-xs font-bold text-white flex items-center gap-2.5"
              >
                <User className="w-4 h-4 text-sky-200" />
                <span>General Grievance</span>
              </button>
              <button
                onClick={() => handleCategorySelect('support')}
                className="btn-liquid-glass btn-liquid-purple p-3 text-left rounded-2xl text-xs font-bold text-white flex items-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Need Someone to Listen</span>
              </button>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-red-500/80 flex-shrink-0 bg-slate-900">
              <img
                src="/spidey-logo.jpg"
                alt="Spider-Man"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-900 px-3 py-2 rounded-2xl border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 text-[11px] text-slate-400">Spidey is typing...</span>
            </div>
          </div>
        )}

        {/* Completed Dispatch Card showing Automatic Email Confirmation */}
        {step === 'completed' && submittedIncident && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-red-950/60 to-slate-900/90 border border-red-500/40 shadow-2xl space-y-3 animate-web-shoot">
            <div className="flex items-center justify-between border-b border-red-900/40 pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Automatic Email Dispatched!
                </span>
              </div>
              <Badge variant="spidey" className="text-[10px]">
                {submittedIncident.id}
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Subject:</span>
                <span className="font-semibold text-white">🦸 Someone Needs Your Help!</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Candidate Recipient:</span>
                <span className="font-mono text-sky-400">{getRecipientEmail()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Requester:</span>
                <span className="text-white">
                  {submittedIncident.name} ({submittedIncident.age} yrs)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Location:</span>
                <span className="text-white">{submittedIncident.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Requester Email:</span>
                <span className="text-white font-mono">{submittedIncident.email}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block mb-0.5">Submitted Grievance:</span>
                <p className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 italic">
                  "{submittedIncident.grievance}"
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-emerald-400">
              <span className="flex items-center gap-1 font-semibold">
                <Radio className="w-3.5 h-3.5 animate-ping" />
                Live Spider-Tracer Active
              </span>
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="text-[11px] h-7 px-2.5 border-slate-700"
              >
                Start New Request
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mic status toast feedback if any */}
      {micFeedback && (
        <div className="px-4 py-1.5 bg-red-950 text-red-200 text-xs border-t border-red-800 flex items-center justify-between animate-fadeIn">
          <span>{micFeedback}</span>
          <button onClick={() => setMicFeedback(null)} className="text-red-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Suggested Answers / Chips for the Question on Screen */}
      {step !== 'completed' && step !== 'ask_category' && SUGGESTED_CHIPS[step]?.length > 0 && (
        <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 flex-shrink-0 mr-1">
            <Sparkles className="w-3 h-3 text-red-400" />
            <span>Suggested:</span>
          </span>
          {SUGGESTED_CHIPS[step].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              disabled={isTyping}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-red-950/70 border border-slate-800 hover:border-red-500/60 text-xs text-slate-300 hover:text-white transition-all whitespace-nowrap flex-shrink-0 cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
            >
              <span>{chip}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      {step !== 'completed' && step !== 'ask_category' && (
        <form
          onSubmit={handleSend}
          className="p-3.5 sm:p-4 bg-slate-900/95 border-t border-slate-800 flex items-center gap-2 sm:gap-3 flex-shrink-0"
        >
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type={step === 'ask_age' ? 'number' : step === 'ask_email' ? 'email' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to you... Speak now!'
                  : step === 'ask_name'
                  ? 'Type your name or alias...'
                  : step === 'ask_age'
                  ? 'Your age...'
                  : step === 'ask_location'
                  ? 'Your street, borough, or city...'
                  : step === 'ask_email'
                  ? 'Your email address...'
                  : step === 'ask_grievance'
                  ? 'Describe your problem, grievance, or situation...'
                  : 'Type your message...'
              }
              className={`w-full text-sm sm:text-base bg-slate-950 border-slate-700 h-12 pl-4 pr-11 transition-all ${
                isListening ? 'ring-2 ring-red-500 border-red-500 bg-red-950/20' : ''
              }`}
              disabled={isTyping}
            />

            {/* Microphone Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white shadow-spider-glow animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={
                isListening
                  ? 'Microphone active! Click to finish speaking'
                  : 'Talk to Spider-Man (Voice Input)'
              }
            >
              {isListening ? <Mic className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            variant="spidey"
            size="sm"
            disabled={!inputValue.trim() || isTyping}
            className="h-12 px-5 sm:px-6 gap-2 text-sm font-bold shadow-spider-glow flex-shrink-0"
          >
            <span className="hidden sm:inline">Send</span>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      )}

      {/* Footer Info Strip */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-900 text-[10px] text-slate-500 flex items-center justify-between flex-shrink-0">
        <span className="flex items-center gap-1.5 text-slate-400">
          <Sparkles className="w-3 h-3 text-red-400" />
          <span>Brand New Day Voice Engine (Peter Parker Speech Active)</span>
        </span>
        <span className="text-slate-400">Emergency Comm: {getRecipientEmail()}</span>
      </div>

      {/* Peter Parker Voice Synthesizer Modal */}
      <SpideyVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  )
}
