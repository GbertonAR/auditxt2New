// src/pages/Transcribir.tsx
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { UploadCloud, LinkIcon } from "lucide-react";

const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function Transcribir() {
  // --------------------------- estado ---------------------------
  const [modo, setModo] = useState<"archivo" | "url">("url");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioURL, setAudioURL] = useState("");
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState("");
  const [cargando, setCargando] = useState(false);

  // -------------------- baseURL desde .env ----------------------
  const baseURL = import.meta.env.VITE_API_URL; // ej: http://localhost:8000
  console.log("Base URL desde Transcri.env:", baseURL);

  // -------------------- submit principal ------------------------
  const handleSubmit = async () => {
    try {
      // Validaciones rápidas
      if (modo === "archivo" && !audioFile) {
        setError("Seleccioná un archivo de audio.");
        return;
      }
      if (modo === "url" && (!audioURL || !isValidURL(audioURL))) {
        setError("Ingresá una URL válida.");
        return;
      }

      setError("");
      setResultado("");
      setCargando(true);

      let response: Response;

      if (modo === "url") {
        response = await fetch(`${baseURL}/api/transcribir`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ link: audioURL, modo_salida: "dialogo" }),
        });
      } else {
        // modo === "archivo"
        const formData = new FormData();
        formData.append("audio", audioFile as Blob);
        formData.append("modo_salida", "dialogo");

        response = await fetch(`${baseURL}/api/transcribir-archivo`, {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) {
        let mensaje = `Error del servidor: ${response.status} ${response.statusText}`;
        try {
          const dataErr = await response.json();
          mensaje += ` - ${dataErr.message || JSON.stringify(dataErr)}`;
        } catch {
          mensaje += " (respuesta no es JSON)";
        }
        throw new Error(mensaje);
      }

      const data = await response.json();
      setResultado(data.transcripcion || "✅ Transcripción completada, pero vacía.");
    } catch (err) {
      const msg =
        err instanceof Error
          ? `❌ Error: ${err.message}`
          : "❌ Ocurrió un error inesperado.";
      setError(msg);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  // ---------------------------- UI -----------------------------
  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">

    <div
      className="min-h-screen bg-[url('/transcribir.png')] bg-cover bg-center bg-fixed p-6 flex flex-col items-center space-y-10"
      // Si la imagen es muy oscura, puedes añadir una superposición translúcida
      // style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Ejemplo de superposición oscura al 50%
    >


      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          🎙️ Transcripción de Audio
        </h1>
        <p className="text-gray-600 text-center">Elegí una fuente de audio</p>

        {/* selector de modo */}
        <div className="flex justify-center gap-6">
          {["archivo", "url"].map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="modo"
                value={m}
                checked={modo === m}
                onChange={() => {
                  setModo(m as "archivo" | "url");
                  setAudioFile(null);
                  setAudioURL("");
                  setResultado("");
                  setError("");
                }}
              />
              <span className="capitalize">{m}</span>
            </label>
          ))}
        </div>

        {/* input archivo */}
        {modo === "archivo" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subí un archivo de audio
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
              />
              <UploadCloud className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        )}

        {/* input url */}
        {modo === "url" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingresá la URL pública del audio o video
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=Sdb9yyA4W5k"
                value={audioURL}
                onChange={(e) => setAudioURL(e.target.value)}
              />
              <LinkIcon className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        )}

        {/* errores */}
        {error && (
          <p className="text-sm text-red-600 font-medium text-center">{error}</p>
        )}

        {/* botón principal */}
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={
            cargando ||
            (modo === "archivo" && !audioFile) ||
            (modo === "url" && !audioURL)
          }
        >
          {cargando ? (
            <>
              ⏳ Transcribiendo...
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 ml-2"></div>
            </>
          ) : (
            "Iniciar transcripción"
          )}
        </Button>

        {/* resultado */}
        {resultado && (
          <div className="bg-gray-100 text-sm text-gray-800 p-4 rounded-md whitespace-pre-wrap max-h-[400px] overflow-y-auto">
            {resultado}
          </div>
        )}
      </div>
    </div>
  );
}