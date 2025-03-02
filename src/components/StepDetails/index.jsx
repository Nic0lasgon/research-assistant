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
      
      case STEPS.VALIDATE_QUERIES:
        return (
          <div className="step-content">
            <h3>Validation des requêtes de recherche</h3>
            <p className="step-description">
              Sélectionnez les requêtes les plus pertinentes pour votre recherche et ajustez la profondeur d'analyse.
              Cette étape vous permet de personnaliser et d'optimiser le processus de recherche.
            </p>
            <p className="step-note">
              Utilisez le formulaire ci-dessous pour sélectionner les requêtes à utiliser et définir la profondeur de recherche.
            </p>
          </div>
        );
      
      case STEPS.SEARCHING:
        return (
          <div className="step-content">
            <h3>Recherche d'informations pertinentes</h3>
            <p className="step-description">
              Exploration du web à partir des requêtes validées pour trouver les sources les plus pertinentes et fiables.
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
            <h3>Analyse et extraction du contenu</h3>
            <p className="step-description">
              L'IA analyse le contenu des sources trouvées pour extraire les informations pertinentes et construire une base de connaissances sur votre sujet.
            </p>
            
            {searchResults.length > 0 && (
              <div className="results-preview">
                <h4>Sources en cours d'analyse :</h4>
                <ul className="source-list">
                  {searchResults.slice(0, 5).map((result, index) => (
                    <li key={index} className="source-item">
                      <div className="source-title">{result.title}</div>
                      <div className="source-url">{result.link}</div>
                    </li>
                  ))}
                  {searchResults.length > 5 && (
                    <li className="source-more">
                      +{searchResults.length - 5} autres sources
                    </li>
                  )}
                </ul>
              </div>
            )}
            
            <div className="step-animation">
              <div className="analyze-animation"></div>
            </div>
          </div>
        );
      
      case STEPS.GENERATING_REPORT:
        return (
          <div className="step-content">
            <h3>Génération du rapport de recherche</h3>
            <p className="step-description">
              Synthèse des informations analysées et rédaction d'un rapport structuré et complet sur votre sujet.
            </p>
            
            {extractedContent && (
              <div className="content-sample">
                <h4>Extrait des informations analysées :</h4>
                <p className="sample-text">
                  {extractedContent.substring(0, 200)}...
                </p>
              </div>
            )}
            
            <div className="step-animation">
              <div className="writing-animation"></div>
            </div>
          </div>
        );
      
      case STEPS.COMPLETE:
        return (
          <div className="step-content">
            <h3>Recherche terminée</h3>
            <p className="step-description">
              Votre rapport de recherche est prêt. Vous pouvez le consulter ci-dessous et l'utiliser pour vos besoins.
            </p>
            <div className="completion-message">
              <i className="check-icon">✓</i>
              <p>Analyse complète de "{query}"</p>
            </div>
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