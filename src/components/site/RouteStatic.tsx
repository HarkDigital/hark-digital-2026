import { useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

/**
 * TV-static page transitions. On every route change the screen fills with
 * analog noise — random grain, horizontal tear bands, scanlines, and a few
 * brand-colored pixels — then the new page tunes in.
 *
 * The overlay snaps to opaque in the same commit as the route swap
 * (useLayoutEffect runs before paint), so the old page is never seen
 * "jumping" to the new one.
 */
export function RouteStatic() {
  const location = useLocation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'idle' | 'on' | 'fading'>('idle')
  const first = useRef(true)

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    // land at the top of the new page (unless deep-linking to an anchor)
    if (!location.hash) window.scrollTo(0, 0)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    setPhase('on')
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // low-res buffer upscaled with pixelated rendering = chunky CRT grain
    const w = (canvas.width = Math.max(2, Math.ceil(window.innerWidth / 3)))
    const h = (canvas.height = Math.max(2, Math.ceil(window.innerHeight / 3)))
    const img = ctx.createImageData(w, h)
    const data = img.data

    let running = true
    let raf = 0
    const draw = () => {
      if (!running) return
      for (let i = 0; i < data.length; i += 4) {
        // high-contrast analog snow
        const v = Math.random() < 0.5 ? Math.random() * 90 : 160 + Math.random() * 95
        data[i] = data[i + 1] = data[i + 2] = v
        data[i + 3] = 255
      }
      // a sprinkle of brand-colored pixels in the noise
      const sparks = (data.length / 4) * 0.012
      for (let n = 0; n < sparks; n++) {
        const p = ((Math.random() * (data.length / 4)) | 0) * 4
        if (Math.random() < 0.6) {
          data[p] = 0
          data[p + 1] = 255
          data[p + 2] = 133 // signal green
        } else {
          data[p] = 255
          data[p + 1] = 255
          data[p + 2] = 255 // white
        }
      }
      ctx.putImageData(img, 0, 0)
      // horizontal tear bands, like a rolling sync glitch
      for (let b = 0; b < 3; b++) {
        const y = (Math.random() * h) | 0
        const bandH = 2 + ((Math.random() * 6) | 0)
        const shift = ((Math.random() - 0.5) * w * 0.24) | 0
        ctx.drawImage(canvas, 0, y, w, bandH, shift, y, w, bandH)
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    const fadeTimer = setTimeout(() => setPhase('fading'), 400)
    const endTimer = setTimeout(() => {
      running = false
      cancelAnimationFrame(raf)
      setPhase('idle')
    }, 700)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      clearTimeout(fadeTimer)
      clearTimeout(endTimer)
    }
  }, [location.pathname, location.hash])

  return (
    <div
      aria-hidden="true"
      className={cn(
        'fixed inset-0 z-[95]',
        phase === 'on' && 'opacity-100 transition-none',
        phase === 'fading' && 'pointer-events-none opacity-0 transition-opacity duration-300',
        phase === 'idle' && 'pointer-events-none invisible opacity-0'
      )}
    >
      <canvas ref={canvasRef} className="h-full w-full [image-rendering:pixelated]" />
      {/* scanlines + vignette over the snow */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.28)_0px,rgba(0,0,0,0.28)_1px,transparent_2px,transparent_4px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  )
}
