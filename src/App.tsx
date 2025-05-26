// App.tsx o App.jsx No se que esta pasando con el nombre de los archivos, pero lo importante es que sea .tsx o .jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Rutas/Páginas espero que estén en src/pages
import { ModeSelector } from './components/ModeSelector';
import Home from './pages/home';
import Transcription from './pages/Transcription';
import Writing from './pages/Writing';

// Estilos Tailwind (asegúrate de tener @tailwind base, components, utilities en index.css)
import './index.css';

export default function App() {
  return (
    // Agregando las future flags aquí
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<ModeSelector />} />
        <Route path="/transcribe" element={<Transcription />} />
        <Route path="/write" element={<Writing />} />
        <Route path="/home" element={<Home />} />
        {/* Ruta para errores 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// Componente simple para páginas no encontradas
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-red-600 p-4">
      <h1 className="text-3xl font-bold">404 - Página no encontrada</h1>
      <p className="mt-2 text-lg">La ruta que buscás no existe.</p>
    </div>
  );
}