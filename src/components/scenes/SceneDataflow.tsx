import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { paper, signal, volt } from '@/components/logo/shared'

interface Packet {
  lane: number
  horizontal: boolean
  pos: number
  speed: number
  accent: boolean
  volt: boolean
}

/**
 * SOFTWARE — data packets streaming through a circuit grid.
 * Nodes light up as packets pass; the cursor accelerates nearby traffic.
 */
function createScene(): ParticleScene {
  let cols: number[] = []
  let rows: number[] = []
  let packets: Packet[] = []
  let nodeGlow: number[][] = []

  return {
    init(w, h) {
      const gap = Math.max(80, Math.min(w, h) / 8)
      cols = []
      rows = []
      for (let x = gap / 2; x < w; x += gap) cols.push(x)
      for (let y = gap / 2; y < h; y += gap) rows.push(y)
      nodeGlow = rows.map(() => cols.map(() => 0))
      const count = Math.min(70, Math.round((w * h) / 16000))
      packets = Array.from({ length: count }, () => ({
        lane: 0,
        horizontal: Math.random() < 0.5,
        pos: Math.random() * Math.max(w, h),
        speed: 40 + Math.random() * 120,
        accent: Math.random() < 0.25,
        volt: Math.random() < 0.5,
      }))
      for (const p of packets) {
        p.lane = Math.floor(Math.random() * (p.horizontal ? rows.length : cols.length))
      }
    },

    frame(ctx, w, h, pointer, dt) {
      // lanes
      ctx.lineWidth = 1
      ctx.strokeStyle = paper(0.07)
      for (const x of cols) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (const y of rows) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // packets
      for (const p of packets) {
        const laneCoord = p.horizontal ? rows[p.lane] : cols[p.lane]
        if (laneCoord === undefined) continue
        let boost = 1
        const px = p.horizontal ? p.pos : laneCoord
        const py = p.horizontal ? laneCoord : p.pos
        if (pointer.inside) {
          const dx = px - pointer.x
          const dy = py - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < 150 * 150) boost = 1 + (1 - Math.sqrt(d2) / 150) * 3
        }
        p.pos += p.speed * boost * dt
        const limit = p.horizontal ? w : h
        if (p.pos > limit + 20) {
          p.pos = -20
          p.lane = Math.floor(Math.random() * (p.horizontal ? rows.length : cols.length))
        }

        // light up nodes the packet passes
        const laneNodes = p.horizontal ? cols : rows
        for (let i = 0; i < laneNodes.length; i++) {
          if (Math.abs(laneNodes[i] - p.pos) < 6) {
            const r = p.horizontal ? p.lane : i
            const c = p.horizontal ? i : p.lane
            if (nodeGlow[r]) nodeGlow[r][c] = 1
          }
        }

        // trail + head
        const trailLen = 26 * boost
        const grad = ctx.createLinearGradient(
          p.horizontal ? px - trailLen : px,
          p.horizontal ? py : py - trailLen,
          px,
          py
        )
        const color = p.accent ? (p.volt ? volt : signal) : paper
        grad.addColorStop(0, color(0))
        grad.addColorStop(1, color(0.7))
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(p.horizontal ? px - trailLen : px, p.horizontal ? py : py - trailLen)
        ctx.lineTo(px, py)
        ctx.stroke()
      }

      // nodes
      for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < cols.length; c++) {
          const glow = nodeGlow[r][c]
          ctx.fillStyle = glow > 0.05 ? signal(0.25 + glow * 0.75) : paper(0.22)
          const s = 2 + glow * 2.5
          ctx.fillRect(cols[c] - s / 2, rows[r] - s / 2, s, s)
          nodeGlow[r][c] = Math.max(0, glow - dt * 1.4)
        }
      }
    },
  }
}

export function SceneDataflow({ className }: { className?: string }) {
  return <ParticleCanvas createScene={createScene} className={className} windowPointer ariaLabel="Data packets flowing through a circuit grid" />
}
