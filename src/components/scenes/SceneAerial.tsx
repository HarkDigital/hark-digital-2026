import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { paper, signal } from '@/components/logo/shared'

/**
 * AERIAL — living topographic contours seen from above, with a drone
 * tracing a survey path. The drone gently steers toward your cursor.
 */
function createScene(): ParticleScene {
  let dx = 0
  let dy = 0
  let trail: Array<{ x: number; y: number }> = []

  return {
    init(w, h) {
      dx = w / 2
      dy = h / 2
      trail = []
    },

    frame(ctx, w, h, pointer, dt, t) {
      const cx = w * 0.62
      const cy = h * 0.45

      // wobbling contour rings
      ctx.lineWidth = 1
      for (let k = 0; k < 9; k++) {
        const base = 40 + k * Math.min(w, h) * 0.075
        ctx.strokeStyle = paper(0.17 - k * 0.01)
        ctx.beginPath()
        for (let i = 0; i <= 90; i++) {
          const a = (i / 90) * Math.PI * 2
          const r =
            base +
            Math.sin(a * 3 + t * 0.25 + k * 1.3) * 8 +
            Math.sin(a * 5 - t * 0.18 + k * 0.7) * 5
          const x = cx + Math.cos(a) * r * 1.15
          const y = cy + Math.sin(a) * r * 0.82
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.stroke()
      }
      // summit marker
      ctx.fillStyle = signal(0.6)
      ctx.beginPath()
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
      ctx.fill()

      // drone: lissajous survey path, bending toward the pointer
      let tx = w * 0.5 + Math.cos(t * 0.42) * w * 0.3
      let ty = h * 0.45 + Math.sin(t * 0.31) * h * 0.26
      if (pointer.inside) {
        tx = tx * 0.45 + pointer.x * 0.55
        ty = ty * 0.45 + pointer.y * 0.55
      }
      const ease = 1 - Math.exp(-1.8 * dt)
      const pdx = dx
      dx += (tx - dx) * ease
      dy += (ty - dy) * ease
      const heading = Math.atan2(dy - ty, dx - tx) + Math.PI

      trail.push({ x: dx, y: dy })
      if (trail.length > 70) trail.shift()

      // flight trail
      for (let i = 1; i < trail.length; i++) {
        ctx.strokeStyle = signal((i / trail.length) * 0.5)
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y)
        ctx.lineTo(trail[i].x, trail[i].y)
        ctx.stroke()
      }

      // camera footprint on the ground ahead of the drone
      const look = 46
      const fx = dx + Math.cos(heading) * look
      const fy = dy + Math.sin(heading) * look
      ctx.strokeStyle = paper(0.22)
      ctx.setLineDash([4, 5])
      ctx.strokeRect(fx - 26, fy - 18, 52, 36)
      ctx.setLineDash([])
      ctx.strokeStyle = paper(0.1)
      ctx.beginPath()
      ctx.moveTo(dx, dy)
      ctx.lineTo(fx - 26, fy - 18)
      ctx.moveTo(dx, dy)
      ctx.lineTo(fx + 26, fy - 18)
      ctx.moveTo(dx, dy)
      ctx.lineTo(fx - 26, fy + 18)
      ctx.moveTo(dx, dy)
      ctx.lineTo(fx + 26, fy + 18)
      ctx.stroke()

      // drone body: center + 4 rotors
      const spin = t * 40
      ctx.fillStyle = paper(0.95)
      ctx.fillRect(dx - 2.5, dy - 2.5, 5, 5)
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI / 2) * i + Math.PI / 4
        const rx = dx + Math.cos(a) * 10
        const ry = dy + Math.sin(a) * 10
        ctx.strokeStyle = paper(0.4)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(dx, dy)
        ctx.lineTo(rx, ry)
        ctx.stroke()
        ctx.strokeStyle = signal(0.75)
        ctx.beginPath()
        ctx.arc(rx, ry, 4.5, spin + i, spin + i + Math.PI * 1.4)
        ctx.stroke()
      }
      void pdx
    },
  }
}

export function SceneAerial({ className }: { className?: string }) {
  return <ParticleCanvas createScene={createScene} className={className} windowPointer ariaLabel="A drone surveying animated terrain contours" />
}
