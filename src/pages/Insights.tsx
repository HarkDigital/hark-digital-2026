import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Nav } from '@/components/site/Nav'
import { Cursor } from '@/components/site/Cursor'
import { Reveal } from '@/components/site/Reveal'
import { Contact } from '@/sections/Contact'
import { POSTS, formatDate, type Post } from '@/data/insights'

function Meta({ post }: { post: Post }) {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
      <span className="text-signal">{post.category}</span>
      <span className="text-line">/</span>
      <span>{formatDate(post.date)}</span>
      <span className="text-line">/</span>
      <span>{post.readMins} min read</span>
    </span>
  )
}

export default function Insights() {
  useEffect(() => {
    document.title = 'Insights · Hark Digital'
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Hark Digital · Software, Web Design & Aerial Media'
    }
  }, [])

  const [featured, ...rest] = POSTS

  return (
    <main className="grain min-h-dvh bg-ink text-paper">
      <Cursor />
      <Nav />

      {/* header */}
      <section className="mx-auto max-w-[1400px] px-5 pt-32 pb-10 md:px-10 md:pt-40">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.28em] text-signal uppercase">Insights</p>
          <h1 className="hero-shadow mt-4 max-w-4xl font-display text-6xl leading-[0.95] font-extrabold tracking-tight uppercase md:text-8xl">
            Field <span className="text-signal italic">notes.</span>
          </h1>
        </Reveal>
      </section>

      {/* featured (most recent) */}
      <section className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal delay={0.15}>
          <Link to={`/insights/${featured.slug}`} className="group block border-y border-line py-10 md:py-14">
            <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-baseline md:gap-12">
              <span className="font-mono text-xs tracking-[0.2em] text-muted uppercase">Latest</span>
              <div>
                <Meta post={featured} />
                <h2 className="mt-4 max-w-4xl font-display text-3xl leading-[1.02] font-bold tracking-tight transition-colors group-hover:text-signal md:text-5xl">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-paper/65 md:text-lg">{featured.dek}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-signal uppercase">
                  Read the piece
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* the rest */}
      <section className="mx-auto max-w-[1400px] px-5 pt-16 pb-28 md:px-10 md:pb-36">
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i * 0.06, 0.2)}>
              <Link to={`/insights/${post.slug}`} className="group flex h-full flex-col border-t border-line pt-6">
                <Meta post={post} />
                <h3 className="mt-4 font-display text-2xl leading-tight font-bold tracking-tight transition-colors group-hover:text-signal md:text-3xl">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 leading-relaxed text-paper/60">{post.dek}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-muted uppercase transition-colors group-hover:text-signal">
                  Read
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Contact />
    </main>
  )
}
