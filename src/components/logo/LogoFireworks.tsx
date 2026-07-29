import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { sampleLogoPoints, type LogoPoint } from '@/lib/particles/logo'
import { adaptiveGap, paper, pink, signal, volt } from './shared'

// Adapted from Backgrounds/Fireworks.tsx — same rocket + radial-burst
// physics, but each explosion's sparks settle into the mark, so the
// logo is literally built out of fireworks.

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  decay: number
  hue: number // 0 paper, 1 signal, 2 volt, 3 pink
  target: number // index into logo points, -1 = free spark
  age: number
}

interface Rocket {
  x: number
  y: number
  vy: number
  targetY: number
}

interface Lock {
  p: number // logo point index
  alpha: number
  life: number
}

const HUES = [paper, signal, volt, pink]

/**
 * 08 — FIREWORKS
 * Every burst throws sparks that settle into the mark. Click anywhere
 * to launch your own rocket. The logo is built from celebrations.
 */
function createScene(): ParticleScene {
  let points: LogoPoint[] = []
  let occupied: Uint8Array = new Uint8Array(0)
  let sparks: Spark[] = []
  let rockets: Rocket[] = []
  let locks: Lock[] = []
  let launchAcc = 0
  let wasDown = false

  const explode = (x: number, y: number) => {
    const hue = 1 + ((Math.random() * 3) | 0)
    // claim unoccupied logo points for this burst to fill in
    const free: number[] = []
    for (let i = 0; i < points.length; i++) if (!occupied[i]) free.push(i)
    const claim = Math.min(free.length, 60 + ((Math.random() * 40) | 0))
    for (let n = 0; n < claim; n++) {
      const pick = (Math.random() * free.length) | 0
      const idx = free.splice(pick, 1)[0]
      occupied[idx] = 1
      const angle = Math.random() * Math.PI * 2
      const speed = 60 + Math.random() * 260
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0,
        hue,
        target: idx,
        age: 0,
      })
    }
    // plus free-flying sparks that just decay (straight from Fireworks.tsx)
    for (let n = 0; n < 46; n++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 90 + Math.random() * 330
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.5 + Math.random() * 0.7,
        hue: Math.random() < 0.4 ? 0 : hue,
        target: -1,
        age: 0,
      })
    }
  }

  return {
    async init(w, h) {
      const gap = adaptiveGap(w, h, 'medium')
      points = await sampleLogoPoints({ width: w, height: h, gap, jitter: gap * 0.25 })
      occupied = new Uint8Array(points.length)
      sparks = []
      rockets = []
      locks = []
    },

    frame(ctx, w, h, pointer, dt) {
      // auto-launch cadence + click-to-launch
      launchAcc += dt
      if (launchAcc > 1.05 && rockets.length < 4) {
        launchAcc = 0
        rockets.push({
          x: w * (0.2 + Math.random() * 0.6),
          y: h + 10,
          vy: -(h * 0.55 + Math.random() * h * 0.2),
          targetY: h * (0.25 + Math.random() * 0.3),
        })
      }
      if (pointer.down && !wasDown && pointer.inside) {
        rockets.push({ x: pointer.x, y: h + 10, vy: -(h * 0.75), targetY: pointer.y })
      }
      wasDown = pointer.down

      // rockets rise with a sparkle trail
      rockets = rockets.filter(r => r.y > r.targetY)
      for (const r of rockets) {
        r.y += r.vy * dt
        r.vy *= Math.exp(-0.4 * dt)
        ctx.fillStyle = paper(0.8)
        ctx.fillRect(r.x - 1, r.y, 2, 6)
        if (Math.random() < 0.6) {
          sparks.push({
            x: r.x + (Math.random() - 0.5) * 3,
            y: r.y + 6,
            vx: (Math.random() - 0.5) * 20,
            vy: 30 + Math.random() * 40,
            alpha: 0.6,
            decay: 1.6,
            hue: 0,
            target: -1,
            age: 0,
          })
        }
        if (r.y <= r.targetY + 4) explode(r.x, r.y)
      }

      // sparks fly, then homing sparks steer into the mark
      sparks = sparks.filter(s => s.alpha > 0.02)
      for (const s of sparks) {
        s.age += dt
        if (s.target >= 0 && s.age > 0.45) {
          const t = points[s.target]
          const dx = t.x - s.x
          const dy = t.y - s.y
          const d2 = dx * dx + dy * dy
          if (d2 < 16) {
            locks.push({ p: s.target, alpha: 0, life: 16 + Math.random() * 8 })
            s.alpha = 0
            continue
          }
          s.vx += dx * 14 * dt
          s.vy += dy * 14 * dt
          s.vx *= Math.exp(-3.2 * dt)
          s.vy *= Math.exp(-3.2 * dt)
        } else {
          s.vy += 150 * dt // gravity, as in the original
          s.vx *= Math.exp(-0.7 * dt)
          s.alpha -= s.decay * dt
        }
        s.x += s.vx * dt
        s.y += s.vy * dt
        ctx.fillStyle = HUES[s.hue](Math.max(0, Math.min(1, s.alpha)))
        ctx.fillRect(s.x - 1.2, s.y - 1.2, 2.4, 2.4)
      }

      // the mark, accumulating and slowly releasing
      for (let i = locks.length - 1; i >= 0; i--) {
        const l = locks[i]
        l.life -= dt
        l.alpha = l.life < 1 ? Math.max(0, l.life) : Math.min(1, l.alpha + dt * 2.5)
        if (l.life <= 0) {
          occupied[l.p] = 0
          locks.splice(i, 1)
          continue
        }
        const t = points[l.p]
        ctx.fillStyle = paper(l.alpha * 0.85)
        ctx.fillRect(t.x - 1, t.y - 1, 2, 2)
      }
    },
  }
}

export function LogoFireworks({ className, windowPointer }: { className?: string; windowPointer?: boolean }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer={windowPointer}
      ariaLabel="Fireworks whose sparks assemble into the Hark Digital logo"
    />
  )
}
