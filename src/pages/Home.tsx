import { MotionConfig } from 'motion/react'
import { Nav } from '@/components/site/Nav'
import { Cursor } from '@/components/site/Cursor'
import { Hero } from '@/sections/Hero'
import { Marquee } from '@/sections/Marquee'
import { Services } from '@/sections/Services'
import { Work } from '@/sections/Work'
import { Security } from '@/sections/Security'
import { Testimonials } from '@/sections/Testimonials'
import { Contact } from '@/sections/Contact'

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="grain bg-ink text-paper">
        <Cursor />
        <Nav />
        <Hero />
        <Marquee />
        <Work />
        <Marquee reverse />
        <Services />
        <Security />
        <Testimonials />
        <Contact />
      </main>
    </MotionConfig>
  )
}
