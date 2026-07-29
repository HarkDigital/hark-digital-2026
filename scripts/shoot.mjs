// Screenshot helper: drives real headless Chrome with a real mouse.
// Usage: node scripts/shoot.mjs <url> <out.png> [--w=1400] [--h=900] [--wait=4000] [--mouse] [--full] [--click=x,y]
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const [url, out, ...rest] = process.argv.slice(2)
const flag = (name, def) => {
  const f = rest.find(a => a.startsWith(`--${name}=`))
  return f ? f.split('=')[1] : def
}
const has = name => rest.includes(`--${name}`)

const W = parseInt(flag('w', '1400'), 10)
const H = parseInt(flag('h', '900'), 10)
const WAIT = parseInt(flag('wait', '4000'), 10)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: W, height: H })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })

  if (has('mouse')) {
    // sweep the cursor through the scene so pointer-reactive effects engage
    const steps = 40
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2
      await page.mouse.move(W / 2 + Math.cos(t * 1.3) * W * 0.2, H / 2 + Math.sin(t * 2.1) * H * 0.2, { steps: 3 })
      await new Promise(r => setTimeout(r, WAIT / steps / 2))
    }
  }
  if (has('scroll')) {
    // scroll through the page to trigger in-view reveals and lazy images
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise(r => setTimeout(r, 350))
      }
      window.scrollTo(0, 0)
    })
    await new Promise(r => setTimeout(r, 1200))
  }

  const click = flag('click', null)
  if (click) {
    const [cx, cy] = click.split(',').map(Number)
    await page.mouse.click(cx, cy)
  }
  await new Promise(r => setTimeout(r, has('mouse') ? WAIT / 2 : WAIT))
  await page.screenshot({ path: out, fullPage: has('full') })
  console.log(`saved ${out}`)
} finally {
  await browser.close()
}
