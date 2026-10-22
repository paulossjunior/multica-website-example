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

import Image from "next/image"

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

export function Gallery() {
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
        at the top of <span className="font-mono">components/sections/Gallery.tsx</span> for a guide
        on which photo to use in each position.
      </p>
    </section>
  )
}
