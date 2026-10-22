export function Contact() {
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
