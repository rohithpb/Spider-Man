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
  Minimize2,
  Maximize2,
  RotateCcw,
  ExternalLink,
  X,
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

  const chatFeedRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  // Initial Spidey Greeting as mandated by challenge requirements
  useEffect(() => {
    if (messages.length === 0) {
      setIsTyping(true)
      const timer = setTimeout(() => {
        setMessages([
          {
            id: 'init-1',
            sender: 'spidey',
            text: "Hey! I'm Spider-Man. Just swinging by your corner of the web.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: 'init-2',
            sender: 'spidey',
            text: "I help people in need of rescue, justice, or just someone who's ready to listen. What's your name, neighbor?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
        setIsTyping(false)
        setStep('ask_name')
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [])

  const addMessage = (sender: 'spidey' | 'user', text: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = inputValue.trim()
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
          `Alert sent automatically to ${emailResult.recipient} (${emailResult.provider === 'emailjs' ? 'Live EmailJS' : 'Instant Dispatcher'})`
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
          addMessage(
            'spidey',
            `Hang tight, ${formData.name}! I've got your back. I just automatically fired off an emergency alert to my personal email comm-link: Subject: 🦸 Someone Needs Your Help!`
          )
          addMessage(
            'spidey',
            `A Spider-Tracer beacon has been calibrated for ${formData.location}. I'm swinging into action right now. Keep your head high and stay safe, neighbor! 🕸️`
          )
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
      setMessages([
        {
          id: `reset-1`,
          sender: 'spidey',
          text: "Fresh web line ready! Hey there, I'm Spider-Man. Who do I have the honor of helping today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, 300)
  }

  if (!isOpen && isFloating) return null

  return (
    <div
      className={`relative flex flex-col rounded-3xl overflow-hidden border border-red-500/30 bg-slate-950/95 shadow-2xl backdrop-blur-2xl transition-all ${
        isFloating
          ? 'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-[94vw] sm:w-[420px] h-[520px] max-h-[calc(100dvh-5.5rem)]'
          : 'w-full h-[650px]'
      }`}
    >
      {/* Chat Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-red-950/90 via-slate-900 to-sky-950/90 border-b border-red-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-red-400/80 shadow-spider-glow bg-slate-900 flex-shrink-0">
              <img
                src="/spidey-logo.jpg"
                alt="Spider-Man"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
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
            <p className="text-[11px] text-sky-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
              Direct Comm-Link • {hasGeminiApiKey() ? 'Gemini AI Active' : 'Automated Email Alert On'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
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

      {/* Messages Feed */}
      <div ref={chatFeedRef} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 web-grid">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-end gap-2 max-w-[92%] sm:max-w-[78%] lg:max-w-[65%]">
              {msg.sender === 'spidey' && (
                <div className="w-7 h-7 rounded-full overflow-hidden border border-red-500/80 flex-shrink-0 shadow-sm mb-1 bg-slate-900">
                  <img
                    src="/spidey-logo.jpg"
                    alt="Spider-Man"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-sky-600 to-spidey-blue text-white rounded-br-xs shadow-md'
                    : 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-bl-xs shadow-lg'
                }`}
              >
                {msg.text}
              </div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-9 font-medium">
              {msg.timestamp}
            </span>
          </div>
        ))}

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

        {/* End of messages anchor */}
      </div>

      {/* Input Form Bar */}
      {step !== 'completed' && step !== 'ask_category' && (
        <form
          onSubmit={handleSend}
          className="p-4 bg-slate-900/95 border-t border-slate-800 flex items-center gap-3"
        >
          <Input
            ref={inputRef}
            type={step === 'ask_age' ? 'number' : step === 'ask_email' ? 'email' : 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              step === 'ask_name'
                ? "Type your name or alias..."
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
            className="flex-1 text-sm sm:text-base bg-slate-950 border-slate-700 h-12 px-5"
            disabled={isTyping}
          />
          <Button
            type="submit"
            variant="spidey"
            size="sm"
            disabled={!inputValue.trim() || isTyping}
            className="h-12 px-6 gap-2 text-sm font-bold shadow-spider-glow flex-shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      )}

      {/* Footer Info Strip */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-900 text-[10px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-slate-400">
          <Sparkles className="w-3 h-3 text-red-400" />
          <span>Brand New Day Dispatch Engine (Gemini Neural NLP Active)</span>
        </span>
        <span className="text-slate-400">Emergency Comm: {getRecipientEmail()}</span>
      </div>
    </div>
  )
}
