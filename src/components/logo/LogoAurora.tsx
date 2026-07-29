import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { loadLogoImage } from '@/lib/particles/logo'

// Adapted from Backgrounds/Aurora.tsx — its drifting repeating-gradient
// curtains, redrawn on canvas in brand colors and masked into the mark,
// so the northern lights flow inside the logo itself.

// green-only palette (July 2026): shades of the signal green plus a white ribbon
const BANDS = [
  { r: 0, g: 255, b: 133 }, // signal green
  { r: 0, g: 210, b: 150 }, // deep green
  { r: 120, g: 255, b: 200 }, // mint
  { r: 255, g: 255, b: 255 }, // a thin white ribbon (stays a whisper)
  { r: 180, g: 255, b: 220 }, // pale green-white
]

/**
 * 09 — AURORA
 * Northern lights pouring through the mark. The cursor drags the
 * curtains toward it.
 */
function createScene(): ParticleScene {
  let logo: HTMLImageElement | null = null
  let buffer: HTMLCanvasElement | null = null
  let bctx: CanvasRenderingContext2D | null = null

  return {
    async init(w, h) {
      logo = await loadLogoImage()
      buffer = document.createElement('canvas')
      // low-res buffer: soft by nature, cheap to fill
      buffer.width = Math.max(2, Math.round(w / 3))
      buffer.height = Math.max(2, Math.round(h / 3))
      bctx = buffer.getContext('2d')
    },

    frame(ctx, w, h, pointer, _dt, t) {
      if (!logo || !buffer || !bctx) return
      const bw = buffer.width
      const bh = buffer.height

      // curtains: vertical gradient ribbons whose centers drift like the
      // original's 100deg repeating bands
      bctx.clearRect(0, 0, bw, bh)
      bctx.globalCompositeOperation = 'lighter'
      const pull = pointer.inside ? (pointer.x / w - 0.5) * bw * 0.3 : 0
      for (let i = 0; i < BANDS.length; i++) {
        const band = BANDS[i]
        const phase = t * (0.16 + i * 0.05) + i * 1.7
        for (let x = 0; x < bw; x += 2) {
          const nx = x / bw
          const center =
            bh * 0.5 +
            Math.sin(nx * 4.4 + phase) * bh * 0.22 +
            Math.sin(nx * 9.1 - phase * 1.3) * bh * 0.09 +
            (pull * (x / bw - 0.5)) / 2
          const thickness = bh * (0.1 + 0.05 * Math.sin(nx * 6 + phase * 0.8 + i))
          const grad = bctx.createLinearGradient(0, center - thickness, 0, center + thickness)
          const a = i === 3 ? 0.05 : 0.11 // pink stays a whisper
          grad.addColorStop(0, `rgba(${band.r},${band.g},${band.b},0)`)
          grad.addColorStop(0.5, `rgba(${band.r},${band.g},${band.b},${a})`)
          grad.addColorStop(1, `rgba(${band.r},${band.g},${band.b},0)`)
          bctx.fillStyle = grad
          bctx.fillRect(x, center - thickness, 2, thickness * 2)
        }
      }
      // mask the curtains into the logo silhouette
      bctx.globalCompositeOperation = 'destination-in'
      const size = Math.min(bw, bh) * 0.8
      bctx.drawImage(logo, (bw - size) / 2, (bh - size) / 2, size, size)
      bctx.globalCompositeOperation = 'source-over'

      // starfield behind the mark
      ctx.fillStyle = 'rgba(255,255,255,0.25)'
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137.5) % w | 0) + Math.sin(t * 0.4 + i) * 2
        const sy = (i * 89.3) % h | 0
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.8 + i * 2.1))
        ctx.globalAlpha = tw * 0.5
        ctx.fillRect(sx, sy, 1.5, 1.5)
      }
      ctx.globalAlpha = 1

      ctx.imageSmoothingEnabled = true
      ctx.drawImage(buffer, 0, 0, w, h)
    },
  }
}

export function LogoAurora({ className, windowPointer }: { className?: string; windowPointer?: boolean }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer={windowPointer}
      ariaLabel="Northern lights flowing inside the Hark Digital logo"
    />
  )
}
