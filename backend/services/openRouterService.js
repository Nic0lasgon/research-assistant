/* eslint-disable no-undef, no-unused-vars */
const axios = require('axios');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Service pour générer des requêtes de recherche
const generateSearchQueries = async (userQuery, feedback = '') => {
  try {
    // Construction du message selon qu'il y a un feedback ou non
    let systemMessage = 'You are an expert research assistant. Given a user\'s query, generate up to four distinct, precise search queries that would help gather comprehensive information on the topic. IMPORTANT: Return ONLY a valid JSON array of strings without any explanation, markdown formatting, or additional text. The response should be EXACTLY in this format: ["query1", "query2", "query3", "query4"]';
    
    let userMessage = `User Query: ${userQuery}`;
    
    // Si un feedback est fourni, l'ajouter à la requête
    if (feedback && feedback.trim()) {
      systemMessage = 'You are an expert research assistant. Given a user\'s query and feedback about previous queries, generate up to four NEW and IMPROVED search queries taking into account the user\'s feedback. IMPORTANT: Return ONLY a valid JSON array of strings without any explanation, markdown formatting, or additional text. The response should be EXACTLY in this format: ["query1", "query2", "query3", "query4"]';
      
      userMessage = `User Query: ${userQuery}\n\nFeedback on previous queries: ${feedback}`;
    }
    
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    // Extraire le tableau JSON de la réponse (gérer les markdown, etc.)
    try {
      // Supprimer les balises markdown si présentes
      const cleanedContent = content.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Erreur lors de l\'analyse JSON:', error);
      throw new Error('Format de réponse invalide');
    }
  } catch (error) {
    console.error('Erreur OpenRouter:', error);
    throw new Error('Erreur lors de la génération des requêtes de recherche');
  }
};

// Service pour extraire le contexte pertinent
const extractRelevantContext = async (websiteContents, userQuery) => {
  try {
    // Préparer les données à envoyer
    const mergedContent = websiteContents.map(item => 
      `SOURCE: ${item.title} (${item.url})\n${item.content}\n\n`
    ).join('');
    
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'google/gemini-2.0-pro-001',
        messages: [
          {
            role: 'system',
            content: 'You are an expert research assistant. Extract and organize the most relevant information from the provided web content that answers the user\'s original query. Focus on factual information, key points, and comprehensive coverage of the topic. Include relevant details but remain concise.'
          },
          {
            role: 'user',
            content: `Original Query: ${userQuery}\n\nWeb Content:\n${mergedContent}\n\nExtract and organize the most relevant information that helps answer the original query.`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur OpenRouter pour l\'extraction du contexte:', error);
    throw new Error('Erreur lors de l\'extraction du contexte pertinent');
  }
};

// Service pour générer le rapport final
const generateReport = async (extractedContent, userQuery) => {
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'google/gemini-2.0-pro-001',
        messages: [
          {
            role: 'system',
            content: 'You are an expert research assistant. Generate a comprehensive, well-structured research report based on the provided information. The report should thoroughly answer the original query with proper sections, citations, and a professional tone. Use markdown for formatting.'
          },
          {
            role: 'user',
            content: `Original Query: ${userQuery}\n\nExtracted Information:\n${extractedContent}\n\nGenerate a comprehensive research report with proper sections, citations of the sources mentioned in the extracted information, and a professional academic tone. Use markdown for formatting.`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur OpenRouter pour la génération du rapport:', error);
    throw new Error('Erreur lors de la génération du rapport final');
  }
};

module.exports = {
  generateSearchQueries,
  extractRelevantContext,
  generateReport
}; 