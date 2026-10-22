export function Hero() {
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
