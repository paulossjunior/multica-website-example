"use client"

import { useState } from "react"
import { Nav } from "@/components/sections/Nav"
import { Footer } from "@/components/sections/Footer"

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

export default function FotografiasPage() {
  const [status, setStatus] = useState<FormState>("idle")
  const [form, setForm] = useState({
    nome: "",
    email: "",
    tipoEnsaio: "",
    dataDesejada: "",
    local: "",
    descricao: "",
  })

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("submitting")
    // Static export: no API route available. Simulate success.
    await new Promise((r) => setTimeout(r, 800))
    setStatus("success")
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
              Em breve entrarei em contato pelo e-mail informado.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <Field label="Nome completo" required>
              <input
                type="text"
                name="nome"
                id="nome"
                required
                value={form.nome}
                onChange={handleChange}
                autoComplete="name"
                className={inputClass}
                placeholder="Seu nome"
              />
            </Field>

            <Field label="E-mail" required>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className={inputClass}
                placeholder="seu@email.com"
              />
            </Field>

            <Field label="Tipo de ensaio" required>
              <select
                name="tipoEnsaio"
                id="tipoEnsaio"
                required
                value={form.tipoEnsaio}
                onChange={handleChange}
                className={inputClass}
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
                min={new Date().toISOString().split("T")[0]}
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
              {status === "submitting" ? "Enviando…" : "Enviar demanda"}
            </button>

            {status === "error" && (
              <p className="text-sm text-red-500 text-center">
                Erro ao enviar. Tente novamente.
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
  "w-full bg-transparent border border-border rounded-sm px-4 py-2.5 text-sm font-light text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs tracking-widest uppercase text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-foreground">*</span>}
      </label>
      {children}
    </div>
  )
}
