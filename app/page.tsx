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
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-heading text-lg leading-none tracking-wide italic"
        >
          {PHOTOGRAPHER_NAME}
        </Link>
        <ul className="flex gap-8 text-xs tracking-widest text-muted-foreground uppercase">
          <li>
            <a href="#work" className="transition-colors hover:text-foreground">
              Work
            </a>
          </li>
          <li>
            <a
              href="#pricing"
              className="transition-colors hover:text-foreground"
            >
              Pricing
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="transition-colors hover:text-foreground"
            >
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
    <section className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-6xl flex-col justify-center px-6 py-24">
      <p className="mb-10 text-xs tracking-widest text-muted-foreground uppercase">
        Photography
      </p>
      <h1 className="max-w-4xl font-heading text-5xl leading-[1.05] font-light tracking-tight sm:text-7xl lg:text-[5.5rem]">
        I photograph the space between stillness and motion.
      </h1>
      <p className="mt-10 max-w-lg text-base leading-relaxed font-light text-muted-foreground">
        Based in Vix. I work across portrait, documentary, and landscape —
        wherever light and patience find each other. Every image is built around
        a single, deliberate frame.
      </p>
      <a
        href="#work"
        className="mt-14 inline-flex w-fit items-center gap-2 border-b border-foreground pb-px text-xs tracking-widest uppercase transition-colors hover:border-muted-foreground hover:text-muted-foreground"
      >
        View selected work
      </a>
    </section>
  )
}

function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-24">
      <header className="mb-12">
        <p className="mb-3 text-xs tracking-widest text-muted-foreground uppercase">
          Portfolio
        </p>
        <h2 className="font-heading text-4xl font-light">Selected Work</h2>
      </header>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map(({ seed, alt }) => (
          <div
            key={seed}
            className="relative aspect-[3/4] overflow-hidden bg-muted"
          >
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

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        All images above are placeholders from{" "}
        <span className="font-mono">picsum.photos</span>. See the comment block
        at the top of <span className="font-mono">app/page.tsx</span> for a
        guide on which photo to use in each position.
      </p>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <header className="mb-14">
          <p className="mb-3 text-xs tracking-widest text-muted-foreground uppercase">
            Investment
          </p>
          <h2 className="font-heading text-4xl font-light">Rates</h2>
          <p className="mt-5 max-w-md leading-relaxed font-light text-muted-foreground">
            Prices below are a starting point. Every project is different —
            reach out and we can talk through what makes sense for yours.
          </p>
        </header>

        <div className="grid grid-cols-1 divide-y divide-border border border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {pricing.map(({ name, price, note, items }) => (
            <div key={name} className="flex flex-col gap-8 bg-background p-8">
              <div>
                <h3 className="font-heading text-2xl font-light">{name}</h3>
                <p className="mt-1 text-xs tracking-wide text-muted-foreground">
                  {note}
                </p>
              </div>

              <div>
                <span className="font-heading text-4xl font-light">
                  {price}
                </span>
              </div>

              <ul className="flex-1 space-y-3 text-sm font-light text-muted-foreground">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[0.45rem] h-px w-3 flex-shrink-0 bg-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="w-fit border-b border-current pb-px text-xs tracking-widest uppercase transition-colors hover:text-muted-foreground"
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
    <section id="contact" className="mx-auto max-w-4xl px-6 py-32 text-center">
      <p className="mb-8 text-xs tracking-widest text-muted-foreground uppercase">
        Contact
      </p>
      <h2 className="mb-8 font-heading text-4xl leading-tight font-light sm:text-5xl">
        Let&apos;s talk about your project.
      </h2>
      <p className="mx-auto mb-12 max-w-md leading-relaxed font-light text-muted-foreground">
        Whether you have a clear brief or only an idea, I&apos;m glad to hear
        from you. The best work begins with a conversation.
      </p>
      <a
        href="mailto:hello@example.com"
        className="font-heading text-2xl font-light underline decoration-1 underline-offset-8 transition-colors hover:text-muted-foreground sm:text-3xl"
      >
        hello@example.com
      </a>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between text-xs tracking-wide text-muted-foreground">
        <span className="font-heading italic">{PHOTOGRAPHER_NAME}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
