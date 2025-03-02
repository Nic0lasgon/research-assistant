/* eslint-disable no-undef, no-unused-vars */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Importation des routes (à implémenter)
const searchRoutes = require('./routes/search');

const app = express();

// Middleware
app.use(helmet()); // Sécurité
app.use(morgan('dev')); // Logging
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', searchRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 