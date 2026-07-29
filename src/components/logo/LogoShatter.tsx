import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { sampleLogoPoints } from '@/lib/particles/logo'
import { adaptiveGap, isCoarsePointer, paper, signal } from './shared'

interface P {
  hx: number
  hy: number
  x: number
  y: number
  vx: number
  vy: number
  state: 'set' | 'falling' | 'healing'
  respawnAt: number
  alpha: number
  accent: boolean
}

/**
 * 06 — ERODE & HEAL
 * The mark stands solid until the cursor sandblasts it — grains break
 * loose, tumble with gravity, and the wound quietly heals behind you.
 * Click for a demolition charge.
 */
function createScene(): ParticleScene {
  let parts: P[] = []
  const coarse = isCoarsePointer()
  let wasDown = false

  return {
    async init(w, h) {
      const gap = adaptiveGap(w, h, coarse ? 'medium' : 'dense')
      const pts = await sampleLogoPoints({ width: w, height: h, gap, jitter: gap * 0.2 })
      parts = pts.map(p => ({
        hx: p.x,
        hy: p.y,
        x: p.x,
        y: p.y,
        vx: 0,
        vy: 0,
        state: 'set' as const,
        respawnAt: 0,
        alpha: 1,
        accent: Math.random() < 0.05,
      }))
    },

    frame(ctx, _w, h, pointer, dt, t) {
      const eroderR = 65
      const eroderR2 = eroderR * eroderR
      const blast = pointer.down && !wasDown
      wasDown = pointer.down

      for (const p of parts) {
        if (p.state === 'set') {
          if (pointer.inside) {
            const dx = p.x - pointer.x
            const dy = p.y - pointer.y
            const d2 = dx * dx + dy * dy
            const r = blast ? 200 : eroderR
            if (d2 < (blast ? r * r : eroderR2)) {
              const d = Math.sqrt(d2) || 1
              const power = blast ? 620 : 260
              p.state = 'falling'
              p.vx = (dx / d) * power * (0.4 + Math.random())
              p.vy = (dy / d) * power * (0.4 + Math.random()) - 60
              p.respawnAt = t + 1.6 + Math.random() * 2
            }
          }
        } else if (p.state === 'falling') {
          p.vy += 900 * dt // gravity
          p.vx *= Math.exp(-0.6 * dt)
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.alpha = Math.max(0, p.alpha - dt * 0.9)
          if ((t > p.respawnAt || p.y > h + 20) && p.alpha <= 0.02) {
            p.state = 'healing'
            p.x = p.hx
            p.y = p.hy
            p.vx = 0
            p.vy = 0
          }
        } else {
          // healing: fade back in at home
          p.alpha = Math.min(1, p.alpha + dt * 1.4)
          if (p.alpha >= 1) p.state = 'set'
        }
      }

      for (const p of parts) {
        if (p.alpha <= 0.02) continue
        const falling = p.state === 'falling'
        ctx.fillStyle = p.accent || falling ? signal(p.alpha * 0.9) : paper(p.alpha * 0.85)
        const s = falling ? 2 : 1.7
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s)
      }
    },
  }
}

export function LogoShatter({ className, windowPointer }: { className?: string; windowPointer?: boolean }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer={windowPointer}
      ariaLabel="Hark Digital logo eroding under the cursor and healing itself"
    />
  )
}
