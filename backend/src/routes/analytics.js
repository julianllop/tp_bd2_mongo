import { Router } from "express";
import * as ctrl from "../controllers/analyticsController.js";

const router = Router();

router.get("/resumen", ctrl.resumenGeneral);
router.get("/especialidades", ctrl.consultasPorEspecialidad);
router.get("/consultas-mes", ctrl.consultasPorMes);
router.get("/medicamentos", ctrl.medicamentosMasRecetados);
router.get("/obras-sociales", ctrl.pacientesPorObraSocial);
router.get("/grupos-sanguineos", ctrl.distribucionGrupoSanguineo);

export default router;
