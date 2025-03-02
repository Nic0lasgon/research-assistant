/* eslint-disable no-undef */
const axios = require('axios');

const JINA_AI_URL = 'https://r.jina.ai';
const JINA_AI_API_KEY = process.env.JINA_AI_API_KEY;

// Service pour extraire le contenu d'une page web via Jina AI
const extractWebContent = async (url) => {
  try {
    const response = await axios.get(`${JINA_AI_URL}/${encodeURIComponent(url)}`, {
      headers: {
        'Authorization': `Bearer ${JINA_AI_API_KEY}`
      }
    });
    
    return response.data.data || 'Contenu non disponible';
  } catch (error) {
    console.error(`Erreur Jina AI pour ${url}:`, error);
    return 'Erreur lors de l\'extraction du contenu';
  }
};

module.exports = {
  extractWebContent
}; 