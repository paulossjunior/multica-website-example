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
            <Link href="/#work" className="hover:text-foreground transition-colors">
              Work
            </Link>
          </li>
          <li>
            <Link href="/#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/#contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/fotografias" className="hover:text-foreground transition-colors">
              Fotografias
            </Link>
          </li>
          <li>
            <Link href="/slides" className="hover:text-foreground transition-colors">
              Slides
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
