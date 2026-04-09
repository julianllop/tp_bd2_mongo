import { useEffect, useState, useCallback } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Users,
    ClipboardList,
    Stethoscope,
    CalendarCheck,
    Calendar,
    X,
} from "lucide-react";
import KpiCard from "../components/shared/KpiCard.jsx";
import Spinner from "../components/shared/Spinner.jsx";
import {
    getResumen,
    getConsultasPorMes,
    getEspecialidades,
    getMedicamentos,
    getObrasSociales,
} from "../api/index.js";

const PIE_COLORS = [
    "#2563eb",
    "#7c3aed",
    "#059669",
    "#d97706",
    "#dc2626",
    "#0891b2",
    "#be185d",
    "#0f766e",
    "#9333ea",
];

const PRESETS = [
    { label: "Hoy", days: 0 },
    { label: "7d", days: 7 },
    { label: "30d", days: 30 },
    { label: "90d", days: 90 },
    { label: "6m", days: 180 },
    { label: "1 año", days: 365 },
    { label: "Todo", days: null },
];

function toISODate(date) {
    return date.toISOString().slice(0, 10);
}

function daysAgoDate(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
}

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [resumen, setResumen] = useState(null);
    const [mesData, setMesData] = useState([]);
    const [espData, setEspData] = useState([]);
    const [medData, setMedData] = useState([]);
    const [osData, setOsData] = useState([]);

    const [activePreset, setActivePreset] = useState(null); // null = Todo
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    const buildParams = useCallback(() => {
        const p = {};
        if (fechaDesde) p.fechaDesde = fechaDesde;
        if (fechaHasta) p.fechaHasta = fechaHasta;

        if (fechaDesde || fechaHasta) {
            const desde = fechaDesde ? new Date(fechaDesde) : new Date(0);
            const hasta = fechaHasta ? new Date(fechaHasta) : new Date();
            const diffDays = (hasta - desde) / 86400000;
            if (diffDays <= 30) p.granularity = "day";
        }

        return p;
    }, [fechaDesde, fechaHasta]);

    const fetchAll = useCallback(() => {
        setLoading(true);
        const params = buildParams();
        Promise.all([
            getResumen(params),
            getConsultasPorMes(params),
            getEspecialidades(params),
            getMedicamentos(params),
            getObrasSociales(),
        ])
            .then(([res, mes, esp, med, os]) => {
                setResumen(res);
                setMesData(mes);
                setEspData(esp);
                setMedData(med);
                setOsData(os);
            })
            .finally(() => setLoading(false));
    }, [buildParams]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    function applyPreset(days) {
        setActivePreset(days);
        if (days === null) {
            setFechaDesde("");
            setFechaHasta("");
        } else if (days === 0) {
            const today = toISODate(new Date());
            setFechaDesde(today);
            setFechaHasta(today);
        } else {
            setFechaDesde(toISODate(daysAgoDate(days)));
            setFechaHasta(toISODate(new Date()));
        }
    }

    function clearFilters() {
        setActivePreset(null);
        setFechaDesde("");
        setFechaHasta("");
    }

    const hasFilter = fechaDesde || fechaHasta;

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-slate-800">
                    Dashboard
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                    Resumen general del sistema
                </p>
            </div>

            {/* Date filter bar */}
            <div className="card flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar size={15} />
                    <span className="text-sm font-medium">Período:</span>
                </div>

                {/* Preset buttons */}
                <div className="flex gap-1 flex-wrap">
                    {PRESETS.map(({ label, days }) => (
                        <button
                            key={label}
                            onClick={() => applyPreset(days)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                activePreset === days
                                    ? "bg-primary text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                    <span className="text-xs text-slate-400">Desde</span>
                    <input
                        type="date"
                        className="input py-1 text-xs w-36"
                        value={fechaDesde}
                        onChange={(e) => {
                            setFechaDesde(e.target.value);
                            setActivePreset("custom");
                        }}
                    />
                    <span className="text-xs text-slate-400">Hasta</span>
                    <input
                        type="date"
                        className="input py-1 text-xs w-36"
                        value={fechaHasta}
                        onChange={(e) => {
                            setFechaHasta(e.target.value);
                            setActivePreset("custom");
                        }}
                    />
                    {hasFilter && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors"
                        >
                            <X size={14} /> Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Spinner size="lg" />
                </div>
            ) : (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                        <KpiCard
                            label="Total Pacientes"
                            value={resumen?.totalPacientes}
                            icon={Users}
                            color="blue"
                        />
                        <KpiCard
                            label={
                                hasFilter
                                    ? "Consultas (período)"
                                    : "Total Consultas"
                            }
                            value={resumen?.totalConsultas}
                            icon={ClipboardList}
                            color="green"
                        />
                        <KpiCard
                            label="Médicos Activos"
                            value={resumen?.totalMedicos}
                            icon={Stethoscope}
                            color="purple"
                        />
                        <KpiCard
                            label="Consultas Hoy"
                            value={resumen?.consultasHoy}
                            icon={CalendarCheck}
                            color="amber"
                        />
                    </div>

                    {/* Charts row 1 */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className="card">
                            <h2 className="font-semibold text-slate-700 mb-4">
                                {buildParams().granularity === "day"
                                    ? "Consultas por día"
                                    : "Consultas por mes"}
                            </h2>
                            {mesData.length === 0 ? (
                                <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
                                    Sin datos para el período seleccionado
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={240}>
                                    <LineChart
                                        data={mesData}
                                        margin={{
                                            top: 4,
                                            right: 16,
                                            left: -10,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#f1f5f9"
                                        />
                                        <XAxis
                                            dataKey="mes"
                                            tick={{
                                                fontSize: 11,
                                                fill: "#94a3b8",
                                            }}
                                        />
                                        <YAxis
                                            tick={{
                                                fontSize: 11,
                                                fill: "#94a3b8",
                                            }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 8,
                                                border: "none",
                                                boxShadow:
                                                    "0 4px 20px rgba(0,0,0,0.08)",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#2563eb"
                                            strokeWidth={2.5}
                                            dot={{ r: 4, fill: "#2563eb" }}
                                            activeDot={{ r: 6 }}
                                            name="Consultas"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <div className="card">
                            <h2 className="font-semibold text-slate-700 mb-4 bg-transparent">
                                Consultas por especialidad
                            </h2>
                            {espData.length === 0 ? (
                                <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
                                    Sin datos para el período seleccionado
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={espData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={85}
                                            dataKey="value"
                                            nameKey="name"
                                            label={({ name, percent }) =>
                                                percent > 0.05
                                                    ? `${name} ${(percent * 100).toFixed(0)}%`
                                                    : ""
                                            }
                                            labelLine={false}
                                        >
                                            {espData.map((_, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={
                                                        PIE_COLORS[
                                                            i %
                                                                PIE_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 8,
                                                border: "none",
                                                boxShadow:
                                                    "0 4px 20px rgba(0,0,0,0.08)",
                                            }}
                                        />
                                        <Legend
                                            iconSize={10}
                                            wrapperStyle={{ fontSize: 12 }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Charts row 2 */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className="card">
                            <h2 className="font-semibold text-slate-700 mb-4">
                                Top 10 medicamentos recetados
                            </h2>
                            {medData.length === 0 ? (
                                <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
                                    Sin datos para el período seleccionado
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart
                                        data={medData}
                                        margin={{
                                            top: 4,
                                            right: 16,
                                            left: -10,
                                            bottom: 40,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#f1f5f9"
                                        />
                                        <XAxis
                                            dataKey="medicamento"
                                            tick={{
                                                fontSize: 10,
                                                fill: "#94a3b8",
                                            }}
                                            angle={-35}
                                            textAnchor="end"
                                            interval={0}
                                        />
                                        <YAxis
                                            tick={{
                                                fontSize: 11,
                                                fill: "#94a3b8",
                                            }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 8,
                                                border: "none",
                                                boxShadow:
                                                    "0 4px 20px rgba(0,0,0,0.08)",
                                            }}
                                        />
                                        <Bar
                                            dataKey="total"
                                            fill="#2563eb"
                                            radius={[4, 4, 0, 0]}
                                            name="Recetas"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <div className="card">
                            <h2 className="font-semibold text-slate-700 mb-4">
                                Pacientes por obra social
                            </h2>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart
                                    data={osData}
                                    layout="vertical"
                                    margin={{
                                        top: 4,
                                        right: 24,
                                        left: 10,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#f1f5f9"
                                        horizontal={false}
                                    />
                                    <XAxis
                                        type="number"
                                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                                        allowDecimals={false}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="obraSocial"
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                        width={110}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 8,
                                            border: "none",
                                            boxShadow:
                                                "0 4px 20px rgba(0,0,0,0.08)",
                                        }}
                                    />
                                    <Bar
                                        dataKey="total"
                                        fill="#7c3aed"
                                        radius={[0, 4, 4, 0]}
                                        name="Pacientes"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
