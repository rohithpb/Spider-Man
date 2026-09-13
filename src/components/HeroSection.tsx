import React from 'react'
import { Sparkles, MessageSquare, ArrowDown, MapPin, Radio, ShieldCheck, Activity } from 'lucide-react'
import { Button } from './ui/button'

interface HeroSectionProps {
  onOpenChat: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenChat }) => {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission, Identity & CTA */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-800/40 text-red-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>THE BRAND NEW DAY ERA</span>
              <span className="w-1 h-1 rounded-full bg-red-400" />
              <span className="text-sky-300">NYC PATROL ACTIVE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Your Friendly Neighborhood <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-sky-400 drop-shadow">
                Spider-Man
              </span>{' '}
              Is Here For You.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              No problem is too small. Whether you’re facing city-shaking supervillains,
              trouble in your alleyway, or just need someone to listen — swing by and reach out.
              Every request is answered with heart, responsibility, and swift action.
            </p>

            {/* Quick Metrics / Spidey HUD */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 py-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-lg sm:text-xl font-black text-red-400">~3 MINS</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Avg Swing Time
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-lg sm:text-xl font-black text-sky-400">5 BOROUGHS</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Full Coverage
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-lg sm:text-xl font-black text-amber-400">100%</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Responsibility
                </div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                onClick={onOpenChat}
                variant="spidey"
                size="lg"
                className="w-full sm:w-auto gap-3 text-base shadow-spider-glow group"
              >
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Ask For Spidey's Help Now</span>
              </Button>

              <a
                href="#origin"
                className="btn-liquid-glass btn-liquid-dark w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-slate-200 hover:text-white transition-all"
              >
                <span>Discover Origin & Powers</span>
                <ArrowDown className="w-4 h-4 text-sky-400 animate-bounce" />
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Automated Email Dispatch Active
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" /> Queens & Manhattan
              </span>
            </div>
          </div>

          {/* Right Column: Hero Portrait & Biometric Dossier */}
          <div className="lg:col-span-6 relative flex flex-col items-center">
            <div className="w-full max-w-[460px] relative group">
              {/* Outer Neon Web Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-sky-500 to-red-600 rounded-3xl blur-2xl opacity-35 group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />

              <div className="relative rounded-3xl overflow-hidden border-2 border-red-500/40 shadow-2xl bg-slate-950/90 backdrop-blur-xl">
                {/* Image Header with Holographic Spidey Artwork */}
                <div className="relative h-[440px] sm:h-[490px] w-full overflow-hidden bg-slate-950">
                  <img
                    src="/spidey-logo.jpg"
                    alt="Spider-Man Brand New Day"
                    className="w-full h-full object-cover object-top scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle Comic Cyber Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-[#040711]/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#040711]/50 via-transparent to-transparent" />

                  {/* Top Status Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1.5 rounded-full bg-red-950/90 border border-red-500/60 text-white font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-xl backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      LIVE PATROL
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-slate-950/90 border border-sky-500/40 text-sky-300 font-mono text-xs font-bold tracking-wider shadow-xl backdrop-blur-md">
                      NYC SECTOR 04
                    </span>
                  </div>

                  {/* Floating Bio Metrics Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800/80 shadow-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-mono text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-red-400" />
                          <span>Active Biometrics</span>
                        </div>
                        <div className="text-sm font-black text-white">
                          Spider-Sense & Reflexes
                        </div>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        OPTIMAL
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-300 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        <span>Fluid Capacity: 100%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Comms: Auto-Alert</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Strip */}
                <div className="p-4 bg-gradient-to-r from-red-950/90 via-slate-950 to-sky-950/90 border-t border-red-900/40 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    24/7 Citizen Emergency Desk
                  </span>
                  <Button
                    onClick={onOpenChat}
                    variant="spidey"
                    size="sm"
                    className="text-xs font-bold gap-1.5 shadow-spider-glow"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Talk to Spidey</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
