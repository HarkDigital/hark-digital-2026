import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { paper, signal } from '@/components/logo/shared'

interface Blip {
  x: number
  y: number
  heat: number
}

/**
 * SEO / GEO — a radar sweep that finds you. Scattered blips light up
 * as the beam passes; hover to drop a new blip and get discovered.
 */
function createScene(): ParticleScene {
  let blips: Blip[] = []
  let cx = 0
  let cy = 0
  let R = 0

  const angleOf = (b: Blip) => Math.atan2(b.y - cy, b.x - cx)

  return {
    init(w, h) {
      cx = w / 2
      cy = h / 2
      R = Math.min(w, h) * 0.44
      blips = Array.from({ length: 34 }, () => {
        const a = Math.random() * Math.PI * 2
        const r = R * (0.2 + Math.random() * 0.75)
        return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, heat: 0 }
      })
    },

    frame(ctx, _w, _h, pointer, dt, t) {
      const beam = (t * 0.9) % (Math.PI * 2)

      // rings + spokes
      ctx.lineWidth = 1
      for (let i = 1; i <= 3; i++) {
        ctx.strokeStyle = paper(0.09)
        ctx.beginPath()
        ctx.arc(cx, cy, (R / 3) * i, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.strokeStyle = paper(0.06)
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI / 4) * i
        ctx.beginPath()
        ctx.moveTo(cx - Math.cos(a) * R, cy - Math.sin(a) * R)
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R)
        ctx.stroke()
      }

      // beam: fading trail of lines behind the sweep
      for (let i = 0; i < 28; i++) {
        const a = beam - i * 0.014
        ctx.strokeStyle = signal(0.5 * (1 - i / 28) ** 2)
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R)
        ctx.stroke()
      }

      // cursor drops a blip (throttled by distance from existing ones)
      if (pointer.inside) {
        const dx = pointer.x - cx
        const dy = pointer.y - cy
        if (dx * dx + dy * dy < R * R && blips.length < 60) {
          const near = blips.some(b => (b.x - pointer.x) ** 2 + (b.y - pointer.y) ** 2 < 40 * 40)
          if (!near) blips.push({ x: pointer.x, y: pointer.y, heat: 0 })
        }
      }

      // blips
      for (const b of blips) {
        let diff = beam - angleOf(b)
        while (diff < 0) diff += Math.PI * 2
        if (diff < 0.06) b.heat = 1
        const base = 0.18
        const a = base + b.heat * 0.82
        ctx.fillStyle = b.heat > 0.35 ? signal(a) : paper(a)
        ctx.beginPath()
        ctx.arc(b.x, b.y, 2 + b.heat * 1.6, 0, Math.PI * 2)
        ctx.fill()
        if (b.heat > 0.5) {
          ctx.strokeStyle = signal((b.heat - 0.5) * 0.9)
          ctx.beginPath()
          ctx.arc(b.x, b.y, 5 + (1 - b.heat) * 26, 0, Math.PI * 2)
          ctx.stroke()
        }
        b.heat = Math.max(0, b.heat - dt * 0.5)
      }

      // center
      ctx.fillStyle = signal(0.9)
      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fill()
    },
  }
}

export function SceneRadar({ className }: { className?: string }) {
  return <ParticleCanvas createScene={createScene} className={className} windowPointer ariaLabel="A radar sweep discovering blips" />
}
