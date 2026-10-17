import React, { useEffect, useRef } from 'react'

interface DewParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  decay: number
}

interface WebInstance {
  id: number
  x: number
  y: number
  baseWidth: number
  baseHeight: number
  rotation: number
  progress: number // 0 to 1 expansion
  linger: number // frames to linger fully visible
  alpha: number // 1 to 0 fade out
  particles: DewParticle[]
}

export const SpiderWebClickEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const websRef = useRef<WebInstance[]>([])
  const animFrameIdRef = useRef<number | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const lastSoundTimeRef = useRef<number>(0)
  const webImageRef = useRef<HTMLImageElement | null>(null)
  const imageLoadedRef = useRef<boolean>(false)

  // Preload the user's authentic spider web image
  useEffect(() => {
    const img = new Image()
    img.src = '/spider-web.png'
    img.onload = () => {
      imageLoadedRef.current = true
    }
    webImageRef.current = img
  }, [])

  // Synthesize an authentic mechanical "THWIP!" web-shooter sound effect
  const playThwipSound = () => {
    const now = Date.now()
    if (now - lastSoundTimeRef.current < 65) return // throttle rapid clicks
    lastSoundTimeRef.current = now

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }

      const t = ctx.currentTime

      // 1. High-pressure air/fluid canister release (White noise burst)
      const bufferSize = Math.floor(ctx.sampleRate * 0.08)
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02))
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'bandpass'
      noiseFilter.frequency.setValueAtTime(3200, t)
      noiseFilter.frequency.exponentialRampToValueAtTime(1100, t + 0.065)
      noiseFilter.Q.value = 3.2

      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.2, t)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.075)

      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noise.start(t)
      noise.stop(t + 0.08)

      // 2. High-speed mechanical nozzle "twang" / resonant silk whistle
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1700, t)
      osc.frequency.exponentialRampToValueAtTime(340, t + 0.065)

      oscGain.gain.setValueAtTime(0.12, t)
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.065)

      osc.connect(oscGain)
      oscGain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.07)
    } catch {
      // Audio autoplay policy or blocked
    }
  }

  // Create a new web burst centered exactly at the click coordinates
  const spawnWeb = (clientX: number, clientY: number) => {
    playThwipSound()

    // Dimensions for web (natural aspect ratio: 1024x768 = 4:3)
    const baseW = Math.floor(Math.random() * 50) + 240 // 240px to 290px
    const baseH = Math.round(baseW * (768 / 1024)) // 180px to 218px
    const rotation = (Math.random() - 0.5) * 0.35 // slight organic tilt

    // Sparkling dew drops flying outward on impact
    const particleCount = Math.floor(Math.random() * 6) + 8
    const particles: DewParticle[] = []
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 3.5 + 1.5
      particles.push({
        x: clientX,
        y: clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2 + 1,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02,
      })
    }

    const newWeb: WebInstance = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
      baseWidth: baseW,
      baseHeight: baseH,
      rotation,
      progress: 0,
      linger: 42, // stay visible for ~42 frames (~700ms)
      alpha: 1.0,
      particles,
    }

    websRef.current.push(newWeb)

    // Ensure animation loop is running
    if (!animFrameIdRef.current) {
      startAnimation()
    }
  }

  const startAnimation = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      // Clear entire canvas with transform reset
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      const img = webImageRef.current
      const webs = websRef.current

      for (let i = webs.length - 1; i >= 0; i--) {
        const web = webs[i]

        // 1. Expand web outwards quickly and smoothly
        if (web.progress < 1) {
          web.progress = Math.min(1, web.progress + 0.16)
        } else if (web.linger > 0) {
          // 2. Linger firmly on screen
          web.linger--
        } else {
          // 3. Smoothly fade out
          web.alpha -= 0.024
        }

        if (web.alpha <= 0) {
          webs.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = web.alpha

        // A. Draw the authentic dew-covered Spider Web Image
        if (img && (imageLoadedRef.current || img.complete)) {
          ctx.save()
          ctx.translate(web.x, web.y)
          ctx.rotate(web.rotation)

          // Natural elastic scale curve
          const scale = 0.4 + 0.6 * Math.sin((web.progress * Math.PI) / 2)
          const w = web.baseWidth * scale
          const h = web.baseHeight * scale

          // Soft silver-white silk glow
          ctx.shadowColor = 'rgba(255, 255, 255, 0.75)'
          ctx.shadowBlur = 12 * web.alpha

          // Draw the spider web centered exactly at click point
          ctx.drawImage(img, -w / 2, -h / 2, w, h)
          ctx.restore()
        }

        // B. Expanding delicate silk shockwave ripple
        if (web.progress < 1) {
          ctx.beginPath()
          ctx.arc(web.x, web.y, (web.baseWidth / 2) * web.progress * 1.05, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 * (1 - web.progress) * web.alpha})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }

        // C. Flying sparkling dew particles
        for (let p = 0; p < web.particles.length; p++) {
          const pt = web.particles[p]
          pt.x += pt.vx
          pt.y += pt.vy
          pt.vx *= 0.94
          pt.vy *= 0.94
          pt.alpha -= pt.decay

          if (pt.alpha > 0) {
            ctx.beginPath()
            ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(240, 249, 255, ${pt.alpha * web.alpha})`
            ctx.shadowColor = '#ffffff'
            ctx.shadowBlur = 6
            ctx.fill()
          }
        }

        ctx.restore()
      }

      if (webs.length > 0) {
        animFrameIdRef.current = requestAnimationFrame(render)
      } else {
        animFrameIdRef.current = null
      }
    }

    animFrameIdRef.current = requestAnimationFrame(render)
  }

  // Handle global viewport clicks anywhere on the website (excluding buttons)
  useEffect(() => {
    // Check if clicked element or any of its parents is a button or interactive control
    const isButtonOrInteractive = (target: EventTarget | null): boolean => {
      if (!target) return false

      let el: Element | null = null
      if (target instanceof Element) {
        el = target
      } else if (target instanceof Node && target.parentElement) {
        el = target.parentElement
      }

      if (!el) return false

      try {
        const interactiveSelector = [
          'button',
          '[role="button"]',
          'a',
          'input',
          'textarea',
          'select',
          '[role="tab"]',
          '[role="menuitem"]',
          '[role="switch"]',
          '[role="slider"]',
          '[role="checkbox"]',
          '.btn',
          '[data-no-web]',
        ].join(', ')

        if (el.closest && el.closest(interactiveSelector)) {
          return true
        }
      } catch {
        // Fallback for safety across all element types
        let curr: Element | null = el
        while (curr) {
          const tag = curr.tagName.toLowerCase()
          if (
            tag === 'button' ||
            tag === 'a' ||
            tag === 'input' ||
            tag === 'textarea' ||
            tag === 'select' ||
            curr.getAttribute('role') === 'button'
          ) {
            return true
          }
          curr = curr.parentElement
        }
      }

      return false
    }

    const handlePointerDown = (e: MouseEvent | PointerEvent | TouchEvent) => {
      // Do NOT trigger web effect while pressing any button or interactive element!
      if (isButtonOrInteractive(e.target)) {
        return
      }

      let clientX = 0
      let clientY = 0

      if ('clientX' in e && typeof e.clientX === 'number') {
        clientX = e.clientX
        clientY = e.clientY
      } else if ('touches' in e && (e as TouchEvent).touches.length > 0) {
        clientX = (e as TouchEvent).touches[0].clientX
        clientY = (e as TouchEvent).touches[0].clientY
      } else {
        return
      }

      spawnWeb(clientX, clientY)
    }

    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = window.innerWidth * dpr
        canvas.height = window.innerHeight * dpr
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }
      }
    }

    handleResize()
    // capture: true ensures clicks anywhere on any element are captured
    window.addEventListener('pointerdown', handlePointerDown, { capture: true, passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, { capture: true })
      window.removeEventListener('resize', handleResize)
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999999]"
      style={{
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}

export default SpiderWebClickEffect
