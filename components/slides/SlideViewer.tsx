"use client"

import { useState, useCallback, useEffect, useRef } from "react"
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
  const [fullscreen, setFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFile = useCallback(async (file: File) => {
    setLoading(true)
    setError(null)
    setSlides([])
    setCurrent(0)
    setFileName(file.name)
    try {
      const parsed = await parsePptx(file)
      if (!parsed.length) throw new Error("Nenhum slide encontrado no arquivo.")
      setSlides(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao processar o arquivo.")
    } finally {
      setLoading(false)
    }
  }, [])

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), [])
  const next = useCallback(
    () => setCurrent((c) => (slides.length ? Math.min(slides.length - 1, c + 1) : 0)),
    [slides.length]
  )

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev() }
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); next() }
      if (e.key === "Escape") setFullscreen(false)
      if (e.key === "f" || e.key === "F") setFullscreen((v) => !v)
      if (e.key === "Home") setCurrent(0)
      if (e.key === "End") setCurrent(slides.length - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prev, next, slides.length])

  // Native Fullscreen API
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen()
        setFullscreen(true)
      } catch {
        setFullscreen((v) => !v)
      }
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setFullscreen(false)
    }
    document.addEventListener("fullscreenchange", onFsChange)
    return () => document.removeEventListener("fullscreenchange", onFsChange)
  }, [])

  const reset = useCallback(() => {
    setSlides([])
    setError(null)
    setFileName(null)
    setCurrent(0)
    setFullscreen(false)
  }, [])

  // Dropzone state
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

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Processando {fileName}…
        </p>
      </div>
    )
  }

  const slide = slides[current]

  return (
    <div
      ref={containerRef}
      className={[
        "flex flex-col gap-4",
        fullscreen
          ? "fixed inset-0 z-50 bg-black p-0"
          : "",
      ].join(" ")}
    >
      {/* Header */}
      {!fullscreen && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-lg font-light text-gray-800 dark:text-gray-200 truncate max-w-xs">
              {fileName}
            </h2>
            <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {slides.length} slides
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleFullscreen}
              title="Fullscreen (F)"
              className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
            <button
              onClick={reset}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Abrir outro arquivo
            </button>
          </div>
        </div>
      )}

      <div className={["flex gap-4", fullscreen ? "h-full" : ""].join(" ")}>
        {/* Thumbnails sidebar */}
        {!fullscreen && (
          <div className="hidden w-44 shrink-0 md:block">
            <SlideThumbnails
              slides={slides}
              current={current}
              onSelect={setCurrent}
            />
          </div>
        )}

        {/* Main area */}
        <div className={["flex min-w-0 flex-1 flex-col gap-3", fullscreen ? "h-full justify-between" : ""].join(" ")}>
          {/* Fullscreen toolbar */}
          {fullscreen && (
            <div className="flex items-center justify-between bg-black/60 px-4 py-2 backdrop-blur-sm">
              <span className="text-sm text-white/70 truncate">{fileName}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/70">{current + 1} / {slides.length}</span>
                <button
                  onClick={toggleFullscreen}
                  className="rounded p-1 text-white/70 hover:text-white"
                  title="Sair (Esc)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className={fullscreen ? "flex flex-1 items-center justify-center px-4" : ""}>
            <div className={fullscreen ? "w-full max-w-5xl" : "w-full"}>
              <SlideRenderer slide={slide} total={slides.length} fullscreen={fullscreen} />
            </div>
          </div>

          {/* Navigation */}
          <div className={["flex items-center justify-between", fullscreen ? "bg-black/60 px-4 py-2 backdrop-blur-sm" : ""].join(" ")}>
            <button
              onClick={prev}
              disabled={current === 0}
              className={[
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                fullscreen
                  ? "text-white hover:bg-white/20"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800",
              ].join(" ")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            <div className="flex items-center gap-1 overflow-hidden max-w-xs">
              {slides.slice(0, 30).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={[
                    "h-2 rounded-full transition-all shrink-0",
                    i === current
                      ? "w-6 bg-blue-500"
                      : fullscreen
                        ? "w-2 bg-white/40 hover:bg-white/70"
                        : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600",
                  ].join(" ")}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
              {slides.length > 30 && (
                <span className={["text-xs", fullscreen ? "text-white/50" : "text-gray-400"].join(" ")}>
                  +{slides.length - 30}
                </span>
              )}
            </div>

            <button
              onClick={next}
              disabled={current === slides.length - 1}
              className={[
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                fullscreen
                  ? "text-white hover:bg-white/20"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800",
              ].join(" ")}
            >
              Próximo
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {!fullscreen && (
            <p className="text-center text-xs text-gray-400 dark:text-gray-600">
              ← → navegar · F tela cheia · Home/End primeiro/último slide
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
