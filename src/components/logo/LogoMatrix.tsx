import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { sampleLogoPoints } from '@/lib/particles/logo'
import { paper, signal } from './shared'

// Adapted from Backgrounds/Matrix.tsx — same katakana + digits charset and
// falling-column model, but here the rain "develops" the logo: characters
// that land on the mark stick and stay lit.
const CHARSET = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789'

interface Column {
  y: number
  speed: number
}

/**
 * 07 — MATRIX
 * Digital rain that develops the mark like a photograph: glyphs falling
 * over the logo stick and glow. The cursor wipes them clean.
 */
function createScene(): ParticleScene {
  const CELL = 15
  let cols = 0
  let rows = 0
  let isLogo: Uint8Array = new Uint8Array(0)
  let bright: Float32Array = new Float32Array(0)
  let glyphs: string[] = []
  let columns: Column[] = []

  return {
    async init(w, h) {
      cols = Math.ceil(w / CELL)
      rows = Math.ceil(h / CELL)
      isLogo = new Uint8Array(cols * rows)
      bright = new Float32Array(cols * rows)
      glyphs = Array.from({ length: cols * rows }, () => CHARSET[(Math.random() * CHARSET.length) | 0])
      const pts = await sampleLogoPoints({ width: w, height: h, gap: CELL, scale: 0.8 })
      for (const p of pts) {
        const c = Math.min(cols - 1, Math.round(p.x / CELL))
        const r = Math.min(rows - 1, Math.round(p.y / CELL))
        isLogo[r * cols + c] = 1
      }
      columns = Array.from({ length: cols }, () => ({
        y: Math.random() * -rows * 2,
        speed: 8 + Math.random() * 16,
      }))
    },

    frame(ctx, _w, h, pointer, dt) {
      ctx.font = `${CELL - 2}px monospace`
      ctx.textBaseline = 'top'

      for (let c = 0; c < cols; c++) {
        const col = columns[c]
        const prevY = col.y
        col.y += col.speed * dt
        if (col.y * CELL > h + 20 * CELL) {
          col.y = Math.random() * -30
          col.speed = 8 + Math.random() * 16
        }
        // light every cell the head crossed this frame
        for (let r = Math.max(0, Math.floor(prevY)); r <= Math.floor(col.y); r++) {
          if (r < 0 || r >= rows) continue
          const i = r * cols + c
          bright[i] = Math.max(bright[i], isLogo[i] ? 1 : 0.45)
          if (Math.random() < 0.3) glyphs[i] = CHARSET[(Math.random() * CHARSET.length) | 0]
        }
      }

      // cursor wipes glyphs off the glass
      const wipeR2 = 70 * 70

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          let b = bright[i]
          if (b <= 0.02) continue
          const x = c * CELL
          const y = r * CELL
          if (pointer.inside) {
            const dx = x - pointer.x
            const dy = y - pointer.y
            if (dx * dx + dy * dy < wipeR2) {
              bright[i] = 0
              continue
            }
          }
          const onLogo = isLogo[i] === 1
          // logo glyphs linger; background rain fades fast
          bright[i] = Math.max(0, b - dt * (onLogo ? 0.14 : 0.9))
          const head = b > 0.92
          ctx.fillStyle = head ? paper(0.9) : onLogo ? signal(0.15 + b * 0.85) : signal(b * 0.35)
          ctx.fillText(glyphs[i], x, y)
        }
      }
    },
  }
}

export function LogoMatrix({ className, windowPointer }: { className?: string; windowPointer?: boolean }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer={windowPointer}
      ariaLabel="Digital rain revealing the Hark Digital logo in glowing characters"
    />
  )
}
