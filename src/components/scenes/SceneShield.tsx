import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { paper, signal, volt } from '@/components/logo/shared'

const danger = (a: number) => `rgba(255, 255, 255, ${a})`

interface Threat {
  x: number
  y: number
  vx: number
  vy: number
  state: 'incoming' | 'deflected'
  life: number
}
interface Spark {
  x: number
  y: number
  age: number
}

/**
 * SECURITY — a shielded core. Threats streak in from the edges and
 * bounce off the perimeter in a flash. Move the cursor to launch your own.
 */
function createScene(): ParticleScene {
  let threats: Threat[] = []
  let sparks: Spark[] = []
  let spawnAcc = 0
  let lastPointerSpawn = 0

  const spawn = (w: number, h: number, cx: number, cy: number, fromX?: number, fromY?: number) => {
    const edge = Math.floor(Math.random() * 4)
    const x = fromX ?? (edge === 0 ? -10 : edge === 1 ? w + 10 : Math.random() * w)
    const y = fromY ?? (edge === 2 ? -10 : edge === 3 ? h + 10 : Math.random() * h)
    const d = Math.hypot(cx - x, cy - y) || 1
    const speed = 90 + Math.random() * 110
    threats.push({
      x,
      y,
      vx: ((cx - x) / d) * speed,
      vy: ((cy - y) / d) * speed,
      state: 'incoming',
      life: 1,
    })
  }

  return {
    init(w, h) {
      threats = []
      sparks = []
      for (let i = 0; i < 5; i++) spawn(w, h, w / 2, h / 2)
    },

    frame(ctx, w, h, pointer, dt, t) {
      const cx = w / 2
      const cy = h / 2
      const Rs = Math.min(w, h) * 0.21

      spawnAcc += dt
      if (spawnAcc > 0.7 && threats.length < 26) {
        spawnAcc = 0
        spawn(w, h, cx, cy)
      }
      if (pointer.inside && t - lastPointerSpawn > 0.5) {
        const d = Math.hypot(pointer.x - cx, pointer.y - cy)
        if (d > Rs * 1.6) {
          spawn(w, h, cx, cy, pointer.x, pointer.y)
          lastPointerSpawn = t
        }
      }

      // orbiting shield arcs (two counter-rotating rings)
      for (const [r, dir, n] of [
        [Rs, 1, 5],
        [Rs * 1.18, -1, 3],
      ] as const) {
        for (let i = 0; i < n; i++) {
          const a0 = ((Math.PI * 2) / n) * i + t * 0.7 * dir
          ctx.strokeStyle = volt(0.6)
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(cx, cy, r, a0, a0 + (Math.PI * 2) / n - 0.5)
          ctx.stroke()
        }
      }

      // core: the Hark diamond
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(Math.PI / 4)
      const pulse = 9 + Math.sin(t * 2.2) * 1.5
      ctx.fillStyle = signal(0.9)
      ctx.fillRect(-pulse / 2, -pulse / 2, pulse, pulse)
      ctx.restore()

      // threats
      threats = threats.filter(th => th.life > 0)
      for (const th of threats) {
        th.x += th.vx * dt
        th.y += th.vy * dt
        if (th.state === 'incoming') {
          const d = Math.hypot(th.x - cx, th.y - cy)
          if (d <= Rs) {
            // deflect: reflect velocity off the circle normal
            const nx = (th.x - cx) / d
            const ny = (th.y - cy) / d
            const dot = th.vx * nx + th.vy * ny
            th.vx = (th.vx - 2 * dot * nx) * 0.75
            th.vy = (th.vy - 2 * dot * ny) * 0.75
            th.state = 'deflected'
            sparks.push({ x: th.x, y: th.y, age: 0 })
          }
        } else {
          th.life -= dt * 0.8
        }
        const color = th.state === 'incoming' ? danger : paper
        const a = th.state === 'incoming' ? 0.85 : th.life * 0.5
        // streak
        ctx.strokeStyle = color(a)
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(th.x - th.vx * 0.09, th.y - th.vy * 0.09)
        ctx.lineTo(th.x, th.y)
        ctx.stroke()
      }

      // impact sparks
      sparks = sparks.filter(s => s.age < 0.6)
      for (const s of sparks) {
        s.age += dt
        const p = s.age / 0.6
        ctx.strokeStyle = signal((1 - p) * 0.9)
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(s.x, s.y, 2 + p * 24, 0, Math.PI * 2)
        ctx.stroke()
      }
    },
  }
}

export function SceneShield({ className }: { className?: string }) {
  return <ParticleCanvas createScene={createScene} className={className} windowPointer ariaLabel="A shield deflecting incoming threats" />
}
