import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, Heart, AlertTriangle, Pill, Scissors, FileText } from "lucide-react";
import Spinner from "../components/shared/Spinner.jsx";
import { getPaciente, getConsultas } from "../api/index.js";

const ESTADO_COLORS = {
  realizada: "bg-emerald-50 text-emerald-700",
  programada: "bg-blue-50 text-blue-700",
  cancelada: "bg-red-50 text-red-600",
};

function calcEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null;
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

function InfoItem({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
      <div>
        <span className="text-slate-400 text-xs">{label}: </span>
        <span className="text-slate-700">{value}</span>
      </div>
    </div>
  );
}

function TagList({ items, color = "bg-slate-100 text-slate-600" }) {
  if (!items?.length) return <span className="text-slate-400 text-sm">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {items.map((item, i) => (
        <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{item}</span>
      ))}
    </div>
  );
}

export default function DetallePaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [loadingPac, setLoadingPac] = useState(true);
  const [loadingCons, setLoadingCons] = useState(true);

  useEffect(() => {
    getPaciente(id)
      .then(setPaciente)
      .finally(() => setLoadingPac(false));

    getConsultas({ paciente: id, limit: 100 })
      .then((res) => setConsultas(res.data ?? []))
      .finally(() => setLoadingCons(false));
  }, [id]);

  if (loadingPac) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner />
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="p-8 text-center text-slate-500">
        Paciente no encontrado.
      </div>
    );
  }

  const edad = calcEdad(paciente.fechaNacimiento);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate("/pacientes")}
          className="mt-1 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-2xl sm:text-3xl text-slate-800">
            {paciente.apellido}, {paciente.nombre}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="text-slate-400 text-sm">DNI {paciente.dni}</span>
            {edad !== null && (
              <span className="text-slate-400 text-sm">{edad} años</span>
            )}
            {paciente.grupoSanguineo && (
              <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {paciente.grupoSanguineo}
              </span>
            )}
            {paciente.sexo && (
              <span className="text-slate-400 text-sm capitalize">
                {paciente.sexo === "M" ? "Masculino" : paciente.sexo === "F" ? "Femenino" : paciente.sexo}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Contacto */}
        <div className="card space-y-2">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contacto</h2>
          <InfoItem icon={Phone} label="Teléfono" value={paciente.contacto?.telefono} />
          <InfoItem icon={Mail} label="Email" value={paciente.contacto?.email} />
          <InfoItem icon={MapPin} label="Dirección" value={paciente.contacto?.direccion} />
          {!paciente.contacto?.telefono && !paciente.contacto?.email && !paciente.contacto?.direccion && (
            <p className="text-slate-400 text-sm">Sin datos de contacto.</p>
          )}
        </div>

        {/* Obra Social */}
        <div className="card space-y-2">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Obra Social</h2>
          {paciente.obraSocial?.nombre ? (
            <>
              <p className="text-slate-700 text-sm font-medium">{paciente.obraSocial.nombre}</p>
              {paciente.obraSocial.plan && (
                <p className="text-slate-500 text-sm">Plan: {paciente.obraSocial.plan}</p>
              )}
              {paciente.obraSocial.numeroAfiliado && (
                <p className="text-slate-500 text-sm">Afiliado N°: {paciente.obraSocial.numeroAfiliado}</p>
              )}
            </>
          ) : (
            <p className="text-slate-400 text-sm">Sin obra social registrada.</p>
          )}
        </div>

        {/* Fecha nacimiento */}
        <div className="card space-y-2">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Datos personales</h2>
          {paciente.fechaNacimiento && (
            <p className="text-sm text-slate-700">
              <span className="text-slate-400">Fecha de nacimiento: </span>
              {new Date(paciente.fechaNacimiento).toLocaleDateString("es-AR")}
              {edad !== null && ` (${edad} años)`}
            </p>
          )}
          {paciente.sexo && (
            <p className="text-sm text-slate-700">
              <span className="text-slate-400">Sexo: </span>
              {paciente.sexo === "M" ? "Masculino" : paciente.sexo === "F" ? "Femenino" : paciente.sexo}
            </p>
          )}
          {paciente.grupoSanguineo && (
            <p className="text-sm text-slate-700">
              <span className="text-slate-400">Grupo sanguíneo: </span>
              {paciente.grupoSanguineo}
            </p>
          )}
        </div>
      </div>

      {/* Antecedentes */}
      <div className="card">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Antecedentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={13} className="text-amber-400" />
              <span className="text-xs font-medium text-slate-500">Alergias</span>
            </div>
            <TagList items={paciente.antecedentes?.alergias} color="bg-amber-50 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Heart size={13} className="text-red-400" />
              <span className="text-xs font-medium text-slate-500">Enfermedades crónicas</span>
            </div>
            <TagList items={paciente.antecedentes?.enfermedadesCronicas} color="bg-red-50 text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Scissors size={13} className="text-slate-400" />
              <span className="text-xs font-medium text-slate-500">Cirugías previas</span>
            </div>
            <TagList items={paciente.antecedentes?.cirugiasPrevias} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Pill size={13} className="text-blue-400" />
              <span className="text-xs font-medium text-slate-500">Medicación habitual</span>
            </div>
            <TagList items={paciente.antecedentes?.medicacionHabitual} color="bg-blue-50 text-blue-700" />
          </div>
        </div>
      </div>

      {/* Historial de consultas */}
      <div className="card p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <FileText size={15} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">Historial médico</h2>
          {!loadingCons && (
            <span className="ml-auto text-xs text-slate-400">{consultas.length} consulta{consultas.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {loadingCons ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : consultas.length === 0 ? (
          <p className="py-10 text-center text-slate-400 text-sm">Este paciente no tiene consultas registradas.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {consultas.map((c) => (
              <div key={c._id} onClick={() => navigate(`/consultas/${c._id}`)} className="px-4 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-slate-800">
                        {c.fecha ? new Date(c.fecha).toLocaleDateString("es-AR") : "—"}
                      </span>
                      <span className="text-slate-400 text-xs">·</span>
                      <span className="text-sm text-slate-600">{c.especialidad}</span>
                      {c.medico && (
                        <>
                          <span className="text-slate-400 text-xs">·</span>
                          <span className="text-sm text-slate-500">
                            Dr./Dra. {c.medico.apellido}
                          </span>
                        </>
                      )}
                    </div>
                    {c.motivoConsulta && (
                      <p className="text-xs text-slate-500">
                        <span className="font-medium">Motivo:</span> {c.motivoConsulta}
                      </p>
                    )}
                    {c.diagnostico && (
                      <p className="text-xs text-slate-500">
                        <span className="font-medium">Diagnóstico:</span> {c.diagnostico}
                      </p>
                    )}
                    {c.observaciones && (
                      <p className="text-xs text-slate-400 italic">{c.observaciones}</p>
                    )}
                    {c.receta?.length > 0 && c.receta.some((r) => r.medicamento) && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {c.receta.filter((r) => r.medicamento).map((r, i) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            {r.medicamento}{r.dosis ? ` ${r.dosis}` : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${ESTADO_COLORS[c.estado] ?? ""}`}>
                    {c.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
