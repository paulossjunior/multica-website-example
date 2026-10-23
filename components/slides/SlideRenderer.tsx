"use client"

import type { ParsedSlide, SlideTextBox, TextRun } from "@/lib/pptx-parser"

interface SlideRendererProps {
  slide: ParsedSlide
  total: number
  fullscreen?: boolean
}

function TextBoxEl({ box }: { box: SlideTextBox }) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        left: `${box.x}%`,
        top: `${box.y}%`,
        width: `${box.w}%`,
        minHeight: `${box.h}%`,
      }}
    >
      {box.paragraphs.map((runs, pi) => (
        <p key={pi} className="leading-tight">
          {runs.map((run, ri) => (
            <RunEl key={ri} run={run} />
          ))}
        </p>
      ))}
    </div>
  )
}

function RunEl({ run }: { run: TextRun }) {
  return (
    <span
      style={{
        fontWeight: run.bold ? 700 : undefined,
        fontStyle: run.italic ? "italic" : undefined,
        fontSize: run.fontSize ? `${run.fontSize}pt` : undefined,
        color: run.color ?? undefined,
      }}
    >
      {run.text}
    </span>
  )
}

export function SlideRenderer({ slide, total, fullscreen }: SlideRendererProps) {
  const { background, textBoxes, images } = slide

  const bgStyle: React.CSSProperties = {}
  if (background.color) bgStyle.backgroundColor = background.color
  if (background.imageDataUrl) {
    bgStyle.backgroundImage = `url(${background.imageDataUrl})`
    bgStyle.backgroundSize = "cover"
    bgStyle.backgroundPosition = "center"
  }

  return (
    <div
      className={[
        "relative w-full select-none overflow-hidden rounded-xl bg-white shadow-lg",
        fullscreen ? "h-full rounded-none" : "",
      ].join(" ")}
    >
      {/* 16:9 aspect ratio */}
      <div className="relative" style={{ paddingTop: "56.25%" }}>
        <div className="absolute inset-0" style={bgStyle}>
          {/* Background fallback */}
          {!background.color && !background.imageDataUrl && (
            <div className="absolute inset-0 bg-white dark:bg-gray-900" />
          )}

          {/* Images at exact positions */}
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={img.dataUrl}
              alt=""
              className="absolute object-contain"
              style={{
                left: `${img.x}%`,
                top: `${img.y}%`,
                width: `${img.w}%`,
                height: `${img.h}%`,
              }}
            />
          ))}

          {/* Text boxes at exact positions */}
          {textBoxes.map((box, i) => (
            <TextBoxEl key={i} box={box} />
          ))}

          {/* Slide counter */}
          <div className="absolute bottom-2 right-3 rounded bg-black/30 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
            {slide.index + 1} / {total}
          </div>
        </div>
      </div>

      {/* Notes */}
      {slide.notes && (
        <div className="border-t border-gray-100 bg-amber-50 px-4 py-2 dark:border-gray-700 dark:bg-amber-950/20">
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              Notes:{" "}
            </span>
            {slide.notes}
          </p>
        </div>
      )}
    </div>
  )
}
