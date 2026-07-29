import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { createGlowSprite, loadLogoImage } from '@/lib/particles/logo'
import { paper, pink, signal, volt } from './shared'

/**
 * 12 — SIPHON
 * The mark as a nebula: a glowing particle rim, dusty interior, and a
 * scattered halo. Every particle drifts gently on its own, so the mark
 * breathes even when nobody touches it. The cursor bends and brightens
 * the dust nearby — a quiet lean, not a storm. Click for a soft ripple.
 *
 * Density is edge-weighted on purpose: every edge pixel gets a particle,
 * the interior is sampled sparsely, and a soft halo scatters just outside
 * the silhouette.
 */

const KIND_EDGE = 0 // outermost line — glow sprites
const KIND_FILL = 1 // interior dust
const KIND_HALO = 2 // scattered dust outside the silhouette
const KIND_RIM = 3 // thick dense band just inside the edge

interface P {
  hx: number
  hy: number
  x: number
  y: number
  vx: number
  vy: number
  kind: number
  hue: number // 0 signal, 1 volt, 2 pink, 3 paper
  swirl: number // ±1 — which way this particle curls under the cursor
  alpha: number
  phase: number
  driftR: number // radius of the idle wander, px
  driftSpeed: number
}

const HUES = [signal, volt, pink, paper]

function pickHue(edge: boolean): number {
  const r = Math.random()
  if (edge) return r < 0.9 ? 0 : r < 0.95 ? 1 : 2
  return r < 0.62 ? 0 : r < 0.7 ? 1 : r < 0.74 ? 2 : 3
}

function createScene(): ParticleScene {
  let parts: P[] = []
  let glow: HTMLCanvasElement
  let glowVolt: HTMLCanvasElement
  let glowPink: HTMLCanvasElement
  let trail: HTMLCanvasElement | null = null
  let tctx: CanvasRenderingContext2D | null = null
  let wasDown = false

  return {
    async init(w, h) {
      const img = await loadLogoImage()
      const dim = Math.min(w, h)

      // rasterize once and read the alpha map for edge detection
      const raster = document.createElement('canvas')
      raster.width = w
      raster.height = h
      const rctx = raster.getContext('2d', { willReadFrequently: true })!
      const size = dim * 0.72
      rctx.drawImage(img, (w - size) / 2, (h - size) / 2, size, size)
      const alpha = rctx.getImageData(0, 0, w, h).data
      const solid = (x: number, y: number) => {
        if (x < 0 || y < 0 || x >= w || y >= h) return false
        return alpha[((y | 0) * w + (x | 0)) * 4 + 3] > 140
      }

      const eGap = Math.max(2, Math.round(dim / 320)) // base sampling step
      const rimW = eGap * 5 // width of the dense rim band
      parts = []

      const push = (x: number, y: number, kind: number, jitter: number, driftR: number, driftSpeed: number) =>
        parts.push({
          hx: x + (Math.random() - 0.5) * jitter,
          hy: y + (Math.random() - 0.5) * jitter,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          kind,
          hue: pickHue(kind === KIND_EDGE || kind === KIND_RIM),
          swirl: Math.random() < 0.5 ? 1 : -1,
          alpha: 1,
          phase: Math.random() * Math.PI * 2,
          driftR,
          driftSpeed,
        })

      // one pass over the solid area, classified by distance to the boundary:
      // outer line (glow) → thick rim band (packed grain) → interior dust
      for (let y = 0; y < h; y += eGap) {
        for (let x = 0; x < w; x += eGap) {
          if (!solid(x, y)) continue
          const onLine =
            !solid(x - eGap * 2, y) ||
            !solid(x + eGap * 2, y) ||
            !solid(x, y - eGap * 2) ||
            !solid(x, y + eGap * 2)
          if (onLine) {
            // brightest outer line — doubled up so the contour is packed
            push(x, y, KIND_EDGE, eGap, 2.5 + Math.random() * 2.5, 0.45 + Math.random() * 0.7)
            push(x, y, KIND_EDGE, eGap * 2, 2.5 + Math.random() * 2.5, 0.45 + Math.random() * 0.7)
            continue
          }
          const inRim =
            !solid(x - rimW, y) ||
            !solid(x + rimW, y) ||
            !solid(x, y - rimW) ||
            !solid(x, y + rimW) ||
            !solid(x - rimW * 0.7, y - rimW * 0.7) ||
            !solid(x + rimW * 0.7, y + rimW * 0.7) ||
            !solid(x - rimW * 0.7, y + rimW * 0.7) ||
            !solid(x + rimW * 0.7, y - rimW * 0.7)
          if (inRim) {
            // dense band hugging the edge — the mass of the mark
            if (Math.random() < 0.9) {
              push(x, y, KIND_RIM, eGap, 3 + Math.random() * 3, 0.45 + Math.random() * 0.7)
            }
          } else if (Math.random() < 0.5) {
            // interior dust — every base cell gets a coin flip, so the fill
            // reads as continuous grain while staying looser than the rim
            push(x, y, KIND_FILL, eGap * 1.5, 4 + Math.random() * 3.5, 0.5 + Math.random() * 0.8)
          }
        }
      }

      // halo: dust scattered just outside the silhouette
      const reach = eGap * 7
      const hGap = eGap * 2
      for (let y = 0; y < h; y += hGap) {
        for (let x = 0; x < w; x += hGap) {
          if (solid(x, y)) continue
          const near =
            solid(x - reach, y) || solid(x + reach, y) || solid(x, y - reach) || solid(x, y + reach)
          if (!near || Math.random() > 0.5) continue
          parts.push({
            hx: x + (Math.random() - 0.5) * reach * 1.6,
            hy: y + (Math.random() - 0.5) * reach * 1.6,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            kind: KIND_HALO,
            hue: pickHue(false),
            swirl: Math.random() < 0.5 ? 1 : -1,
            alpha: 1,
            phase: Math.random() * Math.PI * 2,
            driftR: 6 + Math.random() * 6,
            driftSpeed: 0.4 + Math.random() * 0.7,
          })
        }
      }

      // perf cap: thin uniformly if a huge viewport oversamples
      const MAX = 14000
      if (parts.length > MAX) {
        const keep = MAX / parts.length
        parts = parts.filter(() => Math.random() < keep)
      }

      for (const p of parts) {
        p.x = p.hx
        p.y = p.hy
      }

      glow = createGlowSprite('rgba(0,255,133,0.85)', 16)
      glowVolt = createGlowSprite('rgba(0,255,133,0.85)', 16)
      glowPink = createGlowSprite('rgba(255,255,255,0.85)', 16)

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      trail = document.createElement('canvas')
      trail.width = Math.round(w * dpr)
      trail.height = Math.round(h * dpr)
      tctx = trail.getContext('2d')
      tctx?.scale(dpr, dpr)
    },

    frame(ctx, w, h, pointer, dt, t) {
      if (!trail || !tctx) return

      // fading trail buffer → the dotted stream threads
      const fade = 1 - Math.pow(1 - 0.1, dt * 60)
      tctx.globalCompositeOperation = 'destination-out'
      tctx.fillStyle = `rgba(0,0,0,${fade.toFixed(4)})`
      tctx.fillRect(0, 0, w, h)
      tctx.globalCompositeOperation = 'source-over'

      const R = Math.min(w, h) * 0.46 // cursor influence radius
      const blast = pointer.down && !wasDown && pointer.inside
      wasDown = pointer.down
      const damp = Math.exp(-3.4 * dt)

      for (const p of parts) {
        // idle wander: each particle slowly orbits a moving target near home,
        // so the whole mark breathes even with no pointer around
        const ox = Math.cos(t * p.driftSpeed + p.phase) * p.driftR
        const oy = Math.sin(t * p.driftSpeed * 1.31 + p.phase * 1.7) * p.driftR
        let ax = (p.hx + ox - p.x) * 22
        let ay = (p.hy + oy - p.y) * 22

        if (pointer.inside) {
          const dx = pointer.x - p.x
          const dy = pointer.y - p.y
          const d = Math.hypot(dx, dy) || 1
          if (d < R) {
            // a quiet lean toward the cursor with a hint of curl —
            // equilibrium displacement tops out around 12-15px
            const fall = Math.pow(1 - d / R, 2)
            const pull = 950 * fall
            ax += (dx / d) * pull + (-dy / d) * p.swirl * pull * 0.4
            ay += (dy / d) * pull + (dx / d) * p.swirl * pull * 0.4
          }
          if (blast) {
            const bf = Math.max(0, 1 - d / 340)
            p.vx -= (dx / d) * 300 * bf
            p.vy -= (dy / d) * 300 * bf
          }
        }

        p.vx = (p.vx + ax * dt) * damp
        p.vy = (p.vy + ay * dt) * damp
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.alpha = Math.min(1, p.alpha + dt * 1.8)

        // brisk movement (fast sweeps, click ripples) leaves a faint wake
        const speed = Math.abs(p.vx) + Math.abs(p.vy)
        if (speed > 55) {
          tctx.fillStyle = HUES[p.hue](0.4 * p.alpha)
          tctx.fillRect(p.x - 0.7, p.y - 0.7, 1.4, 1.4)
        }
      }

      ctx.drawImage(trail, 0, 0, w, h)

      // the mark itself
      const glowR = Math.min(w, h) * 0.28
      ctx.globalCompositeOperation = 'lighter'
      for (const p of parts) {
        if (p.kind === KIND_EDGE) {
          const shimmer = 0.72 + 0.28 * Math.sin(t * 2.1 + p.phase)
          // particles near the pointer glow a touch warmer
          let lift = 0
          if (pointer.inside) {
            const dd = Math.hypot(p.x - pointer.x, p.y - pointer.y)
            if (dd < glowR) lift = (1 - dd / glowR) * 0.65
          }
          const sprite = p.hue === 1 ? glowVolt : p.hue === 2 ? glowPink : glow
          const s = 5.5 + shimmer * 4 + lift * 5
          ctx.globalAlpha = Math.min(1, p.alpha * (0.5 + shimmer * 0.4 + lift))
          ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s)
        }
      }
      ctx.globalCompositeOperation = 'source-over'
      for (const p of parts) {
        if (p.kind === KIND_EDGE) {
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = p.hue === 3 ? paper(0.9) : HUES[p.hue](0.95)
          ctx.fillRect(p.x - 0.8, p.y - 0.8, 1.6, 1.6)
        } else if (p.kind === KIND_RIM) {
          const tw = 0.55 + 0.25 * Math.sin(t * 1.8 + p.phase)
          ctx.globalAlpha = p.alpha * tw
          ctx.fillStyle = HUES[p.hue](1)
          ctx.fillRect(p.x - 0.9, p.y - 0.9, 1.8, 1.8)
        } else if (p.kind === KIND_FILL) {
          const tw = 0.34 + 0.16 * Math.sin(t * 1.6 + p.phase)
          ctx.globalAlpha = p.alpha * tw
          ctx.fillStyle = HUES[p.hue](1)
          ctx.fillRect(p.x - 0.8, p.y - 0.8, 1.6, 1.6)
        } else {
          const tw = 0.1 + 0.1 * Math.abs(Math.sin(t * 1.2 + p.phase))
          ctx.globalAlpha = p.alpha * tw
          ctx.fillStyle = HUES[p.hue](1)
          ctx.fillRect(p.x - 0.7, p.y - 0.7, 1.4, 1.4)
        }
      }
      ctx.globalAlpha = 1
    },
  }
}

export function LogoSiphon({ className, windowPointer }: { className?: string; windowPointer?: boolean }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer={windowPointer}
      ariaLabel="The Hark Digital logo as a glowing nebula, streaming particles toward the cursor"
    />
  )
}
