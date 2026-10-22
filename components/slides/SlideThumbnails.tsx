"use client"

import type { ParsedSlide } from "@/lib/pptx-parser"

interface SlideThumbnailsProps {
  slides: ParsedSlide[]
  current: number
  onSelect: (index: number) => void
}

export function SlideThumbnails({ slides, current, onSelect }: SlideThumbnailsProps) {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto pr-1">
      {slides.map((slide) => {
        const title =
          slide.textBoxes[0]?.paragraphs[0]?.map((r) => r.text).join("") ??
          `Slide ${slide.index + 1}`
        const img = slide.images[0]
        const active = slide.index === current

        const bgStyle: React.CSSProperties = {}
        if (slide.background.color) bgStyle.backgroundColor = slide.background.color
        if (slide.background.imageDataUrl) {
          bgStyle.backgroundImage = `url(${slide.background.imageDataUrl})`
          bgStyle.backgroundSize = "cover"
          bgStyle.backgroundPosition = "center"
        }

        return (
          <button
            key={slide.index}
            onClick={() => onSelect(slide.index)}
            className={[
              "group flex flex-col overflow-hidden rounded-lg border-2 text-left transition-all",
              active
                ? "border-blue-500 shadow-md"
                : "border-transparent hover:border-gray-300 dark:hover:border-gray-600",
            ].join(" ")}
          >
            <div
              className="relative w-full bg-white dark:bg-gray-800"
              style={{ paddingTop: "56.25%", ...bgStyle }}
            >
              {img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.dataUrl}
                  alt={`Slide ${slide.index + 1}`}
                  className="absolute object-contain"
                  style={{
                    left: `${img.x}%`,
                    top: `${img.y}%`,
                    width: `${img.w}%`,
                    height: `${img.h}%`,
                  }}
                />
              )}
              {!img && !slide.background.imageDataUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-gray-400 dark:text-gray-600">
                    {slide.index + 1}
                  </span>
                </div>
              )}
              {active && (
                <div className="absolute inset-0 ring-2 ring-inset ring-blue-500" />
              )}
            </div>

            <div
              className={[
                "px-2 py-1",
                active
                  ? "bg-blue-50 dark:bg-blue-950/30"
                  : "bg-white dark:bg-gray-900",
              ].join(" ")}
            >
              <p className="truncate text-xs font-medium text-gray-700 dark:text-gray-300">
                {slide.index + 1}. {title}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
