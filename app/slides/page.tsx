import { SlideViewer } from "@/components/slides/SlideViewer"
import { Nav } from "@/components/sections/Nav"
import { Footer } from "@/components/sections/Footer"

export const metadata = {
  title: "Visualizador de Slides",
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
              Visualizador de Slides
            </h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Faça upload de um arquivo PowerPoint (.pptx) para visualizar os
              slides — tudo processado no browser, nenhum dado sai do seu
              dispositivo.
            </p>
          </div>
          <SlideViewer />
        </div>
      </main>
      <Footer />
    </>
  )
}
