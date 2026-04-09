import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Pacientes from "./pages/Pacientes.jsx";
import Medicos from "./pages/Medicos.jsx";
import Consultas from "./pages/Consultas.jsx";
import DetallePaciente from "./pages/DetallePaciente.jsx";
import DetalleConsulta from "./pages/DetalleConsulta.jsx";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto bg-slate-50 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-20 flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
            <span className="text-slate-800 font-bold text-base">mediDoc</span>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/pacientes/:id" element={<DetallePaciente />} />
            <Route path="/medicos" element={<Medicos />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/consultas/:id" element={<DetalleConsulta />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
