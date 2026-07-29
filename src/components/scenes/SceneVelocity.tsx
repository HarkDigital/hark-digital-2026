import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { paper, signal } from '@/components/logo/shared'

interface Streak {
  a: number // angle
  r: number // 0..1 distance out from the gauge
  len: number
  speed: number
}

/**
 * PAGE SPEED — a performance gauge (à la Lighthouse / PageSpeed) that sweeps
 * up to a green score, ringed by speed streaks that fly outward faster as the
 * score climbs. Move the cursor left/right to rev the meter up and down.
 */
function createScene(): ParticleScene {
  let value = 0 // 0..1, current displayed score
  let streaks: Streak[] = []

  return {
    init() {
      value = 0.2
      streaks = Array.from({ length: 64 }, () => ({
        a: Math.random() * Math.PI * 2,
        r: Math.random(),
        len: 0.05 + Math.random() * 0.1,
        speed: 0.3 + Math.random() * 1.1,
      }))
    },

    frame(ctx, w, h, pointer, dt, t) {
      const cx = w * 0.58
      const cy = h * 0.4
      const R = Math.min(w, h) * 0.3

      // target: idles as a healthy green score with a gentle wobble; the
      // cursor's horizontal position revs it from ~40 up to ~100
      let target = 0.93 + Math.sin(t * 0.9) * 0.05
      let revving = 0
      if (pointer.inside) {
        target = 0.4 + Math.min(1, Math.max(0, pointer.x / w)) * 0.6
        revving = 1
      }
      value += (target - value) * Math.min(1, dt * 3.2)

      const START = Math.PI * 0.75 // 135°, bottom-left
      const SWEEP = Math.PI * 1.5 // 270° clockwise
      const ang = (v: number) => START + SWEEP * v

      // tick marks around the dial
      for (let i = 0; i <= 20; i++) {
        const v = i / 20
        const a = ang(v)
        const major = i % 5 === 0
        const inner = R * (major ? 0.86 : 0.92)
        ctx.strokeStyle = paper(v <= value ? 0.22 : 0.08)
        ctx.lineWidth = major ? 2 : 1
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner)
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R)
        ctx.stroke()
      }

      // arc track + green progress with a soft glow
      const AR = R * 0.72
      ctx.lineCap = 'round'
      ctx.strokeStyle = paper(0.08)
      ctx.lineWidth = 10
      ctx.beginPath()
      ctx.arc(cx, cy, AR, START, START + SWEEP)
      ctx.stroke()

      ctx.strokeStyle = signal(0.16)
      ctx.lineWidth = 22
      ctx.beginPath()
      ctx.arc(cx, cy, AR, START, ang(value))
      ctx.stroke()
      ctx.strokeStyle = signal(0.95)
      ctx.lineWidth = 10
      ctx.beginPath()
      ctx.arc(cx, cy, AR, START, ang(value))
      ctx.stroke()

      // needle
      const na = ang(value)
      ctx.strokeStyle = paper(0.85)
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(na) * AR * 0.82, cy + Math.sin(na) * AR * 0.82)
      ctx.stroke()
      ctx.fillStyle = signal(0.95)
      ctx.beginPath()
      ctx.arc(cx, cy, 5, 0, Math.PI * 2)
      ctx.fill()

      // score readout
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = signal(0.95)
      ctx.font = `700 ${Math.round(R * 0.5)}px 'Syne Variable', sans-serif`
      ctx.fillText(String(Math.round(value * 100)), cx, cy + R * 0.02)
      ctx.fillStyle = paper(0.45)
      ctx.font = `400 ${Math.round(R * 0.075)}px 'Archivo Black', sans-serif`
      ctx.fillText('SCORE', cx, cy + R * 0.3)

      // speed streaks radiating outward, faster and brighter as the score rises
      const spd = 0.25 + value * 1.7 + revving * 0.5
      for (const s of streaks) {
        s.r += s.speed * spd * dt * 0.4
        if (s.r > 1.3) {
          s.r = 0.1
          s.a = Math.random() * Math.PI * 2
        }
        const r0 = R * (1.12 + s.r * 0.85)
        const r1 = r0 + R * s.len * (0.5 + value)
        ctx.strokeStyle = signal(0.04 + value * 0.14)
        ctx.lineWidth = 1.3
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(s.a) * r0, cy + Math.sin(s.a) * r0)
        ctx.lineTo(cx + Math.cos(s.a) * r1, cy + Math.sin(s.a) * r1)
        ctx.stroke()
      }
    },
  }
}

export function SceneVelocity({ className }: { className?: string }) {
  return (
    <ParticleCanvas
      createScene={createScene}
      className={className}
      windowPointer
      ariaLabel="A page speed score gauge sweeping up to a green score"
    />
  )
}
