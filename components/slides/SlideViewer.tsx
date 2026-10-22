"use client"

import { useState, useCallback, useEffect } from "react"
import { parsePptx, type ParsedSlide } from "@/lib/pptx-parser"
import { SlideDropzone } from "./SlideDropzone"
import { SlideRenderer } from "./SlideRenderer"
import { SlideThumbnails } from "./SlideThumbnails"

export function SlideViewer() {
  const [slides, setSlides] = useState<ParsedSlide[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    setLoading(true)
    setError(null)
    setSlides([])
    setCurrent(0)
    setFileName(file.name)
    try {
      const parsed = await parsePptx(file)
      if (!parsed.length) throw new Error("No slides found in this file.")
      setSlides(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file.")
    } finally {
      setLoading(false)
    }
  }, [])

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), [])
  const next = useCallback(
    () => setCurrent((c) => Math.min(slides.length - 1, c + 1)),
    [slides.length]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prev, next])

  const reset = useCallback(() => {
    setSlides([])
    setError(null)
    setFileName(null)
    setCurrent(0)
  }, [])

  if (!slides.length && !loading) {
    return (
      <div className="mx-auto max-w-2xl">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}
        <SlideDropzone onFile={handleFile} loading={loading} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Parsing {fileName}…
        </p>
      </div>
    )
  }

  const slide = slides[current]

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-lg font-light text-gray-800 dark:text-gray-200">
            {fileName}
          </h2>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {slides.length} slides
          </span>
        </div>
        <button
          onClick={reset}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          Open another file
        </button>
      </div>

      <div className="flex gap-4">
        {/* Thumbnails sidebar */}
        <div className="hidden w-44 shrink-0 md:block">
          <SlideThumbnails
            slides={slides}
            current={current}
            onSelect={setCurrent}
          />
        </div>

        {/* Main area */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <SlideRenderer slide={slide} total={slides.length} />

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prev}
              disabled={current === 0}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={[
                    "h-2 rounded-full transition-all",
                    i === current
                      ? "w-6 bg-blue-500"
                      : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500",
                  ].join(" ")}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={current === slides.length - 1}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600">
            Use arrow keys ← → to navigate
          </p>
        </div>
      </div>
    </div>
  )
}
