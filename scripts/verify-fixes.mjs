// One-off verification of the stack/filmstrip review fixes.
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'shell' })
const results = {}
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 60000 })

  // scroll to the very end of the services stack
  await page.evaluate(async () => {
    const stack = document.querySelectorAll('[data-stack-card]')
    const last = stack[stack.length - 1]
    const y = last.getBoundingClientRect().top + scrollY + last.offsetHeight - innerHeight + 50
    const hops = 8
    for (let i = 1; i <= hops; i++) {
      scrollTo({ top: (y * i) / hops, behavior: 'instant' })
      await new Promise(r => setTimeout(r, 150))
    }
  })
  await new Promise(r => setTimeout(r, 1200))

  results.endOfStack = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('[data-stack-card]')]
    const last = cards[cards.length - 1].querySelector('div')
    const lastStyle = getComputedStyle(last)
    const buriedInert = cards.slice(0, -1).filter(c => c.hasAttribute('inert')).length
    return {
      lastCardFilter: lastStyle.filter,
      lastCardTransform: lastStyle.transform,
      buriedInertCount: buriedInert,
      totalCards: cards.length,
    }
  })

  // mid-stack: the top readable card should NOT be dimmed yet
  await page.evaluate(async () => {
    const cards = document.querySelectorAll('[data-stack-card]')
    const c5 = cards[5]
    // position card 5 pinned with card 6 still below the fold
    const y = c5.getBoundingClientRect().top + scrollY - 96
    scrollTo({ top: y, behavior: 'instant' })
  })
  await new Promise(r => setTimeout(r, 1000))
  results.midStack = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('[data-stack-card]')]
    const inner = cards[5].querySelector('div')
    return { card5Filter: getComputedStyle(inner).filter, card5Top: Math.round(cards[5].getBoundingClientRect().top) }
  })

  // reduced-motion carousel card widths
  const page2 = await browser.newPage()
  await page2.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page2.setViewport({ width: 1280, height: 800 })
  await page2.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 60000 })
  results.reducedCarousel = await page2.evaluate(() => {
    const links = [...document.querySelectorAll('#work a[target="_blank"]')]
    return {
      cardWidths: links.map(a => Math.round(a.getBoundingClientRect().width)),
      display: links[0] ? getComputedStyle(links[0]).display : '?',
    }
  })

  console.log(JSON.stringify(results, null, 2))
} finally {
  await browser.close()
}
