import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { Nav } from '@/components/site/Nav'
import { Cursor } from '@/components/site/Cursor'
import { Reveal } from '@/components/site/Reveal'
import { Contact } from '@/sections/Contact'
import { WORK, type WorkItem } from '@/data/work'
import { asset, cn } from '@/lib/utils'

const FEATURED_IDS = ['scribewise', 'acctrans', 'reliablepower'] as const
const FEATURED = FEATURED_IDS.map(id => WORK.find(w => w.id === id)!)
const CREDITS: WorkItem[] = [...FEATURED, ...WORK.filter(w => !(FEATURED_IDS as readonly string[]).includes(w.id))]

const domain = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')
const pad = (n: number) => String(Math.floor(n)).padStart(2, '0')

/* ---------------------------------------------------------------- cold open */

function ColdOpen() {
  const lines = [
    { text: 'The', accent: false },
    { text: 'Feature', accent: false },
    { text: 'Presentation', accent: true },
  ]
  return (
    <section className="relative flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5">
      <p className="absolute top-28 font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
        Hark Digital presents
      </p>
      <h1 className="text-center font-display text-[clamp(26px,6.9vw,150px)] leading-[0.9] font-extrabold tracking-tight uppercase">
        {lines.map((l, i) => (
          <span key={l.text} className="block overflow-hidden">
            <motion.span
              className={cn('block', l.accent && 'text-signal italic')}
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {l.text}
            </motion.span>
          </span>
        ))}
      </h1>
      <p className="mt-8 font-mono text-xs tracking-[0.22em] text-paper/60 uppercase">
        15 live sites · 3 reels · one take
      </p>
      <div className="absolute bottom-10 flex flex-col items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Scroll to roll</span>
        <motion.span
          className="block h-10 w-px origin-top bg-signal/70"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- chapters */

interface ChapterProps {
  w: WorkItem
  n: number
  mirrored: boolean
  onActive: (n: number) => void
  registerRef: (n: number, el: HTMLDivElement | null) => void
}

function ReelChapter({ w, n, mirrored, onActive, registerRef }: ChapterProps) {
  const reduced = useReducedMotion()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [fullScale, setFullScale] = useState(2.6)

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })

  useEffect(() => {
    const measure = () => {
      const el = frameRef.current
      if (!el) return
      // offsetWidth ignores the animated scale transform, so the measurement
      // is stable no matter when a resize fires mid-scroll
      if (el.offsetWidth > 0) setFullScale(Math.max(1, window.innerWidth / el.offsetWidth + 0.02))
    }
    measure()
    let timer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(measure, 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (v > 0.01 && v < 0.99) onActive(n)
  })

  // beats: A title 0-.25 · B zoom .25-.55 · C pan .55-.8 · D cut .8-.95
  const titleOpacity = useTransform(scrollYProgress, [0, 0.08, 0.25, 0.38], [0, 1, 1, 0])
  const titleY = useTransform(scrollYProgress, [0, 0.08, 0.25, 0.38], [32, 0, 0, -48])
  const numeralY = useTransform(scrollYProgress, [0, 0.55], [0, -56])
  const numeralOpacity = useTransform(scrollYProgress, [0, 0.08, 0.3, 0.5], [0, 0.55, 0.55, 0.14])
  const rawScale = useTransform(scrollYProgress, [0, 0.18, 0.25, 0.55], [0.85, 1, 1, fullScale])
  const frameScale = useSpring(rawScale, { stiffness: 120, damping: 26 })
  const frameOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1])
  const gradOpacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 0.75])
  const panY = useTransform(scrollYProgress, [0.55, 0.8], ['0%', '-23%'])
  const thirdOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.93, 1], [0, 1, 1, 0])
  const thirdY = useTransform(scrollYProgress, [0.55, 0.65], [24, 0])
  // opacity alone leaves the pill clickable/tabbable while invisible
  const thirdVisibility = useTransform(thirdOpacity, v => (v < 0.02 ? 'hidden' : 'visible'))
  const barScale = useTransform(scrollYProgress, [0.8, 0.95], [0, 1])

  if (reduced) {
    // static cut: the chapter's final composed state, no pinning
    return (
      <section className="relative border-t border-line px-5 py-24 md:px-[6vw]">
        <span aria-hidden className="text-stroke pointer-events-none absolute top-8 right-0 font-display text-[30vw] leading-none font-extrabold opacity-20 lg:text-[18vw]">
          {pad(n)}
        </span>
        <p className="font-mono text-xs tracking-[0.2em] uppercase">
          <span className="text-muted">Reel {pad(n)} — </span>
          <span className="text-signal">{w.industry}</span>
        </p>
        <h2 className="mt-3 font-display text-[clamp(40px,7vw,110px)] leading-[0.9] font-extrabold tracking-tight uppercase">
          {w.name}
        </h2>
        <div className="mt-8 max-w-4xl overflow-hidden border border-line">
          <img src={asset(`work/${w.id}.webp`)} alt={`${w.name} website`} className="aspect-[16/10] w-full object-cover object-top" />
        </div>
        <p className="mt-6 max-w-[46ch] leading-relaxed text-paper/75">{w.blurb}</p>
        <p className="mt-2 font-mono text-[11px] tracking-[0.16em] text-muted uppercase">{w.tags.join(' / ')}</p>
        <a
          href={w.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full border border-line px-6 py-3 font-mono text-xs tracking-[0.18em] uppercase transition-colors hover:bg-signal hover:text-ink"
        >
          Visit site ↗
        </a>
      </section>
    )
  }

  return (
    <div
      ref={el => {
        wrapperRef.current = el
        registerRef(n, el)
      }}
      className="relative h-[300vh] lg:h-[400vh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* ghost numeral */}
        <motion.span
          aria-hidden
          style={{ y: numeralY, opacity: numeralOpacity }}
          className={cn(
            'text-stroke pointer-events-none absolute top-1/2 -translate-y-1/2 font-display text-[clamp(220px,38vw,560px)] leading-none font-extrabold select-none',
            mirrored ? 'left-[-4vw]' : 'right-[-4vw]'
          )}
        >
          {pad(n)}
        </motion.span>

        {/* title card */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className={cn(
            'absolute top-[16vh] z-10 max-w-[88vw]',
            mirrored ? 'right-[6vw] text-right' : 'left-[6vw]'
          )}
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase">
            <span className="text-muted">Reel {pad(n)} — </span>
            <span className="text-signal">{w.industry}</span>
          </p>
          <h2 className="mt-3 font-display text-[clamp(26px,6.5vw,72px)] leading-[0.9] font-extrabold tracking-tight break-words uppercase [text-shadow:0_2px_14px_rgba(13,13,13,0.9)] lg:text-[clamp(44px,7vw,120px)]">
            {w.name}
          </h2>
        </motion.div>

        {/* the frame */}
        <div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            mirrored ? 'lg:left-[42%]' : 'lg:left-[58%]'
          )}
        >
          <motion.div
            ref={frameRef}
            style={{ scale: frameScale, opacity: frameOpacity, willChange: 'transform' }}
            className="relative aspect-[16/10] w-[86vw] overflow-hidden border border-line bg-ink-2 lg:w-[38vw]"
          >
            <motion.img
              src={asset(`work/${w.id}.webp`)}
              alt={`${w.name} website`}
              style={{ y: panY }}
              className="h-[130%] w-full object-cover object-top"
            />
            <motion.div
              style={{ opacity: gradOpacity }}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink to-transparent"
            />
          </motion.div>
        </div>

        {/* lower third, with its own viewport-anchored scrim — the frame's
            gradient scales past the fold and can't guarantee legibility */}
        <motion.div
          style={{ opacity: thirdOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[48vh] bg-gradient-to-t from-ink via-ink/70 to-transparent"
        />
        <motion.div
          style={{ y: thirdY, opacity: thirdOpacity, visibility: thirdVisibility }}
          className="absolute bottom-0 z-20 w-full px-[6vw] pb-10 lg:pb-14"
        >
          <p className="font-mono text-xs tracking-[0.2em] text-signal uppercase">{w.industry}</p>
          <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-paper/85 md:text-base">{w.blurb}</p>
          <p className="mt-2 font-mono text-[11px] tracking-[0.16em] text-paper/70 uppercase">{w.tags.join(' / ')}</p>
          <a
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block rounded-full border border-paper/30 bg-ink/40 px-6 py-3 font-mono text-xs tracking-[0.18em] uppercase backdrop-blur-sm transition-colors hover:bg-signal hover:text-ink"
          >
            Visit site ↗
          </a>
        </motion.div>

        {/* letterbox cut */}
        <motion.div style={{ scaleY: barScale }} className="pointer-events-none absolute inset-x-0 top-0 z-30 h-1/2 origin-top bg-ink" />
        <motion.div style={{ scaleY: barScale }} className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-1/2 origin-bottom bg-ink" />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- end credits */

function EndCredits() {
  const [previewId, setPreviewId] = useState<string>(FEATURED[0].id)
  const preview = CREDITS.find(w => w.id === previewId)!

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.28em] text-signal uppercase">End credits</p>
        <h2 className="mt-4 font-display text-[clamp(40px,6vw,96px)] leading-[0.9] font-extrabold tracking-tight uppercase">
          Also <span className="text-signal italic">starring</span>
        </h2>
      </Reveal>

      <div className="mt-12 gap-10 lg:grid lg:grid-cols-12">
        {/* the roll */}
        <div className="lg:col-span-7">
          {CREDITS.map((w, i) => (
            <Reveal key={w.id} delay={Math.min(i * 0.04, 0.3)} y={16}>
              <a
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setPreviewId(w.id)}
                onFocus={() => setPreviewId(w.id)}
                className={cn(
                  'group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line py-5 lg:grid-cols-[3.5rem_1fr_auto]',
                  i === 0 && 'border-t'
                )}
              >
                <span className="font-mono text-xs tracking-[0.2em] text-muted transition-colors group-hover:text-signal">
                  {pad(i + 1)}
                </span>
                <span className="flex min-w-0 items-center gap-3 transition-transform duration-300 group-hover:translate-x-2">
                  <img
                    src={asset(`work/${w.id}.webp`)}
                    alt=""
                    loading="lazy"
                    width={64}
                    height={40}
                    className="h-10 w-16 shrink-0 rounded-sm border border-line object-cover object-top lg:hidden"
                  />
                  <span className="min-w-0">
                    <span className="block truncate font-display text-[clamp(20px,6vw,28px)] leading-[1.05] font-extrabold tracking-tight uppercase transition-colors group-hover:text-signal lg:text-[clamp(24px,2.6vw,44px)]">
                      {w.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] tracking-[0.16em] text-muted uppercase lg:hidden">
                      {w.industry}
                    </span>
                  </span>
                  {i < 3 && (
                    <span className="shrink-0 rounded-full border border-signal px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-signal uppercase">
                      Reel
                    </span>
                  )}
                </span>
                <span className="hidden text-right font-mono text-[10px] tracking-[0.16em] text-muted uppercase lg:block">
                  {w.industry}
                  <span className="mt-0.5 block text-muted normal-case">{domain(w.url)}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        {/* the screen */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-[20vh]">
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-line bg-ink-2">
              <AnimatePresence initial={false}>
                <motion.img
                  key={preview.id}
                  src={asset(`work/${preview.id}.webp`)}
                  alt={`${preview.name} website`}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </AnimatePresence>
            </div>
            <p className="mt-3 flex items-baseline justify-between font-mono text-[10px] tracking-[0.18em] uppercase">
              <span className="text-paper/70">{preview.name}</span>
              <span className="text-muted">{domain(preview.url)}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------- HUD */

function Hud({ activeReel, cut, visible }: { activeReel: number; cut: boolean; visible: boolean }) {
  const { scrollYProgress } = useScroll()
  const timeRef = useRef<HTMLSpanElement>(null)

  useMotionValueEvent(scrollYProgress, 'change', v => {
    const total = v * 150 // a fake 2m30s runtime
    const frames = (total * 24) % 24
    if (timeRef.current)
      timeRef.current.textContent = `00:${pad(total / 60)}:${pad(total % 60)}:${pad(frames)}`
  })

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="pointer-events-none fixed inset-0 z-40 font-mono text-[11px] tracking-[0.18em] uppercase"
    >
      <span className="absolute top-24 left-5 flex items-center gap-2 md:left-10">
        {cut ? (
          <span className="text-signal">Cut.</span>
        ) : (
          <>
            <span className="h-2 w-2 animate-pulse rounded-full bg-signal" />
            <span className="text-paper/70">Rec</span>
          </>
        )}
      </span>
      <span className="absolute top-24 right-5 text-paper/70 md:right-10">Reel {pad(activeReel)} / 03</span>
      <span ref={timeRef} className="absolute bottom-6 left-5 text-paper/70 tabular-nums md:left-10">
        00:00:00:00
      </span>
      <span className="absolute right-5 bottom-6 hidden text-muted md:block md:right-10">
        15 sites — Philadelphia, PA
      </span>
    </motion.div>
  )
}

/* --------------------------------------------------------------------- page */

export default function Reel() {
  const reduced = useReducedMotion()
  const [activeReel, setActiveReel] = useState(1)
  const [started, setStarted] = useState(false)
  const chapterRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const endRef = useRef<HTMLDivElement>(null)
  const cut = useInView(endRef, { margin: '0px 0px -30% 0px' })
  const contactRef = useRef<HTMLDivElement>(null)
  const contactInView = useInView(contactRef, { margin: '0px 0px -20% 0px' })

  const { scrollYProgress } = useScroll()
  useMotionValueEvent(scrollYProgress, 'change', v => setStarted(v > 0.03))

  useEffect(() => {
    document.title = 'The Reel · Hark Digital'
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Hark Digital · Software, Web Design & Aerial Media'
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <main className="grain min-h-dvh bg-ink text-paper">
        <Cursor />
        <Nav />

        {!reduced && <Hud activeReel={activeReel} cut={cut} visible={started && !contactInView} />}

        {/* right-edge chapter index */}
        {!reduced && (
          <div className="fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
            {[1, 2, 3].map(nn => (
              <button
                key={nn}
                onClick={() => {
                  const el = chapterRefs.current[nn]
                  if (!el) return
                  // land 15% into the chapter's scroll range: the title card is
                  // fully faded in there, and scrollIntoView would be pushed off
                  // by the global scroll-padding-top
                  const top =
                    el.getBoundingClientRect().top +
                    window.scrollY +
                    (el.offsetHeight - window.innerHeight) * 0.15
                  window.scrollTo({ top, behavior: 'smooth' })
                }}
                className={cn(
                  'font-mono text-[11px] tracking-[0.18em]',
                  activeReel === nn && started ? 'text-signal' : 'text-muted hover:text-paper'
                )}
                aria-label={`Go to reel ${nn}`}
              >
                {pad(nn)}
              </button>
            ))}
          </div>
        )}

        <ColdOpen />

        {FEATURED.map((w, i) => (
          <ReelChapter
            key={w.id}
            w={w}
            n={i + 1}
            mirrored={i === 1}
            onActive={setActiveReel}
            registerRef={(n, el) => {
              chapterRefs.current[n] = el
            }}
          />
        ))}

        {/* intermission */}
        <section className="flex min-h-[60vh] items-center justify-center border-y border-line bg-ink-2 px-5">
          <Reveal className="py-24 text-center">
            <p className="font-mono text-xs tracking-[0.28em] text-muted uppercase">Intermission</p>
            <p className="mt-6 font-display text-[clamp(28px,4.5vw,72px)] leading-[1.05] font-extrabold tracking-tight uppercase">
              Fifteen sites. One <span className="text-signal italic">builder</span>. Zero templates.
            </p>
          </Reveal>
        </section>

        <EndCredits />

        {/* post-credits scene */}
        <section ref={endRef} className="flex min-h-[80vh] flex-col items-center justify-center gap-6 border-t border-line px-5 text-center">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.28em] text-muted uppercase">Post-credits scene</p>
            <h2 className="mt-6 font-display text-[clamp(48px,8vw,128px)] leading-[0.9] font-extrabold tracking-tight uppercase">
              Your site is <span className="text-signal italic">next</span>
            </h2>
            <div className="mt-10 flex flex-col items-center gap-6">
              <a
                href="#contact"
                className="rounded-full bg-signal px-8 py-4 font-mono text-xs font-medium tracking-[0.18em] text-ink uppercase transition-transform hover:scale-105"
              >
                Start a project
              </a>
              <Link
                to="/work"
                className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-signal"
              >
                Prefer the classic grid? Browse the portfolio →
              </Link>
            </div>
          </Reveal>
        </section>

        <div ref={contactRef}>
          <Contact />
        </div>
      </main>
    </MotionConfig>
  )
}
