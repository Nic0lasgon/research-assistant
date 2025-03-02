/* eslint-disable no-undef */
const openRouterService = require('../services/openRouterService');
const serpApiService = require('../services/serpApiService');
const jinaAiService = require('../services/jinaAiService');

// Contrôleur pour générer des requêtes de recherche
exports.generateQueries = async (req, res, next) => {
  try {
    const { query, feedback } = req.body;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'La requête est requise'
      });
    }

    const queries = await openRouterService.generateSearchQueries(query, feedback);
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
    const { queries, depth = 3 } = req.body;
    if (!queries || !Array.isArray(queries)) {
      return res.status(400).json({
        success: false,
        message: 'Des requêtes valides sont requises'
      });
    }

    const results = await serpApiService.performSearch(queries, depth);
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

    // Récupérer le contenu de chaque URL
    const contentPromises = results.map(async (result) => {
      const content = await jinaAiService.extractWebContent(result.url);
      return {
        title: result.title,
        url: result.url,
        content
      };
    });

    const websiteContents = await Promise.all(contentPromises);
    
    // Extraire le contexte pertinent
    const extractedContent = await openRouterService.extractRelevantContext(websiteContents, originalQuery);

    res.json({
      success: true,
      extractedContent
    });
  } catch (error) {
    next(error);
  }
};

// Contrôleur pour générer le rapport final
exports.generateReport = async (req, res, next) => {
  try {
    const { content, query } = req.body;
    if (!content || !query) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu et la requête sont requis'
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