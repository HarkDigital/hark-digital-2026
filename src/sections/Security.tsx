import { Reveal } from '@/components/site/Reveal'

export function Security() {
  return (
    <section className="bg-signal text-ink">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-20 md:grid-cols-[1fr_auto] md:px-10 md:py-28">
        <div>
          <Reveal>
            <p className="font-mono text-xs font-medium tracking-[0.28em] uppercase">
              Hack remediation · Website & data security
            </p>
            <h2 className="mt-4 font-display text-[10.5vw] leading-[0.95] font-extrabold tracking-tight uppercase md:text-7xl">
              Hacked? Breathe.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-base leading-relaxed font-medium md:text-lg">
              We find the breach, clean the infection, restore your site, and lock the door behind
              us. Then we keep watch, hardening, monitoring, and backups, so it never happens
              again.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <a
            href="mailto:mike@hark.digital?subject=Emergency%3A%20my%20site%20was%20hacked"
            className="inline-block rounded-full border-2 border-ink px-8 py-4 font-mono text-sm font-medium tracking-[0.18em] uppercase transition-all hover:bg-ink hover:text-signal"
          >
            Emergency cleanup →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
