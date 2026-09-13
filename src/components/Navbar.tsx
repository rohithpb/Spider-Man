import React, { useState, useEffect } from 'react'
import { ShieldAlert, Radio, FileText, Settings, MessageSquare, Bell } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface NavbarProps {
  onOpenChat: () => void
  onOpenLogs: () => void
  onOpenSettings: () => void
  incidentCount: number
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenChat,
  onOpenLogs,
  onOpenSettings,
  incidentCount,
}) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-red-900/30 py-3 shadow-2xl opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand & Superhero Identity */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-red-500/70 shadow-spider-glow group-hover:scale-105 group-hover:border-red-400 transition-all duration-300 bg-slate-900 flex-shrink-0">
            <img
              src="/spidey-logo.jpg"
              alt="Brand New Day Spider-Man Logo"
              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
            />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-sky-400 border border-slate-950 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase group-hover:text-red-400 transition-colors">
                BRAND NEW DAY
              </span>
              <Badge variant="spidey" className="hidden sm:inline-flex text-[10px] py-0">
                SPIDER-MAN
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wider hidden sm:block">
              FRIENDLY NEIGHBORHOOD HELP & DISPATCH PORTAL
            </p>
          </div>
        </a>

        {/* Action Buttons & Nav CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Incident Log Button */}
          <button
            onClick={onOpenLogs}
            className="btn-liquid-glass btn-liquid-dark relative px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2"
            title="Spider-Tracer Incident Dispatches"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Dispatches</span>
            {incidentCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-red-600/90 text-white text-[10px] font-bold shadow-sm">
                {incidentCount}
              </span>
            )}
          </button>

          {/* Email Settings / Recipient Config */}
          <button
            onClick={onOpenSettings}
            className="btn-liquid-glass btn-liquid-dark p-2.5 rounded-2xl text-slate-300 hover:text-white flex items-center justify-center"
            title="Email Dispatch Settings"
            aria-label="Email Dispatch Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Main Emergency Call CTA */}
          <Button
            onClick={onOpenChat}
            variant="spidey"
            size="sm"
            className="gap-2 text-xs sm:text-sm font-bold"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Spidey For Help</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
