/* eslint-disable no-undef */
const axios = require('axios');

const SERPAPI_URL = 'https://serpapi.com/search';
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

// Service pour effectuer des recherches web via SerpAPI
const performSearch = async (queries, depth = 3) => {
  try {
    // Limiter à un maximum de 4 requêtes pour éviter les abus
    const limitedQueries = queries.slice(0, 4);
    
    // Déterminer le nombre de résultats par requête en fonction de la profondeur
    let resultsPerQuery = 3; // Valeur par défaut
    
    switch (depth) {
      case 1: // Recherche basique
        resultsPerQuery = 2;
        break;
      case 2: // Recherche modérée
        resultsPerQuery = 3;
        break;
      case 3: // Recherche approfondie
        resultsPerQuery = 4;
        break;
      case 4: // Recherche très approfondie
        resultsPerQuery = 5;
        break;
      case 5: // Recherche maximale
        resultsPerQuery = 6;
        break;
      default:
        resultsPerQuery = 3;
    }
    
    // Effectuer les recherches en parallèle
    const searchPromises = limitedQueries.map(async (query) => {
      const params = new URLSearchParams({
        q: query,
        api_key: SERPAPI_API_KEY,
        engine: 'google'
      });
      
      const response = await axios.get(`${SERPAPI_URL}?${params.toString()}`);
      
      if (response.data.organic_results) {
        // Extraire les résultats organiques selon la profondeur spécifiée
        return response.data.organic_results.slice(0, resultsPerQuery).map(result => ({
          title: result.title || 'No title available',
          link: result.link || 'No link available',
          source: result.source || result.displayed_link || 'Unknown source'
        }));
      }
      
      return [];
    });
    
    const searchResults = await Promise.all(searchPromises);
    
    // Aplatir le tableau de tableaux en un seul tableau
    return searchResults.flat();
  } catch (error) {
    console.error('Erreur SerpAPI:', error);
    throw new Error('Erreur lors de la recherche web');
  }
};

module.exports = {
  performSearch
}; 