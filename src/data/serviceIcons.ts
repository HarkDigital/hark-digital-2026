import type { IconName } from '@/components/site/Icons'

/**
 * Icon assignments for every numbered spot on the site. Feature and
 * process arrays line up index-for-index with the entries in
 * servicePages.ts, so a copy change there doesn't break icons here.
 */
interface ServiceIconSet {
  /** the service's own mark, used on the home stack + service pages */
  service: IconName
  /** one per "What you get" card, in order */
  features: [IconName, IconName, IconName, IconName]
  /** one per "How it works" step, in order */
  process: [IconName, IconName, IconName, IconName]
}

export const SERVICE_ICONS: Record<string, ServiceIconSet> = {
  'software-development': {
    service: 'code',
    features: ['door', 'chart', 'link', 'zap'],
    process: ['ear', 'pencil', 'hammer', 'wrench'],
  },
  'web-design': {
    service: 'layout',
    features: ['target', 'doc', 'devices', 'search'],
    process: ['ear', 'pencil', 'hammer', 'rocket'],
  },
  ecommerce: {
    service: 'cart',
    features: ['box', 'card', 'lock', 'chart'],
    process: ['ear', 'grid', 'link', 'trend'],
  },
  'seo-geo': {
    service: 'radar',
    features: ['gear', 'pin', 'doc', 'sparkle'],
    process: ['search', 'layers', 'send', 'trend'],
  },
  'page-speed': {
    service: 'gauge',
    features: ['pulse', 'target', 'devices', 'clock'],
    process: ['search', 'zap', 'gear', 'trend'],
  },
  'ai-consulting': {
    service: 'chip',
    features: ['search', 'sparkle', 'zap', 'globe'],
    process: ['map', 'flask', 'link', 'users'],
  },
  'aerial-media': {
    service: 'drone',
    features: ['building', 'hammer', 'eye', 'video'],
    process: ['map', 'send', 'film', 'box'],
  },
  'hack-remediation': {
    service: 'alert',
    features: ['clock', 'bug', 'flag', 'shield'],
    process: ['eye', 'bug', 'refresh', 'lock'],
  },
  security: {
    service: 'shield',
    features: ['lock', 'eye', 'database', 'refresh'],
    process: ['doc', 'gear', 'eye', 'send'],
  },
  'ada-accessibility': {
    service: 'access',
    features: ['search', 'code', 'shield', 'layout'],
    process: ['search', 'wrench', 'target', 'doc'],
  },
  wordpress: {
    service: 'plug',
    features: ['layout', 'plug', 'gauge', 'shield'],
    process: ['search', 'shield', 'wrench', 'refresh'],
  },
}

/** Reel end-credits: an icon per industry instead of a row number. */
export const INDUSTRY_ICONS: Record<string, IconName> = {
  'Real Estate Investment': 'building',
  'Real Estate': 'building',
  'Telecom / UCaaS': 'phone',
  'Industrial Manufacturing': 'gear',
  'Nonprofit Platform': 'heart',
  'Nonprofit Fundraising': 'heart',
  'Marketing & PR': 'pencil',
  'Trucking & Logistics': 'truck',
  Generators: 'zap',
  'Kitchen & Bath': 'home',
  Healthcare: 'cross',
  Dentistry: 'cross',
  Construction: 'hammer',
  'Wine & Viticulture': 'wine',
}
