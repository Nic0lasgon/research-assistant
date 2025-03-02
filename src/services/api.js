import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Génère des requêtes de recherche à partir de la requête utilisateur
export const generateSearchQueries = async (userQuery) => {
  try {
    const response = await api.post('/generate-queries', { query: userQuery });
    return response.data.queries;
  } catch (error) {
    console.error('Erreur lors de la génération des requêtes:', error);
    throw new Error('Impossible de générer des requêtes de recherche');
  }
};

// Effectue des recherches web pour les requêtes générées
export const performSearch = async (queries) => {
  try {
    const response = await api.post('/search', { queries });
    return response.data.results;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    throw new Error('Impossible d\'effectuer les recherches web');
  }
};

// Analyse le contenu des pages web
export const analyzeWebContent = async (searchResults, originalQuery) => {
  try {
    const response = await api.post('/analyze-content', {
      results: searchResults,
      originalQuery
    });
    return response.data.extractedContent;
  } catch (error) {
    console.error('Erreur lors de l\'analyse du contenu:', error);
    throw new Error('Impossible d\'analyser le contenu web');
  }
};

// Génère le rapport final
export const generateReport = async (extractedContent, originalQuery) => {
  try {
    const response = await api.post('/generate-report', {
      content: extractedContent,
      query: originalQuery
    });
    return response.data.report;
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw new Error('Impossible de générer le rapport final');
  }
}; 