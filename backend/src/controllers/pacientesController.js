import Paciente from "../models/Paciente.js";

export async function getAll(req, res) {
  try {
    const { search, grupoSanguineo, obraSocial, fechaNacimientoDesde, fechaNacimientoHasta, page, limit } = req.query;
    const filter = { activo: true };

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ nombre: regex }, { apellido: regex }, { dni: regex }];
    }
    if (grupoSanguineo) {
      const grupos = grupoSanguineo.split(",").map((s) => s.trim()).filter(Boolean);
      filter.grupoSanguineo = grupos.length === 1 ? grupos[0] : { $in: grupos };
    }
    if (obraSocial) {
      const obras = obraSocial.split(",").map((s) => s.trim()).filter(Boolean);
      filter["obraSocial.nombre"] =
        obras.length === 1
          ? new RegExp(obras[0], "i")
          : { $in: obras.map((o) => new RegExp(o, "i")) };
    }
    if (fechaNacimientoDesde || fechaNacimientoHasta) {
      filter.fechaNacimiento = {};
      if (fechaNacimientoDesde) filter.fechaNacimiento.$gte = new Date(fechaNacimientoDesde);
      if (fechaNacimientoHasta) {
        const hasta = new Date(fechaNacimientoHasta);
        hasta.setDate(hasta.getDate() + 1);
        filter.fechaNacimiento.$lt = hasta;
      }
    }

    const currentPage = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.max(1, parseInt(limit) || 10);
    const skip = (currentPage - 1) * pageSize;

    const [data, total] = await Promise.all([
      Paciente.find(filter).sort({ apellido: 1, nombre: 1 }).skip(skip).limit(pageSize),
      Paciente.countDocuments(filter),
    ]);

    res.json({ data, total, page: currentPage, limit: pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) return res.status(404).json({ error: "Paciente no encontrado" });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const paciente = await Paciente.create(req.body);
    res.status(201).json(paciente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!paciente) return res.status(404).json({ error: "Paciente no encontrado" });
    res.json(paciente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const paciente = await Paciente.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!paciente) return res.status(404).json({ error: "Paciente no encontrado" });
    res.json({ message: "Paciente desactivado", paciente });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
