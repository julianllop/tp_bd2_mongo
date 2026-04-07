import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
});

// Pacientes — params: { search, grupoSanguineo, obraSocial, fechaNacimientoDesde, fechaNacimientoHasta, page, limit }
export const getPacientes = (params = {}) =>
    api.get("/pacientes", { params }).then((r) => r.data);
export const getPaciente = (id) =>
    api.get(`/pacientes/${id}`).then((r) => r.data);
export const createPaciente = (data) =>
    api.post("/pacientes", data).then((r) => r.data);
export const updatePaciente = (id, data) =>
    api.put(`/pacientes/${id}`, data).then((r) => r.data);
export const deletePaciente = (id) =>
    api.delete(`/pacientes/${id}`).then((r) => r.data);

// Medicos — params: { search, especialidad }
export const getMedicos = (params = {}) =>
    api.get("/medicos", { params }).then((r) => r.data);
export const getMedico = (id) => api.get(`/medicos/${id}`).then((r) => r.data);
export const createMedico = (data) =>
    api.post("/medicos", data).then((r) => r.data);
export const updateMedico = (id, data) =>
    api.put(`/medicos/${id}`, data).then((r) => r.data);
export const deleteMedico = (id) =>
    api.delete(`/medicos/${id}`).then((r) => r.data);

// Consultas — params: { paciente, medico, especialidad, estado, fechaDesde, fechaHasta }
export const getConsultas = (params = {}) =>
    api.get("/consultas", { params }).then((r) => r.data);
export const createConsulta = (data) =>
    api.post("/consultas", data).then((r) => r.data);
export const updateConsulta = (id, data) =>
    api.put(`/consultas/${id}`, data).then((r) => r.data);
export const deleteConsulta = (id) =>
    api.delete(`/consultas/${id}`).then((r) => r.data);

// Analytics — todos aceptan params: { fechaDesde, fechaHasta }
export const getResumen = (params = {}) =>
    api.get("/analytics/resumen", { params }).then((r) => r.data);
export const getConsultasPorMes = (params = {}) =>
    api.get("/analytics/consultas-mes", { params }).then((r) => r.data);
export const getEspecialidades = (params = {}) =>
    api.get("/analytics/especialidades", { params }).then((r) => r.data);
export const getMedicamentos = (params = {}) =>
    api.get("/analytics/medicamentos", { params }).then((r) => r.data);
export const getObrasSociales = () =>
    api.get("/analytics/obras-sociales").then((r) => r.data);
export const getGruposSanguineos = () =>
    api.get("/analytics/grupos-sanguineos").then((r) => r.data);
