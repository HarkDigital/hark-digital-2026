import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { paper, signal } from '@/components/logo/shared'

interface Box {
  x: number
  y: number
  w: number
  h: number
  /** draw as the rotated brand diamond instead of a rect */
  diamond?: boolean
}
interface Ripple {
  box: Box
  age: number
}

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
const lerp = (a: number, b: number, p: number) => a + (b - a) * p

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/**
 * ADA ACCESSIBILITY — a keyboard focus ring tabbing through a page
 * wireframe. Every element gets its turn. Move the cursor to send
 * focus where you point.
 */
function createScene(): ParticleScene {
  let boxes: Box[] = []
  let ripples: Ripple[] = []
  let cur = 0
  let target = 0
  let progress = 1
  let dwell = 0

  return {
    init(w, h) {
      // a page wireframe, centered and sized to the viewport
      const pw = Math.min(w * 0.62, 640)
      const u = pw / 100
      const ph = 66 * u
      const px = (w - pw) / 2
      const py = (h - ph) / 2 - h * 0.04
      const cardW = 30 * u
      const cardY = py + 48 * u
      boxes = [
        { x: px, y: py, w: 7 * u, h: 7 * u, diamond: true },
        { x: px + pw - 32 * u, y: py + 1.5 * u, w: 14 * u, h: 4.5 * u },
        { x: px + pw - 15 * u, y: py + 1.5 * u, w: 15 * u, h: 4.5 * u },
        { x: px, y: py + 17 * u, w: 54 * u, h: 8 * u },
        { x: px, y: py + 28.5 * u, w: 42 * u, h: 4.5 * u },
        { x: px, y: py + 37.5 * u, w: 20 * u, h: 6.5 * u },
        { x: px, y: cardY, w: cardW, h: 18 * u },
        { x: px + 35 * u, y: cardY, w: cardW, h: 18 * u },
        { x: px + 70 * u, y: cardY, w: cardW, h: 18 * u },
      ]
      ripples = []
      cur = 0
      target = 1
      progress = 0
      dwell = 0
    },

    frame(ctx, w, h, pointer, dt, t) {
      // the cursor pulls focus to whatever element it is nearest
      let nearest = -1
      if (pointer.inside) {
        let bestD = Math.min(w, h) * 0.3
        for (let i = 0; i < boxes.length; i++) {
          const b = boxes[i]
          const d = Math.hypot(pointer.x - (b.x + b.w / 2), pointer.y - (b.y + b.h / 2))
          if (d < bestD) {
            bestD = d
            nearest = i
          }
        }
      }

      if (progress < 1) {
        progress = Math.min(1, progress + dt / 0.4)
        if (progress >= 1) {
          dwell = 0
          ripples.push({ box: boxes[target], age: 0 })
        }
      } else {
        dwell += dt
        if (nearest >= 0 && nearest !== target) {
          cur = target
          target = nearest
          progress = 0
        } else if (nearest === target) {
          dwell = 0 // focus holds while the cursor rests on an element
        } else if (dwell > 1.05) {
          cur = target
          target = (target + 1) % boxes.length
          progress = 0
        }
      }

      // wireframe elements
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i]
        const focused = progress >= 1 && i === target
        ctx.lineWidth = 1.5
        ctx.strokeStyle = focused ? signal(0.9) : paper(0.28)
        if (b.diamond) {
          ctx.save()
          ctx.translate(b.x + b.w / 2, b.y + b.h / 2)
          ctx.rotate(Math.PI / 4)
          const s = b.w * 0.72
          if (focused) {
            ctx.fillStyle = signal(0.12)
            ctx.fillRect(-s / 2, -s / 2, s, s)
          }
          ctx.strokeRect(-s / 2, -s / 2, s, s)
          ctx.restore()
        } else {
          if (focused) {
            ctx.fillStyle = signal(0.08)
            ctx.fillRect(b.x, b.y, b.w, b.h)
          }
          ctx.strokeRect(b.x, b.y, b.w, b.h)
        }
        // faint text lines inside the cards
        if (i >= boxes.length - 3) {
          ctx.strokeStyle = paper(0.14)
          ctx.beginPath()
          ctx.moveTo(b.x + b.w * 0.12, b.y + b.h * 0.62)
          ctx.lineTo(b.x + b.w * 0.88, b.y + b.h * 0.62)
          ctx.moveTo(b.x + b.w * 0.12, b.y + b.h * 0.78)
          ctx.lineTo(b.x + b.w * 0.62, b.y + b.h * 0.78)
          ctx.stroke()
        }
      }

      // announcement ripples where focus lands
      ripples = ripples.filter(r => r.age < 0.65)
      for (const r of ripples) {
        r.age += dt
        const q = r.age / 0.65
        const grow = q * 26
        ctx.strokeStyle = signal((1 - q) * 0.5)
        ctx.lineWidth = 1.5
        roundedRect(ctx, r.box.x - 5 - grow, r.box.y - 5 - grow, r.box.w + (5 + grow) * 2, r.box.h + (5 + grow) * 2, 8)
        ctx.stroke()
      }

      // the focus ring, easing between elements
      const a = boxes[cur]
      const b = boxes[target]
      const p = ease(progress)
      const pad = 5 + Math.sin(t * 3) * 1.2
      roundedRect(
        ctx,
        lerp(a.x, b.x, p) - pad,
        lerp(a.y, b.y, p) - pad,
        lerp(a.w, b.w, p) + pad * 2,
        lerp(a.h, b.h, p) + pad * 2,
        7
      )
      ctx.strokeStyle = signal(0.95)
      ctx.lineWidth = 2
      ctx.stroke()
    },
  }
}

export function SceneFocus({ className }: { className?: string }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer
      ariaLabel="A keyboard focus ring moving through a page layout, element by element"
    />
  )
}
