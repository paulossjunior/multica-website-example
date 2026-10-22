import { SlideViewer } from "@/components/slides/SlideViewer"
import { Nav } from "@/components/sections/Nav"
import { Footer } from "@/components/sections/Footer"

export const metadata = {
  title: "Slide Viewer",
  description: "Upload and view PowerPoint presentations in your browser.",
}

export default function SlidesPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h1 className="font-heading text-4xl font-light text-gray-900 dark:text-gray-100">
              Slide Viewer
            </h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Upload a PowerPoint file (.pptx) to view it slide by slide — no
              upload to server, everything stays in your browser.
            </p>
          </div>
          <SlideViewer />
        </div>
      </main>
      <Footer />
    </>
  )
}
