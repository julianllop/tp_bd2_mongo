import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Pencil, Trash2, SlidersHorizontal, X } from "lucide-react";
import Modal from "../components/shared/Modal.jsx";
import Table from "../components/shared/Table.jsx";
import Spinner from "../components/shared/Spinner.jsx";
import Pagination from "../components/shared/Pagination.jsx";
import { getMedicos, createMedico, updateMedico, deleteMedico } from "../api/index.js";

const ESPECIALIDADES_OPCIONES = [
  "Cardiología", "Pediatría", "Traumatología", "Ortopedia",
  "Clínica Médica", "Neurología", "Dermatología", "Ginecología",
  "Obstetricia", "Oftalmología", "Urología", "Endocrinología", "Nutrición",
];

const EMPTY_FORM = {
  matricula: "", nombre: "", apellido: "",
  especialidades: "",
  "contacto.telefono": "", "contacto.email": "",
};

function formToPayload(f) {
  return {
    matricula: f.matricula, nombre: f.nombre, apellido: f.apellido,
    especialidades: f.especialidades.split(",").map((s) => s.trim()).filter(Boolean),
    contacto: { telefono: f["contacto.telefono"], email: f["contacto.email"] },
  };
}

function medicoToForm(m) {
  return {
    matricula: m.matricula ?? "", nombre: m.nombre ?? "", apellido: m.apellido ?? "",
    especialidades: (m.especialidades ?? []).join(", "),
    "contacto.telefono": m.contacto?.telefono ?? "",
    "contacto.email": m.contacto?.email ?? "",
  };
}

export default function Medicos() {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const PAGE_SIZE = 10;

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PAGE_SIZE };
      if (search) params.search = search;
      if (especialidad) params.especialidad = especialidad;
      const res = await getMedicos(params);
      setMedicos(res.data);
      setPagination({ total: res.total, totalPages: res.totalPages });
    } finally {
      setLoading(false);
    }
  }, [search, especialidad, page]);

  useEffect(() => {
    const t = setTimeout(() => load(), 300);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => { setPage(1); }, [search, especialidad]);

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  }

  function openEdit(m) {
    setEditing(m);
    setForm(medicoToForm(m));
    setError("");
    setModalOpen(true);
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = formToPayload(form);
      if (editing) { await updateMedico(editing._id, payload); }
      else { await createMedico(payload); }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(m) {
    if (!window.confirm(`¿Eliminar al Dr./Dra. ${m.nombre} ${m.apellido}?`)) return;
    await deleteMedico(m._id);
    load();
  }

  const columns = [
    {
      key: "nombre",
      label: "Médico",
      render: (r) => <span className="font-medium">Dr./Dra. {r.apellido}, {r.nombre}</span>,
    },
    { key: "matricula", label: "Matrícula" },
    {
      key: "especialidades",
      label: "Especialidades",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {(r.especialidades ?? []).map((e) => (
            <span key={e} className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">{e}</span>
          ))}
        </div>
      ),
    },
    {
      key: "contacto",
      label: "Contacto",
      render: (r) => (
        <div className="text-xs text-slate-500 space-y-0.5">
          {r.contacto?.telefono && <div>{r.contacto.telefono}</div>}
          {r.contacto?.email && <div>{r.contacto.email}</div>}
        </div>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (r) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="text-slate-400 hover:text-primary transition-colors"><Pencil size={15} /></button>
          <button onClick={() => handleDelete(r)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-slate-800">Médicos</h1>
        <p className="text-slate-400 text-sm mt-1">Gestión del cuerpo médico</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-0 sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Buscar por nombre, matrícula…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFilters || especialidad
              ? "bg-primary text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <SlidersHorizontal size={15} />
          Filtros
          {especialidad && <span className="bg-white/30 text-xs rounded-full px-1.5">1</span>}
        </button>
        <button className="btn-primary flex items-center gap-2" onClick={openNew}>
          <Plus size={16} /> Nuevo médico
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card flex flex-wrap items-end gap-4">
          <div>
            <label className="label">Especialidad</label>
            <select
              className="input min-w-[200px]"
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
            >
              <option value="">Todas las especialidades</option>
              {ESPECIALIDADES_OPCIONES.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          {especialidad && (
            <button
              onClick={() => setEspecialidad("")}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors pb-2"
            >
              <X size={14} /> Limpiar
            </button>
          )}
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : (
          <>
            <Table columns={columns} data={medicos} emptyMessage="No se encontraron médicos." />
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar médico" : "Nuevo médico"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div>
            <label className="label">Matrícula *</label>
            <input className="input" name="matricula" value={form.matricula} onChange={handleChange} required placeholder="Ej: MN-12345" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Nombre *</label>
              <input className="input" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Apellido *</label>
              <input className="input" name="apellido" value={form.apellido} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="label">Especialidades <span className="text-slate-400 font-normal">(separar con comas)</span></label>
            <input className="input" name="especialidades" value={form.especialidades} onChange={handleChange} placeholder="Ej: Cardiología, Clínica Médica" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Teléfono</label>
              <input className="input" name="contacto.telefono" value={form["contacto.telefono"]} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" name="contacto.email" value={form["contacto.email"]} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear médico"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
