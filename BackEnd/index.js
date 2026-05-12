require('dotenv').config({ path: './config/.env' });
const express = require('express');
const mongoConnect = require('./config/mongoConnet'); 
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 3000;

mongoConnect();

// Parsear body JSON
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});