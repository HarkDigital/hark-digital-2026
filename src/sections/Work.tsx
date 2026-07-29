import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { WORK } from '@/data/work'
import { Reveal } from '@/components/site/Reveal'
import { asset } from '@/lib/utils'

const featured = WORK.filter(w => w.featured)
const more = WORK.filter(w => !w.featured)

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
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

      {/* featured grid */}
      <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2">
        {featured.map((w, i) => (
          <Reveal key={w.id} delay={(i % 2) * 0.08} className={i % 2 === 1 ? 'md:mt-20' : ''}>
            <a href={w.url} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="relative overflow-hidden rounded-xl border border-line">
                <img
                  src={asset(`work/${w.id}.webp`)}
                  alt={`${w.name} website`}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute right-4 bottom-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-signal text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  ↗
                </span>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-signal">
                  {w.name}
                </h3>
                <span className="shrink-0 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
                  {w.industry}
                </span>
              </div>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-paper/60">{w.blurb}</p>
            </a>
          </Reveal>
        ))}
      </div>

      {/* the rest: hover-preview list */}
      <MoreWork />
    </section>
  )
}

function MoreWork() {
  const [hover, setHover] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = previewRef.current
    if (!el) return
    // keep the floating preview fully inside the viewport
    const pw = 340
    const ph = pw * (10 / 16)
    const x = Math.min(e.clientX + 24, window.innerWidth - pw - 12)
    const y = Math.min(Math.max(e.clientY - 90, 12), window.innerHeight - ph - 12)
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  return (
    <div className="relative mt-24" onMouseMove={onMove}>
      <Reveal>
        <p className="mb-6 font-mono text-xs tracking-[0.28em] text-muted uppercase">And plenty more</p>
      </Reveal>
      <div className="border-t border-line">
        {more.map((w, i) => (
          <Reveal key={w.id} delay={Math.min(i * 0.03, 0.15)}>
            <a
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHover(w.id)}
              onMouseLeave={() => setHover(null)}
              className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 border-b border-line py-5 transition-colors hover:bg-ink-2 md:grid-cols-[1fr_auto_auto] md:px-4"
            >
              <h3 className="font-display text-xl font-bold tracking-tight transition-all duration-300 group-hover:translate-x-2 group-hover:text-signal md:text-2xl">
                {w.name}
              </h3>
              <span className="hidden font-mono text-[11px] tracking-[0.18em] text-muted uppercase md:block">
                {w.industry}
              </span>
              <span className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal">
                ↗
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      {/* floating screenshot that follows the cursor (desktop) */}
      <div
        ref={previewRef}
        className="pointer-events-none fixed top-0 left-0 z-30 hidden w-[340px] overflow-hidden rounded-lg border border-line shadow-2xl shadow-black/60 md:block"
        style={{ opacity: hover ? 1 : 0, transition: 'opacity 0.25s ease' }}
      >
        {/* no loading="lazy" here: display:none images would defer until first
            hover and flash blank — eager keeps the reveal instant */}
        {more.map(w => (
          <img
            key={w.id}
            src={asset(`work/${w.id}.webp`)}
            alt=""
            className="aspect-[16/10] w-full object-cover"
            style={{ display: hover === w.id ? 'block' : 'none' }}
          />
        ))}
      </div>
    </div>
  )
}
