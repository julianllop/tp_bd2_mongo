import mongoose from "mongoose";

const consultaSchema = new mongoose.Schema(
  {
    paciente: { type: mongoose.Schema.Types.ObjectId, ref: "Paciente", required: true },
    medico: { type: mongoose.Schema.Types.ObjectId, ref: "Medico", required: true },
    fecha: { type: Date, required: true, default: Date.now },
    especialidad: { type: String, required: true, trim: true },
    motivoConsulta: { type: String, default: "" },
    diagnostico: { type: String, default: "" },
    signosVitales: {
      presionArterial: { type: String, default: "" },
      frecuenciaCardiaca: { type: Number },
      temperatura: { type: Number },
      peso: { type: Number },
      talla: { type: Number },
      saturacionOxigeno: { type: Number },
    },
    datosEspecificos: { type: mongoose.Schema.Types.Mixed, default: {} },
    receta: [
      {
        medicamento: { type: String },
        dosis: { type: String },
        duracion: { type: String },
        indicaciones: { type: String },
      },
    ],
    estudiosIndicados: [{ type: String }],
    observaciones: { type: String, default: "" },
    proximoControl: { type: Date },
    estado: {
      type: String,
      enum: ["programada", "realizada", "cancelada"],
      default: "realizada",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Consulta", consultaSchema);
