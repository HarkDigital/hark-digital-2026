// Screenshot at a scroll position: for verifying scroll-driven sections
// (service stack, filmstrip, reel chapters) that only compose mid-scroll.
// Usage: node scripts/shoot-at.mjs <url> <out.png> [--y=2000] [--w=1400] [--h=900] [--wait=2500]
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const [url, out, ...rest] = process.argv.slice(2)
const flag = (name, def) => {
  const f = rest.find(a => a.startsWith(`--${name}=`))
  return f ? f.split('=')[1] : def
}

const W = parseInt(flag('w', '1400'), 10)
const H = parseInt(flag('h', '900'), 10)
const Y = parseInt(flag('y', '0'), 10)
const WAIT = parseInt(flag('wait', '2500'), 10)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: W, height: H })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
  // step down in a few hops so in-view reveals fire, then settle at target
  await page.evaluate(async targetY => {
    const hops = 6
    for (let i = 1; i <= hops; i++) {
      window.scrollTo({ top: (targetY * i) / hops, behavior: 'instant' })
      await new Promise(r => setTimeout(r, 200))
    }
  }, Y)
  await new Promise(r => setTimeout(r, WAIT))
  await page.screenshot({ path: out })
  console.log(`saved ${out}`)
} finally {
  await browser.close()
}
