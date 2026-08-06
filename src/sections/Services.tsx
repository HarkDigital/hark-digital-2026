import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { SERVICES, type Service } from '@/data/services'
import { SERVICE_PAGES } from '@/data/servicePages'
import { SERVICE_ICONS } from '@/data/serviceIcons'
import { Icon } from '@/components/site/Icons'
import { Reveal } from '@/components/site/Reveal'

const COUNT = SERVICES.length
const GAP = 24 // matches gap-6 on the stack
const stickyTop = (i: number) => 88 + i * 8

/** the slice of container scroll progress during which card i is covered */
interface Window {
  start: number
  end: number
}

interface CardProps {
  s: Service
  i: number
  progress: MotionValue<number>
  win: Window | null
  flat: boolean
}

/**
 * One card in the stack. Cards are sticky at slightly increasing top
 * offsets so each one slides over the previous; a covered card eases
 * back and dims. Cover windows are measured from real card geometry
 * (not uniform slices) so the dim tracks the actual overlap, the last
 * card is never dimmed, and fully-buried cards go inert so keyboard
 * focus can't land on invisible links.
 */
function StackCard({ s, i, progress, win, flat }: CardProps) {
  const reduced = useReducedMotion()
  const page = SERVICE_PAGES.find(p => p.slug === s.slug)
  const icons = SERVICE_ICONS[s.slug]
  const animate = !flat && !reduced && win !== null

  const covered = useTransform(progress, animate ? [win.start, win.end] : [2, 3], [0, 1])
  const scale = useTransform(covered, [0, 1], [1, 0.95])
  const filter = useTransform(covered, v => `brightness(${1 - v * 0.35})`)
  const [buried, setBuried] = useState(false)
  useMotionValueEvent(covered, 'change', v => setBuried(v >= 0.98))

  return (
    <div
      data-stack-card
      className={flat ? undefined : 'sticky'}
      style={flat ? undefined : { top: stickyTop(i) }}
      inert={buried || undefined}
    >
      <motion.div
        style={animate ? { scale, filter } : undefined}
        className="origin-top overflow-hidden rounded-2xl border border-line bg-ink-2"
      >
        <Link
          to={`/services/${s.slug}`}
          aria-labelledby={`svc-card-${s.slug}`}
          className="group grid gap-8 p-7 md:grid-cols-[1.2fr_1fr] md:gap-12 md:p-12"
        >
          <div>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-signal/35 text-signal">
                <Icon name={icons.service} size={24} />
              </span>
              <h3
                id={`svc-card-${s.slug}`}
                className="font-display text-3xl font-bold tracking-tight transition-colors group-hover:text-signal md:text-5xl"
              >
                {s.title}
              </h3>
            </div>
            <p className="mt-6 max-w-xl leading-relaxed text-paper/70">{s.blurb}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {s.tags.map(t => (
                <span
                  key={t}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-wider text-muted uppercase"
                >
                  {t}
                </span>
              ))}
            </div>
            <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-signal uppercase">
              Explore the service
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </span>
          </div>

          {/* what's inside, from the service page's own feature list */}
          {page && (
            <ul className="grid content-center gap-4 border-line max-md:border-t max-md:pt-7 md:border-l md:pl-12">
              {page.features.map((f, fi) => (
                <li key={f.title} className="flex items-center gap-3.5">
                  <Icon name={icons.features[fi]} size={19} className="text-muted" />
                  <span className="text-sm text-paper/80 md:text-base">{f.title}</span>
                </li>
              ))}
            </ul>
          )}
        </Link>
      </motion.div>
    </div>
  )
}

export function Services() {
  const stackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] })
  const [wins, setWins] = useState<(Window | null)[]>(() => SERVICES.map(() => null))
  // short viewports can't fit a pinned card above the fold: fall back to plain flow
  const [flat, setFlat] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-height: 750px)')
    const applyMq = () => setFlat(mq.matches)
    applyMq()
    mq.addEventListener('change', applyMq)

    const measure = () => {
      const els = stackRef.current?.querySelectorAll<HTMLElement>('[data-stack-card]')
      if (!els || els.length !== COUNT) return
      // flow offsets from layout heights: sticky/transform-independent
      const hs = [...els].map(el => el.offsetHeight)
      const offs: number[] = []
      let acc = 0
      for (const h of hs) {
        offs.push(acc)
        acc += h + GAP
      }
      const span = Math.max(1, acc - GAP - window.innerHeight)
      setWins(
        SERVICES.map((_, k) => {
          if (k >= COUNT - 1) return null // the last card is never covered
          const start = (offs[k + 1] - stickyTop(k) - hs[k]) / span
          const end = (offs[k + 1] - stickyTop(k + 1)) / span
          return { start: Math.max(0, start), end: Math.min(1, Math.max(end, start + 0.01)) }
        })
      )
    }
    measure()
    let timer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(measure, 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      mq.removeEventListener('change', applyMq)
      window.removeEventListener('resize', onResize)
      clearTimeout(timer)
    }
  }, [])

  return (
    <section id="services" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.28em] text-signal uppercase">What we do</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight font-bold tracking-tight md:text-6xl">
          Eleven ways to be heard.
        </h2>
      </Reveal>

      <div ref={stackRef} className="relative mt-14 flex flex-col gap-6">
        {SERVICES.map((s, i) => (
          <StackCard key={s.slug} s={s} i={i} progress={scrollYProgress} win={wins[i]} flat={flat} />
        ))}
      </div>
    </section>
  )
}
