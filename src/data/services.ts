export interface Service {
  num: string
  slug: string
  title: string
  blurb: string
  tags: string[]
}

export const SERVICES: Service[] = [
  {
    num: '01',
    slug: 'software-development',
    title: 'Software Development',
    blurb:
      'Custom CRMs, client portals, and dashboards built around how your business actually runs. Every lead, job, and customer in one system that fits like it was made for you, because it was.',
    tags: ['Custom CRMs', 'Client Portals', 'Dashboards', 'Integrations'],
  },
  {
    num: '02',
    slug: 'web-design',
    title: 'Web Design',
    blurb:
      'Beautiful, functional websites that promote your business and are easy to update. Modern frameworks, responsive on every device, built to convert visitors into customers.',
    tags: ['UI/UX', 'Responsive', 'CMS', 'Branding'],
  },
  {
    num: '03',
    slug: 'ecommerce',
    title: 'Ecommerce',
    blurb:
      'From thousands of products to a single payment portal, secure, flexible online stores with the analytics to track sales, spot trends, and grow.',
    tags: ['Online Stores', 'Payment Portals', 'Analytics', 'Conversion'],
  },
  {
    num: '04',
    slug: 'seo-geo',
    title: 'SEO / GEO',
    blurb:
      'Search engine optimization for how people find you today, and generative engine optimization for how AI answers about you tomorrow. Stay visible in both worlds.',
    tags: ['Search Ranking', 'AI Discoverability', 'Local SEO', 'Content Strategy'],
  },
  {
    num: '05',
    slug: 'page-speed',
    title: 'Page Speed',
    blurb:
      'Slow site dragging down your Google score and your sales? We fix Core Web Vitals, turn those red PageSpeed and GTmetrix numbers green, and make pages load in a blink.',
    tags: ['Core Web Vitals', 'PageSpeed Insights', 'GTmetrix', 'Load Time'],
  },
  {
    num: '06',
    slug: 'ai-consulting',
    title: 'AI Consulting',
    blurb:
      'Cut through the hype. We find where AI genuinely saves your business time and money, build it into your workflow, and skip the snake oil.',
    tags: ['Opportunity Audit', 'Custom AI Tools', 'Automation', 'Team Training'],
  },
  {
    num: '07',
    slug: 'aerial-media',
    title: 'Aerial Photography & Video',
    blurb:
      'Professional, insured drone piloting for cinematic productions, real estate, construction progress, inspections, and imagery that makes your site impossible to scroll past.',
    tags: ['Drone Video', 'Real Estate', 'Inspections', 'Cinematic'],
  },
  {
    num: '08',
    slug: 'hack-remediation',
    title: 'Hack Remediation',
    blurb:
      'Site compromised? We find the breach, clean the infection, restore your site, and close the door behind us, then harden everything so it stays closed.',
    tags: ['Malware Removal', 'Breach Response', 'Recovery', 'Blocklist Removal'],
  },
  {
    num: '09',
    slug: 'security',
    title: 'Website & Data Security',
    blurb:
      'Proactive protection for your website and the data behind it, hardening, monitoring, backups, and updates handled before problems become headlines.',
    tags: ['Hardening', 'Monitoring', 'Backups', 'SSL & Compliance'],
  },
  {
    num: '10',
    slug: 'ada-accessibility',
    title: 'ADA Accessibility',
    blurb:
      'One in four American adults lives with a disability. We audit and fix your site to WCAG standards, so every visitor can use it and ADA demand letters have nothing to find.',
    tags: ['WCAG Audits', 'Remediation', 'Screen Reader Testing', 'ADA Compliance'],
  },
  {
    num: '11',
    slug: 'wordpress',
    title: 'WordPress',
    blurb:
      'Powering over forty percent of the web, and most of its headaches. We build, rescue, speed up, and secure WordPress sites, and we’ve seen every way they break.',
    tags: ['Custom Builds', 'Plugin Rescue', 'Speed & Security', 'Care Plans'],
  },
]
