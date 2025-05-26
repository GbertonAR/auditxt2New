// ModeSelector.tsx este no quiere andar
// auditxt2/auditxt2/src/components/ModeSelector.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Mic, PencilLine } from "lucide-react";

export function ModeSelector() {
  const navigate = useNavigate();

  const opciones = [
    {
      nombre: "Transcribir Audio",
      descripcion: "Convertí archivos de audio o video a texto con precisión.",
      icono: <Mic className="h-6 w-6 text-blue-600" />,
      ruta: "/transcribe",
    },
    {
      nombre: "Redactor AI",
      descripcion: "Generá comunicados, correos o posteos usando IA.",
      icono: <PencilLine className="h-6 w-6 text-purple-600" />,
      ruta: "/write",
    },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-xl w-full text-center space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">
          🧠 Bienvenido a <span className="text-blue-600">Auditxt</span>
        </h1>
        <p className="text-gray-600">¿Qué querés hacer hoy?</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {opciones.map((op, i) => (
            <motion.div
              key={op.nombre}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 border rounded-xl bg-gray-50 hover:shadow-md cursor-pointer"
              onClick={() => navigate(op.ruta)}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                {op.icono}
                <h3 className="font-semibold">{op.nombre}</h3>
                <p className="text-sm text-gray-500">{op.descripcion}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <Button onClick={() => navigate("/home")} variant="outline">
          Ir al panel principal
        </Button>
      </motion.div>
    </main>
  );
}
