import type { ComponentType } from 'react'
import { LogoAssemble } from './LogoAssemble'
import { LogoGlow } from './LogoGlow'
import { LogoConstellation } from './LogoConstellation'
import { LogoVortex } from './LogoVortex'
import { LogoFilings } from './LogoFilings'
import { LogoShatter } from './LogoShatter'
import { LogoMatrix } from './LogoMatrix'
import { LogoFireworks } from './LogoFireworks'
import { LogoAurora } from './LogoAurora'
import { LogoRipple } from './LogoRipple'
import { LogoFireflies } from './LogoFireflies'
import { LogoSiphon } from './LogoSiphon'

export interface LogoVariant {
  id: string
  num: string
  name: string
  hint: string
  Component: ComponentType<{ className?: string; windowPointer?: boolean }>
}

export const LOGO_VARIANTS: LogoVariant[] = [
  {
    id: 'assemble',
    num: '01',
    name: 'Assemble',
    hint: 'Move to push the grain aside. Click to detonate — it rebuilds itself.',
    Component: LogoAssemble,
  },
  {
    id: 'ember',
    num: '02',
    name: 'Ember',
    hint: 'The mark sleeps in the dark. Your cursor is the torch.',
    Component: LogoGlow,
  },
  {
    id: 'constellation',
    num: '03',
    name: 'Constellation',
    hint: 'A star chart with gravity. Nearby nodes lean toward the pointer.',
    Component: LogoConstellation,
  },
  {
    id: 'vortex',
    num: '04',
    name: 'Vortex',
    hint: 'Stir it. Particles stream around the cursor, then settle home.',
    Component: LogoVortex,
  },
  {
    id: 'filings',
    num: '05',
    name: 'Filings',
    hint: 'Iron filings on glass — the cursor is the magnet.',
    Component: LogoFilings,
  },
  {
    id: 'erode',
    num: '06',
    name: 'Erode & Heal',
    hint: 'Sandblast the mark. It quietly repairs itself behind you.',
    Component: LogoShatter,
  },
  {
    id: 'matrix',
    num: '07',
    name: 'Matrix',
    hint: 'Digital rain develops the mark like a photograph. The cursor wipes the glass.',
    Component: LogoMatrix,
  },
  {
    id: 'fireworks',
    num: '08',
    name: 'Fireworks',
    hint: 'Every burst settles into the mark. Click to launch your own.',
    Component: LogoFireworks,
  },
  {
    id: 'aurora',
    num: '09',
    name: 'Aurora',
    hint: 'Northern lights pouring through the logo. The cursor drags the curtains.',
    Component: LogoAurora,
  },
  {
    id: 'ripple',
    num: '10',
    name: 'Ripple',
    hint: 'The mark floats on dark water. Move for a wake, click for a splash.',
    Component: LogoRipple,
  },
  {
    id: 'fireflies',
    num: '11',
    name: 'Fireflies',
    hint: 'A blinking swarm holds formation. Get close and they scatter.',
    Component: LogoFireflies,
  },
  {
    id: 'siphon',
    num: '12',
    name: 'Siphon',
    hint: 'A breathing nebula with an edge-lit rim. The cursor bends and brightens it gently — click for a soft ripple.',
    Component: LogoSiphon,
  },
]
