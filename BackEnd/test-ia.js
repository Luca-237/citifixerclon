require('dotenv').config({ path: './config/.env' });
const { analizarIncidenteIA } = require('./services/openai.service');

const runTest = async () => {
  console.log("Iniciando prueba de conexión a Gemini 2.5 Flash...\n");
  
  // Prueba 1: Un reporte normal
  const titulo = "Árbol caído en la calle principal";
  const descripcion = "Después de la tormenta, un árbol grande bloquea toda la calle y no deja pasar a los autos.";
  
  console.log(`Evaluando incidente: "${titulo}"...`);
  const resultado = await analizarIncidenteIA(titulo, descripcion);
  
  console.log("\n--- RESULTADO DE LA IA ---");
  console.log(JSON.stringify(resultado, null, 2));
  console.log("--------------------------\n");
};

runTest();