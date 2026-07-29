import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { paper, signal } from '@/components/logo/shared'

const danger = (a: number) => `rgba(255, 255, 255, ${a})`

interface Cell {
  x: number
  y: number
  corrupt: boolean
  cleanFlash: number
  jitterSeed: number
}

/**
 * HACK REMEDIATION — a corrupted grid being swept clean. The scanline
 * disinfects as it passes; hover to clean cells yourself.
 */
function createScene(): ParticleScene {
  let cells: Cell[] = []
  let cols = 0
  let rows = 0
  let gap = 26

  return {
    init(w, h) {
      gap = Math.max(22, Math.min(w, h) / 26)
      cols = Math.ceil(w / gap)
      rows = Math.ceil(h / gap)
      cells = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push({
            x: c * gap + gap / 2,
            y: r * gap + gap / 2,
            corrupt: Math.random() < 0.16,
            cleanFlash: 0,
            jitterSeed: Math.random() * 100,
          })
        }
      }
    },

    frame(ctx, w, h, pointer, dt, t) {
      const SWEEP = 14 // seconds per pass
      const scanX = ((t % SWEEP) / SWEEP) * (w + 160) - 80

      for (const cell of cells) {
        // scanline disinfects
        if (cell.corrupt && Math.abs(cell.x - scanX) < gap) {
          cell.corrupt = false
          cell.cleanFlash = 1
        }
        // cursor disinfects too
        if (cell.corrupt && pointer.inside) {
          const d2 = (cell.x - pointer.x) ** 2 + (cell.y - pointer.y) ** 2
          if (d2 < 60 * 60) {
            cell.corrupt = false
            cell.cleanFlash = 1
          }
        }
        // reinfection far behind the scanline keeps the loop alive
        if (!cell.corrupt && cell.cleanFlash <= 0 && Math.random() < dt * 0.005) {
          const behind = scanX - cell.x
          if (behind > w * 0.3 || behind < -gap * 2) cell.corrupt = true
        }

        if (cell.corrupt) {
          // glitchy block: flicker + horizontal displacement
          const flick = Math.sin(t * 17 + cell.jitterSeed * 9)
          if (flick > -0.4) {
            const off = Math.sin(t * 23 + cell.jitterSeed) * 4
            const s = gap * 0.5
            ctx.fillStyle = danger(0.25 + Math.abs(flick) * 0.4)
            ctx.fillRect(cell.x - s / 2 + off, cell.y - s / 2, s, s * 0.35)
            ctx.fillStyle = paper(0.16)
            ctx.fillRect(cell.x - s / 2 - off, cell.y - s * 0.05, s * 0.8, s * 0.22)
          }
        } else if (cell.cleanFlash > 0) {
          ctx.fillStyle = signal(cell.cleanFlash * 0.8)
          const s = 3 + cell.cleanFlash * 4
          ctx.fillRect(cell.x - s / 2, cell.y - s / 2, s, s)
          cell.cleanFlash = Math.max(0, cell.cleanFlash - dt * 1.1)
        } else {
          ctx.fillStyle = paper(0.1)
          ctx.fillRect(cell.x - 1, cell.y - 1, 2, 2)
        }
      }

      // the scanline itself
      const grad = ctx.createLinearGradient(scanX - 70, 0, scanX, 0)
      grad.addColorStop(0, signal(0))
      grad.addColorStop(1, signal(0.14))
      ctx.fillStyle = grad
      ctx.fillRect(scanX - 70, 0, 70, h)
      ctx.strokeStyle = signal(0.85)
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(scanX, 0)
      ctx.lineTo(scanX, h)
      ctx.stroke()
    },
  }
}

export function SceneGlitch({ className }: { className?: string }) {
  return <ParticleCanvas createScene={createScene} className={className} windowPointer ariaLabel="A scanline sweeping a corrupted grid clean" />
}
