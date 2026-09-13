import React from 'react'
import { Heart, Shield, Radio, MapPin, Mail, Phone, ExternalLink } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-red-950/60 pt-16 pb-12 relative overflow-hidden">
      {/* Spider-Signal Ambient Beam */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
          {/* Brand & Superhero Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-red-500/60 shadow-spider-glow bg-slate-900 flex-shrink-0">
                <img
                  src="/spidey-logo.jpg"
                  alt="Spider-Man Logo"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="text-xl font-black text-white tracking-tight uppercase">
                BRAND NEW DAY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              The official help and distress portal for Spider-Man. Designed so every citizen across New York City and beyond has immediate direct access to their friendly neighborhood superhero.
            </p>
            <div className="flex items-center gap-2 text-xs text-red-400 font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Queens • Brooklyn • Manhattan • Bronx • Staten Island</span>
            </div>
          </div>

          {/* Quick Contact & Challenge Details */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Superhero Headquarters & Comm
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400" />
                <a href="mailto:pbrohith2@gmail.com" className="hover:text-white transition-colors font-medium">
                  pbrohith2@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400" />
                <span>+91 88 91 67 61 43</span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-amber-400" />
                <a
                  href="http://www.whitematrix.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  www.whitematrix.co.in
                </a>
              </div>
            </div>
          </div>

          {/* Ethics & Quote */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              The Guiding Principle
            </h4>
            <blockquote className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs italic text-slate-300 leading-relaxed">
              "Whatever comes our way, whatever battle we have raging inside us, we always have a choice. We can always do what's right."
            </blockquote>
            <p className="text-[11px] text-slate-400">— Peter Parker / Spider-Man</p>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Brand New Day • Built with React, Tailwind CSS, TypeScript & shadcn/ui conventions.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-red-400">
              Made with <Heart className="w-3 h-3 fill-current text-red-500" /> for everyday heroes
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
