const { getUsersWithExcessiveDubiousIncidents } = require('../services/incident.service');

// ==========================================
// ALERTAS Y MÉTRICAS
// ==========================================
const getAllUsers = async (req, res) => {
  try {
    // Buscamos todos los usuarios y seleccionamos solo los campos necesarios para la tabla
    const users = await User.find()
      .select('firstName lastName email role isActive isBanned createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Error al obtener la lista de todos los usuarios:", error);
    res.status(500).json({ error: 'Error interno del servidor al obtener la lista de usuarios.' });
  }
};


const getBannedUsersList = async (req, res) => {
  try {
    // Buscamos directamente por el atributo booleano indexado
    const bannedUsers = await User.find({ isBanned: true })
      .select('firstName lastName email isActive isBanned createdAt')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: bannedUsers.length,
      users: bannedUsers
    });
  } catch (error) {
    console.error("Error al obtener la lista de usuarios baneados:", error);
    res.status(500).json({ error: 'Error interno del servidor al obtener usuarios restringidos.' });
  }
};

module.exports = {
  getBannedUsersList
};


const getFlaggedUsers = async (req, res) => {
  try {
    // Ejecutamos la consulta con el umbral reglamentario de 5 incidentes
    const flaggedUsers = await getUsersWithExcessiveDubiousIncidents(5);
    
    res.status(200).json({
      success: true,
      count: flaggedUsers.length,
      users: flaggedUsers
    });
  } catch (error) {
    console.error("Error al obtener usuarios advertidos:", error);
    
    // Si falla porque no existe el estado en el "registro maestro"
    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: 'Error interno del servidor al procesar el reporte de usuarios.' });
  }
};

module.exports = {
    getAllUsers,
  getFlaggedUsers
};