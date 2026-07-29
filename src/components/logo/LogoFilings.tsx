import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { sampleLogoPoints } from '@/lib/particles/logo'
import { adaptiveGap, paper, signal } from './shared'

interface F {
  x: number
  y: number
  angle: number
  targetAngle: number
  len: number
  phase: number
}

/**
 * 05 — MAGNETIC FILINGS
 * The mark rendered as thousands of iron filings. The cursor is a magnet:
 * filings pivot to face it, and the field near the pointer splits into
 * a chromatic double-image, like a lens passing over the logo.
 */
function createScene(): ParticleScene {
  let filings: F[] = []

  return {
    async init(w, h) {
      const gap = adaptiveGap(w, h, 'medium')
      const pts = await sampleLogoPoints({ width: w, height: h, gap, jitter: gap * 0.3 })
      const cx = w / 2
      const cy = h / 2
      filings = pts.map(p => ({
        x: p.x,
        y: p.y,
        // at rest, filings follow a gentle spiral field around the center
        angle: Math.atan2(p.y - cy, p.x - cx) + Math.PI / 2,
        targetAngle: 0,
        len: gap * (0.75 + Math.random() * 0.5),
        phase: Math.random() * Math.PI * 2,
      }))
    },

    frame(ctx, w, h, pointer, dt, t) {
      const cx = w / 2
      const cy = h / 2
      const R = Math.min(w, h) * 0.3
      const R2 = R * R
      const turn = 1 - Math.exp(-8 * dt)

      ctx.lineCap = 'round'

      for (const f of filings) {
        let influence = 0
        if (pointer.inside) {
          const dx = pointer.x - f.x
          const dy = pointer.y - f.y
          const d2 = dx * dx + dy * dy
          if (d2 < R2) {
            influence = 1 - Math.sqrt(d2) / R
            f.targetAngle = Math.atan2(dy, dx)
          }
        }
        if (influence === 0) {
          // relax back to the ambient spiral field, with a slow breathing wobble
          f.targetAngle = Math.atan2(f.y - cy, f.x - cx) + Math.PI / 2 + Math.sin(t * 0.8 + f.phase) * 0.22
        }

        // shortest-path angular ease
        let diff = f.targetAngle - f.angle
        while (diff > Math.PI) diff -= Math.PI * 2
        while (diff < -Math.PI) diff += Math.PI * 2
        f.angle += diff * turn

        const half = f.len / 2
        const ca = Math.cos(f.angle) * half
        const sa = Math.sin(f.angle) * half

        if (influence > 0.04) {
          // chromatic split near the magnet
          const off = influence * 2.2
          ctx.strokeStyle = signal(0.25 + influence * 0.75)
          ctx.lineWidth = 1.1
          ctx.beginPath()
          ctx.moveTo(f.x - ca + off, f.y - sa)
          ctx.lineTo(f.x + ca + off, f.y + sa)
          ctx.stroke()
        }
        ctx.strokeStyle = paper(0.28 + influence * 0.6)
        ctx.lineWidth = 1.1
        ctx.beginPath()
        ctx.moveTo(f.x - ca, f.y - sa)
        ctx.lineTo(f.x + ca, f.y + sa)
        ctx.stroke()
      }
    },
  }
}

export function LogoFilings({ className, windowPointer }: { className?: string; windowPointer?: boolean }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer={windowPointer}
      ariaLabel="Hark Digital logo rendered as magnetic filings that follow the cursor"
    />
  )
}
