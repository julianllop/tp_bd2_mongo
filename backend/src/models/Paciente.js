import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema(
  {
    dni: { type: String, required: true, unique: true, trim: true },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    fechaNacimiento: { type: Date, required: true },
    sexo: { type: String, enum: ["M", "F", "otro"], required: true },
    contacto: {
      telefono: { type: String, default: "" },
      email: { type: String, default: "" },
      direccion: { type: String, default: "" },
    },
    obraSocial: {
      nombre: { type: String, default: "" },
      numeroAfiliado: { type: String, default: "" },
      plan: { type: String, default: "" },
    },
    antecedentes: {
      alergias: [{ type: String }],
      enfermedadesCronicas: [{ type: String }],
      cirugiasPrevias: [{ type: String }],
      medicacionHabitual: [{ type: String }],
    },
    grupoSanguineo: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Paciente", pacienteSchema);
