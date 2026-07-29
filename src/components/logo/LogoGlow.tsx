import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { createGlowSprite, sampleLogoPoints, type LogoPoint } from '@/lib/particles/logo'
import { adaptiveGap, isCoarsePointer, paper } from './shared'

interface P extends LogoPoint {
  phase: number
  speed: number
}

/**
 * 02 — EMBER
 * The mark sleeps in the dark; wherever the cursor travels it catches
 * light, embers flaring and breathing along the edges. The closest
 * recreation of the old Unicorn.Studio glow — no library required.
 */
function createScene(): ParticleScene {
  let parts: P[] = []
  let spriteWhite: HTMLCanvasElement
  let spriteSignal: HTMLCanvasElement
  const coarse = isCoarsePointer()
  // smoothed light position (lags behind the pointer like a torch)
  let lx = -9999
  let ly = -9999

  return {
    async init(w, h) {
      const gap = adaptiveGap(w, h, coarse ? 'medium' : 'dense')
      const pts = await sampleLogoPoints({ width: w, height: h, gap, jitter: gap * 0.25 })
      parts = pts.map(p => ({
        ...p,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.6,
      }))
      spriteWhite = createGlowSprite('rgba(255,255,255,0.85)', 24)
      spriteSignal = createGlowSprite('rgba(0,255,133,0.9)', 24)
      lx = w / 2
      ly = h / 2
    },

    frame(ctx, w, h, pointer, dt, t) {
      // torch position: follow pointer, otherwise wander on a lissajous orbit
      let targetX: number
      let targetY: number
      if (pointer.inside) {
        targetX = pointer.x
        targetY = pointer.y
      } else {
        targetX = w / 2 + Math.cos(t * 0.5) * w * 0.22
        targetY = h / 2 + Math.sin(t * 0.34) * h * 0.24
      }
      const ease = 1 - Math.exp(-4.5 * dt)
      lx += (targetX - lx) * ease
      ly += (targetY - ly) * ease

      const R = Math.min(w, h) * 0.24
      const R2 = R * R

      // base: cold, barely-there mark with slow shimmer
      ctx.fillStyle = paper(1)
      for (const p of parts) {
        const shimmer = 0.055 + 0.035 * Math.sin(t * p.speed + p.phase)
        ctx.globalAlpha = shimmer
        ctx.fillRect(p.x - 0.75, p.y - 0.75, 1.5, 1.5)
      }

      // embers: additive glow near the torch
      ctx.globalCompositeOperation = 'lighter'
      for (const p of parts) {
        const dx = p.x - lx
        const dy = p.y - ly
        const d2 = dx * dx + dy * dy
        if (d2 >= R2) continue
        const fall = 1 - Math.sqrt(d2) / R
        const flare = fall * fall * (0.55 + 0.45 * Math.sin(t * p.speed * 2.4 + p.phase))
        if (flare <= 0.01) continue
        const hot = fall > 0.72
        const sprite = hot ? spriteSignal : spriteWhite
        const s = 5 + 15 * flare
        ctx.globalAlpha = Math.min(1, flare)
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s)
      }
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
    },
  }
}

export function LogoGlow({ className, windowPointer }: { className?: string; windowPointer?: boolean }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer={windowPointer}
      ariaLabel="Hark Digital logo glowing where the cursor passes"
    />
  )
}
