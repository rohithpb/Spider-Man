import React, { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import Demo from './components/ui/demo'
import { OriginStory } from './components/OriginStory'
import { SpideyChatbot } from './components/SpideyChatbot'
import { IncidentLogModal } from './components/IncidentLogModal'
import { EmailSettingsModal } from './components/EmailSettingsModal'
import { SpideyVoiceModal } from './components/SpideyVoiceModal'
import { AdminPortal } from './components/AdminPortal'
import { SpiderWebClickEffect } from './components/SpiderWebClickEffect'
import { Footer } from './components/Footer'
import { GrievanceRequest } from './types'
import { getStoredIncidents } from './services/emailService'
import { Sparkles, ChevronUp } from 'lucide-react'

export function App() {
  const [incidents, setIncidents] = useState<GrievanceRequest[]>([])
  const [isLogsOpen, setIsLogsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Load existing dispatches on mount and check for #admin in URL
  useEffect(() => {
    setIncidents(getStoredIncidents())

    const checkHash = () => {
      if (
        window.location.hash.toLowerCase() === '#admin' ||
        window.location.search.includes('admin')
      ) {
        setIsAdminOpen(true)
      }
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleIncidentCreated = (newIncident: GrievanceRequest) => {
    setIncidents((prev) => [newIncident, ...prev])
  }

  const handleClearIncidents = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spidey_incident_dispatches')
      setIncidents([])
    }
  }

  const scrollToChat = () => {
    const chatElement =
      document.getElementById('spidey-chatbot-anchor') || document.getElementById('help-portal')
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 selection:bg-red-600 selection:text-white relative">
      {/* Navigation */}
      <Navbar
        onOpenChat={scrollToChat}
        onOpenLogs={() => setIsLogsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenVoiceSettings={() => setIsVoiceSettingsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        incidentCount={incidents.length}
      />

      {/* Main Content */}
      <main>
        {/* 1. Cinematic Spider-Man Glyph Portal Opening */}
        <section id="portal-intro" className="relative">
          <Demo onEnter={scrollToChat} />
          {/* Seamless atmospheric transition gradient to prevent visual separation */}
          <div className="absolute -bottom-1 left-0 right-0 h-64 pointer-events-none bg-gradient-to-b from-transparent via-[#040711]/85 to-[#040711] z-20" />
        </section>

        {/* 2. Hero Section Dossier */}
        <HeroSection onOpenChat={scrollToChat} />

        {/* 3. Help Portal & Chatbot Section */}
        <section id="help-portal" className="py-20 bg-slate-950/80 relative border-t border-slate-900 scroll-mt-24">
          {/* Section Header */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/50 text-red-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>DIRECT SUPERHERO ASSISTANCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Friendly Neighborhood <span className="text-red-500">Dispatch Desk</span>
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              As soon as you enter, Spider-Man is here to listen. Speak with him naturally below
              with authentic movie-style Peter Parker voice narration and voice recognition.
              An automated email alert will immediately be dispatched to his emergency comm-link!
            </p>
          </div>

          {/* Embedded Conversational Chatbot - Expands Full Width Edge to Edge */}
          <div id="spidey-chatbot-anchor" className="w-full px-2 sm:px-4 lg:px-6 scroll-mt-24">
            <SpideyChatbot
              isOpen={true}
              isFloating={false}
              onIncidentCreated={handleIncidentCreated}
            />
          </div>
        </section>

        {/* 4. Hero Dossier & Origin Story */}
        <OriginStory />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Back to top button */}
      {showBackToTop && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn-liquid-glass btn-liquid-dark p-3 rounded-2xl text-slate-200 hover:text-white shadow-2xl transition-all"
            title="Scroll to top"
          >
            <ChevronUp className="w-4 h-4 relative z-10" />
          </button>
        </div>
      )}

      {/* Spider-Tracer Incident Dispatches Modal */}
      <IncidentLogModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        incidents={incidents}
        onClearIncidents={handleClearIncidents}
      />

      {/* Email Dispatch Settings Modal */}
      <EmailSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Peter Parker Voice Synthesizer Modal */}
      <SpideyVoiceModal
        isOpen={isVoiceSettingsOpen}
        onClose={() => setIsVoiceSettingsOpen(false)}
      />

      {/* Supabase Superhero Admin Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Spider-Man Web Click Effect with user's uploaded dew spider web */}
      <SpiderWebClickEffect />
    </div>
  )
}

export default App
