const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analizarIncidenteIA = async (title, description, incidentesCercanos = []) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: { responseMimeType: "application/json" }
    });

    const listadoCercanos = incidentesCercanos.length > 0
      ? incidentesCercanos.map((inc) => `ID: ${inc._id} | TÍTULO: "${inc.title}" - DESCRIPCIÓN: "${inc.description}"`).join('\n')
      : "No hay incidentes reportados cerca.";

    const prompt = `
      Eres un analista experto del sistema de reportes urbanos "CityFixer" de una municipalidad.
      Tu tarea es analizar un nuevo reporte ciudadano y compararlo con otros incidentes cercanos (si los hay) para detectar duplicados.

      --- NUEVO REPORTE ---
      TÍTULO: "${title}"
      DESCRIPCIÓN: "${description}"

      --- INCIDENTES CERCANOS (A menos de 20 metros) ---
      ${listadoCercanos}

      REGLAS DE EVALUACIÓN:
      1. ESTADO SUGERIDO: 
         - Si el reporte es una emergencia vital, requiere policía, bomberos o ambulancia (ej. accidentes graves, incendios), el estado DEBE ser "rechazado".
         - Si el título y la descripción parecen una broma, o se contradicen, el estado DEBE ser "dudoso".
         - Si el titulo y la descripción son ininteligibles el estado debe ser "rechazado".
         - Si es un reporte normal de infraestructura (baches, basura, luz), el estado DEBE ser "pendiente".
      
    2. PRIORIDAD: Asigna un número del 1 al 5, debe tener en cuenta la gravedad y urgencia del problema. 1 es baja prioridad (ej. un bache pequeño) y 5 es alta prioridad (ej. un gran árbol caído bloqueando una calle).
      
      3. CATEGORÍA: Sugiere una (ej: "bache", "alumbrado", "basura", "vandalismo", "otro").

      4. DUPLICADOS:
         - Si el NUEVO REPORTE describe el MISMO PROBLEMA exacto que un incidente cercano, marca "esDuplicado": true, y en "idIncidenteOriginal" pon el ID exacto de ese incidente cercano. Si no hay duplicado, pon null.

      ESTRUCTURA DE RESPUESTA REQUERIDA (Genera solo este JSON):
      {
        "categoriaSugerida": "string",
        "estadoSugerido": "rechazado" | "dudoso" | "pendiente",
        "prioridadSugerida": number,
        "esDuplicado": boolean,
        "idIncidenteOriginal": "string o null",
        "justificacion": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());

  } catch (error) {
    // Silenciamos el error gigante de la API y dejamos un aviso limpio en consola
    console.warn(`⚠️ [Aviso IA] Gemini no disponible por alta demanda (503). Aplicando fallback manual al incidente.`);
    
    // Retornamos el objeto de respaldo con la aclaración exacta que solicitaste
    return {
      categoriaSugerida: "Requiere clasificación manual",
      estadoSugerido: "pendiente", // Se fuerza explícitamente a pendiente
      prioridadSugerida: 1,
      esDuplicado: false,
      idIncidenteOriginal: null,
      justificacion: "[SISTEMA]: La Inteligencia Artificial no pudo procesar este reporte durante la carga debido a alta demanda del servidor. Se deben establecer la prioridad, categoría y posibles duplicados de manera manual."
    };
  }
};

module.exports = { analizarIncidenteIA };