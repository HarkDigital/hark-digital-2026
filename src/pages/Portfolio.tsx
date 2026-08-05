import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { Nav } from '@/components/site/Nav'
import { Cursor } from '@/components/site/Cursor'
import { Reveal } from '@/components/site/Reveal'
import { Contact } from '@/sections/Contact'
import { WORK, type WorkItem } from '@/data/work'
import { asset, cn } from '@/lib/utils'

// Map each project's specific industry to a broader, filterable sector.
const SECTOR: Record<string, string> = {
  clc: 'Real Estate',
  atlas: 'Real Estate',
  jomar: 'Manufacturing',
  schwing: 'Manufacturing',
  tixforgood: 'Nonprofit',
  amplifier: 'Nonprofit',
  cumberland: 'Healthcare',
  haines: 'Healthcare',
  reliablepower: 'Home Services',
  tricity: 'Home Services',
  ogren: 'Home Services',
  comtec: 'Technology',
  scribewise: 'Technology',
  acctrans: 'Logistics',
  outercoastal: 'Food & Drink',
}

const sectorOf = (id: string) => SECTOR[id] ?? 'Other'

/** Sector filters that have at least two projects, ordered most-first. */
function useFilters() {
  return useMemo(() => {
    const counts = new Map<string, number>()
    for (const w of WORK) {
      const s = sectorOf(w.id)
      counts.set(s, (counts.get(s) ?? 0) + 1)
    }
    const sectors = [...counts.entries()]
      .filter(([, n]) => n >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([s]) => s)
    return ['All', ...sectors]
  }, [])
}

function Card({ w }: { w: WorkItem }) {
  return (
    <motion.a
      layout
      href={w.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl border border-line">
        <img
          src={asset(`work/${w.id}.webp`)}
          alt={`${w.name} website`}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {/* wash + tag pills reveal on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-x-4 bottom-4 flex translate-y-3 flex-wrap gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {w.tags.map(t => (
            <span
              key={t}
              className="rounded-full border border-signal/40 bg-ink/60 px-2.5 py-1 font-mono text-[10px] tracking-wider text-signal uppercase backdrop-blur-sm"
            >
              {t}
            </span>
          ))}
        </div>
        <span className="absolute top-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-signal text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
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
    </motion.a>
  )
}

export default function Portfolio() {
  const filters = useFilters()
  const [active, setActive] = useState('All')

  useEffect(() => {
    document.title = 'Work · Hark Digital'
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Hark Digital · Software, Web Design & Aerial Media'
    }
  }, [])

  const filtered = active === 'All' ? WORK : WORK.filter(w => sectorOf(w.id) === active)

  return (
    <MotionConfig reducedMotion="user">
      <main className="grain min-h-dvh bg-ink text-paper">
        <Cursor />
        <Nav />

        {/* header */}
        <section className="mx-auto max-w-[1400px] px-5 pt-32 pb-10 md:px-10 md:pt-40">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.28em] text-signal uppercase">The portfolio</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.95] font-extrabold tracking-tight uppercase md:text-8xl">
              Proof, not <span className="text-signal italic">promises.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl leading-relaxed text-paper/70">
              Every project here is live and in the wild, from global manufacturers to the family
              dentist down the street. Filter by what we did.
            </p>
            <Link
              to="/reel"
              className="mt-4 inline-block font-mono text-xs tracking-[0.2em] text-signal uppercase transition-colors hover:text-paper"
            >
              Or watch the reel →
            </Link>
          </Reveal>

          {/* filter bar */}
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-2">
              {filters.map(f => {
                const count = f === 'All' ? WORK.length : WORK.filter(w => sectorOf(w.id) === f).length
                const on = f === active
                return (
                  <button
                    key={f}
                    onClick={() => setActive(f)}
                    className={cn(
                      'rounded-full border px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all',
                      on
                        ? 'border-signal bg-signal text-ink'
                        : 'border-line text-muted hover:border-signal/50 hover:text-signal'
                    )}
                  >
                    {f} <span className={cn('ml-1', on ? 'text-ink/60' : 'text-paper/30')}>{count}</span>
                  </button>
                )
              })}
            </div>
          </Reveal>
        </section>

        {/* grid */}
        <section className="mx-auto max-w-[1400px] px-5 pb-28 md:px-10 md:pb-36">
          <motion.div layout className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map(w => (
                <Card key={w.id} w={w} />
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <Contact />
      </main>
    </MotionConfig>
  )
}
