import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import Paciente from "./models/Paciente.js";
import Medico from "./models/Medico.js";
import Consulta from "./models/Consulta.js";

await connectDB(process.env.MONGO_URI);
await Promise.all([Paciente.deleteMany({}), Medico.deleteMany({}), Consulta.deleteMany({})]);
console.log("Colecciones limpiadas.");

// ── Médicos ────────────────────────────────────────────────────────────────────
const medicos = await Medico.insertMany([
  { matricula: "MN-12345", nombre: "Carlos", apellido: "Rodríguez", especialidades: ["Cardiología"], contacto: { telefono: "011-4555-1001", email: "c.rodriguez@medidoc.com" } },
  { matricula: "MN-23456", nombre: "Ana", apellido: "González", especialidades: ["Pediatría"], contacto: { telefono: "011-4555-1002", email: "a.gonzalez@medidoc.com" } },
  { matricula: "MN-34567", nombre: "Luis", apellido: "Martínez", especialidades: ["Traumatología", "Ortopedia"], contacto: { telefono: "011-4555-1003", email: "l.martinez@medidoc.com" } },
  { matricula: "MN-45678", nombre: "Sofía", apellido: "López", especialidades: ["Clínica Médica"], contacto: { telefono: "011-4555-1004", email: "s.lopez@medidoc.com" } },
  { matricula: "MN-56789", nombre: "Diego", apellido: "Fernández", especialidades: ["Neurología"], contacto: { telefono: "011-4555-1005", email: "d.fernandez@medidoc.com" } },
  { matricula: "MN-67890", nombre: "María", apellido: "Pereyra", especialidades: ["Dermatología"], contacto: { telefono: "011-4555-1006", email: "m.pereyra@medidoc.com" } },
  { matricula: "MN-78901", nombre: "Pablo", apellido: "Suárez", especialidades: ["Ginecología", "Obstetricia"], contacto: { telefono: "011-4555-1007", email: "p.suarez@medidoc.com" } },
  { matricula: "MN-89012", nombre: "Carmen", apellido: "Vega", especialidades: ["Oftalmología"], contacto: { telefono: "011-4555-1008", email: "c.vega@medidoc.com" } },
  { matricula: "MN-90123", nombre: "Tomás", apellido: "Ramos", especialidades: ["Urología"], contacto: { telefono: "011-4555-1009", email: "t.ramos@medidoc.com" } },
  { matricula: "MN-01234", nombre: "Lucía", apellido: "Castro", especialidades: ["Endocrinología", "Nutrición"], contacto: { telefono: "011-4555-1010", email: "l.castro@medidoc.com" } },
]);
console.log(`${medicos.length} médicos insertados.`);

// ── Pacientes ──────────────────────────────────────────────────────────────────
const pacientes = await Paciente.insertMany([
  { dni: "30123456", nombre: "Martín", apellido: "Álvarez", fechaNacimiento: new Date("1985-03-14"), sexo: "M", contacto: { telefono: "011-5000-1001", email: "m.alvarez@mail.com", direccion: "Av. Corrientes 1234" }, obraSocial: { nombre: "OSDE", numeroAfiliado: "OS-001", plan: "410" }, antecedentes: { alergias: ["Penicilina"], enfermedadesCronicas: ["Hipertensión arterial"], cirugiasPrevias: ["Apendicectomía"], medicacionHabitual: ["Enalapril 10mg"] }, grupoSanguineo: "A+" },
  { dni: "28765432", nombre: "Laura", apellido: "Benítez", fechaNacimiento: new Date("1978-07-22"), sexo: "F", contacto: { telefono: "011-5000-1002", email: "l.benitez@mail.com", direccion: "Calle Rivadavia 567" }, obraSocial: { nombre: "Swiss Medical", numeroAfiliado: "SW-002", plan: "Gold" }, antecedentes: { alergias: ["AINEs"], enfermedadesCronicas: ["Diabetes tipo 2", "Hipotiroidismo"], cirugiasPrevias: [], medicacionHabitual: ["Metformina 850mg", "Levotiroxina 50mcg"] }, grupoSanguineo: "O+" },
  { dni: "35987654", nombre: "Juan", apellido: "Castro", fechaNacimiento: new Date("1995-11-08"), sexo: "M", contacto: { telefono: "011-5000-1003", email: "j.castro@mail.com", direccion: "Florida 890" }, obraSocial: { nombre: "IOMA", numeroAfiliado: "IO-003", plan: "Básico" }, antecedentes: { alergias: [], enfermedadesCronicas: ["Asma bronquial"], cirugiasPrevias: ["Rodilla derecha - ligamento cruzado"], medicacionHabitual: ["Salbutamol inhalador"] }, grupoSanguineo: "B+" },
  { dni: "22334455", nombre: "Elena", apellido: "Díaz", fechaNacimiento: new Date("1952-05-30"), sexo: "F", contacto: { telefono: "011-5000-1004", email: "e.diaz@mail.com", direccion: "Belgrano 321" }, obraSocial: { nombre: "PAMI", numeroAfiliado: "PA-004", plan: "Estándar" }, antecedentes: { alergias: ["Sulfas"], enfermedadesCronicas: ["Insuficiencia cardíaca", "Fibrilación auricular"], cirugiasPrevias: ["Bypass coronario"], medicacionHabitual: ["Bisoprolol 5mg", "Warfarina 5mg", "Furosemida 40mg"] }, grupoSanguineo: "AB+" },
  { dni: "40111222", nombre: "Santiago", apellido: "García", fechaNacimiento: new Date("2010-02-14"), sexo: "M", contacto: { telefono: "011-5000-1005", email: "garcia.padres@mail.com", direccion: "Sarmiento 456" }, obraSocial: { nombre: "OSDE", numeroAfiliado: "OS-005", plan: "310" }, antecedentes: { alergias: [], enfermedadesCronicas: [], cirugiasPrevias: [], medicacionHabitual: [] }, grupoSanguineo: "O-" },
  { dni: "33445566", nombre: "Valeria", apellido: "Herrera", fechaNacimiento: new Date("1990-09-18"), sexo: "F", contacto: { telefono: "011-5000-1006", email: "v.herrera@mail.com", direccion: "Santa Fe 1111" }, obraSocial: { nombre: "Swiss Medical", numeroAfiliado: "SW-006", plan: "Platinum" }, antecedentes: { alergias: ["Látex"], enfermedadesCronicas: ["Epilepsia"], cirugiasPrevias: [], medicacionHabitual: ["Carbamazepina 400mg"] }, grupoSanguineo: "A-" },
  { dni: "27889900", nombre: "Roberto", apellido: "Ibáñez", fechaNacimiento: new Date("1965-12-03"), sexo: "M", contacto: { telefono: "011-5000-1007", email: "r.ibanez@mail.com", direccion: "Av. Santa Fe 2222" }, obraSocial: { nombre: "IOMA", numeroAfiliado: "IO-007", plan: "Plus" }, antecedentes: { alergias: ["Aspirina"], enfermedadesCronicas: ["Gota", "Hipercolesterolemia"], cirugiasPrevias: ["Colecistectomía"], medicacionHabitual: ["Alopurinol 300mg", "Atorvastatina 40mg"] }, grupoSanguineo: "B-" },
  { dni: "38556677", nombre: "Camila", apellido: "Jiménez", fechaNacimiento: new Date("2018-06-25"), sexo: "F", contacto: { telefono: "011-5000-1008", email: "jimenez.familia@mail.com", direccion: "Palermo 789" }, obraSocial: { nombre: "PAMI", numeroAfiliado: "PA-008", plan: "Familiar" }, antecedentes: { alergias: [], enfermedadesCronicas: [], cirugiasPrevias: [], medicacionHabitual: [] }, grupoSanguineo: "AB-" },
  { dni: "31223344", nombre: "Florencia", apellido: "Morales", fechaNacimiento: new Date("1993-04-17"), sexo: "F", contacto: { telefono: "011-5000-1009", email: "f.morales@mail.com", direccion: "Callao 345" }, obraSocial: { nombre: "Galeno", numeroAfiliado: "GA-009", plan: "Plus" }, antecedentes: { alergias: ["Ibuprofeno"], enfermedadesCronicas: ["Síndrome de ovario poliquístico"], cirugiasPrevias: [], medicacionHabitual: ["Anticonceptivos orales"] }, grupoSanguineo: "A+" },
  { dni: "26778899", nombre: "Héctor", apellido: "Núñez", fechaNacimiento: new Date("1958-08-09"), sexo: "M", contacto: { telefono: "011-5000-1010", email: "h.nunez@mail.com", direccion: "Independencia 678" }, obraSocial: { nombre: "PAMI", numeroAfiliado: "PA-010", plan: "Estándar" }, antecedentes: { alergias: [], enfermedadesCronicas: ["Diabetes tipo 2", "Retinopatía diabética"], cirugiasPrevias: ["Cataratas ojo izquierdo"], medicacionHabitual: ["Insulina Glargina 20UI", "Metformina 1000mg"] }, grupoSanguineo: "O+" },
  { dni: "39001122", nombre: "Agustina", apellido: "Ortega", fechaNacimiento: new Date("2001-12-30"), sexo: "F", contacto: { telefono: "011-5000-1011", email: "a.ortega@mail.com", direccion: "Córdoba 900" }, obraSocial: { nombre: "Medifé", numeroAfiliado: "ME-011", plan: "Básico" }, antecedentes: { alergias: ["Polen", "Ácaros"], enfermedadesCronicas: ["Rinitis alérgica", "Psoriasis"], cirugiasPrevias: [], medicacionHabitual: ["Loratadina 10mg"] }, grupoSanguineo: "B+" },
  { dni: "25667788", nombre: "Ernesto", apellido: "Paredes", fechaNacimiento: new Date("1970-03-22"), sexo: "M", contacto: { telefono: "011-5000-1012", email: "e.paredes@mail.com", direccion: "Tucumán 1200" }, obraSocial: { nombre: "OSDE", numeroAfiliado: "OS-012", plan: "510" }, antecedentes: { alergias: [], enfermedadesCronicas: ["Hiperplasia prostática benigna"], cirugiasPrevias: [], medicacionHabitual: ["Tamsulosina 0.4mg"] }, grupoSanguineo: "AB+" },
  { dni: "36889900", nombre: "Natalia", apellido: "Quiroga", fechaNacimiento: new Date("1987-07-05"), sexo: "F", contacto: { telefono: "011-5000-1013", email: "n.quiroga@mail.com", direccion: "Lavalle 456" }, obraSocial: { nombre: "Swiss Medical", numeroAfiliado: "SW-013", plan: "Silver" }, antecedentes: { alergias: ["Cefalosporinas"], enfermedadesCronicas: ["Hipotiroidismo", "Depresión"], cirugiasPrevias: ["Cesárea"], medicacionHabitual: ["Levotiroxina 75mcg", "Sertralina 50mg"] }, grupoSanguineo: "O-" },
  { dni: "42334455", nombre: "Tomás", apellido: "Ríos", fechaNacimiento: new Date("2015-09-12"), sexo: "M", contacto: { telefono: "011-5000-1014", email: "rios.familia@mail.com", direccion: "Urquiza 222" }, obraSocial: { nombre: "IOMA", numeroAfiliado: "IO-014", plan: "Familiar" }, antecedentes: { alergias: ["Mariscos"], enfermedadesCronicas: [], cirugiasPrevias: [], medicacionHabitual: [] }, grupoSanguineo: "A-" },
  { dni: "29445566", nombre: "Cecilia", apellido: "Sosa", fechaNacimiento: new Date("1975-01-28"), sexo: "F", contacto: { telefono: "011-5000-1015", email: "c.sosa@mail.com", direccion: "Viamonte 789" }, obraSocial: { nombre: "Galeno", numeroAfiliado: "GA-015", plan: "Estándar" }, antecedentes: { alergias: [], enfermedadesCronicas: ["Glaucoma", "Hipertensión ocular"], cirugiasPrevias: ["Trabeculectomía ojo derecho"], medicacionHabitual: ["Timolol colirio 0.5%", "Dorzolamida colirio"] }, grupoSanguineo: "B+" },
  { dni: "37556677", nombre: "Ignacio", apellido: "Torres", fechaNacimiento: new Date("1982-06-14"), sexo: "M", contacto: { telefono: "011-5000-1016", email: "i.torres@mail.com", direccion: "Reconquista 333" }, obraSocial: { nombre: "Medifé", numeroAfiliado: "ME-016", plan: "Plus" }, antecedentes: { alergias: [], enfermedadesCronicas: ["Hipotiroidismo", "Obesidad"], cirugiasPrevias: [], medicacionHabitual: ["Levotiroxina 100mcg", "Orlistat 120mg"] }, grupoSanguineo: "AB-" },
  { dni: "24667788", nombre: "Gloria", apellido: "Vargas", fechaNacimiento: new Date("1948-11-03"), sexo: "F", contacto: { telefono: "011-5000-1017", email: "g.vargas@mail.com", direccion: "Perón 567" }, obraSocial: { nombre: "PAMI", numeroAfiliado: "PA-017", plan: "Estándar" }, antecedentes: { alergias: ["Contraste yodado"], enfermedadesCronicas: ["Osteoporosis", "Artritis reumatoidea"], cirugiasPrevias: ["Prótesis cadera derecha"], medicacionHabitual: ["Metotrexato 7.5mg", "Ácido fólico 5mg"] }, grupoSanguineo: "O+" },
  { dni: "41778899", nombre: "Lucas", apellido: "Acosta", fechaNacimiento: new Date("2008-04-20"), sexo: "M", contacto: { telefono: "011-5000-1018", email: "acosta.familia@mail.com", direccion: "Charcas 890" }, obraSocial: { nombre: "OSDE", numeroAfiliado: "OS-018", plan: "210" }, antecedentes: { alergias: [], enfermedadesCronicas: [], cirugiasPrevias: [], medicacionHabitual: [] }, grupoSanguineo: "A+" },
  { dni: "32889900", nombre: "Marcela", apellido: "Blanco", fechaNacimiento: new Date("1969-08-16"), sexo: "F", contacto: { telefono: "011-5000-1019", email: "m.blanco@mail.com", direccion: "Corrientes 3456" }, obraSocial: { nombre: "Swiss Medical", numeroAfiliado: "SW-019", plan: "Gold" }, antecedentes: { alergias: ["Sulfonamidas"], enfermedadesCronicas: ["Lupus eritematoso sistémico"], cirugiasPrevias: [], medicacionHabitual: ["Hidroxicloroquina 200mg", "Prednisona 5mg"] }, grupoSanguineo: "B-" },
  { dni: "43001122", nombre: "Sebastián", apellido: "Cabrera", fechaNacimiento: new Date("1999-02-07"), sexo: "M", contacto: { telefono: "011-5000-1020", email: "s.cabrera@mail.com", direccion: "Maipú 123" }, obraSocial: { nombre: "IOMA", numeroAfiliado: "IO-020", plan: "Joven" }, antecedentes: { alergias: [], enfermedadesCronicas: ["Colitis ulcerosa"], cirugiasPrevias: [], medicacionHabitual: ["Mesalazina 1g"] }, grupoSanguineo: "AB+" },
]);
console.log(`${pacientes.length} pacientes insertados.`);

// ── Helpers ────────────────────────────────────────────────────────────────────
const [cardio, pedi, trauma, clinica, neuro, dermato, gineco, oftalmo, uro, endocrino] = medicos;
const [
  alvarez, benitez, castro, diaz, garcia, herrera, ibanez, jimenez,
  morales, nunez, ortega, paredes, quiroga, rios, sosa, torres, vargas, acosta, blanco, cabrera,
] = pacientes;

/** Crea un objeto de consulta de forma compacta */
function mk(pac, med, fecha, esp, mot, dx, rx = [], est = "realizada", obs = "") {
  return {
    paciente: pac._id,
    medico: med._id,
    fecha: new Date(fecha),
    especialidad: esp,
    motivoConsulta: mot,
    diagnostico: dx,
    estado: est,
    signosVitales: {},
    datosEspecificos: {},
    receta: rx.map(([medicamento, dosis]) => ({ medicamento, dosis, duracion: "Continuo", indicaciones: "" })),
    estudiosIndicados: [],
    observaciones: obs,
  };
}

// ── Consultas (Abr 2023 – Abr 2026) ───────────────────────────────────────────

const consultaData = [

  // ═══════════════════════════════════════════════════════════════════════
  // 2023 — ABRIL a DICIEMBRE
  // ═══════════════════════════════════════════════════════════════════════

  // CARDIOLOGÍA
  mk(diaz, cardio, "2023-04-20", "Cardiología", "Control post-bypass", "IC CF II post-bypass coronario",
    [["Bisoprolol","5mg"],["Furosemida","40mg"],["Warfarina","5mg"]]),
  mk(alvarez, cardio, "2023-05-08", "Cardiología", "Chequeo cardiovascular inicial", "HTA estadio I. Sin daño de órgano blanco.",
    [["Enalapril","10mg"],["Atorvastatina","20mg"]]),
  mk(diaz, cardio, "2023-07-18", "Cardiología", "Control trimestral IC", "IC CF II compensada. FA con RV controlada.",
    [["Bisoprolol","5mg"],["Furosemida","40mg"],["Warfarina","5mg"]]),
  mk(ibanez, cardio, "2023-08-05", "Cardiología", "Palpitaciones ocasionales", "Extrasístoles supraventriculares benignas.",
    [["Atenolol","25mg"]]),
  mk(diaz, cardio, "2023-10-24", "Cardiología", "Control trimestral IC", "IC CF II. Ajuste de Furosemida por edemas leves.",
    [["Bisoprolol","5mg"],["Furosemida","60mg"],["Warfarina","5mg"],["Espironolactona","25mg"]]),
  mk(blanco, cardio, "2023-11-15", "Cardiología", "Evaluación por lupus y riesgo cardiovascular", "Riesgo cardiovascular bajo. Sin cardiopatía.",
    []),
  mk(diaz, cardio, "2023-12-20", "Cardiología", "Control trimestral IC", "IC estable. Fracción de eyección 42%.",
    [["Bisoprolol","5mg"],["Furosemida","40mg"],["Warfarina","5mg"],["Espironolactona","25mg"]]),

  // PEDIATRÍA
  mk(garcia, pedi, "2023-04-28", "Pediatría", "Control niño sano 13 años", "Desarrollo normal. Vacunas al día.",
    [["Vitamina D","400UI"]]),
  mk(jimenez, pedi, "2023-05-30", "Pediatría", "Fiebre 38.5°C, tos productiva", "Bronquitis aguda leve.",
    [["Amoxicilina","500mg"],["Ibuprofeno","100mg/5ml"]]),
  mk(acosta, pedi, "2023-06-14", "Pediatría", "Dolor de garganta, fiebre 39°C", "Faringoamigdalitis bacteriana.",
    [["Amoxicilina","500mg"],["Paracetamol","500mg"]]),
  mk(garcia, pedi, "2023-08-22", "Pediatría", "Control preventivo anual", "Niño sano. Talla y peso en percentil 50.",
    []),
  mk(rios, pedi, "2023-09-10", "Pediatría", "Control 8 años sano", "Desarrollo normal. Vacunación completa.",
    [["Vitamina D","400UI"]]),
  mk(jimenez, pedi, "2023-11-06", "Pediatría", "Otitis media aguda bilateral", "OMA bilateral. Timpanograma tipo B.",
    [["Amoxicilina-Clavulánico","500mg"],["Ibuprofeno","100mg/5ml"]]),
  mk(acosta, pedi, "2023-12-02", "Pediatría", "Rinitis alérgica estacional", "Rinitis alérgica. Sensibilización a ácaros.",
    [["Loratadina","5mg"],["Fluticasona nasal","50mcg"]]),

  // TRAUMATOLOGÍA
  mk(ibanez, trauma, "2023-05-18", "Traumatología", "Dolor crónico cadera izquierda", "Coxartrosis grado I-II cadera izquierda.",
    [["Meloxicam","15mg"],["Omeprazol","20mg"]]),
  mk(castro, trauma, "2023-07-04", "Traumatología", "Dolor rodilla tras entrenamiento", "Tendinitis rotuliana derecha.",
    [["Diclofenac","75mg"],["Pantoprazol","40mg"]]),
  mk(vargas, trauma, "2023-09-19", "Traumatología", "Lumbalgia crónica exacerbada", "Espondiloartrosis L4-L5 con lumbalgia crónica.",
    [["Pregabalina","75mg"],["Diclofenac","75mg"]]),
  mk(ibanez, trauma, "2023-11-28", "Traumatología", "Control cadera. Kinesioterapia completada.", "Coxartrosis estable. Movilidad funcional conservada.",
    [["Condroitín + Glucosamina","400mg/500mg"],["Meloxicam","7.5mg"]]),

  // CLÍNICA MÉDICA
  mk(benitez, clinica, "2023-04-25", "Clínica Médica", "Control semestral diabetes e hipotiroidismo", "DBT2 con HbA1c 7.2%. TSH compensado.",
    [["Metformina","850mg"],["Levotiroxina","50mcg"],["Atorvastatina","20mg"]]),
  mk(alvarez, clinica, "2023-06-20", "Clínica Médica", "Chequeo anual corporativo", "HTA controlada. Anemia ferropénica leve.",
    [["Enalapril","10mg"],["Sulfato ferroso","325mg"],["Vitamina C","500mg"]]),
  mk(benitez, clinica, "2023-09-05", "Clínica Médica", "Control trimestral diabetes", "DBT2. Glucemia en descenso. HbA1c 6.9%.",
    [["Metformina","1000mg"],["Levotiroxina","50mcg"]]),
  mk(cabrera, clinica, "2023-10-11", "Clínica Médica", "Brote de colitis ulcerosa. Sangre en heces.", "Colitis ulcerosa en actividad moderada.",
    [["Mesalazina","2g"],["Prednisona","40mg"]]),
  mk(benitez, clinica, "2023-12-07", "Clínica Médica", "Control semestral", "DBT2 con buen control. HbA1c 6.7%.",
    [["Metformina","850mg"],["Levotiroxina","50mcg"],["Atorvastatina","20mg"]]),

  // NEUROLOGÍA
  mk(herrera, neuro, "2023-04-17", "Neurología", "Control epilepsia. Inicio del tratamiento.", "Epilepsia focal. Inicia antiepiléptico.",
    [["Carbamazepina","200mg"]]),
  mk(herrera, neuro, "2023-07-12", "Neurología", "Control. 1 crisis en el mes.", "Epilepsia focal. Ajuste de dosis.",
    [["Carbamazepina","400mg"]]),
  mk(diaz, neuro, "2023-08-30", "Neurología", "Cefalea hemicraneal 3 veces por semana", "Migraña episódica sin aura.",
    [["Topiramato","25mg"],["Sumatriptán","50mg"]]),
  mk(herrera, neuro, "2023-10-18", "Neurología", "Control. Sin crisis últimos 2 meses.", "Epilepsia focal bien controlada.",
    [["Carbamazepina","400mg"]]),
  mk(diaz, neuro, "2023-12-14", "Neurología", "Control migraña. Mejora con Topiramato.", "Migraña episódica. Reducción de crisis a 1/mes.",
    [["Topiramato","50mg"],["Sumatriptán","50mg"]]),

  // DERMATOLOGÍA
  mk(ortega, dermato, "2023-06-07", "Dermatología", "Lesiones eritematosas descamativas en cuero cabelludo", "Psoriasis en placas leve.",
    [["Betametasona crema","0.05%"],["Champú ketoconazol","2%"]]),
  mk(morales, dermato, "2023-09-22", "Dermatología", "Acné vulgaris severo con cicatrices", "Acné nódulo-quístico severo.",
    [["Isotretinoína","20mg"]]),

  // GINECOLOGÍA
  mk(morales, gineco, "2023-05-24", "Ginecología", "Irregularidad menstrual e hirsutismo", "Síndrome de ovario poliquístico.",
    [["Anticonceptivos orales combinados","30mcg EE"],["Espironolactona","100mg"]]),
  mk(quiroga, gineco, "2023-07-28", "Ginecología", "Control anual. PAP.", "Control ginecológico normal. PAP NILM.",
    []),

  // OFTALMOLOGÍA
  mk(nunez, oftalmo, "2023-06-01", "Oftalmología", "Control anual retinopatía diabética", "Retinopatía diabética no proliferativa leve OI.",
    []),
  mk(sosa, oftalmo, "2023-09-14", "Oftalmología", "Control glaucoma. PIO elevada.", "Glaucoma primario ángulo abierto. PIO 24 OI.",
    [["Latanoprost colirio","0.005%"],["Timolol colirio","0.5%"]]),

  // UROLOGÍA
  mk(paredes, uro, "2023-07-20", "Urología", "Dificultad miccional y nicturia", "Hiperplasia prostática benigna leve-moderada.",
    [["Tamsulosina","0.4mg"]]),

  // ENDOCRINOLOGÍA
  mk(nunez, endocrino, "2023-08-16", "Endocrinología", "Control diabetes tipo 2 y retinopatía", "DBT2. HbA1c 8.2%. Ajuste insulina.",
    [["Insulina Glargina","24UI"],["Metformina","1000mg"]]),
  mk(torres, endocrino, "2023-11-09", "Endocrinología", "Hipotiroidismo y obesidad. Evaluación", "Hipotiroidismo primario. Obesidad grado II. Resistencia insulínica.",
    [["Levotiroxina","100mcg"],["Metformina","500mg"]]),

  // ═══════════════════════════════════════════════════════════════════════
  // 2024 — ENERO a DICIEMBRE
  // ═══════════════════════════════════════════════════════════════════════

  // CARDIOLOGÍA
  mk(diaz, cardio, "2024-01-16", "Cardiología", "Control IC. Ecos estable.", "IC CF II. FE 44%.",
    [["Bisoprolol","5mg"],["Furosemida","40mg"],["Warfarina","5mg"],["Espironolactona","25mg"]]),
  mk(alvarez, cardio, "2024-02-08", "Cardiología", "Control HTA semestral", "HTA controlada. Sin cambios.",
    [["Enalapril","10mg"],["Hidroclorotiazida","25mg"]]),
  mk(diaz, cardio, "2024-04-22", "Cardiología", "Control trimestral IC. Edemas.", "IC CF II. Edemas por incumplimiento dietético.",
    [["Bisoprolol","5mg"],["Furosemida","80mg"],["Warfarina","5mg"],["Espironolactona","25mg"]]),
  mk(blanco, cardio, "2024-05-14", "Cardiología", "Evaluación pre-quirúrgica por biopsia", "Apta para cirugía. Sin cardiopatía.",
    []),
  mk(diaz, cardio, "2024-07-30", "Cardiología", "Control IC. Mejora con nueva dosis.", "IC CF II compensada. FE 47%.",
    [["Bisoprolol","7.5mg"],["Furosemida","40mg"],["Warfarina","5mg"],["Espironolactona","25mg"]]),
  mk(ibanez, cardio, "2024-08-12", "Cardiología", "Palpitaciones. Holter previo normal.", "Sin arritmia documentada. Palpitaciones funcionales.",
    []),
  mk(diaz, cardio, "2024-10-08", "Cardiología", "Control trimestral IC", "IC CF II estable. FE 47%.",
    [["Bisoprolol","7.5mg"],["Furosemida","40mg"],["Warfarina","5mg"],["Espironolactona","25mg"]]),
  mk(alvarez, cardio, "2024-11-19", "Cardiología", "Control HTA semestral", "HTA bien controlada. Perfil lipídico normal.",
    [["Enalapril","10mg"],["Hidroclorotiazida","25mg"],["Atorvastatina","20mg"]]),
  mk(diaz, cardio, "2024-12-17", "Cardiología", "Control IC fin de año", "IC CF I-II. Mejor clase funcional. FE 50%.",
    [["Bisoprolol","5mg"],["Furosemida","40mg"],["Warfarina","5mg"],["Espironolactona","25mg"]]),

  // PEDIATRÍA
  mk(garcia, pedi, "2024-01-24", "Pediatría", "Fiebre alta y erupción", "Escarlatina. Test estreptococo positivo.",
    [["Amoxicilina","500mg"],["Ibuprofeno","200mg"]]),
  mk(jimenez, pedi, "2024-03-06", "Pediatría", "Control 5 años y vacunas", "Niña sana. Vacuna quíntuple aplicada.",
    [["Vitamina D","400UI"]]),
  mk(garcia, pedi, "2024-04-18", "Pediatría", "Dolor abdominal recurrente", "Estreñimiento funcional.",
    [["Lactulosa","3.3g/5ml"],["Fibra soluble","5g"]]),
  mk(acosta, pedi, "2024-06-05", "Pediatría", "Control preventivo. Alergia a mariscos confirmada.", "Alergia alimentaria documentada.",
    [["Loratadina","10mg"]]),
  mk(rios, pedi, "2024-07-11", "Pediatría", "Traumatismo codo derecho tras caída", "Fractura de codo derecho. Sin desplazamiento.",
    [["Ibuprofeno","400mg"]]),
  mk(jimenez, pedi, "2024-08-27", "Pediatría", "Diarrea aguda 3 días. Sin fiebre.", "Gastroenteritis viral leve.",
    [["Suero oral","a demanda"],["Zinc","20mg"]]),
  mk(garcia, pedi, "2024-10-15", "Pediatría", "Control anual 14 años", "Desarrollo puberal normal. Sin hallazgos.",
    []),
  mk(acosta, pedi, "2024-11-28", "Pediatría", "Tos persistente 3 semanas. No cede con antibiótico.", "Posible asma bronquial. Derivar a neumonología.",
    [["Salbutamol","2 puffs"]]),
  mk(rios, pedi, "2024-12-10", "Pediatría", "Anginas recurrentes. 4to episodio en 1 año.", "Amigdalitis de repetición. Valorar amigdalectomía.",
    [["Amoxicilina","500mg"],["Ibuprofeno","400mg"]]),

  // TRAUMATOLOGÍA
  mk(ibanez, trauma, "2024-02-20", "Traumatología", "Control cadera. Dolor intensificado en invierno.", "Coxartrosis progresiva. Grado II-III.",
    [["Meloxicam","15mg"],["Omeprazol","20mg"],["Condroitín + Glucosamina","400mg/500mg"]]),
  mk(vargas, trauma, "2024-04-03", "Traumatología", "Lumbalgia aguda. Crisis tras esfuerzo.", "Lumbalgia aguda sobre crónica. Contractura paravertebral.",
    [["Diclofenac","75mg"],["Ciclobenzaprina","5mg"],["Pantoprazol","40mg"]]),
  mk(castro, trauma, "2024-05-22", "Traumatología", "Esguince tobillo izquierdo jugando al fútbol", "Esguince LLE tobillo izquierdo grado II.",
    [["Diclofenac","75mg"],["Pantoprazol","40mg"]]),
  mk(ibanez, trauma, "2024-07-16", "Traumatología", "Control cadera. Evaluar cirugía.", "Coxartrosis grado III. En lista de espera prótesis.",
    [["Tramadol","50mg"],["Omeprazol","20mg"]]),
  mk(vargas, trauma, "2024-09-25", "Traumatología", "Lumbalgia crónica. Control semestral.", "Espondiloartrosis L3-L4-L5. Control.",
    [["Pregabalina","75mg"],["Meloxicam","7.5mg"]]),
  mk(castro, trauma, "2024-12-03", "Traumatología", "Dolor rodilla derecha post-maratón", "Síndrome de la banda iliotibial derecha.",
    [["Naproxeno","500mg"],["Omeprazol","20mg"]]),

  // CLÍNICA MÉDICA
  mk(benitez, clinica, "2024-01-30", "Clínica Médica", "Control semestral. Paciente refiere bienestar.", "DBT2 controlada. HbA1c 6.5%. Tiroides estable.",
    [["Metformina","850mg"],["Levotiroxina","50mcg"],["Atorvastatina","20mg"]]),
  mk(alvarez, clinica, "2024-03-14", "Clínica Médica", "Cansancio y disnea leve de esfuerzo", "Anemia ferropénica moderada. Descartar pérdida oculta.",
    [["Sulfato ferroso","325mg"],["Vitamina C","500mg"]]),
  mk(cabrera, clinica, "2024-04-26", "Clínica Médica", "Control colitis. Remisión clínica.", "Colitis ulcerosa en remisión con mesalazina.",
    [["Mesalazina","1g"]]),
  mk(benitez, clinica, "2024-06-18", "Clínica Médica", "Control trimestral diabetes", "DBT2. HbA1c 6.4%. Excelente control.",
    [["Metformina","850mg"],["Levotiroxina","50mcg"]]),
  mk(torres, clinica, "2024-07-09", "Clínica Médica", "Chequeo anual. Aumento de peso.", "Obesidad grado III (IMC 36). Esteatosis hepática.",
    [["Levotiroxina","100mcg"],["Orlistat","120mg"]]),
  mk(benitez, clinica, "2024-09-11", "Clínica Médica", "Control. Paciente refiere mareos.", "DBT2 compensada. Hipotensión ortostática leve.",
    [["Metformina","850mg"],["Levotiroxina","75mcg"]]),
  mk(alvarez, clinica, "2024-10-30", "Clínica Médica", "Control HTA y anemia", "HTA controlada. Anemia en resolución.",
    [["Enalapril","10mg"],["Sulfato ferroso","325mg"]]),
  mk(benitez, clinica, "2024-12-04", "Clínica Médica", "Control fin de año", "DBT2. HbA1c 6.6%. Tiroides compensado.",
    [["Metformina","850mg"],["Levotiroxina","75mcg"],["Atorvastatina","20mg"]]),

  // NEUROLOGÍA
  mk(herrera, neuro, "2024-01-09", "Neurología", "Control epilepsia. Sin crisis 4 meses.", "Epilepsia focal bien controlada. Nivel CB terapéutico.",
    [["Carbamazepina","400mg"]]),
  mk(diaz, neuro, "2024-02-27", "Neurología", "Migraña con mayor frecuencia. 2 crisis/semana.", "Migraña crónica. Escalar profilaxis.",
    [["Topiramato","100mg"],["Sumatriptán","50mg"],["Amitriptilina","25mg"]]),
  mk(herrera, neuro, "2024-04-16", "Neurología", "Control epilepsia. 1 crisis por cambio de turno.", "Epilepsia focal. Refuerzo de higiene del sueño.",
    [["Carbamazepina","400mg"],["Levetiracetam","500mg"]]),
  mk(diaz, neuro, "2024-06-12", "Neurología", "Migraña. Control con nueva medicación.", "Migraña crónica en mejoría. 4 crisis/mes.",
    [["Topiramato","100mg"],["Sumatriptán","100mg"]]),
  mk(herrera, neuro, "2024-08-21", "Neurología", "Control epilepsia. Sin crisis 4 meses.", "Epilepsia focal controlada con doble esquema.",
    [["Carbamazepina","400mg"],["Levetiracetam","500mg"]]),
  mk(diaz, neuro, "2024-10-07", "Neurología", "Migraña. Buena respuesta preventiva.", "Migraña episódica. 1 crisis/mes.",
    [["Topiramato","75mg"],["Sumatriptán","50mg"]]),
  mk(herrera, neuro, "2024-12-11", "Neurología", "Control anual epilepsia", "Epilepsia focal en remisión clínica. 8 meses sin crisis.",
    [["Carbamazepina","400mg"],["Levetiracetam","500mg"]]),

  // DERMATOLOGÍA
  mk(ortega, dermato, "2024-02-13", "Dermatología", "Control psoriasis. Brote moderado.", "Psoriasis en placas moderada. PASI 14.",
    [["Betametasona crema","0.05%"],["Alquitrán crema","5%"]]),
  mk(morales, dermato, "2024-04-09", "Dermatología", "Control acné. Mejora parcial.", "Acné vulgaris en regresión. 4° mes de Isotretinoína.",
    [["Isotretinoína","30mg"]]),
  mk(blanco, dermato, "2024-06-25", "Dermatología", "Control lunares. Biopsia positiva para nevus atípico.", "Nevus displásico moderado. Extirpado.",
    []),
  mk(ortega, dermato, "2024-09-03", "Dermatología", "Recaída psoriasis cuero cabelludo.", "Psoriasis seborreica. Tratamiento localizado.",
    [["Champú ketoconazol","2%"],["Clobetasol loción","0.05%"]]),
  mk(morales, dermato, "2024-11-19", "Dermatología", "Alta Isotretinoína. Control piel.", "Acné resuelto. Cicatrices residuales leves.",
    []),

  // GINECOLOGÍA
  mk(morales, gineco, "2024-01-22", "Ginecología", "Control SOP. Ciclos regulares con ACO.", "SOP compensado. Buena respuesta al tratamiento.",
    [["Anticonceptivos orales combinados","30mcg EE"]]),
  mk(quiroga, gineco, "2024-03-19", "Ginecología", "Control anual. Sofocos y sudoración nocturna.", "Perimenopausia. Inicio síndrome climatérico.",
    [["Estradiol gel transdérmico","0.5mg"]]),
  mk(blanco, gineco, "2024-05-07", "Ginecología", "Control menopausia. TRH 6 meses.", "Síndrome climatérico en mejoría con TRH.",
    [["Estradiol gel transdérmico","0.5mg"],["Progesterona micronizada","200mg"]]),
  mk(morales, gineco, "2024-07-31", "Ginecología", "PAP anual y ecografía transvaginal", "Control ginecológico normal. PAP NILM.",
    []),
  mk(quiroga, gineco, "2024-10-23", "Ginecología", "Control perimenopausia. Sangrado irregular.", "Perimenopausia con metrorragia funcional. Ecografía normal.",
    [["Progesterona micronizada","200mg"],["Ácido tranexámico","500mg"]]),

  // OFTALMOLOGÍA
  mk(nunez, oftalmo, "2024-02-06", "Oftalmología", "Control retinopatía diabética semestral", "RD no proliferativa moderada OI. Progresión.",
    []),
  mk(sosa, oftalmo, "2024-04-30", "Oftalmología", "Control glaucoma. Campo visual", "Glaucoma estabilizado. PIO 18/18.",
    [["Latanoprost colirio","0.005%"],["Timolol colirio","0.5%"]]),
  mk(nunez, oftalmo, "2024-08-14", "Oftalmología", "Control RD post-fotocoagulación", "RD no proliferativa leve OI post-láser. Buen resultado.",
    []),
  mk(sosa, oftalmo, "2024-11-06", "Oftalmología", "Control glaucoma. Queja de visión borrosa AM.", "Glaucoma. PIO estable. Ajuste lágrimas artificiales.",
    [["Latanoprost colirio","0.005%"],["Hialuronato sódico","0.18%"]]),

  // UROLOGÍA
  mk(paredes, uro, "2024-01-17", "Urología", "Control HPB. Mejora con Tamsulosina.", "HPB. PSA 3.2. Flujo mejorado. IPSS 10.",
    [["Tamsulosina","0.4mg"],["Dutasterida","0.5mg"]]),
  mk(paredes, uro, "2024-06-11", "Urología", "Control HPB semestral", "HPB estable. PSA 2.8. IPSS 8.",
    [["Tamsulosina","0.4mg"],["Dutasterida","0.5mg"]]),
  mk(paredes, uro, "2024-11-27", "Urología", "Control anual HPB", "HPB bien controlada. PSA 2.5.",
    [["Tamsulosina","0.4mg"],["Dutasterida","0.5mg"]]),

  // ENDOCRINOLOGÍA
  mk(nunez, endocrino, "2024-03-05", "Endocrinología", "Control DBT2. Ajuste insulina.", "DBT2 con HbA1c 7.8%. Insulina basal ajustada.",
    [["Insulina Glargina","28UI"],["Metformina","1000mg"]]),
  mk(benitez, endocrino, "2024-06-27", "Endocrinología", "Control DBT2 y tiroides por endocrino", "DBT2 bien controlada. HbA1c 6.5%.",
    [["Metformina","850mg"],["Levotiroxina","75mcg"]]),
  mk(quiroga, endocrino, "2024-08-07", "Endocrinología", "Hipotiroidismo. Ajuste dosis Levotiroxina.", "Hipotiroidismo primario. TSH 6.8. Ajuste dosis.",
    [["Levotiroxina","100mcg"],["Sertralina","50mg"]]),
  mk(torres, endocrino, "2024-10-16", "Endocrinología", "Obesidad e hipotiroidismo. Control.", "Hipotiroidismo compensado. Obesidad grado II. Plan nutricional.",
    [["Levotiroxina","100mcg"],["Orlistat","120mg"]]),
  mk(nunez, endocrino, "2024-12-18", "Endocrinología", "Control DBT2 fin de año", "DBT2. HbA1c 7.2%. Sin microangiopatía nueva.",
    [["Insulina Glargina","26UI"],["Metformina","1000mg"]]),

  // CANCELADAS 2024
  mk(garcia, pedi, "2024-02-14", "Pediatría", "Control preventivo", "", [], "cancelada", "Canceló por enfermedad"),
  mk(ibanez, cardio, "2024-09-20", "Cardiología", "Control semestral", "", [], "cancelada", "No concurrió"),

  // ═══════════════════════════════════════════════════════════════════════
  // 2025 — ENERO a DICIEMBRE
  // ═══════════════════════════════════════════════════════════════════════

  // CARDIOLOGÍA
  mk(diaz, cardio, "2025-01-14", "Cardiología", "Control IC primer mes del año", "IC CF II. FE 50%. Mejor función sistólica.",
    [["Bisoprolol","5mg"],["Furosemida","40mg"],["Warfarina","5mg"],["Espironolactona","25mg"]]),
  mk(alvarez, cardio, "2025-02-18", "Cardiología", "Control HTA. Nueva medicación.", "HTA. Agrega ARAII por tos con IECA.",
    [["Losartán","50mg"],["Hidroclorotiazida","25mg"],["Atorvastatina","20mg"]]),
  mk(diaz, cardio, "2025-04-08", "Cardiología", "Control trimestral IC. Estable.", "IC CF I-II. FE 52%. Gran mejoría.",
    [["Bisoprolol","5mg"],["Furosemida","40mg"],["Warfarina","5mg"],["Espironolactona","25mg"]]),
  mk(blanco, cardio, "2025-05-06", "Cardiología", "Dolor torácico atípico", "Síndrome de Tietze. Costocondritis.",
    [["Ibuprofeno","400mg"],["Omeprazol","20mg"]]),
  mk(ibanez, cardio, "2025-06-17", "Cardiología", "Pre-operatorio prótesis cadera", "Riesgo quirúrgico bajo. Apto para cirugía.",
    []),
  mk(diaz, cardio, "2025-07-22", "Cardiología", "Control trimestral IC", "IC CF I. FE 54%. En límite normal.",
    [["Bisoprolol","2.5mg"],["Furosemida","40mg"],["Warfarina","5mg"],["Espironolactona","25mg"]]),
  mk(alvarez, cardio, "2025-09-10", "Cardiología", "Control HTA semestral", "HTA controlada con Losartán. PA 120/75.",
    [["Losartán","50mg"],["Atorvastatina","20mg"]]),
  mk(diaz, cardio, "2025-10-29", "Cardiología", "Control IC. Leve descompensación.", "IC CF II. Brote por infección urinaria intercurrente.",
    [["Bisoprolol","5mg"],["Furosemida","60mg"],["Warfarina","5mg"],["Espironolactona","25mg"],["Amoxicilina","500mg"]]),
  mk(diaz, cardio, "2025-12-16", "Cardiología", "Control IC fin de año", "IC CF I-II estable. FE 53%.",
    [["Bisoprolol","5mg"],["Furosemida","40mg"],["Warfarina","5mg"],["Espironolactona","25mg"]]),

  // PEDIATRÍA
  mk(garcia, pedi, "2025-01-29", "Pediatría", "Fiebre y tos productiva 5 días", "Neumonía lobar derecha.",
    [["Amoxicilina","1g"],["Ibuprofeno","400mg"],["Azitromicina","500mg"]]),
  mk(jimenez, pedi, "2025-03-04", "Pediatría", "Control 6 años sano", "Desarrollo normal. Peso y talla en percentil 50.",
    [["Vitamina D","400UI"]]),
  mk(acosta, pedi, "2025-04-23", "Pediatría", "Asma bronquial. Primera crisis severa.", "Asma bronquial moderada.",
    [["Salbutamol","2 puffs"],["Budesonida","200mcg"],["Montelukast","5mg"]]),
  mk(rios, pedi, "2025-05-15", "Pediatría", "Alergia cutánea. Urticaria generalizada.", "Urticaria aguda. Alergia alimentaria no identificada.",
    [["Loratadina","10mg"],["Betametasona","0.1mg/kg"]]),
  mk(garcia, pedi, "2025-07-08", "Pediatría", "Control 15 años. Escoliosis leve.", "Escoliosis idiopática grado I. Derivar a ortopedia.",
    []),
  mk(jimenez, pedi, "2025-08-19", "Pediatría", "Infección urinaria. Disuria y polaquiuria.", "ITU baja. Cultivo positivo E. coli.",
    [["Nitrofurantoína","100mg"],["Ibuprofeno","200mg"]]),
  mk(acosta, pedi, "2025-09-30", "Pediatría", "Control asma. Buena respuesta.", "Asma bronquial controlada.",
    [["Budesonida","100mcg"],["Salbutamol","2 puffs"]]),
  mk(rios, pedi, "2025-11-11", "Pediatría", "Varicela. Fiebre 38°C y vesículas.", "Varicela sin complicaciones.",
    [["Loratadina","5mg"],["Paracetamol","500mg"]]),
  mk(garcia, pedi, "2025-12-22", "Pediatría", "Amigdalitis purulenta", "Amigdalitis bacteriana. Test estreptococo positivo.",
    [["Amoxicilina","1g"],["Ibuprofeno","400mg"]]),

  // TRAUMATOLOGÍA
  mk(ibanez, trauma, "2025-02-11", "Traumatología", "Post-operatorio prótesis cadera izquierda", "Artroplastia total cadera izquierda. Evolución favorable.",
    [["Enoxaparina","40mg"],["Ibuprofeno","400mg"],["Omeprazol","20mg"]]),
  mk(vargas, trauma, "2025-03-26", "Traumatología", "Lumbalgia. Pide nuevo tratamiento.", "Espondiloartrosis avanzada. Infiltración facetaria.",
    [["Pregabalina","150mg"],["Duloxetina","30mg"]]),
  mk(castro, trauma, "2025-05-20", "Traumatología", "Hombro doloroso derecho. Limitación movimiento.", "Tendinitis manguito rotador hombro derecho.",
    [["Diclofenac","75mg"],["Pantoprazol","40mg"]]),
  mk(ibanez, trauma, "2025-07-15", "Traumatología", "Control a 6 meses de cirugía", "Prótesis cadera funcional. Sin complicaciones.",
    []),
  mk(vargas, trauma, "2025-10-07", "Traumatología", "Control lumbalgia. Refiere mejoría parcial.", "Lumbalgia crónica en tratamiento multimodal.",
    [["Pregabalina","75mg"],["Duloxetina","30mg"]]),
  mk(castro, trauma, "2025-12-09", "Traumatología", "Lesión meniscal rodilla izquierda. RMN.", "Rotura parcial menisco interno rodilla izquierda.",
    [["Diclofenac","75mg"],["Pantoprazol","40mg"]]),

  // CLÍNICA MÉDICA
  mk(benitez, clinica, "2025-01-08", "Clínica Médica", "Control semestral. Excelente control.", "DBT2 controlada. HbA1c 6.3%. Tiroides estable.",
    [["Metformina","850mg"],["Levotiroxina","75mcg"],["Atorvastatina","20mg"]]),
  mk(alvarez, clinica, "2025-02-25", "Clínica Médica", "Control HTA y anemia", "HTA controlada. Anemia resuelta.",
    [["Losartán","50mg"],["Atorvastatina","20mg"]]),
  mk(cabrera, clinica, "2025-04-01", "Clínica Médica", "Brote moderado colitis", "Colitis ulcerosa brote moderado. Ajuste terapia.",
    [["Mesalazina","3g"],["Prednisona","30mg"],["Azatioprina","100mg"]]),
  mk(benitez, clinica, "2025-05-22", "Clínica Médica", "Control. Paciente refiere mucho bienestar.", "DBT2. HbA1c 6.2%. Mejor resultado hasta la fecha.",
    [["Metformina","850mg"],["Levotiroxina","75mcg"]]),
  mk(torres, clinica, "2025-06-10", "Clínica Médica", "Chequeo corporativo. Cambio de trabajo.", "Obesidad grado II. IMC 33. Perfil lipídico alterado.",
    [["Atorvastatina","40mg"],["Levotiroxina","100mcg"]]),
  mk(benitez, clinica, "2025-08-12", "Clínica Médica", "Control trimestral", "DBT2 controlada. Continúa estable.",
    [["Metformina","850mg"],["Levotiroxina","75mcg"],["Atorvastatina","20mg"]]),
  mk(cabrera, clinica, "2025-09-16", "Clínica Médica", "Remisión colitis. Control.", "Colitis ulcerosa en remisión completa con Azatioprina.",
    [["Mesalazina","1g"],["Azatioprina","100mg"]]),
  mk(alvarez, clinica, "2025-10-28", "Clínica Médica", "Chequeo anual completo", "Buen estado general. HTA controlada. Sin hallazgos.",
    [["Losartán","50mg"],["Atorvastatina","20mg"]]),
  mk(benitez, clinica, "2025-12-03", "Clínica Médica", "Control fin de año", "DBT2. HbA1c 6.4%. Excelente adherencia.",
    [["Metformina","850mg"],["Levotiroxina","75mcg"],["Atorvastatina","20mg"]]),

  // NEUROLOGÍA
  mk(herrera, neuro, "2025-01-21", "Neurología", "Control. Sin crisis en 6 meses.", "Epilepsia focal en remisión.",
    [["Carbamazepina","400mg"],["Levetiracetam","500mg"]]),
  mk(diaz, neuro, "2025-03-11", "Neurología", "Migraña controlada. Reducción dosis profiláctica.", "Migraña episódica 1 crisis/mes. Reducción profilaxis.",
    [["Topiramato","50mg"],["Sumatriptán","50mg"]]),
  mk(herrera, neuro, "2025-05-07", "Neurología", "Control. 1 crisis aislada por falta de sueño.", "Epilepsia focal. Crisis gatillada por privación de sueño.",
    [["Carbamazepina","400mg"],["Levetiracetam","750mg"]]),
  mk(diaz, neuro, "2025-07-03", "Neurología", "Migraña. Sin cambios. Mantener tratamiento.", "Migraña crónica estable. 2 crisis/mes.",
    [["Topiramato","75mg"],["Sumatriptán","50mg"]]),
  mk(herrera, neuro, "2025-09-02", "Neurología", "Control semestral epilepsia", "Epilepsia focal controlada. Niveles CB terapéuticos.",
    [["Carbamazepina","400mg"],["Levetiracetam","750mg"]]),
  mk(diaz, neuro, "2025-11-05", "Neurología", "Migraña. Empeoramiento por estrés.", "Migraña crónica con aura. Agrega tratamiento coadyuvante.",
    [["Topiramato","100mg"],["Sumatriptán","100mg"],["Propranolol","40mg"]]),
  mk(herrera, neuro, "2025-12-10", "Neurología", "Control anual epilepsia", "Epilepsia focal. 10 meses sin crisis.",
    [["Carbamazepina","400mg"],["Levetiracetam","750mg"]]),

  // DERMATOLOGÍA
  mk(ortega, dermato, "2025-02-04", "Dermatología", "Psoriasis generalizada. Peor evolución.", "Psoriasis moderada-severa. PASI 18. Candidata biológicos.",
    [["Apremilast","30mg"]]),
  mk(morales, dermato, "2025-04-17", "Dermatología", "Roncha pruriginosa en cara. Sospecha acné quístico.", "Acné quístico recidivante.",
    [["Isotretinoína","20mg"]]),
  mk(blanco, dermato, "2025-06-24", "Dermatología", "Control lunares anual. Sin nuevas lesiones.", "Sin lesiones sospechosas. Continúa seguimiento.",
    []),
  mk(ortega, dermato, "2025-09-11", "Dermatología", "Control Apremilast. Mejoría notable.", "Psoriasis en buena respuesta. PASI 8.",
    [["Apremilast","30mg"]]),
  mk(morales, dermato, "2025-11-28", "Dermatología", "Acné. Control. Sin mejora suficiente.", "Acné quístico. Ajuste a dosis mayor Isotretinoína.",
    [["Isotretinoína","40mg"]]),

  // GINECOLOGÍA
  mk(morales, gineco, "2025-01-16", "Ginecología", "Control SOP. Desea embarazo.", "SOP. Suspende ACO para inducción ovulación.",
    [["Ácido fólico","5mg"],["Clomifeno","50mg"]]),
  mk(quiroga, gineco, "2025-03-20", "Ginecología", "Menopausia. Control TRH anual.", "Menopausia. TRH bien tolerada. Mamografía normal.",
    [["Estradiol gel transdérmico","0.5mg"],["Progesterona micronizada","200mg"]]),
  mk(blanco, gineco, "2025-05-29", "Ginecología", "Control anual. PAP.", "Control ginecológico normal. PAP NILM.",
    []),
  mk(morales, gineco, "2025-08-07", "Ginecología", "Embarazo 8 semanas. Primera consulta.", "Gestación 8 semanas. Control prenatal normal.",
    [["Ácido fólico","5mg"],["Hierro polimaltosado","100mg"]]),
  mk(quiroga, gineco, "2025-11-13", "Ginecología", "Control menopausia. Buena calidad de vida.", "Menopausia bien compensada. Mantener TRH.",
    [["Estradiol gel transdérmico","0.5mg"],["Progesterona micronizada","200mg"]]),

  // OFTALMOLOGÍA
  mk(nunez, oftalmo, "2025-02-19", "Oftalmología", "Control RD semestral. Sin progresión.", "RD no proliferativa leve bilateral. Estable.",
    []),
  mk(sosa, oftalmo, "2025-05-13", "Oftalmología", "Control glaucoma. Campo visual estable.", "Glaucoma primario ángulo abierto estabilizado.",
    [["Latanoprost colirio","0.005%"],["Timolol colirio","0.5%"]]),
  mk(nunez, oftalmo, "2025-08-26", "Oftalmología", "Baja de agudeza visual OD. Urgente.", "Catarata nuclear OD incipiente. Programar cirugía.",
    []),
  mk(sosa, oftalmo, "2025-11-04", "Oftalmología", "Control glaucoma. PIO 20 OI.", "Glaucoma. Ajuste de colirio por PIO en límite.",
    [["Latanoprost colirio","0.005%"],["Brimonidina colirio","0.15%"]]),

  // UROLOGÍA
  mk(paredes, uro, "2025-03-06", "Urología", "Control HPB semestral", "HPB estable. PSA 2.2. Flujo conservado.",
    [["Tamsulosina","0.4mg"],["Dutasterida","0.5mg"]]),
  mk(paredes, uro, "2025-09-18", "Urología", "Control HPB. Episodio retención urinaria.", "HPB con episodio retención aguda resuelto. Sin cirugía.",
    [["Tamsulosina","0.4mg"],["Dutasterida","0.5mg"]]),

  // ENDOCRINOLOGÍA
  mk(nunez, endocrino, "2025-01-28", "Endocrinología", "DBT2. Control semestral insulina.", "DBT2. HbA1c 7.0%. Ajuste basal.",
    [["Insulina Glargina","30UI"],["Metformina","1000mg"]]),
  mk(benitez, endocrino, "2025-04-15", "Endocrinología", "Control DBT2 por endocrino", "DBT2 compensada. Sin microangiopatía.",
    [["Metformina","850mg"]]),
  mk(torres, endocrino, "2025-06-24", "Endocrinología", "Hipotiroidismo. Control semestral.", "Hipotiroidismo compensado. TSH 2.2.",
    [["Levotiroxina","100mcg"]]),
  mk(quiroga, endocrino, "2025-08-29", "Endocrinología", "Hipotiroidismo. Embarazo descartado. Control.", "Hipotiroidismo. Ajuste Levotiroxina.",
    [["Levotiroxina","112mcg"],["Sertralina","50mg"]]),
  mk(nunez, endocrino, "2025-10-21", "Endocrinología", "DBT2. Revisión con nuevo sensor glucosa.", "DBT2. HbA1c 6.9%. Buen monitoreo con sensor.",
    [["Insulina Glargina","28UI"],["Metformina","1000mg"]]),

  // CANCELADAS 2025
  mk(benitez, clinica, "2025-07-10", "Clínica Médica", "Control trimestral", "", [], "cancelada", "Paciente viajando"),
  mk(herrera, neuro, "2025-11-20", "Neurología", "Control epilepsia", "", [], "cancelada", "Canceló sin aviso"),
  mk(paredes, uro, "2025-06-05", "Urología", "Control HPB", "", [], "cancelada", "Canceló por viaje"),

  // ═══════════════════════════════════════════════════════════════════════
  // 2026 — ENERO a 16 DE ABRIL
  // ═══════════════════════════════════════════════════════════════════════

  // CARDIOLOGÍA
  mk(diaz, cardio, "2026-01-13", "Cardiología", "Control IC enero", "IC CF I-II. FE 53%. Estable.",
    [["Bisoprolol","5mg"],["Furosemida","40mg"],["Warfarina","5mg"],["Espironolactona","25mg"]]),
  mk(alvarez, cardio, "2026-02-11", "Cardiología", "Control HTA. Cefalea frecuente.", "HTA levemente descontrolada. Ajuste medicación.",
    [["Losartán","100mg"],["Amlodipina","5mg"],["Atorvastatina","20mg"]]),
  mk(diaz, cardio, "2026-03-17", "Cardiología", "Control trimestral IC", "IC CF I. FE 55%. Mejor control funcional.",
    [["Bisoprolol","5mg"],["Furosemida","40mg"],["Warfarina","5mg"],["Espironolactona","25mg"]]),

  // PEDIATRÍA
  mk(garcia, pedi, "2026-01-20", "Pediatría", "Fiebre y faringitis. Cultivo.", "Faringoamigdalitis bacteriana.",
    [["Amoxicilina","1g"],["Ibuprofeno","400mg"]]),
  mk(jimenez, pedi, "2026-02-24", "Pediatría", "Control 7 años sano", "Desarrollo normal. Vacunas al día.",
    [["Vitamina D","400UI"]]),
  mk(acosta, pedi, "2026-03-10", "Pediatría", "Control asma. Crisis leves ocasionales.", "Asma bronquial leve intermitente.",
    [["Salbutamol","2 puffs"],["Budesonida","100mcg"]]),

  // TRAUMATOLOGÍA
  mk(ibanez, trauma, "2026-01-08", "Traumatología", "Control anual prótesis cadera", "Prótesis cadera estable. Sin signos de aflojamiento.",
    []),
  mk(vargas, trauma, "2026-02-19", "Traumatología", "Lumbalgia. Solicita nueva infiltración.", "Espondiloartrosis. Infiltración facetaria indicada.",
    [["Pregabalina","75mg"]]),
  mk(castro, trauma, "2026-03-25", "Traumatología", "Post-artroscopía rodilla izquierda. Control.", "Menisco interno reparado. Buena evolución.",
    [["Ibuprofeno","400mg"],["Omeprazol","20mg"]]),

  // CLÍNICA MÉDICA
  mk(benitez, clinica, "2026-01-22", "Clínica Médica", "Control semestral inicio de año", "DBT2 excelente control. HbA1c 6.1%.",
    [["Metformina","850mg"],["Levotiroxina","75mcg"],["Atorvastatina","20mg"]]),
  mk(alvarez, clinica, "2026-03-05", "Clínica Médica", "Chequeo anual preventivo", "Sin hallazgos relevantes. HTA controlada.",
    [["Losartán","100mg"],["Atorvastatina","20mg"]]),
  mk(cabrera, clinica, "2026-04-02", "Clínica Médica", "Control colitis. En remisión.", "Colitis ulcerosa en remisión clínica y endoscópica.",
    [["Mesalazina","1g"],["Azatioprina","100mg"]]),

  // NEUROLOGÍA
  mk(herrera, neuro, "2026-01-28", "Neurología", "Control epilepsia. Sin crisis en 14 meses.", "Epilepsia en remisión prolongada.",
    [["Carbamazepina","400mg"],["Levetiracetam","750mg"]]),
  mk(diaz, neuro, "2026-02-18", "Neurología", "Migraña. Crisis cluster en diciembre.", "Migraña crónica. Ajuste profilaxis.",
    [["Topiramato","100mg"],["Propranolol","40mg"],["Sumatriptán","100mg"]]),
  mk(herrera, neuro, "2026-03-24", "Neurología", "Control semestral epilepsia", "Epilepsia focal en remisión clínica.",
    [["Carbamazepina","400mg"],["Levetiracetam","750mg"]]),

  // DERMATOLOGÍA
  mk(ortega, dermato, "2026-02-10", "Dermatología", "Control Apremilast. Excelente respuesta.", "Psoriasis en placas. PASI 4. Gran mejora.",
    [["Apremilast","30mg"]]),
  mk(morales, dermato, "2026-03-17", "Dermatología", "Control acné post-embarazo", "Acné reactivo por cambios hormonales.",
    [["Adapaleno gel","0.1%"],["Clindamicina loción","1%"]]),

  // GINECOLOGÍA
  mk(morales, gineco, "2026-01-14", "Ginecología", "Embarazo 24 semanas. Control prenatal.", "Gestación 24 semanas. Morfología fetal normal.",
    [["Ácido fólico","5mg"],["Hierro polimaltosado","100mg"]]),
  mk(quiroga, gineco, "2026-03-11", "Ginecología", "Control menopausia anual", "Menopausia compensada. Mantener TRH.",
    [["Estradiol gel transdérmico","0.5mg"],["Progesterona micronizada","200mg"]]),

  // OFTALMOLOGÍA
  mk(nunez, oftalmo, "2026-02-04", "Oftalmología", "Pre-operatorio cataratas OD", "Catarata nuclear OD. Apta para facoemulsificación.",
    []),
  mk(sosa, oftalmo, "2026-03-18", "Oftalmología", "Control glaucoma semestral", "Glaucoma estabilizado. PIO 16/17.",
    [["Latanoprost colirio","0.005%"],["Brimonidina colirio","0.15%"]]),

  // UROLOGÍA
  mk(paredes, uro, "2026-02-25", "Urología", "Control HPB anual", "HPB bien controlada. PSA 1.9. IPSS 6.",
    [["Tamsulosina","0.4mg"],["Dutasterida","0.5mg"]]),

  // ENDOCRINOLOGÍA
  mk(benitez, endocrino, "2026-01-30", "Endocrinología", "Control DBT2 inicio año", "DBT2. HbA1c 6.0%. Sin cambios.",
    [["Metformina","850mg"]]),
  mk(nunez, endocrino, "2026-03-12", "Endocrinología", "Post-operatorio cataratas. Control glucemia.", "DBT2. Control perioperatorio. Glucemia estable.",
    [["Insulina Glargina","28UI"],["Metformina","1000mg"]]),
  mk(torres, endocrino, "2026-04-03", "Endocrinología", "Control hipotiroidismo y peso", "Hipotiroidismo compensado. Descenso 4kg. IMC 30.",
    [["Levotiroxina","100mcg"]]),

  // ÚLTIMOS 15 DÍAS — cobertura diaria 26/03/2026 – 09/04/2026
  mk(acosta, pedi,      "2026-03-26", "Pediatría",       "Tos persistente y fiebre baja",                "Bronquitis aguda viral. Tratamiento sintomático.",           [["Ambroxol","15mg/5ml"],["Ibuprofeno","200mg"]]),
  mk(sosa, oftalmo,     "2026-03-27", "Oftalmología",    "Sensación de cuerpo extraño OD",               "Conjuntivitis bacteriana OD.",                               [["Tobramicina colirio","0.3%"]]),
  mk(ibanez, cardio,    "2026-03-28", "Cardiología",     "Palpitaciones y mareo leve",                   "Extrasístoles ventriculares aisladas. Holter indicado.",     [["Atenolol","25mg"]]),
  mk(nunez, endocrino,  "2026-03-29", "Endocrinología",  "Hipoglucemias nocturnas frecuentes",           "DBT2. Ajuste insulina basal por hipoglucemias.",             [["Insulina Glargina","24UI"],["Metformina","1000mg"]]),
  mk(vargas, trauma,    "2026-03-30", "Traumatología",   "Dolor agudo lumbar tras esfuerzo",             "Lumbalgia aguda sobre base crónica. Reposo relativo.",       [["Diclofenac","75mg"],["Ciclobenzaprina","5mg"]]),
  mk(morales, dermato,  "2026-03-31", "Dermatología",    "Sequedad intensa por Isotretinoína",           "Efecto adverso leve. Refuerzo de hidratación.",              [["Isotretinoína","40mg"],["Pantenol crema","5%"]]),
  mk(quiroga, gineco,   "2026-04-01", "Ginecología",     "Sangrado intermenstrual leve",                 "Spotting hormonal. TRH bien tolerada. Sin patología.",       [["Estradiol gel transdérmico","0.5mg"],["Progesterona micronizada","200mg"]]),
  mk(benitez, clinica,  "2026-04-04", "Clínica Médica",  "Astenia y cefalea leve post-viral",            "Síndrome viral autolimitado. DBT2 estable.",                 [["Metformina","850mg"],["Paracetamol","1g"]]),
  mk(diaz, neuro,       "2026-04-05", "Neurología",      "Crisis migrañosa severa con aura visual",      "Migraña con aura. Ajuste medicación de rescate.",           [["Sumatriptán","100mg"],["Metoclopramida","10mg"],["Topiramato","100mg"]]),
  mk(blanco, cardio,    "2026-04-06", "Cardiología",     "Dolor precordial atípico. ECG urgente.",       "ECG normal. Dolor músculo-esquelético. Sin cardiopatía aguda.", [["Ibuprofeno","400mg"],["Omeprazol","20mg"]]),
  mk(cabrera, clinica,  "2026-04-07", "Clínica Médica",  "Distensión abdominal y cólicos",               "CU en leve actividad. Sin brote formal. Ajuste sintomático.",[["Mesalazina","1g"],["Azatioprina","100mg"]]),

  // PROGRAMADAS — hasta el 16 de abril 2026
  mk(diaz, cardio, "2026-04-15", "Cardiología", "Control trimestral IC programado", "Pendiente", [], "programada"),
  mk(herrera, neuro, "2026-04-09", "Neurología", "Control epilepsia", "Pendiente", [], "programada"),
  mk(garcia, pedi, "2026-04-11", "Pediatría", "Control preventivo 16 años", "Pendiente", [], "programada"),
  mk(benitez, clinica, "2026-04-14", "Clínica Médica", "Control semestral", "Pendiente", [], "programada"),
  mk(paredes, uro, "2026-04-16", "Urología", "Control HPB semestral", "Pendiente", [], "programada"),
  mk(morales, gineco, "2026-04-10", "Ginecología", "Control prenatal 28 semanas", "Pendiente", [], "programada"),
  mk(nunez, oftalmo, "2026-04-08", "Oftalmología", "Control post-operatorio cataratas", "Pendiente", [], "programada"),
  mk(ortega, dermato, "2026-04-12", "Dermatología", "Control Apremilast trimestral", "Pendiente", [], "programada"),
];

const consultas = await Consulta.insertMany(consultaData);
console.log(`${consultas.length} consultas insertadas.`);
console.log("Seed completado exitosamente. Datos del 16/04/2023 al 16/04/2026.");
await mongoose.disconnect();
