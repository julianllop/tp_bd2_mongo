import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import Modal from "../components/shared/Modal.jsx";
import Table from "../components/shared/Table.jsx";
import Spinner from "../components/shared/Spinner.jsx";
import Pagination from "../components/shared/Pagination.jsx";
import MultiSelect from "../components/shared/MultiSelect.jsx";
import { getPacientes, createPaciente, updatePaciente, deletePaciente } from "../api/index.js";

const GRUPOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const OBRAS_SOCIALES = ["OSDE", "Swiss Medical", "PAMI", "IOMA", "Galeno", "Medifé"];

const EMPTY_FORM = {
  dni: "", nombre: "", apellido: "", fechaNacimiento: "", sexo: "",
  "contacto.telefono": "", "contacto.email": "", "contacto.direccion": "",
  "obraSocial.nombre": "", "obraSocial.numeroAfiliado": "", "obraSocial.plan": "",
  grupoSanguineo: "",
  "antecedentes.alergias": "", "antecedentes.enfermedadesCronicas": "",
  "antecedentes.cirugiasPrevias": "", "antecedentes.medicacionHabitual": "",
};

function formToPayload(f) {
  return {
    dni: f.dni, nombre: f.nombre, apellido: f.apellido,
    fechaNacimiento: f.fechaNacimiento, sexo: f.sexo,
    grupoSanguineo: f.grupoSanguineo || undefined,
    contacto: { telefono: f["contacto.telefono"], email: f["contacto.email"], direccion: f["contacto.direccion"] },
    obraSocial: { nombre: f["obraSocial.nombre"], numeroAfiliado: f["obraSocial.numeroAfiliado"], plan: f["obraSocial.plan"] },
    antecedentes: {
      alergias: f["antecedentes.alergias"].split(",").map((s) => s.trim()).filter(Boolean),
      enfermedadesCronicas: f["antecedentes.enfermedadesCronicas"].split(",").map((s) => s.trim()).filter(Boolean),
      cirugiasPrevias: f["antecedentes.cirugiasPrevias"].split(",").map((s) => s.trim()).filter(Boolean),
      medicacionHabitual: f["antecedentes.medicacionHabitual"].split(",").map((s) => s.trim()).filter(Boolean),
    },
  };
}

function pacienteToForm(p) {
  return {
    dni: p.dni ?? "", nombre: p.nombre ?? "", apellido: p.apellido ?? "",
    fechaNacimiento: p.fechaNacimiento ? p.fechaNacimiento.slice(0, 10) : "",
    sexo: p.sexo ?? "", grupoSanguineo: p.grupoSanguineo ?? "",
    "contacto.telefono": p.contacto?.telefono ?? "",
    "contacto.email": p.contacto?.email ?? "",
    "contacto.direccion": p.contacto?.direccion ?? "",
    "obraSocial.nombre": p.obraSocial?.nombre ?? "",
    "obraSocial.numeroAfiliado": p.obraSocial?.numeroAfiliado ?? "",
    "obraSocial.plan": p.obraSocial?.plan ?? "",
    "antecedentes.alergias": (p.antecedentes?.alergias ?? []).join(", "),
    "antecedentes.enfermedadesCronicas": (p.antecedentes?.enfermedadesCronicas ?? []).join(", "),
    "antecedentes.cirugiasPrevias": (p.antecedentes?.cirugiasPrevias ?? []).join(", "),
    "antecedentes.medicacionHabitual": (p.antecedentes?.medicacionHabitual ?? []).join(", "),
  };
}

export default function Pacientes() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [grupoSanguineo, setGrupoSanguineo] = useState([]);
  const [obraSocial, setObraSocial] = useState([]);
  const [fechaNacDesde, setFechaNacDesde] = useState("");
  const [fechaNacHasta, setFechaNacHasta] = useState("");
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

  const hasActiveFilters = search || grupoSanguineo.length || obraSocial.length || fechaNacDesde || fechaNacHasta;

  const load = useCallback(async (targetPage = page) => {
    setLoading(true);
    try {
      const params = { page: targetPage, limit: PAGE_SIZE };
      if (search) params.search = search;
      if (grupoSanguineo.length) params.grupoSanguineo = grupoSanguineo.join(",");
      if (obraSocial.length) params.obraSocial = obraSocial.join(",");
      if (fechaNacDesde) params.fechaNacimientoDesde = fechaNacDesde;
      if (fechaNacHasta) params.fechaNacimientoHasta = fechaNacHasta;
      const res = await getPacientes(params);
      setPacientes(res.data);
      setPagination({ total: res.total, totalPages: res.totalPages });
    } finally {
      setLoading(false);
    }
  }, [search, grupoSanguineo, obraSocial, fechaNacDesde, fechaNacHasta, page]);

  useEffect(() => {
    const t = setTimeout(() => load(), 300);
    return () => clearTimeout(t);
  }, [load]);

  function clearFilters() {
    setSearch("");
    setGrupoSanguineo([]);
    setObraSocial([]);
    setFechaNacDesde("");
    setFechaNacHasta("");
    setPage(1);
  }

  function handlePageChange(p) {
    setPage(p);
  }

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, grupoSanguineo, obraSocial, fechaNacDesde, fechaNacHasta]);

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm(pacienteToForm(p));
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
      if (editing) { await updatePaciente(editing._id, payload); }
      else { await createPaciente(payload); }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p) {
    if (!window.confirm(`¿Eliminar a ${p.nombre} ${p.apellido}?`)) return;
    await deletePaciente(p._id);
    load();
  }

  const columns = [
    {
      key: "nombre",
      label: "Nombre",
      render: (r) => <span className="font-medium">{r.apellido}, {r.nombre}</span>,
    },
    { key: "dni", label: "DNI" },
    {
      key: "fechaNacimiento",
      label: "Fecha de nacimiento",
      render: (r) => r.fechaNacimiento ? new Date(r.fechaNacimiento).toLocaleDateString("es-AR") : "—",
    },
    {
      key: "obraSocial",
      label: "Obra Social",
      render: (r) => r.obraSocial?.nombre || "—",
    },
    {
      key: "grupoSanguineo",
      label: "Grupo sanguíneo",
      render: (r) =>
        r.grupoSanguineo ? (
          <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">{r.grupoSanguineo}</span>
        ) : "—",
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (r) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => openEdit(r)} className="text-slate-400 hover:text-primary transition-colors"><Pencil size={15} /></button>
          <button onClick={() => handleDelete(r)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-slate-800">Pacientes</h1>
        <p className="text-slate-400 text-sm mt-1">Gestión del padrón de pacientes</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-0 sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Buscar por nombre, apellido o DNI…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openNew}>
          <Plus size={16} /> Nuevo paciente
        </button>
      </div>

      {/* Filters panel */}
      <div className="card flex flex-wrap items-end gap-4">
          <div className="min-w-[140px]">
            <MultiSelect
              label="Grupo sanguíneo"
              options={GRUPOS}
              value={grupoSanguineo}
              onChange={setGrupoSanguineo}
              placeholder="Todos"
            />
          </div>
          <div className="min-w-[160px]">
            <MultiSelect
              label="Obra social"
              options={OBRAS_SOCIALES}
              value={obraSocial}
              onChange={setObraSocial}
              placeholder="Todas"
            />
          </div>
          <div>
            <label className="label">Nació desde</label>
            <input type="date" className="input" value={fechaNacDesde} onChange={(e) => setFechaNacDesde(e.target.value)} />
          </div>
          <div>
            <label className="label">Nació hasta</label>
            <input type="date" className="input" value={fechaNacHasta} onChange={(e) => setFechaNacHasta(e.target.value)} />
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors pb-2">
              <X size={14} /> Limpiar filtros
            </button>
          )}
        </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : (
          <>
            <Table columns={columns} data={pacientes} emptyMessage="No se encontraron pacientes." onRowClick={(r) => navigate(`/pacientes/${r._id}`)} />
            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar paciente" : "Nuevo paciente"} wide>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <fieldset>
            <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Datos personales</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">DNI *</label>
                <input className="input" name="dni" value={form.dni} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Sexo *</label>
                <select className="input" name="sexo" value={form.sexo} onChange={handleChange} required>
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="label">Nombre *</label>
                <input className="input" name="nombre" value={form.nombre} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Apellido *</label>
                <input className="input" name="apellido" value={form.apellido} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Fecha de nacimiento *</label>
                <input className="input" type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Grupo sanguíneo</label>
                <select className="input" name="grupoSanguineo" value={form.grupoSanguineo} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {GRUPOS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contacto</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Teléfono</label>
                <input className="input" name="contacto.telefono" value={form["contacto.telefono"]} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" name="contacto.email" value={form["contacto.email"]} onChange={handleChange} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Dirección</label>
                <input className="input" name="contacto.direccion" value={form["contacto.direccion"]} onChange={handleChange} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Obra Social</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="label">Nombre</label>
                <input className="input" name="obraSocial.nombre" value={form["obraSocial.nombre"]} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Número de afiliado</label>
                <input className="input" name="obraSocial.numeroAfiliado" value={form["obraSocial.numeroAfiliado"]} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Plan</label>
                <input className="input" name="obraSocial.plan" value={form["obraSocial.plan"]} onChange={handleChange} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Antecedentes <span className="normal-case font-normal text-slate-400">(separar con comas)</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Alergias</label>
                <input className="input" name="antecedentes.alergias" value={form["antecedentes.alergias"]} onChange={handleChange} placeholder="Ej: Penicilina, AINEs" />
              </div>
              <div>
                <label className="label">Enfermedades crónicas</label>
                <input className="input" name="antecedentes.enfermedadesCronicas" value={form["antecedentes.enfermedadesCronicas"]} onChange={handleChange} placeholder="Ej: Diabetes, Hipertensión" />
              </div>
              <div>
                <label className="label">Cirugías previas</label>
                <input className="input" name="antecedentes.cirugiasPrevias" value={form["antecedentes.cirugiasPrevias"]} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Medicación habitual</label>
                <input className="input" name="antecedentes.medicacionHabitual" value={form["antecedentes.medicacionHabitual"]} onChange={handleChange} />
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear paciente"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
