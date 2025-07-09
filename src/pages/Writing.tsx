import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { RedactorForm } from "../components/RedactorForm";

export default function Writing() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [autor, setAutor] = useState("");
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [fechaHora, setFechaHora] = useState("");
  const [formato, setFormato] = useState<"docx" | "pdf">("docx");

  const baseURL = import.meta.env.VITE_API_SRV;
  console.log("🌐 API URL desde Writing1 import.meta.env:", baseURL);

  useEffect(() => {
    const now = new Date();
    const fechaHoraString = now.toLocaleString();
    setFechaHora(fechaHoraString);
    console.log("🕒 Fecha y hora:", fechaHoraString);
    console.log("🌐 API URL desde Writing import.meta.env:", baseURL);
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${baseURL}/api/guardar-articulo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, contenido, autor }),
      });

      if (!res.ok) throw new Error("Error al guardar artículo");
      alert("✅ Artículo guardado correctamente");
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar el artículo");
    }
  };

  const handleAudio = async () => {
    try {
      const res = await fetch(`${baseURL}/api/texto-audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: contenido }),
      });

      if (!res.ok) throw new Error("Error al generar audio");
      const blob = await res.blob();
      setAudioURL(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("❌ Error al generar el audio");
    }
  };

  const handleDescargar = async () => {
    try {
      const res = await fetch(`${baseURL}/api/guardar-articulo?formato=${formato}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, contenido, autor }),
      });

      if (!res.ok) throw new Error("Error al descargar el archivo");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${titulo}.${formato}`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("❌ Error al descargar el archivo");
    }
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 flex flex-col items-center space-y-10">

    <div
      className="min-h-screen bg-[url('/Escribir.png')] bg-cover bg-center bg-fixed p-6 flex flex-col items-center space-y-10"
      // Si la imagen es muy oscura, puedes añadir una superposición translúcida
      // style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Ejemplo de superposición oscura al 50%
    >

      <p className="text-sm text-white">{`🕒 Ejecutado el: ${fechaHora}`}</p>
      <h1 className="text-4xl font-bold text-center text-white">📝 Redactor AI</h1>

      <RedactorForm
        onGenerado={(t, c) => {
          setTitulo(t);
          setContenido(c);
        }}
      />

      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-xl space-y-6">
        <h2 className="text-2xl font-semibold">📄 Completa y guarda tu artículo</h2>

        <div className="space-y-2">
          <Label htmlFor="titulo">Título</Label>
          <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contenido">Contenido</Label>
          <Textarea id="contenido" rows={10} value={contenido} onChange={(e) => setContenido(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="autor">Autor</Label>
          <Input id="autor" value={autor} onChange={(e) => setAutor(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="formato">Formato de descarga</Label>
          <select
            id="formato"
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={formato}
            onChange={(e) => setFormato(e.target.value as "docx" | "pdf")}
          >
            <option value="docx">.DOCX</option>
            <option value="pdf">.PDF</option>
          </select>
        </div>

        <div className="flex justify-between items-center space-x-4">
          <Button variant="secondary" onClick={handleAudio}>🔊 Audio</Button>
          <Button onClick={handleSubmit}>💾 Guardar</Button>
          <Button variant="outline" onClick={handleDescargar}>📥 Descargar</Button>
        </div>

        {audioURL && (
          <div className="mt-4">
            <audio controls src={audioURL} className="w-full rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
}
