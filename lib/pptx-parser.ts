import JSZip from "jszip"

export interface TextRun {
  text: string
  bold: boolean
  italic: boolean
  fontSize: number | null
  color: string | null
}

export interface SlideTextBox {
  paragraphs: TextRun[][]
  x: number
  y: number
  w: number
  h: number
}

export interface SlideImage {
  dataUrl: string
  x: number
  y: number
  w: number
  h: number
}

export interface SlideBackground {
  color: string | null
  imageDataUrl: string | null
}

export interface ParsedSlide {
  index: number
  slideWidth: number
  slideHeight: number
  textBoxes: SlideTextBox[]
  images: SlideImage[]
  notes: string
  background: SlideBackground
}

// Find all elements by local name regardless of namespace prefix
function byName(parent: Document | Element, localName: string): Element[] {
  return Array.from(parent.getElementsByTagNameNS("*", localName))
}

function first(parent: Document | Element, localName: string): Element | null {
  return parent.getElementsByTagNameNS("*", localName).item(0)
}

function parseXml(xml: string): Document {
  return new DOMParser().parseFromString(xml, "application/xml")
}

// Normalize a path that may contain ".." segments
function normalizePath(p: string): string {
  return p.split("/").reduce<string[]>((acc, seg) => {
    if (seg === "..") acc.pop()
    else if (seg && seg !== ".") acc.push(seg)
    return acc
  }, []).join("/")
}

function resolveTarget(target: string, slideFolder: string): string {
  if (target.startsWith("/")) return normalizePath(target.slice(1))
  return normalizePath(`${slideFolder}/${target}`)
}

// Extract hex color from a solidFill element's child
function extractColor(solidFill: Element | null): string | null {
  if (!solidFill) return null
  const rgb = first(solidFill, "srgbClr")
  if (rgb) return `#${rgb.getAttribute("val") ?? "000000"}`
  const sys = first(solidFill, "sysClr")
  if (sys) return `#${sys.getAttribute("lastClr") ?? "000000"}`
  const prstClr = first(solidFill, "prstClr")
  if (prstClr) return prstClrToHex(prstClr.getAttribute("val") ?? "")
  const schemeClr = first(solidFill, "schemeClr")
  if (schemeClr) return null // can't resolve without theme, skip
  return null
}

// Very minimal preset color map (covers common cases)
const PRSTCLR: Record<string, string> = {
  white: "#ffffff", black: "#000000", red: "#ff0000", green: "#008000",
  blue: "#0000ff", yellow: "#ffff00", cyan: "#00ffff", magenta: "#ff00ff",
  gray: "#808080", grey: "#808080", darkGray: "#a9a9a9", lightGray: "#d3d3d3",
  orange: "#ffa500", purple: "#800080", brown: "#a52a2a", pink: "#ffc0cb",
}
function prstClrToHex(name: string): string | null {
  return PRSTCLR[name] ?? null
}

// EMU to percentage of slide dimension
function emuPct(val: string | null, dim: number): number {
  if (!val) return 0
  const n = parseInt(val, 10)
  return isNaN(n) ? 0 : (n / dim) * 100
}

function getXfrm(el: Element): { x: number; y: number; w: number; h: number } | null {
  const xfrm = first(el, "xfrm")
  if (!xfrm) return null
  const off = first(xfrm, "off")
  const ext = first(xfrm, "ext")
  return {
    x: parseFloat(off?.getAttribute("x") ?? "0") || 0,
    y: parseFloat(off?.getAttribute("y") ?? "0") || 0,
    w: parseFloat(ext?.getAttribute("cx") ?? "0") || 0,
    h: parseFloat(ext?.getAttribute("cy") ?? "0") || 0,
  }
}

// Build SlideTextBox from a <p:sp> element
function extractTextBox(
  sp: Element,
  slideW: number,
  slideH: number
): SlideTextBox | null {
  const txBody = first(sp, "txBody")
  if (!txBody) return null

  const paragraphs: TextRun[][] = []

  for (const para of byName(txBody, "p")) {
    const runs: TextRun[] = []

    // Handle field elements (slide number, date, etc.) and regular runs
    const allRuns = byName(para, "r")
    const flds = byName(para, "fld")
    const combined = [...allRuns, ...flds].sort((a, b) => {
      // DOM order: compare position
      const pos = a.compareDocumentPosition(b)
      return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })

    for (const r of combined) {
      const t = first(r, "t")
      const text = t?.textContent ?? ""
      if (!text) continue

      const rPr = first(r, "rPr")
      const bold = rPr?.getAttribute("b") === "1"
      const italic = rPr?.getAttribute("i") === "1"
      const szStr = rPr?.getAttribute("sz")
      const fontSize = szStr ? parseInt(szStr) / 100 : null

      let color: string | null = null
      const solidFill = first(rPr ?? new Element(), "solidFill")
      if (rPr) color = extractColor(first(rPr, "solidFill"))

      runs.push({ text, bold, italic, fontSize, color })
    }

    if (runs.length) paragraphs.push(runs)
  }

  if (!paragraphs.length) return null

  const xfrm = getXfrm(sp)
  if (!xfrm) return { paragraphs, x: 0, y: 0, w: 100, h: 30 }

  return {
    paragraphs,
    x: (xfrm.x / slideW) * 100,
    y: (xfrm.y / slideH) * 100,
    w: (xfrm.w / slideW) * 100,
    h: (xfrm.h / slideH) * 100,
  }
}

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
  bmp: "image/bmp",
  emf: "image/x-emf",
  wmf: "image/x-wmf",
}

async function loadImage(
  zip: JSZip,
  target: string,
  slideFolder: string
): Promise<string | null> {
  const path = resolveTarget(target, slideFolder)
  const file = zip.file(path)
  if (!file) return null
  const ext = path.split(".").pop()?.toLowerCase() ?? "png"
  const mime = MIME[ext] ?? "image/png"
  try {
    const data = await file.async("base64")
    return `data:${mime};base64,${data}`
  } catch {
    return null
  }
}

async function extractImages(
  slideXml: Document,
  relsXml: Document | null,
  zip: JSZip,
  slideFolder: string,
  slideW: number,
  slideH: number
): Promise<SlideImage[]> {
  if (!relsXml) return []

  const relMap = new Map<string, string>()
  for (const rel of byName(relsXml, "Relationship")) {
    const id = rel.getAttribute("Id") ?? ""
    const target = rel.getAttribute("Target") ?? ""
    if (id && target) relMap.set(id, target)
  }

  const images: SlideImage[] = []

  // Pictures: <p:pic> — have position + blipFill
  for (const pic of byName(slideXml, "pic")) {
    const blip = first(pic, "blip")
    if (!blip) continue

    const rId =
      blip.getAttributeNS(
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        "embed"
      ) ?? blip.getAttribute("r:embed") ?? blip.getAttribute("embed") ?? ""
    if (!rId) continue

    const target = relMap.get(rId)
    if (!target) continue

    const dataUrl = await loadImage(zip, target, slideFolder)
    if (!dataUrl) continue

    const xfrm = getXfrm(pic)
    images.push({
      dataUrl,
      x: xfrm ? (xfrm.x / slideW) * 100 : 0,
      y: xfrm ? (xfrm.y / slideH) * 100 : 0,
      w: xfrm ? (xfrm.w / slideW) * 100 : 100,
      h: xfrm ? (xfrm.h / slideH) * 100 : 100,
    })
  }

  return images
}

async function extractBackground(
  slideXml: Document,
  relsXml: Document | null,
  zip: JSZip,
  slideFolder: string
): Promise<SlideBackground> {
  const bg = first(slideXml, "bg")
  if (!bg) return { color: null, imageDataUrl: null }

  const solidFill = first(bg, "solidFill")
  if (solidFill) return { color: extractColor(solidFill), imageDataUrl: null }

  const blipFill = first(bg, "blipFill")
  if (blipFill && relsXml) {
    const blip = first(blipFill, "blip")
    if (blip) {
      const rId =
        blip.getAttributeNS(
          "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
          "embed"
        ) ?? blip.getAttribute("r:embed") ?? ""

      const relMap = new Map<string, string>()
      for (const rel of byName(relsXml, "Relationship")) {
        const id = rel.getAttribute("Id") ?? ""
        const target = rel.getAttribute("Target") ?? ""
        if (id && target) relMap.set(id, target)
      }

      const target = rId ? relMap.get(rId) : null
      if (target) {
        const dataUrl = await loadImage(zip, target, slideFolder)
        if (dataUrl) return { color: null, imageDataUrl: dataUrl }
      }
    }
  }

  return { color: null, imageDataUrl: null }
}

async function extractNotes(zip: JSZip, slideIndex: number): Promise<string> {
  const f = zip.file(`ppt/notesSlides/notesSlide${slideIndex + 1}.xml`)
  if (!f) return ""
  const doc = parseXml(await f.async("string"))
  return byName(doc, "t")
    .map((t) => t.textContent ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}

export async function parsePptx(file: File): Promise<ParsedSlide[]> {
  const zip = await JSZip.loadAsync(file)

  // --- Presentation dimensions ---
  const presFile = zip.file("ppt/presentation.xml")
  if (!presFile) throw new Error("Invalid PPTX: missing ppt/presentation.xml")

  const presXml = parseXml(await presFile.async("string"))
  const sldSz = first(presXml, "sldSz")
  const slideW = parseFloat(sldSz?.getAttribute("cx") ?? "12192000") || 12192000
  const slideH = parseFloat(sldSz?.getAttribute("cy") ?? "6858000") || 6858000

  // --- Slide order from presentation rels ---
  const presRelsFile = zip.file("ppt/_rels/presentation.xml.rels")
  const presRelsXml = presRelsFile
    ? parseXml(await presRelsFile.async("string"))
    : null

  const relMap = new Map<string, string>()
  if (presRelsXml) {
    for (const rel of byName(presRelsXml, "Relationship")) {
      relMap.set(rel.getAttribute("Id") ?? "", rel.getAttribute("Target") ?? "")
    }
  }

  // Ordered slide paths
  const slidePaths: string[] = []
  for (const sldId of byName(presXml, "sldId")) {
    const rId =
      sldId.getAttributeNS(
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        "id"
      ) ?? sldId.getAttribute("r:id") ?? ""
    const target = rId ? relMap.get(rId) : null
    if (target) {
      const path = target.startsWith("/") ? target.slice(1) : `ppt/${target}`
      slidePaths.push(normalizePath(path))
    }
  }

  // Fallback: find slide files by name pattern
  if (!slidePaths.length) {
    const nums = Object.keys(zip.files)
      .filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))
      .map((f) => parseInt(f.match(/slide(\d+)\.xml/)![1]))
      .sort((a, b) => a - b)
    nums.forEach((n) => slidePaths.push(`ppt/slides/slide${n}.xml`))
  }

  // --- Parse each slide ---
  const slides: ParsedSlide[] = []

  for (let i = 0; i < slidePaths.length; i++) {
    const slidePath = slidePaths[i]
    const slideFile = zip.file(slidePath)
    if (!slideFile) continue

    const slideXmlStr = await slideFile.async("string")
    const slideXml = parseXml(slideXmlStr)

    const slideFolder = slidePath.split("/").slice(0, -1).join("/")
    const relsPath = `${slideFolder}/_rels/${slidePath.split("/").pop()}.rels`
    const relsFile = zip.file(relsPath)
    const relsXml = relsFile ? parseXml(await relsFile.async("string")) : null

    // Text boxes from shapes <p:sp>
    const textBoxes: SlideTextBox[] = []
    for (const sp of byName(slideXml, "sp")) {
      const tb = extractTextBox(sp, slideW, slideH)
      if (tb) textBoxes.push(tb)
    }

    // Images from <p:pic>
    const images = await extractImages(
      slideXml,
      relsXml,
      zip,
      slideFolder,
      slideW,
      slideH
    )

    // Background
    const background = await extractBackground(
      slideXml,
      relsXml,
      zip,
      slideFolder
    )

    const notes = await extractNotes(zip, i)

    slides.push({
      index: i,
      slideWidth: slideW,
      slideHeight: slideH,
      textBoxes,
      images,
      notes,
      background,
    })
  }

  return slides
}
