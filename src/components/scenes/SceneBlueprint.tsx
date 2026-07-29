import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { paper, signal } from '@/components/logo/shared'

interface Box {
  x: number
  y: number
  w: number
  h: number
  start: number
  cross?: boolean
}

/**
 * WEB DESIGN — a wireframe that sketches itself, holds, dissolves,
 * and drafts a brand-new layout. The cursor highlights the box under it.
 */
function createScene(): ParticleScene {
  let boxes: Box[] = []
  let cycleStart = 0
  const CYCLE = 9

  const generate = (w: number, h: number, t: number) => {
    const m = Math.min(w, h) * 0.08
    const gw = w - m * 2
    const gh = h - m * 2
    boxes = []
    let delay = 0
    const add = (x: number, y: number, bw: number, bh: number, cross = false) => {
      boxes.push({ x, y, w: bw, h: bh, start: t + delay, cross })
      delay += 0.22
    }
    // header + nav pill
    add(m, m, gw, gh * 0.1)
    add(m + gw * 0.8, m + gh * 0.02, gw * 0.18, gh * 0.06)
    // hero split (random ratio) — image side gets an X placeholder
    const split = 0.5 + Math.random() * 0.2
    const heroH = gh * (0.3 + Math.random() * 0.12)
    add(m, m + gh * 0.13, gw * split - 10, heroH)
    add(m + gw * split + 10, m + gh * 0.13, gw * (1 - split) - 10, heroH, true)
    // column cards
    const colY = m + gh * 0.13 + heroH + 24
    const nCols = 3 + Math.floor(Math.random() * 2)
    const colH = Math.max(60, gh - (colY - m) - gh * 0.12)
    for (let i = 0; i < nCols; i++) {
      const cw = (gw - (nCols - 1) * 20) / nCols
      add(m + i * (cw + 20), colY, cw, colH, Math.random() < 0.3)
    }
    // footer bar
    add(m, m + gh - gh * 0.07, gw, gh * 0.07)
  }

  return {
    init() {
      boxes = []
      cycleStart = -1
    },

    frame(ctx, w, h, pointer, _dt, t) {
      if (cycleStart < 0 || t - cycleStart > CYCLE) {
        cycleStart = t
        generate(w, h, t)
      }
      const phase = t - cycleStart
      // global fade-out at the end of the cycle
      const fadeOut = phase > CYCLE - 1.2 ? Math.max(0, (CYCLE - phase) / 1.2) : 1

      // dotted grid backdrop
      ctx.fillStyle = paper(0.05 * fadeOut)
      const gap = 40
      for (let y = gap; y < h; y += gap)
        for (let x = gap; x < w; x += gap) ctx.fillRect(x - 0.5, y - 0.5, 1, 1)

      for (const b of boxes) {
        const p = Math.min(1, Math.max(0, (t - b.start) / 1.1))
        if (p <= 0) continue
        const perim = 2 * (b.w + b.h)
        const hovered =
          pointer.inside &&
          pointer.x > b.x &&
          pointer.x < b.x + b.w &&
          pointer.y > b.y &&
          pointer.y < b.y + b.h
        ctx.strokeStyle = hovered ? signal(0.85 * fadeOut) : paper(0.32 * fadeOut)
        ctx.lineWidth = 1
        ctx.setLineDash([perim * p, perim])
        ctx.strokeRect(b.x, b.y, b.w, b.h)
        ctx.setLineDash([])

        // corner ticks once drawn
        if (p >= 1) {
          ctx.fillStyle = hovered ? signal(0.9 * fadeOut) : paper(0.5 * fadeOut)
          for (const [cx, cy] of [
            [b.x, b.y],
            [b.x + b.w, b.y],
            [b.x, b.y + b.h],
            [b.x + b.w, b.y + b.h],
          ]) {
            ctx.fillRect(cx - 1.5, cy - 1.5, 3, 3)
          }
        }

        // X placeholder for image boxes
        if (b.cross && p >= 1) {
          ctx.strokeStyle = hovered ? signal(0.4 * fadeOut) : paper(0.14 * fadeOut)
          ctx.beginPath()
          ctx.moveTo(b.x, b.y)
          ctx.lineTo(b.x + b.w, b.y + b.h)
          ctx.moveTo(b.x + b.w, b.y)
          ctx.lineTo(b.x, b.y + b.h)
          ctx.stroke()
        }
      }
    },
  }
}

export function SceneBlueprint({ className }: { className?: string }) {
  return <ParticleCanvas createScene={createScene} className={className} windowPointer ariaLabel="Website wireframes sketching themselves" />
}
