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

export function RedactorForm() {
  const [tipo, setTipo] = useState("comunicado");
  const [tono, setTono] = useState("formal");
  const [audiencia, setAudiencia] = useState("general");
  const [prompt, setPrompt] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
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

    try {
      // const res = await fetch("/api/generar", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ prompt, tono, audiencia }),
      // });
      // *** CAMBIO CLAVE AQUÍ: Puerto y prefijo correctos ***
        const res = await fetch("http://localhost:8000/api/generar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },

         });

      const data = await res.json();
          setResultado(data.resultado || "⚠️ La respuesta fue vacía.");
        } catch (e) {
          console.error("Error al generar contenido", e);
          setResultado("❌ Error al generar el contenido");
        } finally {
          setLoading(false);
        }
      };

      return (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl space-y-4"
        >
          <h2 className="text-xl font-bold">📰 Generador de Contenido de Prensa</h2>

          <div className="space-y-4">
            <fieldset>
              <Label htmlFor="tipo">Tipo de contenido</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comunicado">Comunicado de prensa</SelectItem>
                  <SelectItem value="correo">Correo institucional</SelectItem>
                  <SelectItem value="post">Post para redes sociales</SelectItem>
                </SelectContent>
              </Select>
            </fieldset>

            <fieldset>
              <Label htmlFor="tono">Tono</Label>
              <Select value={tono} onValueChange={setTono}>
                <SelectTrigger id="tono">
                  <SelectValue placeholder="Seleccionar tono" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="amigable">Amigable</SelectItem>
                  <SelectItem value="técnico">Técnico</SelectItem>
                </SelectContent>
              </Select>
            </fieldset>

            <fieldset>
              <Label htmlFor="audiencia">Audiencia</Label>
              <Select value={audiencia} onValueChange={setAudiencia}>
                <SelectTrigger id="audiencia">
                  <SelectValue placeholder="Seleccionar audiencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Público general</SelectItem>
                  <SelectItem value="interna">Audiencia interna</SelectItem>
                  <SelectItem value="institucional">Institucional</SelectItem>
                </SelectContent>
              </Select>
            </fieldset>

            <fieldset>
              <Label htmlFor="prompt">¿Qué contenido querés generar?</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describí brevemente el contenido que necesitás..."
                rows={4}
                required
              />
            </fieldset>
          </div>

          <div className="space-y-2">
            <Button type="submit" disabled={loading} aria-busy={loading} className="w-full text-blue-600">
              {loading ? "Generando..." : "Generar"}
            </Button>

            {/* Indicador de carga con spinner */}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 00-10 10h4z"
                  />
                </svg>
                Generando contenido...
              </div>
            )}

            {/* Carrusel de frases animadas */}
            {loading && (
              <div className="mt-2 text-center text-sm text-gray-600">
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

          {resultado && (
            <div className="mt-4 p-4 bg-gray-50 border rounded max-h-60 overflow-auto whitespace-pre-wrap">
              <h3 className="font-semibold mb-2">🧾 Resultado generado:</h3>
              <pre>{resultado}</pre>
            </div>
          )}
        </form>
      );
}
