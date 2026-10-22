import JSZip from "jszip"

export interface SlideImage {
  dataUrl: string
  rId: string
}

export interface SlideTextBox {
  texts: string[]
  x: number
  y: number
  w: number
  h: number
}

export interface ParsedSlide {
  index: number
  textBoxes: SlideTextBox[]
  images: SlideImage[]
  notes: string
}

function attr(el: Element, name: string): string {
  return el.getAttribute(name) ?? ""
}

function emu(val: string): number {
  const n = parseInt(val, 10)
  return isNaN(n) ? 0 : Math.round((n / 9144000) * 100)
}

function parseXml(xml: string): Document {
  return new DOMParser().parseFromString(xml, "application/xml")
}

function extractText(spEl: Element): SlideTextBox | null {
  const txBody = spEl.querySelector("txBody")
  if (!txBody) return null

  const texts: string[] = []
  const paras = txBody.querySelectorAll("p")
  paras.forEach((p) => {
    const runs = p.querySelectorAll("r > t, fld > t")
    const line = Array.from(runs)
      .map((t) => t.textContent ?? "")
      .join("")
    if (line.trim()) texts.push(line)
  })

  if (!texts.length) return null

  const spPr = spEl.querySelector("spPr")
  const xfrm = spPr?.querySelector("xfrm")
  const off = xfrm?.querySelector("off")
  const ext = xfrm?.querySelector("ext")

  return {
    texts,
    x: off ? emu(attr(off, "x")) : 0,
    y: off ? emu(attr(off, "y")) : 0,
    w: ext ? emu(attr(ext, "cx")) : 100,
    h: ext ? emu(attr(ext, "cy")) : 20,
  }
}

async function resolveSlideImages(
  slideXml: Document,
  relsXml: Document | null,
  zip: JSZip,
  slideFolder: string
): Promise<SlideImage[]> {
  if (!relsXml) return []

  const images: SlideImage[] = []
  const blips = slideXml.querySelectorAll("blipFill blip")

  for (const blip of Array.from(blips)) {
    const rId =
      blip.getAttribute("r:embed") ??
      blip.getAttribute("embed") ??
      blip.getAttributeNS(
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        "embed"
      ) ??
      ""
    if (!rId) continue

    const rel = Array.from(relsXml.querySelectorAll("Relationship")).find(
      (r) => r.getAttribute("Id") === rId
    )
    if (!rel) continue

    const target = rel.getAttribute("Target") ?? ""
    if (!target) continue

    const imgPath = target.startsWith("/")
      ? target.slice(1)
      : `${slideFolder}/${target}`

    const normalizedPath = imgPath
      .split("/")
      .reduce<string[]>((acc, part) => {
        if (part === "..") acc.pop()
        else if (part !== ".") acc.push(part)
        return acc
      }, [])
      .join("/")

    const file = zip.file(normalizedPath)
    if (!file) continue

    const ext = normalizedPath.split(".").pop()?.toLowerCase() ?? "png"
    const mimeMap: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      svg: "image/svg+xml",
      webp: "image/webp",
      emf: "image/x-emf",
      wmf: "image/x-wmf",
    }
    const mime = mimeMap[ext] ?? "image/png"

    try {
      const data = await file.async("base64")
      images.push({ dataUrl: `data:${mime};base64,${data}`, rId })
    } catch {
      // skip unreadable image
    }
  }

  return images
}

async function parseNotes(
  zip: JSZip,
  slideIndex: number
): Promise<string> {
  const notesFile = zip.file(`ppt/notesSlides/notesSlide${slideIndex + 1}.xml`)
  if (!notesFile) return ""
  const xml = await notesFile.async("string")
  const doc = parseXml(xml)
  const texts = Array.from(doc.querySelectorAll("txBody r t"))
    .map((t) => t.textContent ?? "")
    .join(" ")
    .trim()
  return texts
}

export async function parsePptx(file: File): Promise<ParsedSlide[]> {
  const zip = await JSZip.loadAsync(file)

  const presentationFile = zip.file("ppt/presentation.xml")
  if (!presentationFile) throw new Error("Invalid PPTX: missing presentation.xml")

  const presXml = parseXml(await presentationFile.async("string"))
  const slideIdList = presXml.querySelectorAll("sldIdLst sldId")
  const slideCount = slideIdList.length || Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f)).length

  const slides: ParsedSlide[] = []

  for (let i = 0; i < slideCount; i++) {
    const slideNum = i + 1
    const slidePath = `ppt/slides/slide${slideNum}.xml`
    const relsPath = `ppt/slides/_rels/slide${slideNum}.xml.rels`

    const slideFile = zip.file(slidePath)
    if (!slideFile) continue

    const slideXmlStr = await slideFile.async("string")
    const slideXml = parseXml(slideXmlStr)

    const relsFile = zip.file(relsPath)
    const relsXml = relsFile ? parseXml(await relsFile.async("string")) : null

    const spElements = slideXml.querySelectorAll("sp")
    const textBoxes: SlideTextBox[] = []
    spElements.forEach((sp) => {
      const tb = extractText(sp)
      if (tb) textBoxes.push(tb)
    })

    const images = await resolveSlideImages(slideXml, relsXml, zip, "ppt/slides")
    const notes = await parseNotes(zip, i)

    slides.push({ index: i, textBoxes, images, notes })
  }

  return slides
}
