import type { ComponentType } from 'react'
import { SceneDataflow } from './SceneDataflow'
import { SceneBlueprint } from './SceneBlueprint'
import { SceneCommerce } from './SceneCommerce'
import { SceneRadar } from './SceneRadar'
import { SceneVelocity } from './SceneVelocity'
import { SceneNeural } from './SceneNeural'
import { SceneAerial } from './SceneAerial'
import { SceneGlitch } from './SceneGlitch'
import { SceneShield } from './SceneShield'
import { SceneFocus } from './SceneFocus'
import { SceneBlocks } from './SceneBlocks'

export const SCENES: Record<string, ComponentType<{ className?: string }>> = {
  dataflow: SceneDataflow,
  blueprint: SceneBlueprint,
  commerce: SceneCommerce,
  radar: SceneRadar,
  velocity: SceneVelocity,
  neural: SceneNeural,
  aerial: SceneAerial,
  glitch: SceneGlitch,
  shield: SceneShield,
  focus: SceneFocus,
  blocks: SceneBlocks,
}
