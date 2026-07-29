import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { sampleLogoPoints } from '@/lib/particles/logo'
import { adaptiveGap, paper, signal } from './shared'

interface Node {
  hx: number
  hy: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  phase: number
}

/**
 * 03 — CONSTELLATION
 * The mark as a star chart: nodes drift on their moorings, linked by
 * hairlines. The cursor is gravity — nearby stars lean toward it and
 * their links catch the signal color.
 */
function createScene(): ParticleScene {
  let nodes: Node[] = []
  let edges: Array<[number, number]> = []

  return {
    async init(w, h) {
      const gap = adaptiveGap(w, h, 'sparse')
      const pts = await sampleLogoPoints({ width: w, height: h, gap, jitter: gap * 0.35 })
      nodes = pts.map(p => ({
        hx: p.x,
        hy: p.y,
        x: p.x,
        y: p.y,
        vx: 0,
        vy: 0,
        size: 1 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
      }))

      // precompute the link graph from home positions (stable + cheap)
      edges = []
      const maxD = gap * 1.75
      const maxD2 = maxD * maxD
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].hx - nodes[j].hx
          const dy = nodes[i].hy - nodes[j].hy
          if (dx * dx + dy * dy < maxD2) edges.push([i, j])
        }
      }
    },

    frame(ctx, w, h, pointer, dt, t) {
      const gravR = Math.min(w, h) * 0.22
      const gravR2 = gravR * gravR
      const damp = Math.exp(-3.2 * dt)

      for (const n of nodes) {
        // gentle orbital drift around the mooring
        const driftX = Math.cos(t * 0.7 + n.phase) * 1.1
        const driftY = Math.sin(t * 0.9 + n.phase) * 1.1
        let ax = (n.hx + driftX - n.x) * 26
        let ay = (n.hy + driftY - n.y) * 26

        if (pointer.inside) {
          const dx = pointer.x - n.x
          const dy = pointer.y - n.y
          const d2 = dx * dx + dy * dy
          if (d2 < gravR2 && d2 > 1) {
            const d = Math.sqrt(d2)
            const f = ((gravR - d) / gravR) * 480
            ax += (dx / d) * f
            ay += (dy / d) * f
          }
        }

        n.vx = (n.vx + ax * dt) * damp
        n.vy = (n.vy + ay * dt) * damp
        n.x += n.vx * dt
        n.y += n.vy * dt
      }

      // links
      ctx.lineWidth = 0.7
      for (const [i, j] of edges) {
        const a = nodes[i]
        const b = nodes[j]
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        let nearMouse = 0
        if (pointer.inside) {
          const dx = mx - pointer.x
          const dy = my - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < gravR2) nearMouse = 1 - Math.sqrt(d2) / gravR
        }
        ctx.strokeStyle = nearMouse > 0.05 ? signal(0.16 + nearMouse * 0.6) : paper(0.13)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      // stars
      for (const n of nodes) {
        const twinkle = 0.55 + 0.35 * Math.sin(t * 1.6 + n.phase * 3)
        ctx.fillStyle = paper(twinkle)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2)
        ctx.fill()
      }
    },
  }
}

export function LogoConstellation({ className, windowPointer }: { className?: string; windowPointer?: boolean }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer={windowPointer}
      ariaLabel="Hark Digital logo drawn as a constellation network"
    />
  )
}
