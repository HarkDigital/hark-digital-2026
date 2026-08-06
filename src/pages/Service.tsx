import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Nav } from '@/components/site/Nav'
import { Cursor } from '@/components/site/Cursor'
import { Reveal } from '@/components/site/Reveal'
import { Contact } from '@/sections/Contact'
import { SCENES } from '@/components/scenes'
import { SERVICE_PAGES } from '@/data/servicePages'
import { SERVICE_CONTENT } from '@/data/serviceContent'
import { SERVICE_ICONS } from '@/data/serviceIcons'
import { Icon } from '@/components/site/Icons'

const DEFAULT_DESCRIPTION =
  'Hark Digital · software development, web design, ecommerce, SEO/GEO, security, ADA accessibility, and aerial media. From publicly traded companies to mom-and-pop pizza shops.'

/** Injects a JSON-LD structured-data script for the lifetime of the page. */
function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data)
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = json
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [json])
  return null
}

export default function Service() {
  const { slug } = useParams()
  const index = SERVICE_PAGES.findIndex(p => p.slug === slug)
  const page = SERVICE_PAGES[index]
  const content = page ? SERVICE_CONTENT[page.slug] : undefined

  useEffect(() => {
    if (!page) return
    document.title = `${page.title} · Hark Digital`
    const meta = document.querySelector('meta[name="description"]')
    if (meta && content) meta.setAttribute('content', content.metaDescription)
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Hark Digital · Software, Web Design & Aerial Media'
      meta?.setAttribute('content', DEFAULT_DESCRIPTION)
    }
  }, [page, content])

  if (!page) return <Navigate to="/" replace />

  const Scene = SCENES[page.scene]
  // size the hero headline to its length so long titles don't overflow;
  // a single long unbreakable word (Syne caps are wide) forces the
  // smallest mobile size regardless of total length
  const headlineText = `${page.headline} ${page.headlineAccent ?? ''}`.trim()
  const longestWord = Math.max(...headlineText.split(/[\s-]+/).map(w => w.length))
  const headlineSize =
    longestWord >= 10
      ? 'text-[6.5vw] md:text-[3.7vw]'
      : headlineText.length <= 22
        ? 'text-[11vw] md:text-[5.6vw]'
        : headlineText.length <= 34
          ? 'text-[9vw] md:text-[4.5vw]'
          : 'text-[7.5vw] md:text-[3.7vw]'
  const prev = SERVICE_PAGES[(index - 1 + SERVICE_PAGES.length) % SERVICE_PAGES.length]
  const next = SERVICE_PAGES[(index + 1) % SERVICE_PAGES.length]

  return (
    <main className="grain bg-ink text-paper">
      <Cursor />
      <Nav />

      {/* hero with the themed scene */}
      <section className="relative flex min-h-[92dvh] flex-col justify-end overflow-hidden">
        <Scene key={page.slug} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(13,13,13,0.78)_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-20 md:px-10 md:pb-16">
          <Reveal>
            <p className="mb-5 font-mono text-xs tracking-[0.28em] text-signal uppercase">
              {page.title}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className={`hero-shadow max-w-5xl font-display ${headlineSize} leading-[0.98] font-extrabold tracking-tight text-balance uppercase`}
            >
              {page.headline} {page.headlineAccent && <span className="text-signal italic">{page.headlineAccent}</span>}
            </h1>
          </Reveal>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <Reveal delay={0.2} className="max-w-2xl">
              <p className="text-base leading-relaxed text-paper/75 md:text-lg">{page.lede}</p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="rounded-full bg-signal px-7 py-3 font-mono text-xs font-medium tracking-[0.18em] text-ink uppercase transition-transform hover:scale-105"
                >
                  Start a project
                </Link>
                <Link
                  to="/"
                  className="rounded-full border border-paper/25 px-7 py-3 font-mono text-xs tracking-[0.18em] uppercase transition-colors hover:border-signal hover:text-signal"
                >
                  ← All services
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* what you get */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.28em] text-signal uppercase">What you get</p>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
          {page.features.map((f, i) => (
            <Reveal key={f.title} delay={Math.min(i * 0.06, 0.2)} className="h-full">
              <div className="group h-full bg-ink p-8 transition-colors duration-300 hover:bg-ink-2 md:p-10">
                <Icon
                  name={SERVICE_ICONS[page.slug].features[i]}
                  size={26}
                  className="text-muted transition-colors duration-300 group-hover:text-signal"
                />
                <h2 className="mt-4 font-display text-2xl font-bold tracking-tight">{f.title}</h2>
                <p className="mt-3 leading-relaxed text-paper/65">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* stat strip */}
      <section className="border-y border-line bg-ink-2">
        <Reveal className="mx-auto flex max-w-[1400px] flex-col items-baseline gap-3 px-5 py-14 md:flex-row md:gap-8 md:px-10">
          <span className="font-display text-6xl font-extrabold tracking-tight text-signal md:text-8xl">
            {page.stat.value}
          </span>
          <span className="max-w-md font-mono text-xs leading-relaxed tracking-[0.18em] text-muted uppercase">
            {page.stat.label}
          </span>
        </Reveal>
      </section>

      {/* process */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.28em] text-signal uppercase">How it works</p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
            We listen first. Then we build.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-4">
          {page.process.map((s, i) => (
            <Reveal key={s.title} delay={Math.min(i * 0.08, 0.3)}>
              <div className="group relative cursor-default pt-6 transition-transform duration-300 ease-out hover:-translate-y-1.5">
                {/* top rule: base line + green fill that draws in on hover */}
                <span className="absolute inset-x-0 top-0 h-px bg-line" />
                <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal shadow-[0_0_10px_var(--color-signal)] transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <div className="flex items-center gap-3">
                  <Icon name={SERVICE_ICONS[page.slug].process[i]} size={22} className="text-signal" />
                  <span className="h-1.5 w-1.5 rotate-45 scale-0 bg-signal opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
                </div>
                <h3 className="mt-2 font-display text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-signal">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/55 transition-colors duration-300 group-hover:text-paper/85">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* long-form: the SEO/GEO depth */}
      {content && (
        <section className="border-t border-line bg-ink-2">
          <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
            <Reveal>
              <p className="font-mono text-xs tracking-[0.28em] text-signal uppercase">The longer version</p>
            </Reveal>
            <div className="mt-12 grid gap-16 md:grid-cols-[1fr_1fr]">
              {content.article.map((block, i) => (
                <Reveal key={block.heading} delay={Math.min(i * 0.06, 0.18)} className={i === 2 ? 'md:col-span-2 md:max-w-3xl' : ''}>
                  <article>
                    <h2 className="font-display text-2xl leading-tight font-bold tracking-tight md:text-3xl">
                      {block.heading}
                    </h2>
                    {block.paragraphs.map((p, j) => (
                      <p key={j} className="mt-5 leading-relaxed text-paper/70">
                        {p}
                      </p>
                    ))}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {content && (
        <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.28em] text-signal uppercase">Questions, answered</p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
              What people ask us about {page.title.toLowerCase()}.
            </h2>
          </Reveal>
          <div className="mt-12 max-w-4xl border-t border-line">
            {content.faqs.map((f, i) => (
              <Reveal key={f.q} delay={Math.min(i * 0.04, 0.16)}>
                <details className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-6 font-display text-lg font-bold tracking-tight transition-colors hover:text-signal md:text-xl [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="shrink-0 font-mono text-signal transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-3xl pb-6 leading-relaxed text-paper/70">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* structured data for search + AI answer engines */}
      {content && (
        <>
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: page.title,
              description: content.metaDescription,
              url: `https://hark.digital/services/${page.slug}`,
              provider: {
                '@type': 'ProfessionalService',
                name: 'Hark Digital Design',
                url: 'https://hark.digital/',
                email: 'mike@hark.digital',
                address: { '@type': 'PostalAddress', addressRegion: 'PA' },
              },
              areaServed: 'Philadelphia, United States',
            }}
          />
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: content.faqs.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }}
          />
        </>
      )}

      {/* quote */}
      {page.quote && (
        <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10 md:pb-32">
          <Reveal>
            <figure className="rounded-xl border border-line bg-ink-2 p-10 md:p-16">
              <span className="font-display text-6xl leading-none text-signal">“</span>
              <blockquote className="mt-2 max-w-3xl font-display text-xl leading-snug font-semibold tracking-tight md:text-3xl">
                {page.quote.text}
              </blockquote>
              <figcaption className="mt-6 font-mono text-xs tracking-[0.2em] text-muted uppercase">
                {page.quote.name} · {page.quote.company}
              </figcaption>
            </figure>
          </Reveal>
        </section>
      )}

      {/* cta line + prev/next */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
          <Reveal>
            <p className="max-w-2xl font-display text-2xl font-bold tracking-tight text-balance md:text-4xl">
              {page.cta}
            </p>
          </Reveal>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-[0.18em] uppercase">
            <Link to={`/services/${prev.slug}`} className="text-muted transition-colors hover:text-signal">
              ← {prev.title}
            </Link>
            <Link to={`/services/${next.slug}`} className="text-muted transition-colors hover:text-signal">
              {next.title} →
            </Link>
          </div>
        </div>
      </section>

      <Contact />
    </main>
  )
}
