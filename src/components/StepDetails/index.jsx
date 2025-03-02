import React from 'react';
import { useSearch } from '../../contexts/SearchContext';
import './StepDetails.css';

const StepDetails = () => {
  const { 
    currentStep, 
    STEPS, 
    searchQueries, 
    searchResults, 
    extractedContent, 
    query 
  } = useSearch();

  // Si aucune recherche n'est en cours, ne rien afficher
  if (currentStep === STEPS.IDLE) return null;

  // Définir le contenu à afficher en fonction de l'étape actuelle
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.GENERATING_QUERIES:
        return (
          <div className="step-content">
            <h3>Génération de requêtes intelligentes</h3>
            <p className="step-description">
              L'IA analyse votre question pour générer des requêtes de recherche plus précises et complètes. 
              Cette étape est essentielle pour couvrir différents aspects de votre sujet.
            </p>
            <div className="step-animation">
              <div className="thinking-animation">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        );
      
      case STEPS.SEARCHING:
        return (
          <div className="step-content">
            <h3>Recherche d'informations pertinentes</h3>
            <p className="step-description">
              Exploration du web à partir des requêtes générées pour trouver les sources les plus pertinentes et fiables.
            </p>
            
            {searchQueries.length > 0 && (
              <div className="queries-container">
                <h4>Requêtes utilisées :</h4>
                <ul className="queries-list">
                  {searchQueries.map((query, index) => (
                    <li key={index} className="query-item">
                      <span className="query-number">{index + 1}</span>
                      <span className="query-text">{query}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="step-animation">
              <div className="search-animation"></div>
            </div>
          </div>
        );
      
      case STEPS.ANALYZING:
        return (
          <div className="step-content">
            <h3>Analyse approfondie du contenu</h3>
            <p className="step-description">
              L'IA lit et analyse en profondeur les pages web trouvées pour en extraire les informations essentielles.
            </p>
            
            {searchResults.length > 0 && (
              <div className="results-container">
                <h4>Sources en cours d'analyse :</h4>
                <ul className="results-list">
                  {searchResults.slice(0, 5).map((result, index) => (
                    <li key={index} className="result-item">
                      <div className="result-title">{result.title}</div>
                      <div className="result-url">{result.url}</div>
                    </li>
                  ))}
                  {searchResults.length > 5 && (
                    <li className="result-item more-results">
                      <div className="result-title">+ {searchResults.length - 5} autres sources</div>
                    </li>
                  )}
                </ul>
              </div>
            )}
            
            <div className="step-animation">
              <div className="analyzing-animation"></div>
            </div>
          </div>
        );
      
      case STEPS.GENERATING_REPORT:
        return (
          <div className="step-content">
            <h3>Rédaction du rapport détaillé</h3>
            <p className="step-description">
              L'IA synthétise toutes les informations recueillies pour créer un rapport complet, structuré et détaillé.
            </p>
            
            {extractedContent && (
              <div className="content-preview">
                <h4>Aperçu des informations collectées :</h4>
                <div className="content-sample">
                  {extractedContent.substring(0, 200)}...
                </div>
              </div>
            )}
            
            <div className="step-animation">
              <div className="writing-animation">
                <span className="typewriter"></span>
              </div>
            </div>
          </div>
        );
      
      case STEPS.COMPLETE:
        return (
          <div className="step-content step-complete">
            <h3>Recherche terminée avec succès</h3>
            <p className="step-description">
              Votre rapport détaillé est prêt ! Découvrez une analyse approfondie de "{query}".
            </p>
            <div className="completion-icon">✓</div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="step-details">
      {renderStepContent()}
    </div>
  );
};

export default StepDetails; 