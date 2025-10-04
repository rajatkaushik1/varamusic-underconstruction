// src/components/LotusHeroBackground.jsx
import { useEffect, useRef, useMemo } from 'react'
import '../styles/lotus-hero.css'

export default function LotusHeroBackground({ durationMs = 3000, onIntroComplete, skipIntro = false }) {
  const starFieldRef = useRef(null)
  const particlesRef = useRef(null)
  const completedRef = useRef(false)
  const timers = useMemo(() => ({ timeouts: [], intervals: [] }), [])

  useEffect(() => {
    const starField = starFieldRef.current
    const particlesEl = particlesRef.current
    if (!starField) return

    const clearTimers = () => {
      timers.intervals.forEach(clearInterval)
      timers.timeouts.forEach(clearTimeout)
      timers.intervals.length = 0
      timers.timeouts.length = 0
    }

    const createStar = (delay = 0) => {
      const to = setTimeout(() => {
        const star = document.createElement('div')
        star.className = 'star'
        const x = Math.random() * 100       // 0–100vw
        const speed = 3 + Math.random() * 4 // 3–7s
        const size = 1 + Math.random() * 2  // 1–3px
        star.style.left = `${x}vw`
        star.style.top = `100vh`
        star.style.width = `${size}px`
        star.style.height = `${size}px`
        star.style.animation = `vara-starMove ${speed}s linear forwards`
        starField.appendChild(star)
        const t2 = setTimeout(() => star.remove(), speed * 1000 + 60)
        timers.timeouts.push(t2)
      }, delay)
      timers.timeouts.push(to)
    }

    // start starfield
    for (let i = 0; i < 50; i++) createStar(i * 200)
    const inter = setInterval(() => createStar(), 320)
    timers.intervals.push(inter)

    // intro particles
    if (!skipIntro && particlesEl) {
      for (let i = 0; i < 14; i++) {
        const p = document.createElement('div')
        p.className = 'particle'
        const angle = (Math.PI * 2 * i) / 14
        const distance = 100 + Math.random() * 150
        p.style.left = `50vw`
        p.style.top = `60vh`
        p.style.setProperty('--dx', `${Math.cos(angle) * distance}px`)
        p.style.setProperty('--dy', `${Math.sin(angle) * distance}px`)
        p.style.animation = `vara-particleFloat 2s ease-out ${480 + i * 50}ms forwards`
        particlesEl.appendChild(p)
      }
    }

    const done = (skipped) => {
      if (completedRef.current) return
      completedRef.current = true
      try { onIntroComplete && onIntroComplete() } catch {}
      try {
        window.dispatchEvent(new CustomEvent('vara:hero-intro-complete', {
          detail: { durationMs, skipped }
        }))
      } catch {}
    }

    timers.timeouts.push(setTimeout(() => done(!!skipIntro), skipIntro ? 0 : durationMs))

    return () => {
      clearTimers()
      if (starField) while (starField.firstChild) starField.removeChild(starField.firstChild)
      if (particlesEl) while (particlesEl.firstChild) particlesEl.removeChild(particlesEl.firstChild)
    }
  }, [durationMs, onIntroComplete, skipIntro, timers])

  return (
    <div className="vara-hero-bg" aria-hidden="true">
      <div ref={starFieldRef} className="star-field" />
      <div className="bg-glow" />
      {!skipIntro && <div className="lotus-center" />}
      <div ref={particlesRef} className="particles" />
      <div className="vignette" />
    </div>
  )
}