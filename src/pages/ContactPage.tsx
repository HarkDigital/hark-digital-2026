import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Nav } from '@/components/site/Nav'
import { Cursor } from '@/components/site/Cursor'
import { Reveal } from '@/components/site/Reveal'
import { LogoMark } from '@/components/site/LogoMark'
import { cn } from '@/lib/utils'

const SERVICE_OPTIONS = [
  'Web Design',
  'Software Development',
  'Ecommerce',
  'SEO / GEO',
  'AI Consulting',
  'Aerial Photography & Video',
  'Hack Remediation',
  'Website & Data Security',
  'ADA Accessibility',
  'WordPress',
  'Something else',
]

type Status = 'idle' | 'submitting' | 'success' | 'error'

const fieldClass =
  'w-full rounded-lg border border-line bg-ink-2 px-4 py-3 text-paper placeholder:text-muted/60 outline-none transition-colors focus:border-signal'
const labelClass = 'mb-2 block font-mono text-[11px] tracking-[0.18em] text-muted uppercase'

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Contact · Hark Digital'
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Hark Digital · Software, Web Design & Aerial Media'
    }
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('submitting')
    setError('')
    const payload = Object.fromEntries(new FormData(form).entries())
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error || `Request failed (${res.status})`)
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  return (
    <main className="grain min-h-dvh bg-ink text-paper">
      <Cursor />
      <Nav />

      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 pt-32 pb-24 md:grid-cols-[0.85fr_1.15fr] md:gap-20 md:px-10 md:pt-40">
        {/* left: pitch + direct details */}
        <div>
          <Reveal>
            <p className="font-mono text-xs tracking-[0.28em] text-signal uppercase">Start a project</p>
            <h1 className="mt-4 font-display text-6xl leading-[0.92] font-extrabold tracking-tight uppercase md:text-7xl">
              Say hello<span className="text-signal">.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md leading-relaxed text-paper/70">
              Tell us what you are building, fixing, or dreaming up. New project, a site that got
              hacked, or eyes in the sky, we read every message and reply like a human.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 space-y-4">
              <a
                href="mailto:mike@hark.digital"
                className="block font-mono text-sm tracking-[0.14em] text-paper transition-colors hover:text-signal"
              >
                mike@hark.digital
              </a>
              <div className="flex items-center gap-3 pt-4">
                <LogoMark className="h-8 w-8 text-paper" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
                  Philadelphia · Everywhere · est. 2016
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* right: form */}
        <Reveal delay={0.15}>
          <div className="rounded-2xl border border-line bg-ink-2/40 p-6 md:p-10">
            {status === 'success' ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-signal text-2xl text-ink">
                  ✓
                </span>
                <h2 className="mt-6 font-display text-3xl font-bold tracking-tight">Message sent.</h2>
                <p className="mt-3 max-w-sm text-paper/70">
                  Thanks for reaching out. We will get back to you shortly, usually within a business
                  day.
                </p>
                <Link
                  to="/"
                  className="mt-8 rounded-full border border-paper/25 px-6 py-3 font-mono text-xs tracking-[0.18em] uppercase transition-colors hover:border-signal hover:text-signal"
                >
                  Back home
                </Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-5" noValidate>
                {/* honeypot: hidden from humans, catches bots */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Name *
                    </label>
                    <input id="name" name="name" required className={fieldClass} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={fieldClass}
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="company" className={labelClass}>
                      Company
                    </label>
                    <input id="company" name="company" className={fieldClass} placeholder="Optional" />
                  </div>
                  <div>
                    <label htmlFor="service" className={labelClass}>
                      What do you need?
                    </label>
                    <select id="service" name="service" defaultValue="" className={cn(fieldClass, 'appearance-none')}>
                      <option value="" disabled>
                        Choose one…
                      </option>
                      {SERVICE_OPTIONS.map(s => (
                        <option key={s} value={s} className="bg-ink-2">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className={cn(fieldClass, 'resize-y')}
                    placeholder="Tell us about your project, timeline, and anything else that helps."
                  />
                </div>

                {status === 'error' && (
                  <p className="font-mono text-xs tracking-wide text-signal">
                    {error}. You can also email us directly at mike@hark.digital.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="mt-1 w-full rounded-full bg-signal px-7 py-4 font-mono text-xs font-medium tracking-[0.18em] text-ink uppercase transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send message →'}
                </button>
                <p className="text-center font-mono text-[10px] tracking-[0.15em] text-muted/70 uppercase">
                  We reply to every message. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </section>

      {/* slim footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-5 py-8 md:flex-row md:px-10">
          <Link to="/" className="flex items-center gap-3">
            <LogoMark className="h-7 w-7 text-paper transition-colors hover:text-signal" />
            <span className="font-display text-sm font-bold tracking-[0.18em] uppercase">
              Hark<span className="text-signal">.</span><span className="text-muted">Digital</span>
            </span>
          </Link>
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            © {new Date().getFullYear()} Hark Digital Design
          </p>
        </div>
      </footer>
    </main>
  )
}
