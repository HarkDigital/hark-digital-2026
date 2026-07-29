import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { sampleLogoPoints } from '@/lib/particles/logo'
import { adaptiveGap, isCoarsePointer } from './shared'

interface P {
  x: number
  y: number
  vx: number
  vy: number
  hx: number
  hy: number
  accent: boolean
}

/**
 * 04 — VORTEX
 * The mark holds its shape until the cursor arrives — then it becomes
 * a whirlpool, particles streaming around the pointer in glowing trails
 * before settling back into place.
 */
function createScene(): ParticleScene {
  let parts: P[] = []
  let trail: HTMLCanvasElement | null = null
  let tctx: CanvasRenderingContext2D | null = null
  const coarse = isCoarsePointer()

  return {
    async init(w, h) {
      const gap = adaptiveGap(w, h, coarse ? 'medium' : 'dense')
      const pts = await sampleLogoPoints({ width: w, height: h, gap, jitter: gap * 0.3 })
      parts = pts.map(p => ({
        x: p.x,
        y: p.y,
        vx: 0,
        vy: 0,
        hx: p.x,
        hy: p.y,
        accent: Math.random() < 0.08,
      }))
      // device-resolution trail buffer so retina displays stay crisp
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      trail = document.createElement('canvas')
      trail.width = Math.round(w * dpr)
      trail.height = Math.round(h * dpr)
      tctx = trail.getContext('2d')
      tctx?.scale(dpr, dpr)
    },

    frame(ctx, w, h, pointer, dt) {
      if (!trail || !tctx) return

      // fade previous frame → motion trails (dt-scaled so trail length
      // doesn't depend on the display's refresh rate)
      const fade = 1 - Math.pow(1 - 0.16, dt * 60)
      tctx.globalCompositeOperation = 'destination-out'
      tctx.fillStyle = `rgba(0,0,0,${fade.toFixed(4)})`
      tctx.fillRect(0, 0, w, h)
      tctx.globalCompositeOperation = 'source-over'

      const R = Math.min(w, h) * 0.24
      const R2 = R * R
      const damp = Math.exp(-2.8 * dt)

      for (const p of parts) {
        let ax = (p.hx - p.x) * 30
        let ay = (p.hy - p.y) * 30

        if (pointer.inside) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < R2 && d2 > 4) {
            const d = Math.sqrt(d2)
            const fall = 1 - d / R
            // tangential swirl + slight inward pull = whirlpool
            const swirl = 3200 * fall
            ax += (-dy / d) * swirl - (dx / d) * 600 * fall
            ay += (dx / d) * swirl - (dy / d) * 600 * fall
          }
        }

        p.vx = (p.vx + ax * dt) * damp
        p.vy = (p.vy + ay * dt) * damp
        p.x += p.vx * dt
        p.y += p.vy * dt
      }

      // draw onto the trail buffer
      for (const p of parts) {
        const speed = Math.abs(p.vx) + Math.abs(p.vy)
        const heat = Math.min(1, speed / 320)
        tctx.fillStyle = p.accent
          ? `rgba(0,255,133,${0.55 + heat * 0.45})`
          : `rgba(${255 - heat * 200},${255 - heat * 40},${255 - heat * 60},${0.5 + heat * 0.5})`
        const s = 1.4 + heat * 1.2
        tctx.fillRect(p.x - s / 2, p.y - s / 2, s, s)
      }

      ctx.drawImage(trail, 0, 0, w, h)
    },
  }
}

export function LogoVortex({ className, windowPointer }: { className?: string; windowPointer?: boolean }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer={windowPointer}
      ariaLabel="Hark Digital logo swirling around the cursor like a vortex"
    />
  )
}
