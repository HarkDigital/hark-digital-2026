import { Reveal } from '@/components/site/Reveal'

const USES = [
  'Cinematic productions',
  'Real estate marketing',
  'Construction progress',
  'Inspections',
  'Action sports',
  'Web & social imagery',
]

/** Contour-line backdrop evoking an aerial topographic view. */
function Contours() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 800 600"
      aria-hidden="true"
    >
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse
          key={i}
          cx={560 - i * 6}
          cy={300 + i * 4}
          rx={60 + i * 52}
          ry={36 + i * 34}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-paper"
          transform={`rotate(${-14 + i * 2} 560 300)`}
        />
      ))}
      <circle cx="560" cy="300" r="4" className="fill-signal" />
    </svg>
  )
}

export function Aerial() {
  return (
    <section id="aerial" className="relative overflow-hidden border-y border-line bg-ink-2">
      <Contours />
      <div className="relative mx-auto grid max-w-[1400px] gap-12 px-5 py-24 md:grid-cols-2 md:px-10 md:py-36">
        <div>
          <Reveal>
            <p className="font-mono text-xs tracking-[0.28em] text-signal uppercase">Aerial media</p>
            <h2 className="mt-4 font-display text-4xl leading-tight font-bold tracking-tight md:text-6xl">
              Eyes in the sky, licensed to fly.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg leading-relaxed text-paper/70">
              Mike is an FAA Part 107 licensed remote pilot. That means legal, insured, professional
              drone work: cinematic aerials that make listings sell faster, job sites easier to
              track, and brands impossible to ignore.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex gap-12">
              <div>
                <p className="font-display text-5xl font-extrabold text-signal md:text-6xl">107</p>
                <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
                  FAA Part licensed
                </p>
              </div>
              <div>
                <p className="font-display text-5xl font-extrabold text-signal md:text-6xl">4K</p>
                <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
                  Cinema-grade video
                </p>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="self-center">
          <Reveal delay={0.15}>
            <ul className="border-t border-line">
              {USES.map((u, i) => (
                <li
                  key={u}
                  className="group flex items-center gap-5 border-b border-line py-4 transition-colors hover:bg-ink-3"
                >
                  <span className="font-mono text-xs text-signal">0{i + 1}</span>
                  <span className="font-display text-lg font-semibold tracking-tight transition-transform group-hover:translate-x-2 md:text-xl">
                    {u}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
