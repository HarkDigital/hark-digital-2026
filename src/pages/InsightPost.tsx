import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Nav } from '@/components/site/Nav'
import { Cursor } from '@/components/site/Cursor'
import { Reveal } from '@/components/site/Reveal'
import { Contact } from '@/sections/Contact'
import { POSTS, formatDate } from '@/data/insights'
import { SERVICE_PAGES } from '@/data/servicePages'

const DEFAULT_TITLE = 'Hark Digital · Software, Web Design & Aerial Media'
const DEFAULT_DESCRIPTION =
  'Hark Digital · software development, web design, ecommerce, SEO/GEO, security, and aerial media. From publicly traded companies to mom-and-pop pizza shops.'

/** Injects a JSON-LD script for the life of the page. */
function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data)
  useEffect(() => {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.text = json
    document.head.appendChild(el)
    return () => {
      document.head.removeChild(el)
    }
  }, [json])
  return null
}

export default function InsightPost() {
  const { slug } = useParams()
  const index = POSTS.findIndex(p => p.slug === slug)
  const post = POSTS[index]

  useEffect(() => {
    if (!post) return
    document.title = `${post.title} · Hark Digital Insights`
    const meta = document.querySelector('meta[name="description"]')
    meta?.setAttribute('content', post.dek)
    window.scrollTo(0, 0)
    return () => {
      document.title = DEFAULT_TITLE
      meta?.setAttribute('content', DEFAULT_DESCRIPTION)
    }
  }, [post])

  if (!post) return <Navigate to="/insights" replace />

  const service = SERVICE_PAGES.find(s => s.slug === post.serviceSlug)
  const newer = POSTS[index - 1]
  const older = POSTS[index + 1]

  return (
    <main className="grain bg-ink text-paper">
      <Cursor />
      <Nav />

      <article className="mx-auto max-w-[1400px] px-5 pt-32 pb-8 md:px-10 md:pt-40">
        <Reveal>
          <Link
            to="/insights"
            className="font-mono text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-signal"
          >
            ← Insights
          </Link>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            <span className="text-signal">{post.category}</span>
            <span className="text-line">/</span>
            <span>{formatDate(post.date)}</span>
            <span className="text-line">/</span>
            <span>{post.readMins} min read</span>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.02] font-extrabold tracking-tight text-balance md:text-6xl">
            {post.title}
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-paper/70 md:text-xl">{post.dek}</p>
        </Reveal>
      </article>

      <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10">
        <div className="max-w-4xl">
        <Reveal>
          <p className="border-l-2 border-signal pl-5 text-lg leading-relaxed text-paper/85 md:text-xl">
            {post.lead}
          </p>
        </Reveal>

        {post.sections.map((section, i) => (
          <Reveal key={section.heading} delay={Math.min(i * 0.03, 0.15)}>
            <section className="mt-12">
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{section.heading}</h2>
              {section.paragraphs.map((para, j) => (
                <p key={j} className="mt-4 leading-relaxed text-paper/70 md:text-lg">
                  {para}
                </p>
              ))}
            </section>

            {/* drop the pull quote in after the first section */}
            {i === 0 && (
              <figure className="mt-12">
                <blockquote className="font-display text-2xl leading-snug font-bold tracking-tight text-balance text-signal md:text-4xl">
                  “{post.pullQuote}”
                </blockquote>
              </figure>
            )}
          </Reveal>
        ))}
        </div>
      </div>

      {/* related-service CTA */}
      {service && (
        <section className="border-y border-line bg-ink-2">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-10">
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] text-signal uppercase">
                This is what we do
              </p>
              <p className="mt-2 max-w-md font-display text-xl font-bold tracking-tight md:text-2xl">
                We build and fix this for a living: {service.title}.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                to={`/services/${service.slug}`}
                className="rounded-full border border-paper/25 px-6 py-3 font-mono text-xs tracking-[0.18em] uppercase transition-colors hover:border-signal hover:text-signal"
              >
                {service.title}
              </Link>
              <Link
                to="/contact"
                className="rounded-full bg-signal px-6 py-3 font-mono text-xs font-medium tracking-[0.18em] text-ink uppercase transition-transform hover:scale-105"
              >
                Start a project
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* prev / next posts */}
      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {older && (
            <Link to={`/insights/${older.slug}`} className="group border-t border-line pt-4">
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Older</span>
              <p className="mt-2 font-display text-lg font-bold tracking-tight transition-colors group-hover:text-signal">
                {older.title}
              </p>
            </Link>
          )}
          {newer && (
            <Link
              to={`/insights/${newer.slug}`}
              className="group border-t border-line pt-4 sm:text-right"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Newer</span>
              <p className="mt-2 font-display text-lg font-bold tracking-tight transition-colors group-hover:text-signal">
                {newer.title}
              </p>
            </Link>
          )}
        </div>
      </section>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.dek,
          datePublished: post.date,
          articleSection: post.category,
          url: `https://hark.digital/insights/${post.slug}`,
          author: { '@type': 'Organization', name: 'Hark Digital Design' },
          publisher: {
            '@type': 'Organization',
            name: 'Hark Digital Design',
            url: 'https://hark.digital/',
          },
        }}
      />

      <Contact />
    </main>
  )
}
