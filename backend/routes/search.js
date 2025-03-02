/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Route pour générer des requêtes de recherche
router.post('/generate-queries', searchController.generateQueries);

// Route pour effectuer des recherches
router.post('/search', searchController.search);

// Route pour analyser le contenu web
router.post('/analyze-content', searchController.analyzeContent);

// Route pour générer le rapport
router.post('/generate-report', searchController.generateReport);

module.exports = router; 