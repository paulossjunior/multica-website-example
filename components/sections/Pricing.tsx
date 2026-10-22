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

export function Pricing() {
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
