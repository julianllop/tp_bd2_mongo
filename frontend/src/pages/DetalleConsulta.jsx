import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Stethoscope, Calendar, ClipboardList, Activity, Pill, FileText, Eye } from "lucide-react";
import Spinner from "../components/shared/Spinner.jsx";
import { getConsulta } from "../api/index.js";

const ESTADO_COLORS = {
  realizada: "bg-emerald-50 text-emerald-700",
  programada: "bg-blue-50 text-blue-700",
  cancelada: "bg-red-50 text-red-600",
};

function Section({ icon: Icon, title, children }) {
  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-1">
        <Icon size={14} className="text-slate-400" />
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, className = "" }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <span className="text-xs text-slate-400">{label}</span>
      <p className={`text-sm text-slate-700 mt-0.5 ${className}`}>{value}</p>
    </div>
  );
}

export default function DetalleConsulta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consulta, setConsulta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getConsulta(id)
      .then(setConsulta)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner />
      </div>
    );
  }

  if (notFound || !consulta) {
    return (
      <div className="p-8 text-center text-slate-500">Consulta no encontrada.</div>
    );
  }

  const paciente = consulta.paciente;
  const medico = consulta.medico;
  const sv = consulta.signosVitales ?? {};
  const receta = (consulta.receta ?? []).filter((r) => r.medicamento);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="mt-1 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-serif text-2xl sm:text-3xl text-slate-800">
              Consulta
            </h1>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ESTADO_COLORS[consulta.estado] ?? ""}`}>
              {consulta.estado}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            {consulta.fecha ? new Date(consulta.fecha).toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "—"}
            {consulta.especialidad ? ` · ${consulta.especialidad}` : ""}
          </p>
        </div>
      </div>

      {/* Paciente + Médico */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section icon={User} title="Paciente">
          {paciente ? (
            <>
              <button
                onClick={() => navigate(`/pacientes/${paciente._id}`)}
                className="text-base font-semibold text-primary hover:underline text-left"
              >
                {paciente.apellido}, {paciente.nombre}
              </button>
              {paciente.dni && <p className="text-sm text-slate-500">DNI: {paciente.dni}</p>}
            </>
          ) : (
            <p className="text-slate-400 text-sm">Sin datos del paciente.</p>
          )}
        </Section>

        <Section icon={Stethoscope} title="Médico">
          {medico ? (
            <>
              <p className="text-base font-semibold text-slate-800">
                Dr./Dra. {medico.apellido}, {medico.nombre}
              </p>
              {medico.matricula && <p className="text-sm text-slate-500">Matrícula: {medico.matricula}</p>}
              {medico.especialidades?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {medico.especialidades.map((e, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{e}</span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-slate-400 text-sm">Sin datos del médico.</p>
          )}
        </Section>
      </div>

      {/* Datos clínicos */}
      <Section icon={ClipboardList} title="Datos clínicos">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Especialidad" value={consulta.especialidad} />
          <Field
            label="Fecha"
            value={consulta.fecha ? new Date(consulta.fecha).toLocaleDateString("es-AR") : null}
          />
          <Field label="Motivo de consulta" value={consulta.motivoConsulta} className="whitespace-pre-wrap" />
          <Field label="Diagnóstico" value={consulta.diagnostico} className="whitespace-pre-wrap" />
          {consulta.observaciones && (
            <div className="sm:col-span-2">
              <Field label="Observaciones" value={consulta.observaciones} className="whitespace-pre-wrap" />
            </div>
          )}
          {consulta.proximoControl && (
            <Field
              label="Próximo control"
              value={new Date(consulta.proximoControl).toLocaleDateString("es-AR")}
            />
          )}
        </div>
      </Section>

      {/* Signos vitales */}
      {(sv.presionArterial || sv.frecuenciaCardiaca || sv.temperatura || sv.peso || sv.talla || sv.saturacionOxigeno) && (
        <Section icon={Activity} title="Signos vitales">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Presión arterial" value={sv.presionArterial} />
            <Field label="Frec. cardíaca" value={sv.frecuenciaCardiaca ? `${sv.frecuenciaCardiaca} lpm` : null} />
            <Field label="Temperatura" value={sv.temperatura ? `${sv.temperatura} °C` : null} />
            <Field label="Peso" value={sv.peso ? `${sv.peso} kg` : null} />
            <Field label="Talla" value={sv.talla ? `${sv.talla} cm` : null} />
            <Field label="Saturación O₂" value={sv.saturacionOxigeno ? `${sv.saturacionOxigeno} %` : null} />
          </div>
        </Section>
      )}

      {/* Receta */}
      {receta.length > 0 && (
        <Section icon={Pill} title="Receta">
          <div className="divide-y divide-slate-50">
            {receta.map((r, i) => (
              <div key={i} className="py-2 first:pt-0 last:pb-0 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Field label="Medicamento" value={r.medicamento} />
                <Field label="Dosis" value={r.dosis} />
                <Field label="Duración" value={r.duracion} />
                <Field label="Indicaciones" value={r.indicaciones} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Estudios indicados */}
      {consulta.estudiosIndicados?.length > 0 && (
        <Section icon={FileText} title="Estudios indicados">
          <ul className="space-y-1">
            {consulta.estudiosIndicados.map((e, i) => (
              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-slate-300 mt-0.5">·</span>
                {e}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Datos específicos (campo libre Mixed) */}
      {consulta.datosEspecificos && Object.keys(consulta.datosEspecificos).length > 0 && (
        <Section icon={Eye} title="Datos específicos">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(consulta.datosEspecificos).map(([key, val]) => (
              <Field key={key} label={key} value={String(val)} />
            ))}
          </div>
        </Section>
      )}

      {/* Timestamps */}
      <p className="text-xs text-slate-300 text-right">
        {consulta.createdAt && `Registrada: ${new Date(consulta.createdAt).toLocaleString("es-AR")}`}
        {consulta.updatedAt && consulta.updatedAt !== consulta.createdAt && ` · Actualizada: ${new Date(consulta.updatedAt).toLocaleString("es-AR")}`}
      </p>
    </div>
  );
}
