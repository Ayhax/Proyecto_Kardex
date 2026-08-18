require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);

// Manejador de errores centralizado — captura los SQLSTATE '45000' que
// lanzan los Stored Procedures y los devuelve como mensaje limpio.
app.use((err, req, res, next) => {
  console.error(err);
  if (err?.sqlState === '45000') {
    return res.status(400).json({ message: err.sqlMessage });
  }
  res.status(500).json({ message: 'Error interno del servidor.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor SIGA Hospital corriendo en http://localhost:${PORT}`);
});