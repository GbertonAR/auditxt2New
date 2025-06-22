// IMPORTS
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

// Frases para mostrar durante la carga
const frases = [
  "🧠 Pensando como un redactor profesional...",
  "📣 Eligiendo el tono justo...",
  "✍️ Escribiendo con claridad institucional...",
];

// Tonos y subtonos
const tonos = {
  institucional: ["Profesional", "Objetivo", "Serio", "Neutro", "Respetuoso"],
  cordial: ["Amigable", "Cercano", "Comprensivo", "Solidario", "Motivacional"],
  informativo: ["Claro", "Didáctico", "Accesible", "Directo"],
  persuasivo: ["Enérgico", "Inspirador", "Emocional", "Urgente"],
  creativo: ["Divertido", "Irónico", "Descontracturado", "Popular", "Estilo redes sociales"],
  reflexivo: ["Crítico", "Argumentativo", "Especializado", "Científico"],
};

export function RedactorForm({ onGenerado }: { onGenerado?: (titulo: string, contenido: string) => void }) {
  const [tipo, setTipo] = useState("comunicado");
  const [categoriaTono, setCategoriaTono] = useState("institucional");
  const [subtono, setSubtono] = useState("");
  const [audiencia, setAudiencia] = useState("general");
  const [prompt, setPrompt] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fraseIndex, setFraseIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setFraseIndex((prev) => (prev + 1) % frases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultado("");
    setError(null);

    try {
      const res = await fetch(`${baseURL}/api/texto-audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: `Redacción de ${tipo}`,
          contenido: prompt,
          tono: categoriaTono,
          subtono,
          audiencia,
        }),
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          setError(`Error del servidor (${res.status}): Respuesta no válida`);
          return;
        }
        setError(`Error del servidor (${res.status}): ${errorData.detail || errorData.message}`);
        return;
      }

      const data = await res.json();
      const generado = data.resultado || "⚠️ La respuesta del backend no incluyó contenido.";
      setResultado(generado);

      // ✅ Llamar al callback
      if (onGenerado) {
        onGenerado(`Redacción de ${tipo}`, generado);
      }

    } catch (e: any) {
      if (e instanceof TypeError && e.message.includes("Failed to fetch")) {
        setError("No se pudo conectar con el servidor.");
      } else {
        setError(`❌ Error: ${e.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl space-y-4">
      <h2 className="text-xl font-bold">📰 Generador de Contenido de Prensa</h2>

      {/* Tipo de contenido */}
      <fieldset>
        <Label htmlFor="tipo">Tipo de contenido</Label>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger id="tipo">
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="comunicado">Comunicado</SelectItem>
            <SelectItem value="boletin">Boletín</SelectItem>
            <SelectItem value="correo">Correo Institucional</SelectItem>
            <SelectItem value="post">Post para Redes</SelectItem>
            <SelectItem value="informe">Informe</SelectItem>
            <SelectItem value="articulo">Artículo</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </fieldset>

      {/* Tono */}
      <fieldset>
        <Label htmlFor="tono">Tono</Label>
        <Select value={categoriaTono} onValueChange={(val) => {
          setCategoriaTono(val);
          setSubtono("");
        }}>
          <SelectTrigger id="tono">
            <SelectValue placeholder="Seleccionar tono" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(tonos).map((key) => (
              <SelectItem key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </fieldset>

      {/* Subtono */}
      {categoriaTono && (
        <fieldset>
          <Label htmlFor="subtono">Subtono</Label>
          <Select value={subtono} onValueChange={setSubtono}>
            <SelectTrigger id="subtono">
              <SelectValue placeholder="Seleccionar subtono" />
            </SelectTrigger>
            <SelectContent>
              {tonos[categoriaTono].map((sub) => (
                <SelectItem key={sub} value={sub.toLowerCase()}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </fieldset>
      )}

      {/* Audiencia */}
      <fieldset>
        <Label htmlFor="audiencia">Audiencia</Label>
        <Select value={audiencia} onValueChange={setAudiencia}>
          <SelectTrigger id="audiencia">
            <SelectValue placeholder="Seleccionar audiencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">Público general</SelectItem>
            <SelectItem value="interna">Interna</SelectItem>
            <SelectItem value="institucional">Institucional</SelectItem>
          </SelectContent>
        </Select>
      </fieldset>

      {/* Prompt */}
      <fieldset>
        <Label htmlFor="prompt">¿Qué contenido querés generar?</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describí el contenido..."
          rows={4}
          required
          disabled={loading}
        />
      </fieldset>

      {/* Botón */}
      <div className="space-y-2">
        <Button type="submit" disabled={loading || !prompt.trim()} aria-busy={loading} className="text-blue-500">
          {loading ? "Generando..." : "✨ Generar contenido"}
        </Button>

        {loading && (
          <div className="text-sm text-gray-500 flex gap-2 items-center mt-2">
            <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 00-10 10h4z" />
            </svg>
            <AnimatePresence mode="wait">
              <motion.div
                key={frases[fraseIndex]}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.5 }}
              >
                {frases[fraseIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded border border-red-400 mt-4">
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {/* Resultado */}
      {/* {resultado && (
        <div className="mt-4 bg-gray-50 border rounded p-4 whitespace-pre-wrap max-h-60 overflow-auto">
          <h3 className="font-semibold mb-2">🧾 Resultado generado:</h3>
          <pre>{resultado}</pre>
        </div>
      )} */}
    </form>
  );
}
