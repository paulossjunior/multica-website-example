"use client"

import { useCallback, useState } from "react"

interface SlideDropzoneProps {
  onFile: (file: File) => void
  loading: boolean
}

export function SlideDropzone({ onFile, loading }: SlideDropzoneProps) {
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback(
    (f: File) => {
      if (!f.name.match(/\.(pptx|ppt)$/i)) {
        alert("Please upload a .pptx or .ppt file.")
        return
      }
      onFile(f)
    },
    [onFile]
  )

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragging(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={[
        "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-16 text-center transition-colors",
        dragging
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
          : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/30",
      ].join(" ")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          {loading ? "Processing…" : "Drag & drop your PPTX file here"}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          or click below to browse
        </p>
      </div>
      <label className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
        {loading ? "Loading…" : "Choose File"}
        <input
          type="file"
          accept=".pptx,.ppt"
          className="hidden"
          onChange={onInputChange}
          disabled={loading}
        />
      </label>
      <p className="text-xs text-gray-400">Supports .pptx files</p>
    </div>
  )
}
