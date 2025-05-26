// src/pages/Writing.tsx

import { useState } from "react"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Button } from "../components/ui/button"
import { RedactorForm } from "../components/RedactorForm"

export default function Writing() {
  const [titulo, setTitulo] = useState("")
  const [contenido, setContenido] = useState("")
  const [autor, setAutor] = useState("")

  const handleSubmit = () => {
    console.log({ titulo, contenido, autor })
    // Aquí podrías enviar a la API o guardar localmente
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 flex flex-col items-center space-y-10">
      <h1 className="text-4xl font-bold text-center text-primary">📝 Redactor AI</h1>

      <RedactorForm />

      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-xl space-y-6">
        <h2 className="text-2xl font-semibold">📄 Completa y guarda tu artículo</h2>

        <div className="space-y-2">
          <Label htmlFor="titulo">Título del artículo</Label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ingresa un título llamativo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contenido">Contenido</Label>
          <Textarea
            id="contenido"
            rows={10}
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Pega aquí el texto generado o edítalo..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="autor">Autor</Label>
          <Input
            id="autor"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            placeholder="Nombre del autor"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit}>💾 Guardar Artículo</Button>
        </div>
      </div>
    </div>
  )
}
