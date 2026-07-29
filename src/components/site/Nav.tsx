import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LogoMark } from './LogoMark'
import { SERVICES } from '@/data/services'
import { cn } from '@/lib/utils'

function ServicesDropdown() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onClick)
    }
  }, [open])

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          'flex items-center gap-1.5 font-mono text-xs tracking-[0.18em] uppercase transition-colors',
          open ? 'text-signal' : 'text-muted hover:text-signal'
        )}
      >
        Services
        <span className={cn('text-[9px] transition-transform duration-200', open && 'rotate-180')}>▼</span>
      </button>

      <div
        className={cn(
          'absolute top-full left-1/2 w-72 -translate-x-1/2 pt-4 transition-all duration-200',
          open ? 'visible opacity-100' : 'invisible -translate-y-1 opacity-0'
        )}
      >
        <div className="overflow-hidden rounded-xl border border-line bg-ink/95 shadow-2xl shadow-black/60 backdrop-blur-xl">
          {SERVICES.map(s => (
            <Link
              key={s.slug}
              to={`/services/${s.slug}`}
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-4 border-b border-line px-5 py-3.5 last:border-b-0 transition-colors hover:bg-ink-2"
            >
              <span className="font-display text-sm font-bold tracking-tight transition-colors group-hover:text-signal">
                {s.title}
              </span>
            </Link>
          ))}
          <a
            href={`${import.meta.env.BASE_URL}#services`}
            onClick={() => setOpen(false)}
            className="block bg-ink-2 px-5 py-3 text-center font-mono text-[10px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-signal"
          >
            All services ↓
          </a>
        </div>
      </div>
    </div>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'border-b border-line bg-ink/80 backdrop-blur-md' : 'bg-transparent'
        )}
      >
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10">
          <Link to="/" className="group flex items-center gap-3">
            <LogoMark className="h-8 w-8 text-paper transition-colors duration-300 group-hover:text-signal" />
            <span className="font-display text-sm font-bold tracking-[0.18em] uppercase">
              Hark<span className="text-signal">.</span><span className="text-muted">Digital</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              to="/work"
              className="font-mono text-xs tracking-[0.18em] text-muted uppercase transition-colors hover:text-signal"
            >
              Work
            </Link>
            <ServicesDropdown />
            <Link
              to="/insights"
              className="font-mono text-xs tracking-[0.18em] text-muted uppercase transition-colors hover:text-signal"
            >
              Insights
            </Link>
            <a
              href={`${import.meta.env.BASE_URL}#voices`}
              className="font-mono text-xs tracking-[0.18em] text-muted uppercase transition-colors hover:text-signal"
            >
              Clients
            </a>
            <Link
              to="/lab"
              className="font-mono text-xs tracking-[0.18em] text-muted uppercase transition-colors hover:text-signal"
            >
              Lab
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-paper/25 px-5 py-2 font-mono text-xs tracking-[0.18em] uppercase transition-all hover:border-signal hover:bg-signal hover:text-ink"
            >
              Start a project
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Menu"
            aria-expanded={open}
          >
            <span
              className={cn('h-px w-6 bg-paper transition-transform', open && 'translate-y-[3.5px] rotate-45')}
            />
            <span
              className={cn('h-px w-6 bg-paper transition-transform', open && '-translate-y-[3.5px] -rotate-45')}
            />
          </button>
        </nav>
      </header>

      {/* mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col justify-center gap-2 overflow-y-auto bg-ink/95 px-8 py-24 backdrop-blur-lg transition-opacity duration-300 md:hidden',
          // `invisible` also removes the closed menu's links from tab order & AT
          open ? 'opacity-100' : 'pointer-events-none invisible opacity-0'
        )}
      >
        <Link
          to="/work"
          onClick={() => setOpen(false)}
          className="border-b border-line py-4 font-display text-3xl font-bold"
        >
          <span className="mr-4 font-mono text-sm text-signal">01</span>
          Work
        </Link>
        <div className="border-b border-line py-4">
          <p className="font-display text-3xl font-bold">
            <span className="mr-4 font-mono text-sm text-signal">02</span>
            Services
          </p>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 pl-9">
            {SERVICES.map(s => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                onClick={() => setOpen(false)}
                className="font-mono text-[11px] leading-snug tracking-[0.12em] text-muted uppercase transition-colors hover:text-signal"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>
        <Link
          to="/insights"
          onClick={() => setOpen(false)}
          className="border-b border-line py-4 font-display text-3xl font-bold"
        >
          <span className="mr-4 font-mono text-sm text-signal">03</span>
          Insights
        </Link>
        <a
          href={`${import.meta.env.BASE_URL}#voices`}
          onClick={() => setOpen(false)}
          className="border-b border-line py-4 font-display text-3xl font-bold"
        >
          <span className="mr-4 font-mono text-sm text-signal">04</span>
          Clients
        </a>
        <Link
          to="/contact"
          onClick={() => setOpen(false)}
          className="border-b border-line py-4 font-display text-3xl font-bold"
        >
          <span className="mr-4 font-mono text-sm text-signal">05</span>
          Contact
        </Link>
        <Link
          to="/lab"
          onClick={() => setOpen(false)}
          className="py-4 font-mono text-sm tracking-[0.2em] text-muted uppercase"
        >
          → Logo Lab
        </Link>
      </div>
    </>
  )
}
