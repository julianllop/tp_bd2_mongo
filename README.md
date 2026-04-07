# mediDoc — Sistema de Historia Clínica Electrónica

Stack: Node.js + Express + Mongoose (ES Modules) | React + Vite + TailwindCSS + Recharts | MongoDB via Docker

## Levantar el proyecto

### 1. Base de datos (Docker)
```bash
docker-compose up -d
```

### 2. Backend
```bash
cd backend
npm install
npm run seed      # Carga datos de ejemplo
npm run dev       # Servidor en http://localhost:3000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev       # App en http://localhost:5173
```

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | /api/pacientes | Listar / crear |
| GET/PUT/DELETE | /api/pacientes/:id | Ver / editar / eliminar |
| GET/POST | /api/medicos | Listar / crear |
| GET/PUT/DELETE | /api/medicos/:id | Ver / editar / eliminar |
| GET/POST | /api/consultas | Listar / crear |
| GET/PUT/DELETE | /api/consultas/:id | Ver / editar / eliminar |
| GET | /api/analytics/resumen | KPIs generales |
| GET | /api/analytics/especialidades | Distribución por especialidad |
| GET | /api/analytics/consultas-mes | Consultas por mes |
| GET | /api/analytics/medicamentos | Top 10 medicamentos |
| GET | /api/analytics/obras-sociales | Pacientes por obra social |
| GET | /api/analytics/grupos-sanguineos | Distribución grupos sanguíneos |
| GET | /api/health | Health check |
