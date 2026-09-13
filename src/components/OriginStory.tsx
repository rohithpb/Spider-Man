import React from 'react'
import { BookOpen, Heart, ShieldCheck, Camera, Sparkles, Quote } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'

export const OriginStory: React.FC = () => {
  return (
    <section id="origin" className="py-20 bg-slate-950/60 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="spidey" className="text-xs px-3 py-1">
            HERO DOSSIER & LORE
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            The Legend of <span className="text-red-500">Peter Parker</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            In the <span className="text-sky-400 font-semibold">Brand New Day</span> era, Spider-Man recommits to the grassroots streets of New York City — proving that the greatest superpower is simply caring enough to show up.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card 1: The Radioactive Genesis */}
          <div className="lg:col-span-4">
            <Card className="h-full border-red-900/30 hover:border-red-500/50 transition-all group bg-gradient-to-b from-slate-900/90 to-slate-950/90">
              <CardContent className="p-8 space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-800/40 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  The Genesis Bite
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  During a high school science demonstration at Midtown High, a stray radioactive arachnid altered the DNA of brilliant yet awkward orphan Peter Parker. Overnight, he woke up with proportional arachnid strength, adhesive fingertip setae, and a psychic early-warning danger sense.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 text-xs font-semibold">
                    Genomic Mutation
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 text-xs font-semibold">
                    Forest Hills, Queens
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card 2: Uncle Ben's Guiding Principle (Featured Center) */}
          <div className="lg:col-span-4">
            <Card className="h-full border-sky-900/40 hover:border-sky-400/50 transition-all relative overflow-hidden bg-gradient-to-b from-slate-900/95 via-sky-950/30 to-slate-950/95 shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Quote className="w-32 h-32 text-sky-400" />
              </div>

              <CardContent className="p-8 space-y-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-950 border border-sky-800/40 flex items-center justify-center text-sky-400">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    The Eternal Credo
                  </h3>
                  <blockquote className="border-l-2 border-red-500 pl-4 my-4 italic text-slate-200 text-base font-medium">
                    "With great power there must also come — great responsibility!"
                  </blockquote>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    A tragic lesson taught by the loss of his beloved Uncle Ben shaped Peter’s moral core. Spider-Man doesn't fight for fame, fortune, or vengeance. He fights because he has the power to protect those who cannot protect themselves.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/30 text-xs text-red-200">
                  <span className="font-bold text-white block mb-1">Brand New Day Philosophy:</span>
                  Superheroes shouldn't be unreachable gods. They should be neighbors who check in when your day goes wrong.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card 3: Personality & Day-to-Day Mission */}
          <div className="lg:col-span-4">
            <Card className="h-full border-slate-800 hover:border-red-500/40 transition-all group bg-gradient-to-b from-slate-900/90 to-slate-950/90">
              <CardContent className="p-8 space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Personality & Mission
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Armed with lightning quips, relentless optimism, and a camera strapped to lamp posts for the Daily Bugle, Peter balances late rent and chemistry formulas with saving commuter trains. His humor isn’t arrogance — it’s how he keeps himself and terrified hostages brave.
                </p>
                <div className="space-y-2 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Always accessible to civilians</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Zero civilian casualties mission rule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Proactive neighborhood patrol desk</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
