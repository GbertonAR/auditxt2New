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
  const [audioURL, setAudioURL] = useState<string | null>(null)

  const handleSubmit = async () => {
    try {
      console.log("Guardando artículo:", { titulo, contenido, autor })
      const res = await fetch("http://localhost:8000/api/guardar-articulo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titulo, contenido, autor }),
      })

      if (!res.ok) throw new Error("Error al guardar artículo")

      alert("✅ Artículo guardado correctamente")
    } catch (err) {
      console.error(err)
      alert("❌ Error al guardar el artículo")
    }
  }

  const handleAudio = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/texto-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texto: contenido }),
      })

      if (!res.ok) throw new Error("Error al generar audio")

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setAudioURL(url)
    } catch (err) {
      console.error(err)
      alert("❌ Error al generar el audio")
    }
  }

  // 👇 CAMBIO: Descargar archivo como .txt o .docx
  const descargarArchivo = async (formato: "txt" | "docx") => {
    try {
      const res = await fetch(`http://localhost:8000/api/descargar-articulo?formato=${formato}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titulo, autor, contenido }),
      })

      if (!res.ok) throw new Error("Error al descargar el archivo")

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `${titulo}.${formato}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert("❌ Error al descargar el archivo")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 flex flex-col items-center space-y-10">
      <h1 className="text-4xl font-bold text-center text-primary">📝 Redactor AI</h1>

      <RedactorForm
        onGenerado={(tituloGenerado, contenidoGenerado) => {
          setTitulo(tituloGenerado)
          setContenido(contenidoGenerado)
        }}
      />

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

        <div className="flex flex-wrap gap-3 justify-between items-center">
          <Button variant="secondary" onClick={handleAudio}>🔊 Audio</Button>
          <Button onClick={handleSubmit}>💾 Guardar Artículo</Button>
          {/* 👇 CAMBIO: Botones de descarga */}
          <Button onClick={() => descargarArchivo("txt")}>⬇️ Descargar TXT</Button>
          <Button onClick={() => descargarArchivo("docx")}>⬇️ Descargar DOCX</Button>
        </div>

        {audioURL && (
          <div className="mt-4">
            <audio controls src={audioURL} className="w-full rounded-lg" />
          </div>
        )}
      </div>
    </div>
  )
}
