import { Nav } from "@/components/sections/Nav"
import { Hero } from "@/components/sections/Hero"
import { Gallery } from "@/components/sections/Gallery"
import { Pricing } from "@/components/sections/Pricing"
import { Contact } from "@/components/sections/Contact"
import { Footer } from "@/components/sections/Footer"

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Gallery />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
