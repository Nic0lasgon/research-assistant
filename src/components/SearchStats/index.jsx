import React from 'react';
import { useSearch } from '../../contexts/SearchContext';
import './SearchStats.css';

const SearchStats = () => {
  const { 
    currentStep, 
    STEPS, 
    searchQueries, 
    searchResults, 
    extractedContent 
  } = useSearch();

  // Ne rien afficher si aucune recherche n'est en cours ou terminée
  if (currentStep < STEPS.SEARCHING) return null;

  // Calculer les statistiques
  const queriesCount = searchQueries.length;
  const resultsCount = searchResults.length;
  
  // Estimation du nombre de mots analysés (approximation basée sur le contenu extrait)
  const estimatedWordsAnalyzed = extractedContent 
    ? Math.round(extractedContent.split(/\s+/).length * 10) // *10 pour simuler le contenu total avant extraction
    : 0;
  
  // Estimation des sources utilisées
  const sourcesCount = searchResults.length;

  return (
    <div className="search-stats">
      <h3>Statistiques de recherche</h3>
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-value">{queriesCount}</div>
          <div className="stat-label">Requêtes générées</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{resultsCount}</div>
          <div className="stat-label">Résultats analysés</div>
        </div>
        
        {currentStep >= STEPS.ANALYZING && (
          <div className="stat-item">
            <div className="stat-value">{estimatedWordsAnalyzed.toLocaleString()}</div>
            <div className="stat-label">Mots examinés</div>
          </div>
        )}
        
        {currentStep >= STEPS.ANALYZING && (
          <div className="stat-item">
            <div className="stat-value">{sourcesCount}</div>
            <div className="stat-label">Sources utilisées</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchStats; 