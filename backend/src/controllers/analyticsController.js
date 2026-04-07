import Paciente from "../models/Paciente.js";
import Medico from "../models/Medico.js";
import Consulta from "../models/Consulta.js";

/** Builds a date range filter object from query params fechaDesde / fechaHasta */
function buildDateFilter(query) {
  const { fechaDesde, fechaHasta } = query;
  if (!fechaDesde && !fechaHasta) return null;
  const range = {};
  if (fechaDesde) range.$gte = new Date(fechaDesde);
  if (fechaHasta) {
    const hasta = new Date(fechaHasta);
    hasta.setDate(hasta.getDate() + 1);
    range.$lt = hasta;
  }
  return range;
}

export async function resumenGeneral(req, res) {
  try {
    const hoy = new Date();
    const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finDia = new Date(inicioDia.getTime() + 86400000);

    const dateRange = buildDateFilter(req.query);
    const consultaFilter = { estado: "realizada" };
    if (dateRange) consultaFilter.fecha = dateRange;

    const [totalPacientes, totalConsultas, totalMedicos, consultasHoy] =
      await Promise.all([
        Paciente.countDocuments({ activo: true }),
        Consulta.countDocuments(consultaFilter),
        Medico.countDocuments({ activo: true }),
        Consulta.countDocuments({ fecha: { $gte: inicioDia, $lt: finDia } }),
      ]);

    res.json({ totalPacientes, totalConsultas, totalMedicos, consultasHoy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function consultasPorEspecialidad(req, res) {
  try {
    const dateRange = buildDateFilter(req.query);
    const matchStage = { estado: "realizada" };
    if (dateRange) matchStage.fecha = dateRange;

    const data = await Consulta.aggregate([
      { $match: matchStage },
      { $group: { _id: "$especialidad", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $project: { _id: 0, name: "$_id", value: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function consultasPorMes(req, res) {
  try {
    const dateRange = buildDateFilter(req.query);
    const matchStage = { estado: { $ne: "cancelada" } };
    if (dateRange) matchStage.fecha = dateRange;

    const data = await Consulta.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { year: { $year: "$fecha" }, month: { $month: "$fecha" } },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          mes: {
            $let: {
              vars: {
                meses: ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
              },
              in: {
                $concat: [
                  { $arrayElemAt: ["$$meses", "$_id.month"] },
                  " ",
                  { $toString: "$_id.year" },
                ],
              },
            },
          },
          total: 1,
        },
      },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function medicamentosMasRecetados(req, res) {
  try {
    const dateRange = buildDateFilter(req.query);
    const matchStage = { estado: "realizada" };
    if (dateRange) matchStage.fecha = dateRange;

    const data = await Consulta.aggregate([
      { $match: matchStage },
      { $unwind: "$receta" },
      { $group: { _id: "$receta.medicamento", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, medicamento: "$_id", total: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function pacientesPorObraSocial(_req, res) {
  try {
    const data = await Paciente.aggregate([
      { $match: { activo: true, "obraSocial.nombre": { $ne: "" } } },
      { $group: { _id: "$obraSocial.nombre", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $project: { _id: 0, obraSocial: "$_id", total: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function distribucionGrupoSanguineo(_req, res) {
  try {
    const data = await Paciente.aggregate([
      { $match: { activo: true, grupoSanguineo: { $exists: true, $ne: null } } },
      { $group: { _id: "$grupoSanguineo", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $project: { _id: 0, grupo: "$_id", total: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
