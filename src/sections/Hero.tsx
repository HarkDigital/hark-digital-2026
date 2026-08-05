import { Link } from 'react-router-dom'
import { LogoConstellation } from '@/components/logo/LogoConstellation'
import { Reveal } from '@/components/site/Reveal'

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-dvh flex-col justify-end overflow-hidden">
      {/* the mark, lit by the cursor — anywhere on screen */}
      <LogoConstellation className="absolute inset-0" windowPointer />

      {/* radial vignette so text stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(13,13,13,0.72)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-24 md:px-10 md:pb-16">
        <Reveal>
          <p className="mb-5 font-mono text-xs tracking-[0.28em] text-muted uppercase md:text-sm">
            hark <span className="text-signal">/härk/</span> · verb · to listen attentively
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display text-[11vw] leading-[0.95] font-extrabold tracking-tight text-balance uppercase md:text-[7.5vw]">
            Make the internet{' '}
            <span className="text-signal italic">listen.</span>
          </h1>
        </Reveal>
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.2} className="max-w-xl">
            <p className="text-base leading-relaxed text-paper/75 md:text-lg">
              Hark Digital builds software, websites, ecommerce, and aerial media for publicly
              traded companies, government entities, and mom‑and‑pop pizza shops alike.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="#work"
                className="rounded-full bg-signal px-7 py-3 font-mono text-xs font-medium tracking-[0.18em] text-ink uppercase transition-transform hover:scale-105"
              >
                See the work ↓
              </a>
              <Link
                to="/contact"
                className="rounded-full border border-paper/25 px-7 py-3 font-mono text-xs tracking-[0.18em] uppercase transition-colors hover:border-signal hover:text-signal"
              >
                Start a project
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="font-mono text-[11px] leading-loose tracking-[0.2em] text-muted uppercase md:text-right">
              Philadelphia → everywhere
              <br />
              est. 2016
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
