/* eslint-disable no-undef, no-unused-vars */
const axios = require('axios');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Service pour générer des requêtes de recherche
const generateSearchQueries = async (userQuery) => {
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: 'You are an expert research assistant. Given a user\'s query, generate up to four distinct, precise search queries that would help gather comprehensive information on the topic. IMPORTANT: Return ONLY a valid JSON array of strings without any explanation, markdown formatting, or additional text. The response should be EXACTLY in this format: ["query1", "query2", "query3", "query4"]'
          },
          {
            role: 'user',
            content: `User Query: ${userQuery}`
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

// Service pour extraire le contenu pertinent
const extractRelevantContext = async (webContents, queries, originalQuery) => {
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'google/gemini-2.0-pro-exp-02-05:free',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en extraction d'informations. À partir de la requête de l'utilisateur, de la requête de recherche ayant conduit à cette page, et du contenu de la page web, identifie et extrais toutes les informations pertinentes pour répondre à la requête. Retourne uniquement le contexte utile sous forme de texte brut, sans aucun commentaire additionnel.`
          },
          {
            role: 'user',
            content: `User Queries: ${queries.join(', ')}
Webpage Contents: 
"""
${webContents}
"""`
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
    console.error('Erreur OpenRouter:', error);
    throw new Error('Erreur lors de l\'extraction du contexte');
  }
};

// Service pour générer le rapport final
const generateReport = async (extractedContent, originalQuery) => {
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'google/gemini-2.0-pro-exp-02-05:free',
        messages: [
          {
            role: 'system',
            content: `INSTRUCTION CRITIQUE: Tu DOIS absolument générer ta réponse UNIQUEMENT EN FRANÇAIS, jamais en anglais.

Tu es un expert en recherche et rédaction de rapports. Ta mission est de générer un rapport TRÈS DÉTAILLÉ et approfondi en français. Le rapport doit faire au moins 1500 mots et contenir plusieurs sections avec analyses précises.

CONSIGNES OBLIGATOIRES:
1. Écris UNIQUEMENT en français
2. Ton rapport doit être extrêmement détaillé (minimum 1500 mots)
3. Inclus au moins 4-5 sous-sections dans chaque partie principale
4. Développe chaque point avec exemples et explications approfondies
5. Ne synthétise pas trop l'information - préfère l'exhaustivité

Structure à suivre en Markdown:

# Rapport de Recherche: [Requête de l'Utilisateur]

## Résumé Exécutif
[Résumé détaillé du contenu - minimum 200 mots]

## Contexte et Méthodologie
[Explication détaillée du contexte et de l'approche - minimum 200 mots]

## Principales Découvertes
### Découverte 1
[Explication détaillée et analyse approfondie - minimum 150 mots]

### Découverte 2
[Explication détaillée et analyse approfondie - minimum 150 mots]

### Découverte 3
[Explication détaillée et analyse approfondie - minimum 150 mots]

## Analyse Détaillée
### Aspect 1
[Analyse très approfondie avec exemples et implications - minimum 200 mots]
_Source:_ [Nom de la Source](URL)

### Aspect 2
[Analyse très approfondie avec exemples et implications - minimum 200 mots]
_Source:_ [Autre Source](URL)

## Implications et Recommandations
[Analyse des conséquences et suggestions concrètes - minimum 200 mots]

## Conclusion
[Synthèse complète et perspectives - minimum 150 mots]

REMINDER: Ton rapport DOIT être en français et très détaillé (minimum 1500 mots).`
          },
          {
            role: 'user',
            content: `Requête originale de l'utilisateur: ${originalQuery}

Contextes extraits (fusionnés):
"""
${extractedContent}
"""`
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
    console.error('Erreur OpenRouter:', error);
    throw new Error('Erreur lors de la génération du rapport');
  }
};

module.exports = {
  generateSearchQueries,
  extractRelevantContext,
  generateReport
}; 