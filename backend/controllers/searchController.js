/* eslint-disable no-undef */
const openRouterService = require('../services/openRouterService');
const serpApiService = require('../services/serpApiService');
const jinaAiService = require('../services/jinaAiService');

// Contrôleur pour générer des requêtes de recherche
exports.generateQueries = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'La requête est requise'
      });
    }

    const queries = await openRouterService.generateSearchQueries(query);
    res.json({
      success: true,
      queries
    });
  } catch (error) {
    next(error);
  }
};

// Contrôleur pour effectuer des recherches
exports.search = async (req, res, next) => {
  try {
    const { queries } = req.body;
    if (!queries || !Array.isArray(queries)) {
      return res.status(400).json({
        success: false,
        message: 'Des requêtes valides sont requises'
      });
    }

    const results = await serpApiService.performSearch(queries);
    res.json({
      success: true,
      results
    });
  } catch (error) {
    next(error);
  }
};

// Contrôleur pour analyser le contenu web
exports.analyzeContent = async (req, res, next) => {
  try {
    const { results, originalQuery } = req.body;
    if (!results || !Array.isArray(results) || !originalQuery) {
      return res.status(400).json({
        success: false,
        message: 'Des résultats de recherche et une requête originale sont requis'
      });
    }

    // Extraire le contenu des pages web pour chaque URL
    const contentPromises = results.map(async (result) => {
      const content = await jinaAiService.extractWebContent(result.url);
      return {
        url: result.url,
        title: result.title,
        content
      };
    });

    // Attendre que toutes les extractions soient terminées
    const webContents = await Promise.all(contentPromises);
    
    // Fusionner tous les contenus pour les traiter ensemble
    const mergedContent = webContents.map(item => 
      `SOURCE: ${item.title} (${item.url})\n${item.content}\n\n`
    ).join('');

    // Extraire le contexte pertinent
    const queries = results.map(result => result.title);
    const extractedContent = await openRouterService.extractRelevantContext(
      mergedContent,
      queries,
      originalQuery
    );

    res.json({
      success: true,
      extractedContent
    });
  } catch (error) {
    next(error);
  }
};

// Contrôleur pour générer le rapport
exports.generateReport = async (req, res, next) => {
  try {
    const { content, query } = req.body;
    if (!content || !query) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu extrait et la requête sont requis'
      });
    }

    const report = await openRouterService.generateReport(content, query);
    res.json({
      success: true,
      report
    });
  } catch (error) {
    next(error);
  }
}; 