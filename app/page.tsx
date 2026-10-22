import Image from "next/image"
import Link from "next/link"
import { PHOTOGRAPHER_NAME } from "./layout"

/*
 * PLACEHOLDER IMAGE GUIDE
 *
 * To replace a photo: edit the `gallery` array below.
 * Change `seed` to any string for a different picsum placeholder, OR
 * add a `src` field and update the <Image> to use it directly:
 *
 *   { src: "/gallery/lisbon.jpg", alt: "Trams at dawn, Lisbon" }
 *
 * Intended subjects per slot:
 *   p1 — hero / wide establishing shot
 *   p2 — tight portrait, natural window light
 *   p3 — environmental portrait (person in their space)
 *   p4 — texture or abstract detail
 *   p5 — candid or street moment
 *   p6 — architectural form or geometric composition
 *   p7 — golden-hour or dusk scene
 *   p8 — interior with deliberate light
 *   p9 — close portrait or still life
 *
 * TODO: update each `alt` string with a specific description once real
 * images replace the placeholders — generic alt text hurts accessibility.
 */

const gallery = [
  { seed: "p1", alt: "Establishing landscape" },
  { seed: "p2", alt: "Portrait in natural light" },
  { seed: "p3", alt: "Environmental portrait" },
  { seed: "p4", alt: "Texture study" },
  { seed: "p5", alt: "Candid moment" },
  { seed: "p6", alt: "Architectural composition" },
  { seed: "p7", alt: "Golden hour" },
  { seed: "p8", alt: "Interior light" },
  { seed: "p9", alt: "Close portrait" },
]

const pricing = [
  {
    name: "Session",
    price: "$350",
    note: "Up to 2 hours",
    items: [
      "30 curated, edited images",
      "Online gallery for download",
      "Personal use license",
      "One location",
    ],
  },
  {
    name: "Editorial",
    price: "$750",
    note: "Up to 4 hours",
    items: [
      "80 curated, edited images",
      "Print-ready files",
      "Extended use license",
      "Pre-shoot consultation",
    ],
  },
  {
    name: "Full Day",
    price: "Custom",
    note: "Up to 8 hours",
    items: [
      "Unlimited edited images",
      "All rights transferred",
      "Flexible location(s)",
      "Dedicated planning session",
    ],
  },
]

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Work />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-heading italic text-lg tracking-wide leading-none">
          {PHOTOGRAPHER_NAME}
        </Link>
        <ul className="flex gap-8 text-xs tracking-widest uppercase text-muted-foreground">
          <li>
            <a href="#work" className="hover:text-foreground transition-colors">
              Work
            </a>
          </li>
          <li>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="min-h-[calc(100svh-3.5rem)] flex flex-col justify-center px-6 py-24 max-w-6xl mx-auto">
      <p className="text-xs tracking-widest uppercase text-muted-foreground mb-10">
        Photography
      </p>
      {/* Replace this line with a tagline that reflects your work */}
      <h1 className="font-heading font-light text-5xl sm:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight max-w-4xl">
        I photograph the space between stillness and motion.
      </h1>
      {/* Replace with your own introduction — who you are, where you're based, what drives you */}
      <p className="mt-10 max-w-lg text-base text-muted-foreground leading-relaxed font-light">
        Based in Vix. I work across portrait, documentary, and landscape — wherever
        light and patience find each other. Every image is built around a single, deliberate
        frame.
      </p>
      <a
        href="#work"
        className="mt-14 inline-flex items-center gap-2 text-xs tracking-widest uppercase border-b border-foreground pb-px w-fit hover:text-muted-foreground hover:border-muted-foreground transition-colors"
      >
        View selected work
      </a>
    </section>
  )
}

function Work() {
  return (
    <section id="work" className="px-6 py-24 max-w-6xl mx-auto">
      <header className="mb-12">
        <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Portfolio</p>
        <h2 className="font-heading font-light text-4xl">Selected Work</h2>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
        {gallery.map(({ seed, alt }) => (
          <div key={seed} className="relative aspect-[3/4] overflow-hidden bg-muted">
            <Image
              src={`https://picsum.photos/seed/${seed}/800/1067`}
              alt={alt}
              fill
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
        All images above are placeholders from{" "}
        <span className="font-mono">picsum.photos</span>. See the comment block
        at the top of <span className="font-mono">app/page.tsx</span> for a guide
        on which photo to use in each position.
      </p>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="bg-muted/40 border-y border-border">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <header className="mb-14">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Investment</p>
          <h2 className="font-heading font-light text-4xl">Rates</h2>
          <p className="mt-5 text-muted-foreground max-w-md leading-relaxed font-light">
            Prices below are a starting point. Every project is different — reach out
            and we can talk through what makes sense for yours.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border border-border">
          {pricing.map(({ name, price, note, items }) => (
            <div key={name} className="bg-background p-8 flex flex-col gap-8">
              <div>
                <h3 className="font-heading font-light text-2xl">{name}</h3>
                <p className="text-xs text-muted-foreground mt-1 tracking-wide">{note}</p>
              </div>

              <div>
                <span className="font-heading text-4xl font-light">{price}</span>
              </div>

              <ul className="space-y-3 text-sm text-muted-foreground font-light flex-1">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[0.45rem] h-px w-3 bg-muted-foreground flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="text-xs tracking-widest uppercase border-b border-current pb-px w-fit hover:text-muted-foreground transition-colors"
              >
                Get in touch
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="px-6 py-32 max-w-4xl mx-auto text-center">
      <p className="text-xs tracking-widest uppercase text-muted-foreground mb-8">Contact</p>
      <h2 className="font-heading font-light text-4xl sm:text-5xl leading-tight mb-8">
        Let&apos;s talk about your project.
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-12 leading-relaxed font-light">
        Whether you have a clear brief or only an idea, I&apos;m glad to hear from you.
        The best work begins with a conversation.
      </p>
      <a
        href="mailto:hello@example.com"
        className="font-heading text-2xl sm:text-3xl font-light underline underline-offset-8 decoration-1 hover:text-muted-foreground transition-colors"
      >
        hello@example.com
      </a>
    </section>
  )
}

function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-muted-foreground tracking-wide">
        <span className="font-heading italic">{PHOTOGRAPHER_NAME}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
