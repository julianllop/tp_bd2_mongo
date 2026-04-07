import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Stethoscope, ClipboardList, Activity, X } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/pacientes", label: "Pacientes", icon: Users },
  { to: "/medicos", label: "Médicos", icon: Stethoscope },
  { to: "/consultas", label: "Consultas", icon: ClipboardList },
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside
      className={`fixed md:relative inset-y-0 left-0 z-40 w-60 flex-shrink-0 bg-sidebar flex flex-col h-screen transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={22} className="text-blue-400" />
            <span className="text-white text-xl font-bold tracking-tight">mediDoc</span>
          </div>
          <p className="text-blue-300/60 text-xs mt-0.5">Historia Clínica Electrónica</p>
        </div>
        <button
          onClick={onClose}
          className="md:hidden text-white/60 hover:text-white transition-colors mt-0.5 p-1 rounded-lg"
          aria-label="Cerrar menú"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-blue-200/70 hover:bg-white/8 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-blue-300/40 text-xs">© 2025 mediDoc</p>
      </div>
    </aside>
  );
}
