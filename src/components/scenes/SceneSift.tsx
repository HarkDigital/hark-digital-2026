import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { paper, signal } from '@/components/logo/shared'

interface Mote {
  x: number
  y: number
  vx: number
  seed: number
  keep: boolean
  decided: boolean
  lane: number
  alpha: number
}
interface Spark {
  x: number
  y: number
  age: number
}

const LANES = 4

/**
 * AI CONSULTING — the sieve. A torrent of hype flows in from the left;
 * the filter lets only the genuinely useful through, and it leaves as
 * clean, ordered signal. Drag the cursor to move the filter.
 */
function createScene(): ParticleScene {
  let motes: Mote[] = []
  let sparks: Spark[] = []
  let sieveX = 0

  const respawn = (m: Mote, w: number, h: number, initial = false) => {
    m.x = initial ? Math.random() * w : -10 - Math.random() * w * 0.15
    m.y = h * 0.12 + Math.random() * h * 0.76
    m.vx = 50 + Math.random() * 70
    m.seed = Math.random() * Math.PI * 2
    m.keep = Math.random() < 0.24
    m.decided = initial && m.x >= sieveX ? true : false
    m.lane = Math.floor(Math.random() * LANES)
    m.alpha = 1
  }

  const laneY = (h: number, i: number) => h * 0.38 + (i / (LANES - 1)) * h * 0.24

  return {
    init(w, h) {
      sieveX = w * 0.5
      sparks = []
      motes = Array.from({ length: 90 }, () => {
        const m = {} as Mote
        respawn(m, w, h, true)
        return m
      })
    },

    frame(ctx, w, h, pointer, dt, t) {
      // the filter follows the cursor, lazily
      const targetX = pointer.inside ? Math.min(Math.max(pointer.x, w * 0.3), w * 0.72) : w * 0.5
      sieveX += (targetX - sieveX) * Math.min(1, dt * 3)

      // lane guides, only downstream of the filter
      ctx.lineWidth = 1
      for (let i = 0; i < LANES; i++) {
        ctx.strokeStyle = signal(0.09)
        ctx.beginPath()
        ctx.moveTo(sieveX, laneY(h, i))
        ctx.lineTo(w, laneY(h, i))
        ctx.stroke()
      }

      for (const m of motes) {
        if (!m.decided && m.x >= sieveX) {
          m.decided = true
          if (m.keep) sparks.push({ x: sieveX, y: m.y, age: 0 })
        }

        if (!m.decided) {
          // upstream: noisy drift
          m.x += m.vx * dt
          m.y += Math.sin(m.seed + t * 2.2) * 14 * dt
        } else if (m.keep) {
          // downstream signal: faster, snapping into its lane
          m.x += m.vx * 1.9 * dt
          m.y += (laneY(h, m.lane) - m.y) * Math.min(1, dt * 5)
        } else {
          // filtered out: sink and fade
          m.x += m.vx * 0.4 * dt
          m.y += 26 * dt
          m.alpha -= dt * 1.1
        }
        if (m.x > w + 20 || m.alpha <= 0) respawn(m, w, h)

        if (m.decided && m.keep) {
          ctx.strokeStyle = signal(0.85)
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(m.x - 14, m.y)
          ctx.lineTo(m.x, m.y)
          ctx.stroke()
        } else {
          ctx.fillStyle = paper((m.decided ? 0.22 : 0.34) * m.alpha)
          ctx.beginPath()
          ctx.arc(m.x, m.y, 1.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // the filter itself: a hairline with the brand diamond at center
      ctx.strokeStyle = paper(0.2)
      ctx.lineWidth = 1
      ctx.setLineDash([3, 7])
      ctx.beginPath()
      ctx.moveTo(sieveX, h * 0.08)
      ctx.lineTo(sieveX, h * 0.92)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.save()
      ctx.translate(sieveX, h / 2)
      ctx.rotate(Math.PI / 4)
      const s = 10 + Math.sin(t * 2.4) * 2
      ctx.fillStyle = signal(0.9)
      ctx.fillRect(-s / 2, -s / 2, s, s)
      ctx.restore()

      // pass-through sparks
      sparks = sparks.filter(sp => sp.age < 0.5)
      for (const sp of sparks) {
        sp.age += dt
        const q = sp.age / 0.5
        ctx.strokeStyle = signal((1 - q) * 0.7)
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, 2 + q * 14, 0, Math.PI * 2)
        ctx.stroke()
      }
    },
  }
}

export function SceneSift({ className }: { className?: string }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer
      ariaLabel="Noisy particles passing through a filter, with only the useful few emerging as clean signal lines"
    />
  )
}
