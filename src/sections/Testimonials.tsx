import { TESTIMONIALS, type Testimonial } from '@/data/testimonials'
import { Reveal } from '@/components/site/Reveal'

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[320px] shrink-0 rounded-xl border border-line bg-ink-2 p-6 md:w-[400px]">
      <span className="font-display text-4xl leading-none text-signal">“</span>
      <blockquote className="mt-2 text-sm leading-relaxed text-paper/80">{t.quote}</blockquote>
      <figcaption className="mt-5 flex items-baseline justify-between gap-3">
        <span className="font-display text-sm font-bold">{t.name}</span>
        <span className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{t.company}</span>
      </figcaption>
    </figure>
  )
}

export function Testimonials() {
  const top = TESTIMONIALS.slice(0, 4)
  const bottom = TESTIMONIALS.slice(4)
  return (
    <section id="voices" className="overflow-hidden py-24 md:py-36">
      <Reveal className="mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="font-mono text-xs tracking-[0.28em] text-signal uppercase">Client voices</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight font-bold tracking-tight md:text-6xl">
          We listen. They talk.
        </h2>
      </Reveal>

      {/* the animated strips are decorative duplicates; a screen-reader-only
          list below carries the real content once */}
      <div className="mt-14 space-y-6" aria-hidden="true">
        {/* 4 copies so the -50% loop point stays offscreen even on ultra-wide
            displays; under reduced motion the strips become swipeable rows */}
        <div className="motion-reduce:overflow-x-auto">
          <div className="flex w-max animate-marquee gap-6 pr-6 hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...top, ...top, ...top, ...top].map((t, i) => (
              <Card key={i} t={t} />
            ))}
          </div>
        </div>
        <div className="motion-reduce:overflow-x-auto">
          <div className="flex w-max animate-marquee-reverse gap-6 pr-6 hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...bottom, ...bottom, ...bottom, ...bottom].map((t, i) => (
              <Card key={i} t={t} />
            ))}
          </div>
        </div>
      </div>

      <ul className="sr-only">
        {TESTIMONIALS.map(t => (
          <li key={t.name}>
            {t.name}, {t.company}: “{t.quote}”
          </li>
        ))}
      </ul>
    </section>
  )
}
