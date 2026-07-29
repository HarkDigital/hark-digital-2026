// Blog / Insights posts. Written to be quotable for AI answer engines (GEO),
// current to the 2026 technology landscape, and mapped to a Hark service.
// Typography matches the rest of the site (curly apostrophes, no em dashes).

export interface PostSection {
  heading: string
  paragraphs: string[]
}

export interface Post {
  slug: string
  title: string
  dek: string
  category: string
  /** related service slug, for the "this is what we do" CTA */
  serviceSlug: string
  date: string // ISO YYYY-MM-DD
  readMins: number
  lead: string
  sections: PostSection[]
  pullQuote: string
}

/** Deterministic date formatting (avoids timezone drift from Date parsing). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[m - 1]} ${d}, ${y}`
}

// Newest first: the index and prev/next rely on this order.
export const POSTS: Post[] = [
  {
    slug: 'the-wordpress-hacks-hitting-small-sites-right-now',
    title: 'The WordPress Hacks Hitting Small Sites Right Now',
    dek: 'WordPress runs a huge share of the web, which makes it the internet’s favorite target. Here is how the recent wave of attacks actually gets in, and how to stop being easy.',
    category: 'Hack Remediation',
    serviceSlug: 'hack-remediation',
    date: '2026-07-15',
    readMins: 6,
    lead: 'If your site runs WordPress, you are in good company: it powers roughly two in five websites on the planet. That popularity is also the problem. Attackers write one exploit and point it at millions of sites at once, and the small, lightly maintained ones are where it lands.',
    sections: [
      {
        heading: 'It is almost always a plugin',
        paragraphs: [
          'The WordPress core itself is hardened and quick to patch. The soft underbelly is plugins and themes, where the large majority of real-world vulnerabilities live. Every plugin you install is third-party code running inside your site, and an abandoned or out-of-date one is an unlocked window. Recent history keeps proving it: a single flaw in a hugely popular caching plugin exposed millions of sites at once, and page-builder bugs have handed attackers full control more than once.',
        ],
      },
      {
        heading: 'The attacks are automated and fast',
        paragraphs: [
          'When a vulnerability goes public, you are not racing a person, you are racing a bot. Automated scanners begin probing for the new hole within hours, long before most owners have even read the update notice. That gap between “a patch exists” and “you installed it” is the most dangerous window on your site, and anything left on autopilot loses that race every time.',
        ],
      },
      {
        heading: 'What actually gets injected',
        paragraphs: [
          'The payoff is rarely dramatic. Modern WordPress malware prefers to hide: cloaked spam that shows pharmacy or casino pages only to Google, redirects that quietly send your mobile visitors somewhere nasty, fake admin accounts held in reserve, and backdoors buried in innocent-looking files. You can stare at your own homepage and see nothing wrong while your rankings collapse and your host sends the first warning email.',
        ],
      },
      {
        heading: 'How to stop being the easy target',
        paragraphs: [
          'The fixes are unglamorous and they work: update WordPress, plugins, and themes promptly, delete the plugins you no longer use, and never run nulled or pirated add-ons, which are a common way backdoors get delivered in the first place. Enforce strong passwords with two-factor authentication, and keep off-site backups you have actually tested.',
          'If you are already compromised, resist the urge to just delete the one obvious file. A proper cleanup finds every backdoor, clears the Google warnings, and closes the entry point, because a hack that leaves a single door open simply comes back.',
        ],
      },
    ],
    pullQuote: 'When a WordPress flaw goes public, you are not racing a hacker. You are racing a bot that started scanning before you finished your coffee.',
  },
  {
    slug: 'answer-engines-ate-the-results-page',
    title: 'Answer Engines Ate the Results Page. Here Is How to Show Up.',
    dek: 'Google’s AI Overviews, ChatGPT, and Perplexity now answer the question before anyone clicks. Getting cited in that answer is the new front page.',
    category: 'SEO / GEO',
    serviceSlug: 'seo-geo',
    date: '2026-07-08',
    readMins: 6,
    lead: 'For twenty years, search engine optimization meant one thing: climb the list of blue links until people click yours. In 2026 that list is often the second thing a searcher sees, tucked beneath an AI-written answer that resolves the question on the spot. The game did not end. It changed shape.',
    sections: [
      {
        heading: 'The zero-click search is now the default',
        paragraphs: [
          'More than half of Google searches already end without a click to any website, and AI Overviews have only accelerated that. When the engine can summarize your industry, your pricing, and your hours in a tidy paragraph, the searcher has no reason to visit a page. The traffic did not vanish. It got intercepted.',
          'That sounds like a threat, and for businesses that ignore it, it is. But there is an opening: the AI has to build that answer from somewhere, and it names its sources. Being one of those sources is the new version of ranking first.',
        ],
      },
      {
        heading: 'What answer engines actually reward',
        paragraphs: [
          'Generative engines favor content that is easy to lift and hard to misread: clear, factual sentences a machine can quote without hedging, consistent facts across your site and the wider web, and structure that spells out exactly who you are, what you do, and where. Vague marketing prose that dodges specifics gets skipped in favor of a competitor who simply stated the answer.',
          'The businesses winning citations are not the loudest. They are the clearest. A dentist who plainly states services offered, insurance accepted, and neighborhood served gets recommended by an assistant. A dentist described in fog does not.',
        ],
      },
      {
        heading: 'SEO and GEO are the same discipline now',
        paragraphs: [
          'The good news for anyone who invested in real search work is that the foundations overlap almost completely. Fast, well-structured pages with genuine expertise and clean markup both rank in Google and get quoted by AI. The difference is emphasis. Generative engine optimization leans harder on quotability, on structured data, and on being consistent everywhere a machine might learn about you.',
          'This is not a reason to chase every shiny new AI tool. It is a reason to do the fundamentals properly, with the next few years in mind.',
        ],
      },
    ],
    pullQuote: 'Ranking number one is worth less when nobody scrolls. The new prize is being the sentence the AI decides to quote.',
  },
  {
    slug: 'the-build-vs-buy-math-just-changed',
    title: 'The Build-vs-Buy Math Just Changed',
    dek: 'For years, custom software was the expensive option and off-the-shelf won by default. AI-assisted development quietly flipped that calculation for a lot of small businesses.',
    category: 'Software Development',
    serviceSlug: 'software-development',
    date: '2026-06-30',
    readMins: 6,
    lead: 'Every growing business hits the same wall: the generic software you started with no longer fits how you actually work, and you are papering over the gap with spreadsheets, sticky notes, and manual re-entry. The old answer was to grit your teeth and adapt, because custom was too expensive. That answer is aging fast.',
    sections: [
      {
        heading: 'Why off-the-shelf stops fitting',
        paragraphs: [
          'Packaged software is built for the average of a thousand businesses, which means it fits none of them exactly. For a while the compromises are fine. Then you grow, your process gets specific, and the tool starts dictating how you work instead of the other way around. The tell is a spreadsheet being emailed around to do the one thing your expensive software cannot.',
        ],
      },
      {
        heading: 'What AI actually changed',
        paragraphs: [
          'AI-assisted development did not replace building software, it made the routine parts faster. The boilerplate, the glue code, the first draft of a feature, work that used to eat days now takes hours. That does not make a serious application free, but it meaningfully lowers the cost of the small, focused custom tools that used to be too expensive to justify. The build-vs-buy line moved, and plenty of businesses have not noticed yet.',
        ],
      },
      {
        heading: 'Custom does not mean risky',
        paragraphs: [
          'The old fear of custom software was being trapped in a bespoke system only one developer understands. We build the opposite: modern, boring-on-purpose technology that thousands of developers know, documented and handed over, with you owning the code, the data, and the accounts. Custom should make you more independent, not less.',
        ],
      },
      {
        heading: 'Start with the sharpest pain',
        paragraphs: [
          'You do not commission a giant system on day one. You find the one workflow that leaks the most time, the double-entry chore or the customer question that takes three phone calls, and you fix that first. A working prototype in weeks, then short cycles you can see. The businesses that win with custom software are the ones who solved one real problem and grew from there.',
        ],
      },
    ],
    pullQuote: 'The old rule was simple: custom software is the expensive option. AI quietly moved that line, and most small businesses have not looked again.',
  },
  {
    slug: 'speed-is-the-silent-conversion-killer',
    title: 'Speed Is the Silent Conversion Killer',
    dek: 'Every extra second of load time quietly hands a customer to your faster competitor. In 2026, with impatient phones and AI crawlers everywhere, slow is more expensive than ever.',
    category: 'Page Speed',
    serviceSlug: 'page-speed',
    date: '2026-06-24',
    readMins: 5,
    lead: 'Nobody emails to tell you your site was too slow. They just leave, and you never learn they were there. Speed is the rare business problem that is both invisible and enormous, and it gets more expensive every year.',
    sections: [
      {
        heading: 'The three-second cliff',
        paragraphs: [
          'Google’s research is blunt: as mobile load time climbs from one second to three, the odds a visitor bounces jump by around a third. By five seconds it roughly doubles. Those are not fussy power users. That is the ordinary person on an ordinary phone deciding your business is not worth the wait.',
        ],
      },
      {
        heading: 'Core Web Vitals grew teeth',
        paragraphs: [
          'Since 2021, speed has been a direct Google ranking factor through Core Web Vitals. In 2024 the standard got stricter when INP replaced FID, measuring how responsive a page feels across the entire visit rather than just the first tap. A site that felt fine two years ago can quietly fail today.',
          'Passing all three vitals, loading, responsiveness, and visual stability, is now the price of admission for competitive rankings, not a bonus you earn.',
        ],
      },
      {
        heading: 'The crawlers multiplied',
        paragraphs: [
          'There is a new kind of traffic hitting your server: AI crawlers indexing the web for answer engines and shopping assistants. A bloated, slow site is not just losing human patience, it is burning the crawl budget that decides whether machines understand you at all. Fast pages are now legible to both audiences.',
        ],
      },
      {
        heading: 'Where the seconds hide',
        paragraphs: [
          'The culprits are boringly consistent: enormous images, a pile of plugins each loading their own scripts, render-blocking code, no caching, and cheap hosting. Most sites recover the biggest chunk of their speed from just two or three fixes. The trick is measuring first and fixing what actually hurts, not what merely looks scary in a report.',
        ],
      },
    ],
    pullQuote: 'A slow site never announces itself. It just quietly forwards your customers to whoever loads faster.',
  },
  {
    slug: 'ai-without-the-snake-oil',
    title: 'AI Without the Snake Oil',
    dek: 'Every vendor is an AI company now, and most of it is noise. Here is where artificial intelligence genuinely earns its keep for a small business, and where it does not.',
    category: 'AI Consulting',
    serviceSlug: 'ai-consulting',
    date: '2026-06-05',
    readMins: 6,
    lead: 'Ask ten software vendors what is new and ten will say AI. The word has been stretched to mean everything, which is a reliable sign it has started to mean nothing. Underneath the marketing, though, a handful of genuinely useful patterns have settled out, and they are worth knowing.',
    sections: [
      {
        heading: 'The hype hit the plateau, and that is good',
        paragraphs: [
          'We are past the phase where every demo felt like magic and every roadmap promised the moon. What is left is calmer and more useful: specific tools that reliably do specific jobs. For a small business, that shift from magic to utility is exactly the moment it becomes safe to invest.',
        ],
      },
      {
        heading: 'Where AI actually saves you hours',
        paragraphs: [
          'The durable wins are unglamorous and language-shaped: drafting quotes and emails, summarizing intake forms and long documents, answering routine customer questions from your own material, categorizing invoices and tickets. Each one trims minutes off a task you do dozens of times a week, and the minutes are the entire point.',
          'Notice the pattern. Repetitive work that involves words is AI’s home turf. Work that needs judgment, relationships, and accountability is not, and pretending otherwise is how projects fail.',
        ],
      },
      {
        heading: 'The agent question',
        paragraphs: [
          'The buzzword of the year is agents: software that does not just answer but takes actions on your behalf. For a small business the honest answer is that they are promising, and worth a small, well-fenced experiment rather than a bet-the-company rollout. An agent that drafts and queues work for a human to approve is useful today. One turned loose on your bank account is not.',
        ],
      },
      {
        heading: 'Start with one boring win',
        paragraphs: [
          'The right first AI project is small, measurable, and likely to succeed. Pick one repetitive task, automate it, and check whether it actually saved time. If it did, expand. If it did not, you lost very little. The businesses that get real value from AI are not the ones with the grandest plans. They are the ones who shipped one useful thing and built from there.',
        ],
      },
    ],
    pullQuote: 'AI is very good at the work around the job and very bad at the job itself. The whole trick is knowing which is which.',
  },
  {
    slug: 'your-small-site-is-a-bigger-target',
    title: 'Your Small Site Is a Bigger Target Than Ever',
    dek: 'AI turned website attacks into a volume business. Bots probe millions of sites a day, and the small, unmaintained ones are the easiest money on the internet.',
    category: 'Website Security',
    serviceSlug: 'security',
    date: '2026-05-19',
    readMins: 5,
    lead: 'The most common thing we hear from a business whose site was just hacked is some version of “why would anyone target us?” It is the wrong question. Almost nobody targeted you. Software did, automatically, alongside a hundred thousand other sites that same morning.',
    sections: [
      {
        heading: 'Attacks do not choose you, they scan for you',
        paragraphs: [
          'Modern attacks are automated and cheap. Bots crawl the web around the clock looking for known weaknesses: an outdated plugin, a weak password, an abandoned admin account. They do not care whether the site belongs to a bank or a bakery. They care whether the door is unlocked, and AI has only made them faster, cheaper, and better at finding the gap.',
        ],
      },
      {
        heading: 'Too small to hack is a myth',
        paragraphs: [
          'Small sites get compromised constantly, precisely because their owners assume they are beneath notice. A hijacked small business site is valuable on its own: it can send spam, host scam pages, mine crypto, or quietly redirect your customers somewhere nasty, all while you have no idea. You do not have to be worth robbing. You just have to be easy.',
        ],
      },
      {
        heading: 'The boring habits that actually protect you',
        paragraphs: [
          'Security is not a product you buy once. It is a short list of habits kept faithfully: keep software and plugins updated, use strong unique passwords with two-factor authentication, limit admin accounts, run SSL, and take automatic off-site backups you have actually tested. Most breaches walk straight through a hole an update had already fixed. Consistency beats cleverness.',
        ],
      },
      {
        heading: 'When it does happen',
        paragraphs: [
          'If your site is compromised, speed matters. Every hour it stays infected costs you rankings, email deliverability, and trust. The fix is methodical rather than panicked: contain the damage, remove every backdoor instead of just the visible symptom, clear the Google warnings, and close the hole it came through. A cleanup that misses one backdoor is only a countdown to the next breach.',
        ],
      },
    ],
    pullQuote: 'You do not have to be worth robbing to get robbed. On the modern web, you only have to be easy.',
  },
  {
    slug: 'real-footage-in-a-feed-full-of-fakes',
    title: 'Real Footage in a Feed Full of Fakes',
    dek: 'As AI-generated images flood every feed, authentic aerial footage of your actual property or job site is quietly becoming a competitive edge, not a luxury.',
    category: 'Aerial Photography',
    serviceSlug: 'aerial-media',
    date: '2026-05-08',
    readMins: 5,
    lead: 'Scroll any feed in 2026 and a good share of what you see never happened: AI-generated skies, invented interiors, stock imagery dressed up as real. Audiences have learned to feel the fakeness even when they cannot name it. Which is exactly why footage of a real place, shot from the air, has started to stand out again.',
    sections: [
      {
        heading: 'Authenticity is the new scarcity',
        paragraphs: [
          'When any competitor can generate a glossy image in seconds, a generated image is worth roughly what it costs, which is nothing. What cannot be faked is your actual building, your actual lot, your actual progress on a real job site. Aerial footage is proof, and in a feed full of invented images, proof is what persuades.',
        ],
      },
      {
        heading: 'It sells the thing words cannot',
        paragraphs: [
          'A drone shows a property, its lot lines, and the whole neighborhood in a single frame no ground camera can capture. Listings with aerial imagery consistently draw more views and sell faster, because a buyer understands a place in three seconds of video that a hundred words never quite convey. For builders, a weekly flyover turns “how is the site coming?” into a timeline that clients and lenders actually trust.',
        ],
      },
      {
        heading: 'Legal, insured, and planned',
        paragraphs: [
          'Commercial drone work in the United States is not a hobby with a camera attached. It legally requires a licensed, insured pilot, and hiring an unlicensed operator puts the liability squarely on your business. Done right, every shoot is planned in advance: airspace checked and cleared, weather windows chosen, and a shot list agreed, so the footage is usable the day it lands.',
        ],
      },
      {
        heading: 'Where it earns its keep',
        paragraphs: [
          'Beyond real estate the practical uses stack up: construction progress your whole team can watch, roof and tower inspections without ladders or risk, and cinematic brand video that stops the scroll. The common thread never changes. It is real, it is yours, and no prompt can generate it.',
        ],
      },
    ],
    pullQuote: 'In a feed full of images that never happened, footage of a real place is the one thing a competitor cannot generate their way past.',
  },
  {
    slug: 'the-death-of-the-template',
    title: 'The Death of the Template',
    dek: 'When anyone can generate a passable website in an afternoon, a passable website is worth nothing. In 2026, distinctiveness and craft are the baseline, not the upgrade.',
    category: 'Web Design',
    serviceSlug: 'web-design',
    date: '2026-04-28',
    readMins: 6,
    lead: 'There has never been an easier time to get a website that looks fine. AI builders will spin one up from a paragraph of prompts, and it will be responsive, clean, and utterly forgettable. Which is exactly the problem.',
    sections: [
      {
        heading: 'Generated everything, remembered nothing',
        paragraphs: [
          'When every competitor can produce the same tasteful, templated site in an afternoon, looking fine stops being an advantage and becomes the floor. The web is filling with pages that are technically competent and completely interchangeable, and visitors feel it even when they cannot name it. Sameness reads as forgettable, and forgettable does not convert.',
        ],
      },
      {
        heading: 'What a website is actually for',
        paragraphs: [
          'A business website has three jobs: look credible in the first three seconds, answer the visitor’s real question in the next thirty, and make the next step impossible to miss. A generic template can fake the first and fumbles the other two, because it knows nothing about your business, your customers, or the single thing that makes you the right call.',
        ],
      },
      {
        heading: 'Fast, findable, and yours',
        paragraphs: [
          'Craft is not only how a site looks. It is how fast it loads, how cleanly a search engine and an AI can read it, and how naturally it walks a real person toward a decision. Those are deliberate choices, not defaults. The sites that win in 2026 are the ones where a human made those choices on purpose, for a specific audience.',
        ],
      },
      {
        heading: 'Design as a moat',
        paragraphs: [
          'As the baseline rises, distinctiveness becomes the moat. A site that feels made, that sounds like you and moves like nothing else in your category, is now one of the few things a competitor cannot generate their way past. In the age of infinite automated design, the human touch turns out to be the last defensible advantage.',
        ],
      },
    ],
    pullQuote: 'When anyone can generate a passable site, passable is worthless. The one thing competitors cannot copy is care.',
  },
  {
    slug: 'frictionless-or-forgotten',
    title: 'Frictionless or Forgotten',
    dek: 'AI shopping assistants are starting to check out on your customers’ behalf. If your store is slow, confusing, or invisible to machines, you lose the sale before a human ever sees it.',
    category: 'Ecommerce',
    serviceSlug: 'ecommerce',
    date: '2026-04-09',
    readMins: 5,
    lead: 'Online shoppers were already impatient. Now a growing share of them are not people at all, but assistants shopping on their behalf, comparing, filtering, and increasingly checking out. Selling online in 2026 means designing for both the impatient human and the literal machine.',
    sections: [
      {
        heading: 'The checkout is where the money leaks',
        paragraphs: [
          'Most abandoned carts are not lost sales, they are unanswered questions: surprise shipping costs, a checkout that asks for too much, a form that breaks on a phone. Every extra field and every hidden fee is a fresh chance for the customer to quietly change their mind. The stores that win make buying boringly easy and honest.',
        ],
      },
      {
        heading: 'Machines are shopping now',
        paragraphs: [
          'AI shopping agents read your store the way a search crawler does, through structure rather than vibes. If your prices, availability, and product details are buried in images or tangled markup, the assistant skips you for a competitor it can actually parse. Being machine-readable is quickly becoming as important as being human-friendly.',
        ],
      },
      {
        heading: 'Trust is a design decision',
        paragraphs: [
          'Nobody types a card number into a site they do not trust, and trust is built in the details: clear prices, shipping shown early, readable return policies, SSL, and a checkout that asks only for what it needs. For a service business, that same trust turns a “pay invoice” button into money in the bank instead of another round of phone tag.',
        ],
      },
      {
        heading: 'Measure what actually converts',
        paragraphs: [
          'A good store is not just a catalog, it is an instrument. It should show you which products earn, which pages leak customers, and where the next dollar of marketing belongs. Decisions made from real numbers beat decisions made from gut feeling, and the gap compounds every quarter.',
        ],
      },
    ],
    pullQuote: 'Half your customers now judge your store in milliseconds, and a growing half are not even human. Both leave if you make them wait.',
  },
]
