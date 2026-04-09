import Medico from "../models/Medico.js";

export async function getAll(req, res) {
  try {
    const { search, especialidad, page, limit } = req.query;
    const filter = { activo: true };

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { nombre: regex },
        { apellido: regex },
        { matricula: regex },
        { especialidades: regex },
      ];
    }
    if (especialidad) {
      const esps = especialidad.split(",").map((s) => s.trim()).filter(Boolean);
      filter.especialidades = esps.length === 1 ? { $in: [esps[0]] } : { $in: esps };
    }

    const currentPage = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.max(1, parseInt(limit) || 10);
    const skip = (currentPage - 1) * pageSize;

    const [data, total] = await Promise.all([
      Medico.find(filter).sort({ apellido: 1, nombre: 1 }).skip(skip).limit(pageSize),
      Medico.countDocuments(filter),
    ]);

    res.json({ data, total, page: currentPage, limit: pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const medico = await Medico.findById(req.params.id);
    if (!medico) return res.status(404).json({ error: "Médico no encontrado" });
    res.json(medico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const medico = await Medico.create(req.body);
    res.status(201).json(medico);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const medico = await Medico.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!medico) return res.status(404).json({ error: "Médico no encontrado" });
    res.json(medico);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const medico = await Medico.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!medico) return res.status(404).json({ error: "Médico no encontrado" });
    res.json({ message: "Médico desactivado", medico });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
