import Consulta from "../models/Consulta.js";

export async function getAll(req, res) {
  try {
    const { paciente, medico, especialidad, estado, search, fechaDesde, fechaHasta, page, limit } = req.query;
    const filter = {};

    if (paciente) filter.paciente = paciente;
    if (medico) {
      const medicos = medico.split(",").map((s) => s.trim()).filter(Boolean);
      filter.medico = medicos.length === 1 ? medicos[0] : { $in: medicos };
    }
    if (especialidad) {
      const esps = especialidad.split(",").map((s) => s.trim()).filter(Boolean);
      filter.especialidad = esps.length === 1 ? esps[0] : { $in: esps };
    }
    if (estado) {
      const estados = estado.split(",").map((s) => s.trim()).filter(Boolean);
      filter.estado = estados.length === 1 ? estados[0] : { $in: estados };
    }
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ especialidad: regex }, { diagnostico: regex }, { motivoConsulta: regex }];
    }
    if (fechaDesde || fechaHasta) {
      filter.fecha = {};
      if (fechaDesde) filter.fecha.$gte = new Date(fechaDesde);
      if (fechaHasta) {
        const hasta = new Date(fechaHasta);
        hasta.setDate(hasta.getDate() + 1);
        filter.fecha.$lt = hasta;
      }
    }

    const currentPage = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.max(1, parseInt(limit) || 10);
    const skip = (currentPage - 1) * pageSize;

    const [data, total] = await Promise.all([
      Consulta.find(filter)
        .populate("paciente", "nombre apellido dni")
        .populate("medico", "nombre apellido matricula")
        .sort({ fecha: -1 })
        .skip(skip)
        .limit(pageSize),
      Consulta.countDocuments(filter),
    ]);

    res.json({ data, total, page: currentPage, limit: pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const consulta = await Consulta.findById(req.params.id)
      .populate("paciente")
      .populate("medico");
    if (!consulta) return res.status(404).json({ error: "Consulta no encontrada" });
    res.json(consulta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const consulta = await Consulta.create(req.body);
    const populated = await consulta.populate([
      { path: "paciente", select: "nombre apellido dni" },
      { path: "medico", select: "nombre apellido matricula" },
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const consulta = await Consulta.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("paciente", "nombre apellido dni")
      .populate("medico", "nombre apellido matricula");
    if (!consulta) return res.status(404).json({ error: "Consulta no encontrada" });
    res.json(consulta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const consulta = await Consulta.findByIdAndUpdate(
      req.params.id,
      { estado: "cancelada" },
      { new: true }
    );
    if (!consulta) return res.status(404).json({ error: "Consulta no encontrada" });
    res.json({ message: "Consulta cancelada", consulta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
