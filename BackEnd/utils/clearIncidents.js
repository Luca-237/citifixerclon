// Limpieza de incidentes para volver a cargar datos de prueba.
// Borra TODOS los incidentes, grupos y notificaciones (estas últimas quedan
// huérfanas sin sus incidentes). NO toca estados, categorías, roles, barrios ni usuarios.
//
// Uso:
//   node utils/clearIncidents.js            → DRY RUN: muestra qué borraría, sin borrar
//   node utils/clearIncidents.js --confirm  → borra de verdad
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });
const mongoose = require('mongoose');
const mongoConnect = require('../config/mongoConnet');
const Incident = require('../models/incident');
const IncidentGroup = require('../models/incidentGroup');
const Notification = require('../models/notification');

const CONFIRM = process.argv.includes('--confirm');

const clearIncidents = async () => {
  try {
    await mongoConnect();
    console.log(`\n⚠️  Conectado a: ${mongoose.connection.host} / DB: ${mongoose.connection.name}`);

    const [incCount, groupCount, notifCount] = await Promise.all([
      Incident.countDocuments(),
      IncidentGroup.countDocuments(),
      Notification.countDocuments()
    ]);

    console.log('\nDocumentos a borrar:');
    console.log(`  - Incidentes:     ${incCount}`);
    console.log(`  - Grupos:         ${groupCount}`);
    console.log(`  - Notificaciones: ${notifCount}`);

    if (!CONFIRM) {
      console.log('\n🟡 DRY RUN — no se borró nada.');
      console.log('   Para ejecutar de verdad:  node utils/clearIncidents.js --confirm\n');
      return;
    }

    const [inc, group, notif] = await Promise.all([
      Incident.deleteMany({}),
      IncidentGroup.deleteMany({}),
      Notification.deleteMany({})
    ]);

    console.log('\n✅ Borrado completo:');
    console.log(`  - Incidentes:     ${inc.deletedCount}`);
    console.log(`  - Grupos:         ${group.deletedCount}`);
    console.log(`  - Notificaciones: ${notif.deletedCount}`);
    console.log('\nListo. Podés volver a cargar incidentes.');
  } catch (error) {
    console.error('Error al limpiar incidentes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de la DB');
  }
};

clearIncidents();
