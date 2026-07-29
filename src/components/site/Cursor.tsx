import { useEffect, useRef } from 'react'

/**
 * Custom cursor: a signal dot with a lagging ring that swells over links
 * and buttons. Desktop pointers only; the native cursor stays visible.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let x = -100
    let y = -100
    let rx = -100
    let ry = -100
    let hovering = false
    let raf = 0
    let running = false

    const loop = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      const scale = hovering ? 2.2 : 1
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${scale})`
      ring.style.borderColor = hovering ? 'rgba(0,255,133,0.9)' : 'rgba(255,255,255,0.45)'
      // sleep once the ring has caught up — resumes on the next mousemove
      if (Math.abs(x - rx) < 0.1 && Math.abs(y - ry) < 0.1) {
        running = false
        return
      }
      raf = requestAnimationFrame(loop)
    }

    const wake = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      const target = e.target as HTMLElement
      hovering = !!target.closest('a, button, [data-cursor]')
      wake()
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    wake()
    dot.style.opacity = '1'
    ring.style.opacity = '1'

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[100] size-1.5 rounded-full bg-signal opacity-0"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[100] size-8 rounded-full border opacity-0 transition-[border-color] duration-200"
      />
    </>
  )
}
