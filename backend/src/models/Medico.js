import mongoose from "mongoose";

const medicoSchema = new mongoose.Schema(
  {
    matricula: { type: String, required: true, unique: true, trim: true },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    especialidades: [{ type: String, trim: true }],
    contacto: {
      telefono: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Medico", medicoSchema);
