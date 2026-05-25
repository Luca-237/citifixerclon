import axios from "axios";

// Cliente base — manda la cookie de sesión automáticamente en cada request
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


// ─── Categorías ───────────────────────────────────────────────────────────────

// Trae todas las categorías disponibles para clasificar un incidente
export const getCategorias = () => api.get("/api/categories");

// ─── Incidentes ───────────────────────────────────────────────────────────────

// Crea un nuevo incidente — recibe FormData (multipart) con archivos de fotos.
// El middleware de Cloudinary en el back intercepta los archivos, los sube y
// agrega las URLs a req.body.photos antes de llegar al controller.
// Nota: location se envía como JSON string — el back debe parsearlo.
export const postIncidente = (formData) =>
  api.post("/api/incidents", formData);

// Trae los incidentes del usuario autenticado
export const getMisIncidentes = () => api.get("/api/incidents/my-incidents");

// ─── Admin — Incidentes ───────────────────────────────────────────────────────

// Trae todos los incidentes (solo admin/superAdmin)
export const getAllIncidents = () => api.get("/api/incidents");

// Cambia el estado de un incidente
export const updateIncidentStatus = (id, statusId) =>
  api.patch(`/api/incidents/${id}/status`, { statusId });

// Cambia la categoría de un incidente
export const updateIncidentCategory = (id, categoryId) =>
  api.patch(`/api/incidents/${id}/category`, { categoryId });

// ─── Admin — Categorías ───────────────────────────────────────────────────────

// Crea una nueva categoría
export const createCategory = (body) => api.post("/api/categories", body);

// Elimina una categoría por id
export const deleteCategory = (id) => api.delete(`/api/categories/${id}`);

// ─── Estados ─────────────────────────────────────────────────────────────────

// Trae todos los estados disponibles
export const getStatuses = () => api.get("/api/statuses");

export default api;
