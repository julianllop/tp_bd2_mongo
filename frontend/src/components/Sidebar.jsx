import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Stethoscope, ClipboardList, Activity } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/pacientes", label: "Pacientes", icon: Users },
  { to: "/medicos", label: "Médicos", icon: Stethoscope },
  { to: "/consultas", label: "Consultas", icon: ClipboardList },
];

export default function Sidebar() {
  return (
    <aside className="w-60 flex-shrink-0 bg-sidebar flex flex-col h-screen">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity size={22} className="text-blue-400" />
          <span className="text-white text-xl font-bold tracking-tight">mediDoc</span>
        </div>
        <p className="text-blue-300/60 text-xs mt-0.5">Historia Clínica Electrónica</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
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
