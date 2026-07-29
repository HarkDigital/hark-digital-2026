import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { createGlowSprite, sampleLogoPoints, type LogoPoint } from '@/lib/particles/logo'
import { paper, signal } from './shared'

// Adapted from Backgrounds/Fireflies.tsx + Sparkles.tsx — wandering,
// blinking glow-bugs, except this swarm keeps formation: each firefly
// tends a spot on the mark, so together they draw the logo in light.

interface Fly {
  x: number
  y: number
  vx: number
  vy: number
  home: number // index into anchor points
  blinkPhase: number
  blinkSpeed: number
  hue: 0 | 1 // 0 signal, 1 paper-white
}

/**
 * 11 — FIREFLIES
 * A swarm of glow-bugs holding the shape of the mark. Bring the cursor
 * close and they scatter, then drift back to their posts, blinking.
 */
function createScene(): ParticleScene {
  let anchors: LogoPoint[] = []
  let flies: Fly[] = []
  let spriteSignal: HTMLCanvasElement
  let spriteWhite: HTMLCanvasElement

  return {
    async init(w, h) {
      // sparse anchors: enough to read the mark, few enough to feel alive
      const gap = Math.max(10, Math.round(Math.min(w, h) / 46))
      anchors = await sampleLogoPoints({ width: w, height: h, gap, jitter: gap * 0.3 })
      flies = anchors.map((a, i) => ({
        x: a.x + (Math.random() - 0.5) * 80,
        y: a.y + (Math.random() - 0.5) * 80,
        vx: 0,
        vy: 0,
        home: i,
        blinkPhase: Math.random() * Math.PI * 2,
        blinkSpeed: 0.8 + Math.random() * 1.8,
        hue: Math.random() < 0.75 ? 0 : 1,
      }))
      spriteSignal = createGlowSprite('rgba(0,255,133,0.9)', 20)
      spriteWhite = createGlowSprite('rgba(255,255,255,0.8)', 20)
    },

    frame(ctx, _w, _h, pointer, dt, t) {
      const scareR2 = 110 * 110
      const damp = Math.exp(-1.9 * dt)

      ctx.globalCompositeOperation = 'lighter'
      for (const f of flies) {
        const home = anchors[f.home]
        // wandering pull toward the post + jitter, firefly-style
        let ax = (home.x - f.x) * 4.5 + (Math.random() - 0.5) * 260
        let ay = (home.y - f.y) * 4.5 + (Math.random() - 0.5) * 260

        if (pointer.inside) {
          const dx = f.x - pointer.x
          const dy = f.y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < scareR2) {
            const d = Math.sqrt(d2) || 1
            const f2 = ((110 - d) / 110) * 2000
            ax += (dx / d) * f2
            ay += (dy / d) * f2
          }
        }

        f.vx = (f.vx + ax * dt) * damp
        f.vy = (f.vy + ay * dt) * damp
        f.x += f.vx * dt
        f.y += f.vy * dt

        // blink: mostly dim, periodic bright pulses
        const blink = Math.sin(t * f.blinkSpeed + f.blinkPhase)
        const lit = blink > 0.2 ? (blink - 0.2) / 0.8 : 0
        const glow = 0.12 + lit * 0.88
        const sprite = f.hue === 0 ? spriteSignal : spriteWhite
        const s = 6 + lit * 12
        ctx.globalAlpha = glow
        ctx.drawImage(sprite, f.x - s / 2, f.y - s / 2, s, s)
        // the bug itself
        ctx.globalAlpha = 0.5 + lit * 0.5
        ctx.fillStyle = f.hue === 0 ? signal(1) : paper(0.9)
        ctx.fillRect(f.x - 0.8, f.y - 0.8, 1.6, 1.6)
      }
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
    },
  }
}

export function LogoFireflies({ className, windowPointer }: { className?: string; windowPointer?: boolean }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer={windowPointer}
      ariaLabel="Fireflies swarming in the shape of the Hark Digital logo"
    />
  )
}
