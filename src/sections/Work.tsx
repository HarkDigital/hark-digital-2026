import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { WORK, type WorkItem } from '@/data/work'
import { Reveal } from '@/components/site/Reveal'
import { asset } from '@/lib/utils'

const featured = WORK.filter(w => w.featured)

function StripCard({ w }: { w: WorkItem }) {
  return (
    <a
      href={w.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-[78vw] shrink-0 sm:w-[52vw] lg:w-[40vw]"
    >
      <div className="relative overflow-hidden rounded-xl border border-line">
        <img
          src={asset(`work/${w.id}.webp`)}
          alt={`${w.name} website`}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute right-4 bottom-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-signal text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          ↗
        </span>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-signal md:text-2xl">
          {w.name}
        </h3>
        <span className="shrink-0 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
          {w.industry}
        </span>
      </div>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-paper/55">{w.blurb}</p>
    </a>
  )
}

function EndCard() {
  return (
    <div className="flex w-[70vw] shrink-0 flex-col items-start justify-center gap-5 rounded-xl border border-line bg-ink-2 p-8 sm:w-[40vw] lg:w-[26vw] lg:p-10">
      <p className="font-display text-2xl font-bold tracking-tight md:text-3xl">
        Nine more, all live.
      </p>
      <Link
        to="/work"
        className="rounded-full bg-signal px-6 py-3 font-mono text-xs font-medium tracking-[0.18em] text-ink uppercase transition-transform hover:scale-105"
      >
        All 15 projects
      </Link>
      <Link
        to="/reel"
        className="font-mono text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-signal"
      >
        Or watch the reel →
      </Link>
    </div>
  )
}

/**
 * SELECTED WORK — a filmstrip. The section pins while vertical scroll
 * drives the strip sideways through the six featured builds. Reduced
 * motion (and its users' sanity) gets a native swipe carousel instead.
 */
export function Work() {
  const reduced = useReducedMotion()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [shift, setShift] = useState(0)

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })

  useEffect(() => {
    if (reduced) return
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      // scrollWidth ignores the translate transform, so this stays stable
      setShift(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    let timer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(measure, 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  const rawX = useTransform(scrollYProgress, [0.04, 0.96], [0, -shift])
  const x = useSpring(rawX, { stiffness: 120, damping: 28 })
  const barScale = useTransform(scrollYProgress, [0.04, 0.96], [0, 1])

  const header = (
    <Reveal>
      <p className="font-mono text-xs tracking-[0.28em] text-signal uppercase">Selected work</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-3xl font-display text-4xl leading-tight font-bold tracking-tight md:text-6xl">
          Built to be heard.
        </h2>
        <Link
          to="/work"
          className="group font-mono text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-signal"
        >
          All 15 projects{' '}
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </Reveal>
  )

  if (reduced) {
    // native, snap-scrolling strip — same content, no pinning
    return (
      <section id="work" className="py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">{header}</div>
        <div className="mt-12 flex snap-x snap-mandatory gap-8 overflow-x-auto px-5 pb-4 md:px-10">
          {featured.map(w => (
            <div key={w.id} className="shrink-0 snap-start">
              <StripCard w={w} />
            </div>
          ))}
          <EndCard />
        </div>
      </section>
    )
  }

  return (
    <section id="work">
      <div ref={wrapperRef} className="relative h-[280vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">{header}</div>
          <motion.div
            ref={trackRef}
            style={{ x, willChange: 'transform' }}
            className="mt-12 flex items-start gap-8 pr-[10vw] pl-5 md:pl-10"
          >
            {featured.map(w => (
              <StripCard key={w.id} w={w} />
            ))}
            <EndCard />
          </motion.div>
          {/* progress rail */}
          <div className="mx-auto mt-10 h-px w-full max-w-[1400px] bg-line px-5 md:px-10">
            <motion.div style={{ scaleX: barScale }} className="h-px origin-left bg-signal" />
          </div>
        </div>
      </div>
    </section>
  )
}
