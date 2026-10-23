"use client"

import { useState, useEffect } from "react"
import { Nav } from "@/components/sections/Nav"
import { Footer } from "@/components/sections/Footer"
import { PHOTOGRAPHER_EMAIL } from "@/lib/site"

type FormState = "idle" | "submitting" | "success" | "error"

const TIPOS_ENSAIO = [
  "Retrato",
  "Casamento",
  "Ensaio Gestante",
  "Newborn",
  "Família",
  "Corporativo / Empresarial",
  "Produto",
  "Evento",
  "Paisagem / Arquitetura",
  "Outro",
]

type FormErrors = Partial<Record<"nome" | "email" | "tipoEnsaio", string>>

export default function FotografiasPage() {
  const [status, setStatus] = useState<FormState>("idle")
  const [errors, setErrors] = useState<FormErrors>({})
  const [minDate, setMinDate] = useState("")
  const [form, setForm] = useState({
    nome: "",
    email: "",
    tipoEnsaio: "",
    dataDesejada: "",
    local: "",
    descricao: "",
  })

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0])
  }, [])

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!form.nome.trim()) errs.nome = "Nome obrigatório."
    if (!form.email.trim()) {
      errs.email = "E-mail obrigatório."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "E-mail inválido."
    }
    if (!form.tipoEnsaio) errs.tipoEnsaio = "Selecione um tipo de ensaio."
    return errs
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setStatus("submitting")

    try {
      const subject = encodeURIComponent(
        `Demanda de fotografia – ${form.tipoEnsaio}`,
      )
      const body = encodeURIComponent(
        [
          `Nome: ${form.nome}`,
          `E-mail: ${form.email}`,
          `Tipo de ensaio: ${form.tipoEnsaio}`,
          `Data desejada: ${form.dataDesejada || "Não informada"}`,
          `Local: ${form.local || "Não informado"}`,
          "",
          "Descrição:",
          form.descricao || "—",
        ].join("\n"),
      )
      window.location.href = `mailto:${PHOTOGRAPHER_EMAIL}?subject=${subject}&body=${body}`
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <>
      <Nav />
      <main className="min-h-[calc(100svh-3.5rem)] px-6 py-24 max-w-2xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-muted-foreground mb-8">
          Fotografias
        </p>
        <h1 className="font-heading font-light text-4xl sm:text-5xl leading-tight mb-4">
          Envie sua demanda.
        </h1>
        <p className="text-muted-foreground font-light leading-relaxed mb-14 max-w-md">
          Preencha o formulário e entrarei em contato para conversarmos sobre o
          seu projeto.
        </p>

        {status === "success" ? (
          <div className="border border-border rounded-sm px-8 py-12 text-center">
            <p className="font-heading font-light text-2xl mb-3">
              Demanda recebida.
            </p>
            <p className="text-muted-foreground font-light text-sm leading-relaxed">
              Seu cliente de e-mail foi aberto com os dados preenchidos. Envie a
              mensagem para concluir.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Field label="Nome completo" required error={errors.nome}>
              <input
                type="text"
                name="nome"
                id="nome"
                value={form.nome}
                onChange={handleChange}
                autoComplete="name"
                className={inputClass}
                placeholder="Seu nome"
                aria-invalid={!!errors.nome}
                aria-describedby={errors.nome ? "nome-error" : undefined}
              />
            </Field>

            <Field label="E-mail" required error={errors.email}>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className={inputClass}
                placeholder="seu@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </Field>

            <Field label="Tipo de ensaio" required error={errors.tipoEnsaio}>
              <select
                name="tipoEnsaio"
                id="tipoEnsaio"
                value={form.tipoEnsaio}
                onChange={handleChange}
                className={inputClass}
                aria-invalid={!!errors.tipoEnsaio}
                aria-describedby={
                  errors.tipoEnsaio ? "tipoEnsaio-error" : undefined
                }
              >
                <option value="">Selecione…</option>
                {TIPOS_ENSAIO.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Data desejada">
              <input
                type="date"
                name="dataDesejada"
                id="dataDesejada"
                value={form.dataDesejada}
                onChange={handleChange}
                className={inputClass}
                min={minDate}
              />
            </Field>

            <Field label="Local / Cidade">
              <input
                type="text"
                name="local"
                id="local"
                value={form.local}
                onChange={handleChange}
                className={inputClass}
                placeholder="Onde será realizado o ensaio?"
              />
            </Field>

            <Field label="Descrição do projeto">
              <textarea
                name="descricao"
                id="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={5}
                className={inputClass}
                placeholder="Conte um pouco sobre o que você tem em mente…"
              />
            </Field>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-4 w-full border border-foreground py-3 text-xs tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Abrindo e-mail…" : "Enviar demanda"}
            </button>

            {status === "error" && (
              <p role="alert" className="text-sm text-red-500 text-center">
                Não foi possível abrir o cliente de e-mail. Envie diretamente
                para{" "}
                <a
                  href={`mailto:${PHOTOGRAPHER_EMAIL}`}
                  className="underline underline-offset-2"
                >
                  {PHOTOGRAPHER_EMAIL}
                </a>
                .
              </p>
            )}
          </form>
        )}
      </main>
      <Footer />
    </>
  )
}

const inputClass =
  "w-full bg-transparent border border-border rounded-sm px-4 py-2.5 text-sm font-light text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors aria-invalid:border-red-500"

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs tracking-widest uppercase text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-foreground">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
