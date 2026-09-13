import React, { useState } from 'react'
import { Shield, Zap, Crosshair, Cpu, Eye, Activity, Sliders } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

export const PowersSection: React.FC = () => {
  const [activeWebFormula, setActiveWebFormula] = useState<'standard' | 'impact' | 'taser' | 'foam'>('standard')
  const [spiderSenseSimActive, setSpiderSenseSimActive] = useState(false)

  const triggerSpiderSenseTest = () => {
    setSpiderSenseSimActive(true)
    setTimeout(() => setSpiderSenseSimActive(false), 2400)
  }

  const webFormulas = {
    standard: {
      name: 'Standard Micro-Tensile Silk',
      tensile: '300 lbs/mm²',
      duration: 'Dissolves cleanly in 1 hour',
      description: 'Ideal for skyline swinging, apprehending suspects, and securing falling vehicles.',
      color: 'border-sky-400 text-sky-400',
    },
    impact: {
      name: 'High-Velocity Impact Webbing',
      tensile: '450 lbs/mm²',
      duration: 'Expands into instant cocoon',
      description: 'Compressed pellets fired at ballistic velocity to instantly immobilize armored brutes.',
      color: 'border-amber-400 text-amber-400',
    },
    taser: {
      name: 'Bio-Electric Taser Web',
      tensile: '250 lbs/mm²',
      duration: 'Discharges 50,000V non-lethal pulse',
      description: 'Disables high-tech electronics, Oscorp drone swarms, and mechanical exoskeletons.',
      color: 'border-red-400 text-red-400',
    },
    foam: {
      name: 'Impact-Absorbent Cushion Foam',
      tensile: 'Cushions 10-story falls',
      duration: 'Expands 20x volume in 0.2s',
      description: 'Deploys a shock-absorbing safety trampoline for civilian rescue operations.',
      color: 'border-emerald-400 text-emerald-400',
    },
  }

  return (
    <section id="powers" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Spider Sense Simulation Flash Overlay */}
      {spiderSenseSimActive && (
        <div className="fixed inset-0 pointer-events-none z-50 animate-pulse border-[8px] border-red-500/80 bg-red-600/10 transition-all duration-300" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="web" className="text-xs px-3 py-1">
            BIOMETRICS & ARSENAL
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Powers, Tech & <span className="text-sky-400">Spider-Sense</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Powered by both arachnid genetics and Peter Parker’s bio-chemical genius.
            Interact with the diagnostics below to test Spidey’s gear in action.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Power 1: The Sixth Sense (Interactive Simulator) */}
          <div className="lg:col-span-6">
            <Card className="h-full border-red-900/40 bg-gradient-to-br from-slate-900 via-slate-900/90 to-red-950/40 shadow-2xl relative overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-800/40 flex items-center justify-center text-red-400">
                      <Eye className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">Spider-Sense</h3>
                      <p className="text-xs text-red-300 font-semibold uppercase tracking-wider">
                        Precognitive Neurological Threat Detection
                      </p>
                    </div>
                  </div>
                  <Badge variant={spiderSenseSimActive ? 'destructive' : 'outline'}>
                    {spiderSenseSimActive ? 'THREAT DETECTED' : 'STANDBY'}
                  </Badge>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  A clairvoyant involuntary subconscious warning system linked directly to Peter’s cerebellum. It reacts milliseconds before danger manifests — calculating trajectories of incoming sniper rounds, structural collapses, and hidden ambushes.
                </p>

                {/* Interactive Simulator Box */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-red-400" />
                      Synaptic Latency Monitor
                    </span>
                    <span className="text-red-400 font-mono font-bold">
                      {spiderSenseSimActive ? '0.008 ms (SPIKE!)' : '0.12 ms (Baseline)'}
                    </span>
                  </div>

                  <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        spiderSenseSimActive
                          ? 'w-full bg-gradient-to-r from-amber-400 via-red-500 to-red-600 shadow-spider-glow'
                          : 'w-1/4 bg-sky-500/60'
                      }`}
                    />
                  </div>

                  <Button
                    onClick={triggerSpiderSenseTest}
                    variant={spiderSenseSimActive ? 'destructive' : 'spidey'}
                    className="w-full text-xs font-bold gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    {spiderSenseSimActive
                      ? '⚠️ INCOMING HAZARD EVADED!'
                      : 'Simulate Immediate Danger Trigger'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Power 2: Web-Shooter Custom Fluid Formula (Interactive) */}
          <div className="lg:col-span-6">
            <Card className="h-full border-sky-900/40 bg-gradient-to-br from-slate-900 via-slate-900/90 to-sky-950/40 shadow-2xl">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-950 border border-sky-800/40 flex items-center justify-center text-sky-400">
                      <Crosshair className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">Twin Wrist Web-Shooters</h3>
                      <p className="text-xs text-sky-300 font-semibold uppercase tracking-wider">
                        High-Pressure Pneumatic Fluid Synthesis
                      </p>
                    </div>
                  </div>
                  <Badge variant="web">PARKER LABS TECH</Badge>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Engineered from a custom polymer liquid that solidifies into shear-resistant strands upon atmospheric contact. Switch nozzles below to inspect Peter’s mission-tailored compounds.
                </p>

                {/* Formula Switcher */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['standard', 'impact', 'taser', 'foam'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveWebFormula(key)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                        activeWebFormula === key
                          ? 'bg-sky-500/20 border-sky-400 text-white shadow-web-glow'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>

                {/* Formula Details Box */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {webFormulas[activeWebFormula].name}
                    </span>
                    <span className="text-xs font-mono text-sky-400 font-bold">
                      {webFormulas[activeWebFormula].tensile}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {webFormulas[activeWebFormula].description}
                  </p>
                  <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {webFormulas[activeWebFormula].duration}
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
