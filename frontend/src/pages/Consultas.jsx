import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, SlidersHorizontal, X } from "lucide-react";
import Modal from "../components/shared/Modal.jsx";
import Table from "../components/shared/Table.jsx";
import Spinner from "../components/shared/Spinner.jsx";
import Pagination from "../components/shared/Pagination.jsx";
import {
  getConsultas, getMedicos, getPacientes,
  createConsulta, updateConsulta, deleteConsulta,
} from "../api/index.js";

const EMPTY_FORM = {
  paciente: "", medico: "", fecha: new Date().toISOString().slice(0, 10),
  especialidad: "", motivoConsulta: "", diagnostico: "", observaciones: "",
  "signosVitales.presionArterial": "", "signosVitales.frecuenciaCardiaca": "",
  "signosVitales.temperatura": "", "signosVitales.peso": "",
  "signosVitales.talla": "", "signosVitales.saturacionOxigeno": "",
  estado: "realizada",
};

const EMPTY_MED_ITEM = { medicamento: "", dosis: "", duracion: "", indicaciones: "" };

const ESTADO_COLORS = {
  realizada: "bg-emerald-50 text-emerald-700",
  programada: "bg-blue-50 text-blue-700",
  cancelada: "bg-red-50 text-red-600",
};

function formToPayload(f, receta) {
  return {
    paciente: f.paciente, medico: f.medico, fecha: f.fecha,
    especialidad: f.especialidad, motivoConsulta: f.motivoConsulta,
    diagnostico: f.diagnostico, observaciones: f.observaciones, estado: f.estado,
    signosVitales: {
      presionArterial: f["signosVitales.presionArterial"],
      frecuenciaCardiaca: f["signosVitales.frecuenciaCardiaca"] ? Number(f["signosVitales.frecuenciaCardiaca"]) : undefined,
      temperatura: f["signosVitales.temperatura"] ? Number(f["signosVitales.temperatura"]) : undefined,
      peso: f["signosVitales.peso"] ? Number(f["signosVitales.peso"]) : undefined,
      talla: f["signosVitales.talla"] ? Number(f["signosVitales.talla"]) : undefined,
      saturacionOxigeno: f["signosVitales.saturacionOxigeno"] ? Number(f["signosVitales.saturacionOxigeno"]) : undefined,
    },
    receta: receta.filter((r) => r.medicamento.trim()),
  };
}

function consultaToForm(c) {
  return {
    paciente: c.paciente?._id ?? c.paciente ?? "",
    medico: c.medico?._id ?? c.medico ?? "",
    fecha: c.fecha ? c.fecha.slice(0, 10) : "",
    especialidad: c.especialidad ?? "", motivoConsulta: c.motivoConsulta ?? "",
    diagnostico: c.diagnostico ?? "", observaciones: c.observaciones ?? "",
    estado: c.estado ?? "realizada",
    "signosVitales.presionArterial": c.signosVitales?.presionArterial ?? "",
    "signosVitales.frecuenciaCardiaca": c.signosVitales?.frecuenciaCardiaca ?? "",
    "signosVitales.temperatura": c.signosVitales?.temperatura ?? "",
    "signosVitales.peso": c.signosVitales?.peso ?? "",
    "signosVitales.talla": c.signosVitales?.talla ?? "",
    "signosVitales.saturacionOxigeno": c.signosVitales?.saturacionOxigeno ?? "",
  };
}

export default function Consultas() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pacientesList, setPacientesList] = useState([]);
  const [medicosList, setMedicosList] = useState([]);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterPaciente, setFilterPaciente] = useState("");
  const [filterMedico, setFilterMedico] = useState("");
  const [filterEsp, setFilterEsp] = useState("");
  const [filterEst, setFilterEst] = useState("");
  const [filterFechaDesde, setFilterFechaDesde] = useState("");
  const [filterFechaHasta, setFilterFechaHasta] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const PAGE_SIZE = 10;

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [receta, setReceta] = useState([{ ...EMPTY_MED_ITEM }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const hasActiveFilters = filterPaciente || filterMedico || filterEsp || filterEst || filterFechaDesde || filterFechaHasta;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PAGE_SIZE };
      if (filterPaciente) params.paciente = filterPaciente;
      if (filterMedico) params.medico = filterMedico;
      if (filterEsp) params.especialidad = filterEsp;
      if (filterEst) params.estado = filterEst;
      if (filterFechaDesde) params.fechaDesde = filterFechaDesde;
      if (filterFechaHasta) params.fechaHasta = filterFechaHasta;
      const res = await getConsultas(params);
      setConsultas(res.data);
      setPagination({ total: res.total, totalPages: res.totalPages });
    } finally {
      setLoading(false);
    }
  }, [filterPaciente, filterMedico, filterEsp, filterEst, filterFechaDesde, filterFechaHasta, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    // Carga completa sin paginar para los selects del modal
    Promise.all([
      getPacientes({ limit: 200 }),
      getMedicos({ limit: 200 }),
    ]).then(([p, m]) => {
      setPacientesList(p.data);
      setMedicosList(m.data);
    });
  }, []);

  useEffect(() => { setPage(1); }, [filterPaciente, filterMedico, filterEsp, filterEst, filterFechaDesde, filterFechaHasta]);

  function clearFilters() {
    setFilterPaciente("");
    setFilterMedico("");
    setFilterEsp("");
    setFilterEst("");
    setFilterFechaDesde("");
    setFilterFechaHasta("");
    setPage(1);
  }

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setReceta([{ ...EMPTY_MED_ITEM }]);
    setError("");
    setModalOpen(true);
  }

  function openEdit(c) {
    setEditing(c);
    setForm(consultaToForm(c));
    setReceta(c.receta?.length ? c.receta.map((r) => ({ ...r })) : [{ ...EMPTY_MED_ITEM }]);
    setError("");
    setModalOpen(true);
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleRecetaChange(i, field, value) {
    setReceta((r) => r.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = formToPayload(form, receta);
      if (editing) { await updateConsulta(editing._id, payload); }
      else { await createConsulta(payload); }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c) {
    const pac = c.paciente?.nombre ? `${c.paciente.nombre} ${c.paciente.apellido}` : "este paciente";
    if (!window.confirm(`¿Cancelar la consulta de ${pac}?`)) return;
    await deleteConsulta(c._id);
    load();
  }

  // Especialidades hardcoded para no depender de la página actual
  const especialidades = [
    "Cardiología", "Clínica Médica", "Dermatología", "Endocrinología",
    "Ginecología", "Neurología", "Oftalmología", "Ortopedia",
    "Pediatría", "Traumatología", "Urología",
  ];

  const columns = [
    {
      key: "fecha",
      label: "Fecha",
      render: (r) => r.fecha ? new Date(r.fecha).toLocaleDateString("es-AR") : "—",
    },
    {
      key: "paciente",
      label: "Paciente",
      render: (r) => r.paciente ? `${r.paciente.apellido}, ${r.paciente.nombre}` : "—",
    },
    {
      key: "medico",
      label: "Médico",
      render: (r) => r.medico ? `Dr./Dra. ${r.medico.apellido}` : "—",
    },
    { key: "especialidad", label: "Especialidad" },
    {
      key: "diagnostico",
      label: "Diagnóstico",
      render: (r) => (
        <span className="line-clamp-1 max-w-xs" title={r.diagnostico}>{r.diagnostico || "—"}</span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (r) => (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${ESTADO_COLORS[r.estado] ?? ""}`}>
          {r.estado}
        </span>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (r) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="text-slate-400 hover:text-primary transition-colors">
            <Pencil size={15} />
          </button>
          {r.estado !== "cancelada" && (
            <button onClick={() => handleDelete(r)} className="text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-slate-800">Consultas</h1>
        <p className="text-slate-400 text-sm mt-1">Historial de consultas médicas</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? "bg-primary text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <SlidersHorizontal size={15} />
          Filtros
          {hasActiveFilters && (
            <span className="bg-white/30 text-xs rounded-full px-1.5">
              {[filterPaciente, filterMedico, filterEsp, filterEst, filterFechaDesde, filterFechaHasta].filter(Boolean).length}
            </span>
          )}
        </button>
        <button className="btn-primary flex items-center gap-2 ml-auto" onClick={openNew}>
          <Plus size={16} /> Nueva consulta
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <div>
              <label className="label">Paciente</label>
              <select className="input" value={filterPaciente} onChange={(e) => setFilterPaciente(e.target.value)}>
                <option value="">Todos</option>
                {pacientesList.map((p) => (
                  <option key={p._id} value={p._id}>{p.apellido}, {p.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Médico</label>
              <select className="input" value={filterMedico} onChange={(e) => setFilterMedico(e.target.value)}>
                <option value="">Todos</option>
                {medicosList.map((m) => (
                  <option key={m._id} value={m._id}>Dr./Dra. {m.apellido}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Especialidad</label>
              <select className="input" value={filterEsp} onChange={(e) => setFilterEsp(e.target.value)}>
                <option value="">Todas</option>
                {especialidades.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Estado</label>
              <select className="input" value={filterEst} onChange={(e) => setFilterEst(e.target.value)}>
                <option value="">Todos</option>
                <option value="realizada">Realizada</option>
                <option value="programada">Programada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="label">Fecha desde</label>
              <input type="date" className="input" value={filterFechaDesde} onChange={(e) => setFilterFechaDesde(e.target.value)} />
            </div>
            <div>
              <label className="label">Fecha hasta</label>
              <input type="date" className="input" value={filterFechaHasta} onChange={(e) => setFilterFechaHasta(e.target.value)} />
            </div>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors">
              <X size={14} /> Limpiar todos los filtros
            </button>
          )}
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : (
          <>
            <Table columns={columns} data={consultas} emptyMessage="No se encontraron consultas." />
            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar consulta" : "Nueva consulta"} wide>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <fieldset>
            <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Datos generales</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Paciente *</label>
                <select className="input" name="paciente" value={form.paciente} onChange={handleChange} required>
                  <option value="">Seleccionar paciente</option>
                  {pacientesList.map((p) => (
                    <option key={p._id} value={p._id}>{p.apellido}, {p.nombre} — {p.dni}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Médico *</label>
                <select className="input" name="medico" value={form.medico} onChange={handleChange} required>
                  <option value="">Seleccionar médico</option>
                  {medicosList.map((m) => (
                    <option key={m._id} value={m._id}>Dr./Dra. {m.apellido}, {m.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Fecha *</label>
                <input className="input" type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Especialidad *</label>
                <input className="input" name="especialidad" value={form.especialidad} onChange={handleChange} required placeholder="Ej: Cardiología" />
              </div>
              <div>
                <label className="label">Estado</label>
                <select className="input" name="estado" value={form.estado} onChange={handleChange}>
                  <option value="realizada">Realizada</option>
                  <option value="programada">Programada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>
            <div className="mt-3 space-y-3">
              <div>
                <label className="label">Motivo de consulta</label>
                <textarea className="input resize-none" rows={2} name="motivoConsulta" value={form.motivoConsulta} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Diagnóstico</label>
                <textarea className="input resize-none" rows={2} name="diagnostico" value={form.diagnostico} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Observaciones</label>
                <textarea className="input resize-none" rows={2} name="observaciones" value={form.observaciones} onChange={handleChange} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Signos vitales</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "signosVitales.presionArterial", label: "Presión arterial", placeholder: "120/80" },
                { name: "signosVitales.frecuenciaCardiaca", label: "Frec. cardíaca (lpm)", type: "number" },
                { name: "signosVitales.temperatura", label: "Temperatura (°C)", type: "number", step: "0.1" },
                { name: "signosVitales.peso", label: "Peso (kg)", type: "number", step: "0.1" },
                { name: "signosVitales.talla", label: "Talla (cm)", type: "number" },
                { name: "signosVitales.saturacionOxigeno", label: "SatO₂ (%)", type: "number" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="label">{f.label}</label>
                  <input
                    className="input" name={f.name} type={f.type ?? "text"} step={f.step}
                    placeholder={f.placeholder} value={form[f.name]} onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <div className="flex items-center justify-between mb-3">
              <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Receta</legend>
              <button type="button" onClick={() => setReceta((r) => [...r, { ...EMPTY_MED_ITEM }])} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                <Plus size={13} /> Agregar medicamento
              </button>
            </div>
            <div className="space-y-3">
              {receta.map((item, i) => (
                <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-start bg-slate-50 rounded-lg p-3">
                  <div>
                    <label className="label">Medicamento</label>
                    <input className="input" value={item.medicamento} onChange={(e) => handleRecetaChange(i, "medicamento", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Dosis</label>
                    <input className="input" value={item.dosis} onChange={(e) => handleRecetaChange(i, "dosis", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Duración</label>
                    <input className="input" value={item.duracion} onChange={(e) => handleRecetaChange(i, "duracion", e.target.value)} />
                  </div>
                  <div className="relative">
                    <label className="label">Indicaciones</label>
                    <input className="input pr-7" value={item.indicaciones} onChange={(e) => handleRecetaChange(i, "indicaciones", e.target.value)} />
                    {receta.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setReceta((r) => r.filter((_, idx) => idx !== i))}
                        className="absolute right-2 top-6 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear consulta"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
