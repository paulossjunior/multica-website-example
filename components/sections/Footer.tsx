import { PHOTOGRAPHER_NAME } from "@/lib/site"

export function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-muted-foreground tracking-wide">
        <span className="font-heading italic">{PHOTOGRAPHER_NAME}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
