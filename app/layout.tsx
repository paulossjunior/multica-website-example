import type { Metadata } from "next"
import { Outfit, Cormorant_Garamond } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

// Edit this constant to update the name everywhere (metadata, nav, footer)
export const PHOTOGRAPHER_NAME = "Paulo's Photography"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400"],
  style: ["normal", "italic"],
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400"],
})

export const metadata: Metadata = {
  title: PHOTOGRAPHER_NAME,
  description: "Portrait, landscape, and documentary photography.",
  openGraph: {
    type: "website",
    title: PHOTOGRAPHER_NAME,
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
