import { ParticleCanvas, type ParticleScene, type PointerState } from '@/lib/particles/useParticleCanvas'
import { sampleLogoPoints } from '@/lib/particles/logo'
import { adaptiveGap, isCoarsePointer, paper, signal, volt } from './shared'

interface P {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  size: number
  accent: boolean
  volt: boolean
  alpha: number
}

/**
 * 01 — ASSEMBLE
 * Particles fly in from the void and lock into the mark.
 * The cursor pushes them aside; release and they snap home.
 * Click to detonate and watch it rebuild.
 */
function createScene(): ParticleScene {
  let parts: P[] = []
  const coarse = isCoarsePointer()
  let wasDown = false

  return {
    async init(w, h) {
      const gap = adaptiveGap(w, h, coarse ? 'medium' : 'dense')
      const pts = await sampleLogoPoints({ width: w, height: h, gap, jitter: gap * 0.4 })
      parts = pts.map(p => {
        const angle = Math.random() * Math.PI * 2
        const dist = Math.max(w, h) * (0.6 + Math.random() * 0.6)
        return {
          x: w / 2 + Math.cos(angle) * dist,
          y: h / 2 + Math.sin(angle) * dist,
          vx: 0,
          vy: 0,
          tx: p.x,
          ty: p.y,
          size: 0.8 + Math.random() * 1.4,
          accent: Math.random() < 0.07,
          volt: Math.random() < 0.5,
          alpha: 0.35 + Math.random() * 0.6,
        }
      })
    },

    frame(ctx, _w, _h, pointer: PointerState, dt) {
      const repelR = 95
      const repelR2 = repelR * repelR

      if (pointer.down && !wasDown) {
        // detonate outward from the click
        for (const p of parts) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d = Math.sqrt(dx * dx + dy * dy) || 1
          const boost = Math.max(0, 1 - d / 500)
          p.vx += (dx / d) * 900 * boost + (Math.random() - 0.5) * 160
          p.vy += (dy / d) * 900 * boost + (Math.random() - 0.5) * 160
        }
      }
      wasDown = pointer.down

      const k = 46 // spring stiffness
      const damp = Math.exp(-6.5 * dt)

      for (const p of parts) {
        let ax = (p.tx - p.x) * k
        let ay = (p.ty - p.y) * k

        if (pointer.inside) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < repelR2) {
            const d = Math.sqrt(d2) || 1
            const f = ((repelR - d) / repelR) * 2600
            ax += (dx / d) * f
            ay += (dy / d) * f
          }
        }

        p.vx = (p.vx + ax * dt) * damp
        p.vy = (p.vy + ay * dt) * damp
        p.x += p.vx * dt
        p.y += p.vy * dt
      }

      // draw — batched by color for speed
      ctx.fillStyle = paper(0.9)
      for (const p of parts) {
        if (p.accent) continue
        ctx.globalAlpha = p.alpha
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
      for (const p of parts) {
        if (!p.accent) continue
        ctx.fillStyle = p.volt ? volt(0.95) : signal(0.95)
        ctx.globalAlpha = p.alpha
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
      ctx.globalAlpha = 1
    },
  }
}

export function LogoAssemble({ className, windowPointer }: { className?: string; windowPointer?: boolean }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer={windowPointer}
      ariaLabel="Hark Digital logo assembled from particles"
    />
  )
}
