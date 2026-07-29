import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { paper, signal } from '@/components/logo/shared'

interface Node {
  x: number
  y: number
  flash: number
}
interface Pulse {
  path: number[] // node index per layer
  layer: number
  t: number // 0..1 along current edge
  speed: number
}

/**
 * AI CONSULTING — a neural network thinking out loud. Pulses travel the
 * layers, lighting nodes as they fire; the cursor excites nearby neurons.
 */
function createScene(): ParticleScene {
  let layers: Node[][] = []
  let pulses: Pulse[] = []

  const randomPath = () => layers.map(l => Math.floor(Math.random() * l.length))

  return {
    init(w, h) {
      const counts = [4, 7, 7, 5, 3]
      const mx = w * 0.12
      layers = counts.map((n, li) => {
        const x = mx + ((w - mx * 2) / (counts.length - 1)) * li
        return Array.from({ length: n }, (_, i) => ({
          x,
          y: (h / (n + 1)) * (i + 1),
          flash: 0,
        }))
      })
      pulses = Array.from({ length: 9 }, () => ({
        path: randomPath(),
        layer: Math.floor(Math.random() * (counts.length - 1)),
        t: Math.random(),
        speed: 0.5 + Math.random() * 0.9,
      }))
    },

    frame(ctx, _w, _h, pointer, dt, time) {
      // edges
      ctx.lineWidth = 0.6
      for (let li = 0; li < layers.length - 1; li++) {
        for (const a of layers[li]) {
          for (const b of layers[li + 1]) {
            let alpha = 0.08
            if (pointer.inside) {
              const mx = (a.x + b.x) / 2
              const my = (a.y + b.y) / 2
              const d2 = (mx - pointer.x) ** 2 + (my - pointer.y) ** 2
              if (d2 < 160 * 160) alpha += (1 - Math.sqrt(d2) / 160) * 0.18
            }
            ctx.strokeStyle = paper(alpha)
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // pulses
      for (const p of pulses) {
        const a = layers[p.layer][p.path[p.layer]]
        const b = layers[p.layer + 1][p.path[p.layer + 1]]
        let boost = 1
        if (pointer.inside) {
          const px = a.x + (b.x - a.x) * p.t
          const py = a.y + (b.y - a.y) * p.t
          const d2 = (px - pointer.x) ** 2 + (py - pointer.y) ** 2
          if (d2 < 140 * 140) boost = 2.2
        }
        p.t += p.speed * boost * dt
        if (p.t >= 1) {
          b.flash = 1
          p.t = 0
          p.layer++
          if (p.layer >= layers.length - 1) {
            p.layer = 0
            p.path = randomPath()
            layers[0][p.path[0]].flash = 1
          }
        }
        const px = a.x + (b.x - a.x) * p.t
        const py = a.y + (b.y - a.y) * p.t
        // edge segment behind the pulse
        ctx.strokeStyle = signal(0.35)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(a.x + (b.x - a.x) * Math.max(0, p.t - 0.18), a.y + (b.y - a.y) * Math.max(0, p.t - 0.18))
        ctx.lineTo(px, py)
        ctx.stroke()
        ctx.fillStyle = signal(0.95)
        ctx.beginPath()
        ctx.arc(px, py, 2.4, 0, Math.PI * 2)
        ctx.fill()
      }

      // nodes
      for (const layer of layers) {
        for (const n of layer) {
          const breathe = 0.36 + Math.sin(time * 1.4 + n.x * 0.02 + n.y * 0.03) * 0.06
          const a = breathe + n.flash * 0.7
          ctx.fillStyle = n.flash > 0.4 ? signal(Math.min(1, a)) : paper(Math.min(1, a))
          ctx.beginPath()
          ctx.arc(n.x, n.y, 3.4 + n.flash * 2.2, 0, Math.PI * 2)
          ctx.fill()
          if (n.flash > 0.55) {
            ctx.strokeStyle = signal((n.flash - 0.55) * 0.8)
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(n.x, n.y, 7 + (1 - n.flash) * 18, 0, Math.PI * 2)
            ctx.stroke()
          }
          n.flash = Math.max(0, n.flash - dt * 1.6)
        }
      }
    },
  }
}

export function SceneNeural({ className }: { className?: string }) {
  return <ParticleCanvas createScene={createScene} className={className} windowPointer ariaLabel="A neural network with pulses firing between neurons" />
}
