import { Link } from 'react-router-dom'
import { SERVICES } from '@/data/services'
import { Reveal } from '@/components/site/Reveal'

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.28em] text-signal uppercase">What we do</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight font-bold tracking-tight md:text-6xl">
          Eleven ways to be heard.
        </h2>
      </Reveal>

      <div className="mt-14 border-t border-line">
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} delay={Math.min(i * 0.04, 0.2)}>
            <Link
              to={`/services/${s.slug}`}
              className="group grid grid-cols-1 items-baseline gap-x-5 border-b border-line py-7 transition-colors duration-300 hover:bg-ink-2 md:grid-cols-[1fr_auto] md:gap-x-10 md:px-6"
            >
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-2 md:text-4xl">
                  {s.title}
                  <span className="ml-4 inline-block -translate-x-2 text-xl text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-signal group-hover:opacity-100">
                    ↗
                  </span>
                </h3>
                <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pt-4 leading-relaxed text-paper/70">{s.blurb}</p>
                    <div className="flex flex-wrap gap-2 pt-4 pb-1 md:hidden">
                      {s.tags.map(t => (
                        <span
                          key={t}
                          className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-wider text-muted uppercase"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden max-w-xs flex-wrap justify-end gap-2 self-center md:flex">
                {s.tags.map(t => (
                  <span
                    key={t}
                    className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-wider text-muted uppercase transition-colors group-hover:border-signal/40 group-hover:text-paper/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
