import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { sampleLogoPoints } from '@/lib/particles/logo'
import { adaptiveGap, isCoarsePointer, paper, signal, volt } from './shared'

// Adapted from Backgrounds/Ripple.tsx + Underwater.tsx — expanding rings
// on a still surface, except the water is made of the logo's particles.

interface Ripple {
  x: number
  y: number
  r: number
  speed: number
  amp: number
  maxR: number
}

interface P {
  hx: number
  hy: number
  phase: number
}

/**
 * 10 — RIPPLE
 * The mark floats on dark water. Raindrops — and your cursor — send
 * rings across it, bending the logo as they pass.
 */
function createScene(): ParticleScene {
  let parts: P[] = []
  let ripples: Ripple[] = []
  let dripAcc = 0
  let lastPointerRipple = 0
  const coarse = isCoarsePointer()
  let wasDown = false

  const drop = (x: number, y: number, big = false) => {
    ripples.push({
      x,
      y,
      r: 0,
      speed: big ? 260 : 170,
      amp: big ? 16 : 8,
      maxR: big ? 640 : 380,
    })
  }

  return {
    async init(w, h) {
      const gap = adaptiveGap(w, h, coarse ? 'medium' : 'dense')
      const pts = await sampleLogoPoints({ width: w, height: h, gap, jitter: gap * 0.2 })
      parts = pts.map(p => ({ hx: p.x, hy: p.y, phase: Math.random() * Math.PI * 2 }))
      ripples = []
    },

    frame(ctx, w, h, pointer, dt, t) {
      // ambient raindrops
      dripAcc += dt
      if (dripAcc > 1.4) {
        dripAcc = 0
        drop(w * (0.25 + Math.random() * 0.5), h * (0.2 + Math.random() * 0.6))
      }
      // cursor wake + click splash
      if (pointer.inside && t - lastPointerRipple > 0.45) {
        drop(pointer.x, pointer.y)
        lastPointerRipple = t
      }
      if (pointer.down && !wasDown && pointer.inside) drop(pointer.x, pointer.y, true)
      wasDown = pointer.down

      ripples = ripples.filter(rp => rp.r < rp.maxR)
      for (const rp of ripples) rp.r += rp.speed * dt

      for (const p of parts) {
        // gentle idle bob, like light chop on the surface
        let dx = Math.sin(t * 1.1 + p.phase) * 0.7
        let dy = Math.cos(t * 0.9 + p.phase * 1.3) * 0.7
        let crest = 0

        for (const rp of ripples) {
          const ddx = p.hx - rp.x
          const ddy = p.hy - rp.y
          const d = Math.sqrt(ddx * ddx + ddy * ddy) || 1
          const band = d - rp.r
          if (Math.abs(band) < 46) {
            const fade = 1 - rp.r / rp.maxR
            const wave = Math.sin(band * 0.18) * Math.exp(-(band * band) / (2 * 20 * 20)) * rp.amp * fade
            dx += (ddx / d) * wave
            dy += (ddy / d) * wave
            crest = Math.max(crest, Math.abs(wave) / rp.amp)
          }
        }

        const x = p.hx + dx
        const y = p.hy + dy
        // crests glint green-blue, calm water stays pale
        ctx.fillStyle =
          crest > 0.5 ? signal(0.5 + crest * 0.5) : crest > 0.18 ? volt(0.3 + crest * 0.6) : paper(0.5)
        const s = 1.5 + crest * 1.4
        ctx.fillRect(x - s / 2, y - s / 2, s, s)
      }

      // faint expanding ring outlines on the open water
      for (const rp of ripples) {
        const fade = (1 - rp.r / rp.maxR) * 0.16
        if (fade <= 0.01) continue
        ctx.strokeStyle = paper(fade)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.stroke()
      }
    },
  }
}

export function LogoRipple({ className, windowPointer }: { className?: string; windowPointer?: boolean }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer={windowPointer}
      ariaLabel="The Hark Digital logo floating on water, rippling as drops land"
    />
  )
}
