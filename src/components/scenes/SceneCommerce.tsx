import { ParticleCanvas, type ParticleScene } from '@/lib/particles/useParticleCanvas'
import { paper, signal } from '@/components/logo/shared'

interface Ping {
  x: number
  y: number
  age: number
}

/**
 * ECOMMERCE — a live revenue sparkline climbing to the right,
 * with lime "sale" pings. Hover the chart to ring one up yourself.
 */
// Bounded, mean-reverting random walk: gentle ups and downs around a healthy
// midline, no dramatic spikes or resets — reads like a normal analytics chart.
const TARGET = 0.55
const nextValue = (prev: number) => {
  const v = prev + (TARGET - prev) * 0.05 + (Math.random() - 0.5) * 0.045
  return Math.min(0.82, Math.max(0.2, v))
}

function createScene(): ParticleScene {
  let values: number[] = []
  let pings: Ping[] = []
  let acc = 0
  let lastHoverPing = 0

  return {
    init(w) {
      const n = Math.max(40, Math.floor(w / 26))
      let v = 0.5
      values = Array.from({ length: n }, () => (v = nextValue(v)))
      pings = []
    },

    frame(ctx, w, h, pointer, dt, t) {
      acc += dt
      const STEP = 0.38
      while (acc > STEP) {
        acc -= STEP
        values.push(nextValue(values[values.length - 1]))
        values.shift()
        if (Math.random() < 0.3) {
          const i = values.length - 1
          pings.push({ x: (i / (values.length - 1)) * w, y: 0, age: 0 })
        }
      }

      const pad = h * 0.18
      const toY = (v: number) => h - pad - v * (h - pad * 2)
      const dx = w / (values.length - 1)
      const shift = (acc / STEP) * dx // sub-step slide for smooth motion

      // baseline grid
      ctx.strokeStyle = paper(0.06)
      ctx.lineWidth = 1
      for (let i = 1; i <= 3; i++) {
        const y = pad + ((h - pad * 2) / 4) * i
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // area fill
      ctx.beginPath()
      ctx.moveTo(-shift, toY(values[0]))
      values.forEach((v, i) => ctx.lineTo(i * dx - shift, toY(v)))
      ctx.lineTo(w, h)
      ctx.lineTo(-shift, h)
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, pad, 0, h)
      grad.addColorStop(0, signal(0.12))
      grad.addColorStop(1, signal(0))
      ctx.fillStyle = grad
      ctx.fill()

      // line
      ctx.beginPath()
      ctx.moveTo(-shift, toY(values[0]))
      values.forEach((v, i) => ctx.lineTo(i * dx - shift, toY(v)))
      ctx.strokeStyle = paper(0.75)
      ctx.lineWidth = 1.6
      ctx.stroke()

      // head dot with pulse
      const hx = (values.length - 1) * dx - shift
      const hy = toY(values[values.length - 1])
      ctx.fillStyle = signal(0.95)
      ctx.beginPath()
      ctx.arc(hx, hy, 3.5 + Math.sin(t * 6) * 1, 0, Math.PI * 2)
      ctx.fill()

      // cursor ping
      if (pointer.inside && t - lastHoverPing > 0.6) {
        const i = Math.round(((pointer.x + shift) / w) * (values.length - 1))
        if (i >= 0 && i < values.length && Math.abs(toY(values[i]) - pointer.y) < 60) {
          pings.push({ x: pointer.x, y: 0, age: 0 })
          lastHoverPing = t
        }
      }

      // pings ride the chart line
      pings = pings.filter(p => p.age < 1.4)
      for (const p of pings) {
        p.age += dt
        p.x -= (dx / STEP) * dt
        const i = Math.min(values.length - 1, Math.max(0, Math.round(((p.x + shift) / w) * (values.length - 1))))
        const py = toY(values[i])
        const a = 1 - p.age / 1.4
        ctx.strokeStyle = signal(a * 0.8)
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.arc(p.x, py, 4 + p.age * 26, 0, Math.PI * 2)
        ctx.stroke()
      }
    },
  }
}

export function SceneCommerce({ className }: { className?: string }) {
  return <ParticleCanvas createScene={createScene} className={className} windowPointer ariaLabel="A rising sales chart with pings for each sale" />
}
