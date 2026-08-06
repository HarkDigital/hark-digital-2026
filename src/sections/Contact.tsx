import { Link } from 'react-router-dom'
import { LogoGlow } from '@/components/logo/LogoGlow'
import { LogoMark } from '@/components/site/LogoMark'
import { Reveal } from '@/components/site/Reveal'

export function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-line">
      {/* constellation mark drifting behind the CTA */}
      <LogoGlow className="absolute inset-0 opacity-45" windowPointer />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(13,13,13,0.85)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-[1400px] flex-col justify-between px-5 py-20 md:px-10">
        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <Reveal>
            <Link
              to="/contact"
              className="block font-display text-[14vw] leading-none font-extrabold tracking-tight uppercase transition-colors duration-300 hover:text-signal md:text-[9vw]"
            >
              Say hello<span className="text-signal">.</span>
            </Link>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              to="/contact"
              className="mt-10 inline-block rounded-full bg-signal px-8 py-4 font-mono text-xs font-medium tracking-[0.18em] text-ink uppercase shadow-[0_6px_28px_rgba(13,13,13,0.9)] transition-transform hover:scale-105"
            >
              Contact
            </Link>
          </Reveal>
        </div>

        <div className="flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark className="h-10 w-10 text-paper" />
            <div>
              <p className="font-display text-sm font-bold tracking-[0.18em] uppercase">
                Hark<span className="text-signal">.</span><span className="text-muted">Digital</span>
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
                Philadelphia · Everywhere · est. 2016
              </p>
            </div>
          </div>

          <p className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            © {new Date().getFullYear()} Hark Digital Design
          </p>
        </div>
      </div>
    </footer>
  )
}
