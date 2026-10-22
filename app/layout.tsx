import type { Metadata } from "next"
import { Outfit, Cormorant_Garamond } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500"],
})

export const metadata: Metadata = {
  title: "Paulo's Photography",
  description: "Portrait, landscape, and documentary photography.",
  openGraph: {
    type: "website",
    title: "Paulo's Photography",
    description: "Portrait, landscape, and documentary photography.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", cormorant.variable, outfit.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
