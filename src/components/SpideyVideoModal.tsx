import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  Play,
  Film,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Radio,
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

import { supabaseService } from '../services/supabaseService'

interface SpideyVideoModalProps {
  isOpen: boolean
  onClose: () => void
}

// Candidates for local uploaded video files placed in public/
const LOCAL_VIDEO_CANDIDATES = [
  '/spidey-helping.mp4',
  '/spidey-helping.webm',
  '/spidey-action.mp4',
  '/spider-man.mp4',
  '/spidey.mp4',
]

// Fallback official hero rescue trailer embed if local or Supabase video is not yet present
const FALLBACK_HERO_VIDEO = 'https://www.youtube.com/embed/shW9i6k8cB0?autoplay=1&rel=0'

export const SpideyVideoModal: React.FC<SpideyVideoModalProps> = ({ isOpen, onClose }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [videoTitle, setVideoTitle] = useState<string>('Spider-Man: Saving Citizens & Answering the Call')
  const [isHtml5Video, setIsHtml5Video] = useState<boolean>(false)
  const [videoSourceLabel, setVideoSourceLabel] = useState<string>('HERO ARCHIVE')
  const [isBuffering, setIsBuffering] = useState<boolean>(false)
  const videoPlayerRef = useRef<HTMLVideoElement>(null)

  // Resolve video: 1) Supabase active video, 2) public/ local video, 3) Fallback embed
  useEffect(() => {
    let isMounted = true

    const resolveVideo = async () => {
      // 1. Check Supabase uploaded video
      const supabaseActive = supabaseService.getActiveVideo()
      if (supabaseActive && isMounted) {
        setVideoSrc(supabaseActive)
        setVideoTitle(supabaseService.getActiveVideoTitle())
        setIsHtml5Video(true)
        setVideoSourceLabel('SUPABASE CLOUD VIDEO')
        return
      }

      // 2. Check local candidates in public/
      for (const path of LOCAL_VIDEO_CANDIDATES) {
        try {
          const res = await fetch(path, { method: 'HEAD' })
          if (res.ok && isMounted) {
            setVideoSrc(path)
            setVideoTitle('Spider-Man Helping Others (Local Bundled Video)')
            setIsHtml5Video(true)
            setVideoSourceLabel('OFFICIAL BUNDLE')
            return
          }
        } catch {
          // continue checking
        }
      }

      // 3. Fallback
      if (isMounted) {
        setVideoSrc(FALLBACK_HERO_VIDEO)
        setVideoTitle('Spider-Man: Hero Rescue & Community Action')
        setIsHtml5Video(false)
        setVideoSourceLabel('HERO ARCHIVE')
      }
    }

    resolveVideo()

    const unsubscribe = supabaseService.subscribe(() => {
      resolveVideo()
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/92 animate-web-shoot">
      <div className="relative w-full max-w-4xl flex flex-col rounded-3xl border border-red-500/40 bg-slate-950 shadow-2xl overflow-hidden will-change-transform">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-950/90 via-slate-900 to-sky-950/90 border-b border-red-900/40 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 border border-red-400 flex items-center justify-center shadow-spider-glow flex-shrink-0 text-white">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white uppercase tracking-wide">
                  Spider-Man: Hero Rescue & Community Action
                </h3>
                <Badge variant="spidey" className="text-[10px] py-0 px-1.5">
                  {videoSourceLabel}
                </Badge>
              </div>
              <p className="text-xs text-sky-400">
                Exclusive footage of Spider-Man protecting citizens across New York City
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-liquid-glass btn-liquid-dark p-2 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Body */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-red-500/40 bg-black shadow-lg">
            {isHtml5Video && videoSrc ? (
              <>
                <video
                  ref={videoPlayerRef}
                  src={videoSrc}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  crossOrigin="anonymous"
                  onWaiting={() => setIsBuffering(true)}
                  onPlaying={() => setIsBuffering(false)}
                  onCanPlay={() => setIsBuffering(false)}
                  onLoadStart={() => setIsBuffering(true)}
                  className="w-full h-full object-contain"
                  style={{
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                  }}
                />

                {/* Smooth Buffering Overlay */}
                {isBuffering && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center pointer-events-none transition-opacity">
                    <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-950/90 border border-red-500/60 shadow-spider-glow text-white text-xs font-semibold">
                      <span className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      <span>Optimizing Hero Stream...</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <iframe
                src={videoSrc || FALLBACK_HERO_VIDEO}
                title="Spider-Man Helping Others"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          {/* Video Description Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">
                    {videoTitle}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    VERIFIED HERO FOOTAGE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Every neighborhood, every street. Spider-Man responding with heart, courage, and responsibility.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs border-slate-700 text-slate-200 hover:text-white"
            >
              Close Theater
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>Spider-Man Heroic Rescue Archive • Queens & Manhattan Patrol</span>
          </span>
          <span className="text-[11px] text-sky-400 flex items-center gap-1">
            <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
            Emergency Comm-Link Active
          </span>
        </div>
      </div>
    </div>
  )
}
