export default function KpiCard({ label, value, icon: Icon, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="card flex items-center gap-4">
      <div className={`rounded-xl p-3 ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value ?? "—"}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
