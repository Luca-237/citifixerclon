/**
 * Plantilla de JSDoc para CityFixer.
 *
 * Convención de equipo: TODA función exportada de `services/` y `utils/` lleva
 * un bloque como el de abajo. Mínimo obligatorio: descripción, @param, @returns
 * y @throws cuando la función pueda lanzar.
 *
 * Copiá el bloque de ejemplo, no este encabezado.
 */

// ---------------------------------------------------------------------------
// EJEMPLO 1 — función de service asíncrona
// ---------------------------------------------------------------------------

/**
 * Crea un incidente y lo asigna a un grupo (existente o nuevo) según el
 * análisis de la IA y la proximidad geográfica.
 *
 * @param {Object} data            Datos del reporte (title, description, photos, location, category).
 * @param {string} userId          ID del usuario que reporta.
 * @param {Object} aiData          Resultado del análisis de IA (estado, confianza, etc.).
 * @param {string} role            Rol del usuario ('user' | 'admin' | 'superAdmin').
 * @returns {Promise<Object>}      El incidente creado, poblado con su grupo.
 * @throws {Error} Si los datos no pasan la validación (error con `.status`).
 */
async function createIncident(data, userId, aiData, role) {
  // ...
}

// ---------------------------------------------------------------------------
// EJEMPLO 2 — helper/util sincrónico
// ---------------------------------------------------------------------------

/**
 * Calcula el puntaje de un incidente para elegir al representante del grupo.
 * Pondera más la descripción que el título.
 *
 * @param {Object} incident  Incidente con `title` y `description`.
 * @returns {number}         Puntaje (mayor = mejor representante).
 */
function calcularScoreRepresentante(incident) {
  // ...
}

/*
 * Etiquetas JSDoc útiles:
 *   @param {Tipo} nombre   Descripción del parámetro.
 *   @param {Tipo} [opc]    Parámetro opcional (entre corchetes).
 *   @returns {Tipo}        Qué devuelve.
 *   @throws {Error}        Cuándo y por qué lanza.
 *   @example               Bloque de ejemplo de uso.
 *   @deprecated            Marcar funciones que no se deben usar más.
 */
