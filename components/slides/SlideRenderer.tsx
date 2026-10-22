"use client"

import type { ParsedSlide } from "@/lib/pptx-parser"

interface SlideRendererProps {
  slide: ParsedSlide
  total: number
}

export function SlideRenderer({ slide, total }: SlideRendererProps) {
  const hasImage = slide.images.length > 0
  const mainImage = slide.images[0]

  const titleBox = slide.textBoxes[0]
  const bodyBoxes = slide.textBoxes.slice(1)

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
      {/* 16:9 aspect ratio */}
      <div className="relative" style={{ paddingTop: "56.25%" }}>
        <div className="absolute inset-0 flex flex-col">
          {hasImage && (
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainImage.dataUrl}
                alt={`Slide ${slide.index + 1} image`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          )}

          <div
            className={[
              "relative flex h-full flex-col justify-between p-8",
              hasImage ? "text-white" : "text-gray-900 dark:text-gray-100",
            ].join(" ")}
          >
            {/* Title */}
            {titleBox && (
              <div>
                <h2
                  className={[
                    "font-heading text-3xl font-light leading-tight",
                    hasImage ? "drop-shadow" : "",
                  ].join(" ")}
                >
                  {titleBox.texts.join(" ")}
                </h2>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-hidden py-4">
              {bodyBoxes.map((box, i) => (
                <div key={i} className="mb-3">
                  {box.texts.map((t, j) => (
                    <p
                      key={j}
                      className={[
                        "text-base leading-relaxed",
                        hasImage ? "drop-shadow" : "text-gray-700 dark:text-gray-300",
                      ].join(" ")}
                    >
                      {t}
                    </p>
                  ))}
                </div>
              ))}

              {/* Extra images */}
              {slide.images.slice(1).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {slide.images.slice(1).map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={img.dataUrl}
                      alt={`Slide ${slide.index + 1} image ${i + 2}`}
                      className="max-h-32 rounded object-contain"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Slide number */}
            <div
              className={[
                "self-end rounded-full px-3 py-1 text-xs font-medium",
                hasImage
                  ? "bg-white/20 text-white backdrop-blur-sm"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
              ].join(" ")}
            >
              {slide.index + 1} / {total}
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {slide.notes && (
        <div className="border-t border-gray-100 px-6 py-3 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">Notes: </span>
            {slide.notes}
          </p>
        </div>
      )}
    </div>
  )
}
