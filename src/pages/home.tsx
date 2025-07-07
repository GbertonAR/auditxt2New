// src/pages/Home.tsx
import { Button } from "../components/ui/button"
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-800 to-blue-500 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold text-center mb-8 drop-shadow-lg"
      >
        ¿Qué deseas hacer?
      </motion.h1>

      <div className="flex gap-6">
        <Button
          className="bg-white text-blue-800 font-semibold hover:bg-blue-100 transition-transform transform hover:scale-105 shadow-lg px-6 py-3 rounded-2xl"
        >
          Transcribir
        </Button>
        <Button
          className="bg-white text-blue-800 font-semibold hover:bg-blue-100 transition-transform transform hover:scale-105 shadow-lg px-6 py-3 rounded-2xl"
        >
          Redactar
        </Button>
      </div>
    </div>
  );
}
