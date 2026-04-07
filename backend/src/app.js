import express from "express";
import cors from "cors";
import pacientesRouter from "./routes/pacientes.js";
import medicosRouter from "./routes/medicos.js";
import consultasRouter from "./routes/consultas.js";
import analyticsRouter from "./routes/analytics.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/pacientes", pacientesRouter);
app.use("/api/medicos", medicosRouter);
app.use("/api/consultas", consultasRouter);
app.use("/api/analytics", analyticsRouter);

export default app;
