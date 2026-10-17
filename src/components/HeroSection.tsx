import React, { useState } from 'react'
import {
  Sparkles,
  MessageSquare,
  ArrowDown,
  MapPin,
  Radio,
  ShieldCheck,
  Activity,
  Play,
  Film,
  Upload,
  Clock,
  Compass,
  HeartHandshake,
  Zap,
  ArrowRight,
} from 'lucide-react'
import { Button } from './ui/button'
import { SpideyVideoModal } from './SpideyVideoModal'

interface HeroSectionProps {
  onOpenChat: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenChat }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-sky-500/12 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission, Identity & CTA */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left z-10">
            {/* The Brand New Day Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-950/90 via-slate-900/90 to-sky-950/90 border border-red-500/40 shadow-spider-glow text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-red-400 font-extrabold tracking-widest">
                THE BRAND NEW DAY ERA
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-sky-400 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                NYC PATROL ACTIVE
              </span>
            </div>

            {/* Main Headline - Cinematic Marvel Comic Typography */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white">
              <span className="block text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-sky-300 to-slate-400 uppercase font-mono mb-2">
                Your Friendly Neighborhood
              </span>
              <span className="relative inline-block my-1">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1E44] via-[#FF5E62] via-45% to-[#00D2FF] font-black drop-shadow-[0_0_35px_rgba(255,30,68,0.5)]">
                  Spider-Man
                </span>
                <span className="absolute -inset-1 bg-red-600/15 blur-xl -z-10 rounded-xl" />
              </span>{' '}
              <span className="block sm:inline text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] font-black">
                Is Here For You.
              </span>
            </h1>

            {/* Paragraph Description with Emphasis */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              No problem is too small. Whether you’re facing{' '}
              <span className="text-white font-semibold underline decoration-red-500/60 underline-offset-4 decoration-2">
                city-shaking supervillains
              </span>
              , trouble in your alleyway, or just need a friendly hero who’s ready to listen —
              swing by and reach out. Every request is answered with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-red-400 font-bold">
                heart, responsibility, and swift action.
              </span>
            </p>

            {/* Quick Metrics / Spidey HUD */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 py-1">
              <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-red-500/30 hover:border-red-500/60 transition-all text-center group shadow-lg hover:shadow-spider-glow">
                <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-red-400 transition-colors">
                    ~3 MINS
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                  Avg Swing Time
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-sky-500/30 hover:border-sky-500/60 transition-all text-center group shadow-lg">
                <div className="flex items-center justify-center gap-1 text-sky-400 mb-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-sky-400 transition-colors">
                    5 BOROUGHS
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                  Full NYC Patrol
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/30 hover:border-amber-500/60 transition-all text-center group shadow-lg">
                <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    100%
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                  Responsibility
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3.5 pt-1">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Button
                  onClick={onOpenChat}
                  variant="spidey"
                  size="lg"
                  className="w-full sm:w-auto gap-3 text-base font-bold shadow-spider-glow group h-14 px-8"
                >
                  <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform text-white" />
                  <span>Ask For Spidey's Help Now</span>
                </Button>

                <a
                  href="#origin"
                  className="btn-liquid-glass btn-liquid-dark w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 h-14 rounded-2xl text-sm font-bold text-slate-200 hover:text-white transition-all border border-slate-700/60"
                >
                  <span>Discover Origin & Powers</span>
                  <ArrowDown className="w-4 h-4 text-sky-400 animate-bounce" />
                </a>
              </div>

              {/* Dedicated Button directly BELOW "Ask For Spidey's Help Now" to Watch & Add Video */}
              <div className="flex justify-center lg:justify-start pt-1">
                <div className="relative group w-full sm:w-auto">
                  {/* Outer Pulsing Neon Aura */}
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-red-600 via-sky-400 to-red-600 opacity-70 group-hover:opacity-100 blur-lg transition duration-500 group-hover:duration-200 animate-pulse" />

                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(true)}
                    className="relative w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-slate-950 via-red-950/85 to-slate-950 border-2 border-red-500/80 hover:border-sky-400 shadow-[0_0_25px_rgba(239,68,68,0.45)] hover:shadow-[0_0_45px_rgba(56,189,248,0.65)] transition-all duration-300 text-left overflow-hidden cursor-pointer group-hover:scale-[1.02]"
                  >
                    {/* Shimmer light sweep */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    {/* Glowing 3D Play Button Icon with Double Pulse */}
                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-red-800 border-2 border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.8)] flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0">
                      <Play className="w-6 h-6 fill-current ml-0.5 text-white filter drop-shadow" />
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-400 border border-slate-950" />
                      </span>
                    </div>

                    {/* Center Copy */}
                    <div className="relative flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-base sm:text-lg font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-sky-200 group-hover:to-red-200 transition-all tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                          Watch Spidey Helping Others
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-red-500 to-sky-500 text-white shadow-md animate-pulse">
                          🎬 RESCUE FOOTAGE
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-sky-200/90 font-medium flex items-center gap-2 mt-1">
                        <Film className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
                        <span>Exclusive footage of Spider-Man swinging into action and saving lives</span>
                      </p>
                    </div>

                    {/* Right Interactive Action Badge */}
                    <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600/30 border border-red-400/50 text-red-200 text-xs font-bold group-hover:bg-red-600 group-hover:text-white group-hover:border-red-300 transition-all shadow-sm">
                      <span>Watch</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Status Info */}
            <div className="flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Automated Email Dispatch Active
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-red-400" /> Queens & Manhattan Direct Link
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

      {/* Spider-Man Rescue Video Modal */}
      <SpideyVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </section>
  )
}
