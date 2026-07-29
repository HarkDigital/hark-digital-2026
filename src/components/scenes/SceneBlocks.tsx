import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { paper, signal } from '@/components/logo/shared'

interface Block {
  sx: number
  sy: number
  w: number
  h: number
  x: number
  y: number
  vx: number
  vy: number
  state: 'flying' | 'set' | 'loose'
  age: number
}
interface Pulse {
  x: number
  y: number
  w: number
  h: number
  age: number
}

/**
 * WORDPRESS — content blocks assembling into a page. Every so often one
 * pops loose and gets snapped back into place. Move the cursor to
 * shove blocks around; they always find their way home.
 */
function createScene(): ParticleScene {
  let blocks: Block[] = []
  let pulses: Pulse[] = []
  let popAcc = 0

  const fling = (b: Block, w: number, h: number) => {
    // respawn just outside a random edge, flying back to its slot
    const edge = Math.floor(Math.random() * 4)
    b.x = edge === 0 ? -b.w - 20 : edge === 1 ? w + 20 : Math.random() * w
    b.y = edge === 2 ? -b.h - 20 : edge === 3 ? h + 20 : Math.random() * h
    b.vx = 0
    b.vy = 0
    b.state = 'flying'
    b.age = 0
  }

  return {
    init(w, h) {
      // a page layout: header, hero, text bars, three cards, footer
      const pw = Math.min(w * 0.6, 620)
      const u = pw / 100
      const ph = 68 * u
      const px = (w - pw) / 2
      const py = (h - ph) / 2 - h * 0.04
      const cardW = 30 * u
      const cardY = py + 42 * u
      const slots: [number, number, number, number][] = [
        [px, py, 8 * u, 8 * u],
        [px + 12 * u, py + 2 * u, 44 * u, 4 * u],
        [px + pw - 24 * u, py + 1.5 * u, 24 * u, 5 * u],
        [px, py + 14 * u, 58 * u, 9 * u],
        [px, py + 26 * u, 44 * u, 4.5 * u],
        [px, py + 33 * u, 24 * u, 5 * u],
        [px, cardY, cardW, 17 * u],
        [px + 35 * u, cardY, cardW, 17 * u],
        [px + 70 * u, cardY, cardW, 17 * u],
        [px, py + 63 * u, pw, 5 * u],
      ]
      blocks = slots.map(([sx, sy, bw, bh]) => {
        const b: Block = { sx, sy, w: bw, h: bh, x: sx, y: sy, vx: 0, vy: 0, state: 'flying', age: 0 }
        fling(b, w, h)
        return b
      })
      pulses = []
      popAcc = -1.5 // let the initial assembly finish before popping blocks
    },

    frame(ctx, w, h, pointer, dt, t) {
      // every few seconds a settled block pops loose
      popAcc += dt
      if (popAcc > 2.4) {
        popAcc = 0
        const set = blocks.filter(b => b.state === 'set')
        if (set.length > blocks.length - 2) {
          const b = set[Math.floor(Math.random() * set.length)]
          const a = Math.random() * Math.PI * 2
          b.state = 'loose'
          b.age = 0
          b.vx = Math.cos(a) * 260
          b.vy = Math.sin(a) * 260 - 120
        }
      }

      for (const b of blocks) {
        b.age += dt
        if (b.state === 'flying') {
          // ease home, snap when close
          const k = Math.min(1, dt * 3.2)
          b.x += (b.sx - b.x) * k
          b.y += (b.sy - b.y) * k
          if (Math.hypot(b.sx - b.x, b.sy - b.y) < 1.2) {
            b.x = b.sx
            b.y = b.sy
            b.state = 'set'
            pulses.push({ x: b.sx, y: b.sy, w: b.w, h: b.h, age: 0 })
          }
        } else if (b.state === 'loose') {
          b.vy += 300 * dt // a little gravity, like a dropped part
          b.x += b.vx * dt
          b.y += b.vy * dt
          if (b.age > 0.75) fling(b, w, h)
        }

        // the cursor shoves settled blocks; they spring back home
        let ox = 0
        let oy = 0
        if (b.state === 'set' && pointer.inside) {
          const cx = b.x + b.w / 2
          const cy = b.y + b.h / 2
          const d = Math.hypot(cx - pointer.x, cy - pointer.y)
          const R = 130
          if (d < R && d > 0.001) {
            const f = ((R - d) / R) * 26
            ox = ((cx - pointer.x) / d) * f
            oy = ((cy - pointer.y) / d) * f
          }
        }

        const settledLong = b.state === 'set' && b.age > 0.4
        const alpha = b.state === 'loose' ? Math.max(0, 0.8 - b.age) : settledLong ? 0.3 : 0.85
        ctx.strokeStyle = settledLong ? paper(alpha) : signal(alpha)
        ctx.lineWidth = 1.5
        ctx.strokeRect(b.x + ox, b.y + oy, b.w, b.h)
        // faint content lines inside the larger blocks
        if (b.h > 20 && b.w > 40) {
          ctx.strokeStyle = paper(0.13)
          ctx.beginPath()
          ctx.moveTo(b.x + ox + b.w * 0.12, b.y + oy + b.h * 0.62)
          ctx.lineTo(b.x + ox + b.w * 0.88, b.y + oy + b.h * 0.62)
          ctx.moveTo(b.x + ox + b.w * 0.12, b.y + oy + b.h * 0.78)
          ctx.lineTo(b.x + ox + b.w * 0.6, b.y + oy + b.h * 0.78)
          ctx.stroke()
        }
      }

      // snap pulses
      pulses = pulses.filter(p => p.age < 0.55)
      for (const p of pulses) {
        p.age += dt
        const q = p.age / 0.55
        const g = 4 + q * 18
        ctx.strokeStyle = signal((1 - q) * 0.7)
        ctx.lineWidth = 1.5
        ctx.strokeRect(p.x - g, p.y - g, p.w + g * 2, p.h + g * 2)
      }
      void t
    },
  }
}

export function SceneBlocks({ className }: { className?: string }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer
      ariaLabel="Content blocks assembling themselves into a page layout"
    />
  )
}
