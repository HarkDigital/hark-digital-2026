import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface PointerState {
  x: number
  y: number
  /** true once the pointer has been over the canvas at least once */
  inside: boolean
  down: boolean
}

export interface ParticleScene {
  /** called once per (re)size with CSS-pixel dimensions */
  init(w: number, h: number): void | Promise<void>
  /** called every animation frame; dt in seconds (clamped), t in seconds */
  frame(ctx: CanvasRenderingContext2D, w: number, h: number, pointer: PointerState, dt: number, t: number): void
  destroy?(): void
}

interface Props {
  createScene: () => ParticleScene
  className?: string
  /** track the pointer across the whole window instead of only over the canvas */
  windowPointer?: boolean
  ariaLabel?: string
}

/**
 * Generic canvas runner: DPR-aware sizing, pointer tracking (mouse + touch),
 * pauses when scrolled offscreen, honors prefers-reduced-motion by rendering
 * a single settled frame.
 */
export function ParticleCanvas({ createScene, className, windowPointer = false, ariaLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scene = createScene()
    const pointer: PointerState = { x: -9999, y: -9999, inside: false, down: false }
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let running = false
    let disposed = false
    let w = 0
    let h = 0
    let last = performance.now()
    const start = last

    // test hook: `?autopilot` drives a synthetic cursor so headless
    // screenshots can exercise the pointer interactions
    const autopilot = window.location.search.includes('autopilot')

    const renderFrame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 20)
      last = now
      const t = (now - start) / 1000
      if (autopilot) {
        pointer.inside = true
        pointer.x = w / 2 + Math.cos(t * 1.4) * w * 0.2
        pointer.y = h / 2 + Math.sin(t * 1.9) * h * 0.22
      }
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, w, h)
      scene.frame(ctx, w, h, pointer, dt, t)
      ctx.restore()
    }

    const loop = (now: number) => {
      if (!running || disposed) return
      renderFrame(now)
      raf = requestAnimationFrame(loop)
    }

    let debugHandle: unknown
    if (import.meta.env.DEV) {
      // manual stepping for debugging in environments where RAF is suspended
      debugHandle = {
        step: (ms = 16.7) => renderFrame((last || performance.now()) + ms),
        scene,
        pointer,
        info: () => ({ w, h, running, disposed }),
      }
      ;(window as unknown as Record<string, unknown>).__particleDebug = debugHandle
    }

    const play = () => {
      if (running || disposed || reducedMotion) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const pause = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const resize = async () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2) // zoom / monitor changes
      const rect = container.getBoundingClientRect()
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      await scene.init(w, h)
      if (disposed) return
      if (reducedMotion) {
        // settle the simulation invisibly, then draw one static frame
        for (let i = 0; i < 180; i++) {
          ctx.save()
          ctx.scale(dpr, dpr)
          ctx.clearRect(0, 0, w, h)
          scene.frame(ctx, w, h, pointer, 1 / 60, i / 60)
          ctx.restore()
        }
        renderFrame(performance.now())
      }
    }

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.inside = true
    }
    const onMove = (e: PointerEvent) => toLocal(e)
    const onDown = (e: PointerEvent) => {
      toLocal(e)
      pointer.down = true
    }
    const onUp = () => {
      pointer.down = false
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
      pointer.inside = false
      pointer.down = false
    }

    const pointerTarget: HTMLElement | Window = windowPointer ? window : container
    pointerTarget.addEventListener('pointermove', onMove as EventListener, { passive: true })
    pointerTarget.addEventListener('pointerdown', onDown as EventListener, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    if (!windowPointer) container.addEventListener('pointerleave', onLeave)

    const ro = new ResizeObserver(() => {
      void resize()
    })
    ro.observe(container)

    const io = new IntersectionObserver(
      entries => {
        // entries arrive oldest-first; only the newest state matters
        if (entries[entries.length - 1]?.isIntersecting) play()
        else pause()
      },
      { threshold: 0.01 }
    )
    io.observe(container)

    void resize().then(play)

    return () => {
      disposed = true
      pause()
      const win = window as unknown as Record<string, unknown>
      if (import.meta.env.DEV && win.__particleDebug === debugHandle) delete win.__particleDebug
      ro.disconnect()
      io.disconnect()
      pointerTarget.removeEventListener('pointermove', onMove as EventListener)
      pointerTarget.removeEventListener('pointerdown', onDown as EventListener)
      window.removeEventListener('pointerup', onUp)
      if (!windowPointer) container.removeEventListener('pointerleave', onLeave)
      scene.destroy?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={containerRef} className={cn('relative', className)} role="img" aria-label={ariaLabel}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
