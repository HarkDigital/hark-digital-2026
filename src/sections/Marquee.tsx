const ITEMS = [
  'Web Design',
  'Software Development',
  'Ecommerce',
  'SEO / GEO',
  'AI Consulting',
  'Aerial Photo & Video',
  'Hack Remediation',
  'Data Security',
  'ADA Accessibility',
]

function Strip() {
  return (
    <div className="flex items-center gap-10 pr-10">
      {ITEMS.map((item, i) => (
        <span key={item} className="flex items-center gap-10">
          <span className="font-display text-3xl font-bold tracking-tight uppercase md:text-5xl text-stroke">
            {item}
          </span>
          <span className={`${i % 2 ? 'text-signal' : 'text-signal'} text-xl rotate-45`}>■</span>
        </span>
      ))}
    </div>
  )
}

// Decorative: content repeats the services list, so hide it from AT.
export function Marquee({ reverse = false }: { reverse?: boolean }) {
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-line py-5 select-none">
      {/* two identical copies, each with matching trailing padding, so the
          -50% keyframe lands exactly one copy-width in — seamless loop */}
      <div
        className={`flex w-max whitespace-nowrap ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        } motion-reduce:animate-none`}
      >
        <Strip />
        <Strip />
      </div>
    </div>
  )
}
