import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { UploadCloud, LinkIcon } from "lucide-react";

const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export default function Transcribir() {
  const [modo, setModo] = useState<"archivo" | "url">("url"); // Modo por defecto
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioURL, setAudioURL] = useState("");
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async () => {
    if (modo === "archivo" && !audioFile) {
      setError("Seleccioná un archivo de audio.");
      return;
    }
    if (modo === "url" && !audioURL) {
      setError("Ingresá una URL.");
      return;
    }
    if (modo === "url" && !isValidURL(audioURL)) {
      setError("La URL no es válida.");
      return;
    }

    setError("");
    setResultado("");
    setCargando(true);

    try {
      let response;
      if (modo === "url") {
        response = await fetch("http://localhost:8000/api/transcribir", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            link: audioURL,
            modo_salida: "dialogo",
          }),
        });
      } else if (modo === "archivo" && audioFile) {
        const formData = new FormData();
        formData.append("audio", audioFile);
        formData.append("modo_salida", "dialogo");
        response = await fetch("http://localhost:8000/api/transcribir-archivo", {
          method: "POST",
          body: formData,
        });
      } else {
        throw new Error("Modo no válido o archivo faltante."); // Esto no debería ocurrir, pero es una precaución
      }

      if (!response.ok) {
        let errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.message || JSON.stringify(errorData)}`;
        } catch (jsonError) {
          errorMessage += " (Error al parsear la respuesta JSON)";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setResultado(data.resultado || "✅ Transcripción completada, pero vacía.");
    } catch (err) {
      let errorMessage = "❌ Error: ";
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        errorMessage += "No se pudo alcanzar el servidor. Verifica la conexión de red o la URL.";
      } else if (err instanceof Error) {
        errorMessage += err.message;
      } else {
        errorMessage += String(err);
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          🎙️ Transcripción de Audio
        </h1>
        <p className="text-gray-600 text-center">
          Elegí una fuente de audio
        </p>

        <div className="flex justify-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="modo"
              value="archivo"
              checked={modo === "archivo"}
              onChange={() => {
                setModo("archivo");
                setAudioURL("");
                setResultado("");
                setError("");
              }}
            />
            <span>Archivo</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="modo"
              value="url"
              checked={modo === "url"}
              onChange={() => {
                setModo("url");
                setAudioFile(null);
                setResultado("");
                setError("");
              }}
            />
            <span>URL</span>
          </label>
        </div>

        {modo === "archivo" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subí un archivo de audio
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="audio/*"
                className="cursor-pointer"
                onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
              />
              <UploadCloud className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        )}

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

        {error && (
          <p className="text-sm text-red-600 font-medium text-center">{error}</p>
        )}

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={cargando || (modo === "archivo" && !audioFile) || (modo === "url" && !audioURL)} // Deshabilita mientras carga
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

        {resultado && (
          <div className="bg-gray-100 text-sm text-gray-800 p-4 rounded-md whitespace-pre-wrap max-h-[400px] overflow-y-auto">
            {resultado}
          </div>
        )}
      </div>
    </div>
  );
}