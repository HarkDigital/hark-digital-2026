import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { paper, signal } from '@/components/logo/shared'

interface Dot {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  accent: boolean
}

const LINK_DIST = 120
const REPEL_R = 150

/**
 * HACK REMEDIATION — a particles.js-style network. Calm dots drift and
 * link up; the cursor pushes them away, an intruder the swarm keeps its
 * distance from. Breathe.
 */
function createScene(): ParticleScene {
  let dots: Dot[] = []

  return {
    init(w, h) {
      const count = Math.min(110, Math.max(50, Math.round((w * h) / 16000)))
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 36,
        vy: (Math.random() - 0.5) * 36,
        r: 1.4 + Math.random() * 1.3,
        accent: Math.random() < 0.14,
      }))
    },

    frame(ctx, w, h, pointer, dt) {
      for (const d of dots) {
        d.x += d.vx * dt
        d.y += d.vy * dt

        // the cursor repels; drift velocity stays untouched so the
        // swarm settles back once the pointer moves on
        if (pointer.inside) {
          const dx = d.x - pointer.x
          const dy = d.y - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist < REPEL_R && dist > 0.001) {
            const f = ((REPEL_R - dist) / REPEL_R) * 260
            d.x += (dx / dist) * f * dt
            d.y += (dy / dist) * f * dt
          }
        }

        // bounce at the edges
        if (d.x < 0) (d.x = 0), (d.vx = Math.abs(d.vx))
        if (d.x > w) (d.x = w), (d.vx = -Math.abs(d.vx))
        if (d.y < 0) (d.y = 0), (d.vy = Math.abs(d.vy))
        if (d.y > h) (d.y = h), (d.vy = -Math.abs(d.vy))
      }

      // links between close neighbors
      ctx.lineWidth = 1
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i]
          const b = dots[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = dx * dx + dy * dy
          if (dist < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(dist) / LINK_DIST) * 0.22
            ctx.strokeStyle = a.accent || b.accent ? signal(alpha * 1.4) : paper(alpha)
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const d of dots) {
        ctx.fillStyle = d.accent ? signal(0.85) : paper(0.55)
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }
    },
  }
}

export function SceneNetwork({ className }: { className?: string }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer
      ariaLabel="A calm network of drifting connected particles that scatter away from the cursor"
    />
  )
}
