import Link from "next/link"
import { PHOTOGRAPHER_NAME } from "@/lib/site"

export function Nav() {
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
          <li>
            <Link href="/fotografias" className="hover:text-foreground transition-colors">
              Fotografias
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
