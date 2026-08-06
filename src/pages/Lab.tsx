import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LOGO_VARIANTS } from '@/components/logo'
import { Contact } from '@/sections/Contact'
import { cn } from '@/lib/utils'

/**
 * The Logo Lab — eleven particle interpretations of the Hark mark.
 * Pick one for the hero; keep the rest as easter eggs.
 */
export default function Lab() {
  const [params] = useSearchParams()
  const initial = Math.max(
    0,
    LOGO_VARIANTS.findIndex(v => v.id === params.get('v'))
  )
  const [active, setActive] = useState(initial)
  const variant = LOGO_VARIANTS[active]
  const Scene = variant.Component

  return (
    <main className="bg-ink text-paper">
    <div className="relative h-dvh w-full overflow-hidden bg-ink">
      <Scene key={variant.id} className="absolute inset-0" />

      {/* top bar */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-6">
        <Link
          to="/"
          className="pointer-events-auto font-mono text-xs tracking-[0.3em] text-muted uppercase transition-colors hover:text-paper"
        >
          ← hark.digital
        </Link>
        <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">logo lab</span>
      </header>

      {/* variant info */}
      <div className="pointer-events-none absolute bottom-28 left-6 z-10 max-w-sm md:bottom-24 md:left-10">
        <p className="font-mono text-xs text-signal">{variant.num} / {String(LOGO_VARIANTS.length).padStart(2, '0')}</p>
        <h1 className="mt-1 font-display text-4xl font-bold tracking-tight">{variant.name}</h1>
        <p className="mt-2 text-sm text-muted">{variant.hint}</p>
      </div>

      {/* switcher */}
      <nav className="absolute inset-x-0 bottom-0 z-10 overflow-x-auto border-t border-line bg-ink/70 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex w-max gap-1">
        {LOGO_VARIANTS.map((v, i) => (
          <button
            key={v.id}
            onClick={() => setActive(i)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all',
              i === active
                ? 'border-signal bg-signal text-ink'
                : 'border-line text-muted hover:border-paper/40 hover:text-paper'
            )}
          >
            {v.num} {v.name}
          </button>
        ))}
        </div>
      </nav>
    </div>
    <Contact />
    </main>
  )
}
