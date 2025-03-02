import React, { useState, useEffect } from 'react';
import { useSearch } from '../../contexts/SearchContext';
import './QueryValidator.css';

const QueryValidator = () => {
  const { 
    currentStep, 
    STEPS, 
    searchQueries, 
    validateQueries, 
    regenerateQueries,
    searchDepth,
    setSearchDepth,
    query
  } = useSearch();

  const [selectedQueries, setSelectedQueries] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [depthValue, setDepthValue] = useState(searchDepth);

  // Initialiser les requêtes sélectionnées lorsque les requêtes changent
  useEffect(() => {
    // Par défaut, sélectionner toutes les requêtes
    if (searchQueries && searchQueries.length > 0) {
      setSelectedQueries([...searchQueries]);
    } else {
      setSelectedQueries([]);
    }
  }, [searchQueries]);

  // Mettre à jour la profondeur de recherche lorsque le slider change
  useEffect(() => {
    setDepthValue(searchDepth);
  }, [searchDepth]);

  // Gérer le changement de la profondeur de recherche
  const handleDepthChange = (e) => {
    const newDepth = parseInt(e.target.value, 10);
    setDepthValue(newDepth);
    setSearchDepth(newDepth);
  };

  // Gérer la sélection/désélection d'une requête
  const toggleQuerySelection = (query) => {
    if (selectedQueries.includes(query)) {
      setSelectedQueries(selectedQueries.filter(q => q !== query));
    } else {
      setSelectedQueries([...selectedQueries, query]);
    }
  };

  // Déterminer la description de la profondeur
  const getDepthDescription = (depth) => {
    switch (depth) {
      case 1:
        return "Recherche basique avec des résultats généraux";
      case 2:
        return "Recherche modérée avec des résultats plus détaillés";
      case 3:
        return "Recherche approfondie avec des résultats complets";
      case 4:
        return "Recherche très approfondie avec des résultats exhaustifs";
      case 5:
        return "Recherche maximale avec une analyse complète du sujet";
      default:
        return "Ajustez la profondeur de recherche selon vos besoins";
    }
  };

  // Gérer la validation des requêtes
  const handleValidateQueries = () => {
    validateQueries(selectedQueries);
  };

  // Gérer la regénération des requêtes
  const handleRegenerateQueries = () => {
    regenerateQueries(feedback);
    setFeedback('');
  };

  // Ne rien afficher si l'étape actuelle n'est pas celle de validation des requêtes
  if (currentStep !== STEPS.VALIDATE_QUERIES || !searchQueries || searchQueries.length === 0) {
    return null;
  }

  return (
    <div className="query-validator">
      <h3>Valider les requêtes de recherche</h3>

      <div className="validator-instructions">
        <p>Pour votre recherche: <span className="initial-query">{query}</span></p>
        <p>Veuillez sélectionner les requêtes les plus pertinentes pour effectuer votre recherche. Vous pouvez également ajuster la profondeur de recherche et demander de nouvelles requêtes si nécessaire.</p>
      </div>

      <div className="depth-control">
        <label htmlFor="search-depth">Profondeur de recherche</label>
        <div className="depth-labels">
          <span>Basique</span>
          <span>Maximale</span>
        </div>
        <div className="depth-input-group">
          <input 
            type="range" 
            id="search-depth" 
            min="1" 
            max="5" 
            step="1" 
            value={depthValue} 
            onChange={handleDepthChange} 
          />
          <span className="depth-value">{depthValue}</span>
        </div>
        <div className="depth-description">
          {getDepthDescription(depthValue)}
        </div>
      </div>

      <div className="queries-list">
        {searchQueries.map((queryItem, index) => (
          <div 
            key={index} 
            className={`query-item ${selectedQueries.includes(queryItem) ? 'selected' : ''}`}
            onClick={() => toggleQuerySelection(queryItem)}
          >
            <div className="query-checkbox">
              <input 
                type="checkbox" 
                id={`query-${index}`} 
                checked={selectedQueries.includes(queryItem)} 
                onChange={() => {}} // Géré par onClick du parent
              />
              <label htmlFor={`query-${index}`}></label>
            </div>
            <div className="query-text">{queryItem}</div>
          </div>
        ))}
      </div>

      <div className="regenerate-section">
        <p>Vous n'êtes pas satisfait des requêtes générées?</p>
        <textarea 
          className="feedback-input" 
          placeholder="Expliquez ce qui ne va pas avec les requêtes actuelles ou ce que vous recherchez spécifiquement..." 
          value={feedback} 
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
        <button 
          className="regenerate-button" 
          onClick={handleRegenerateQueries}
          disabled={feedback.trim().length < 5}
        >
          Générer de nouvelles requêtes
        </button>
      </div>

      <div className="validation-actions">
        <div className="selection-info">
          {selectedQueries.length} requête{selectedQueries.length !== 1 ? 's' : ''} sélectionnée{selectedQueries.length !== 1 ? 's' : ''}
        </div>
        <button 
          className="validate-button" 
          onClick={handleValidateQueries}
          disabled={selectedQueries.length === 0}
        >
          Lancer la recherche
        </button>
      </div>
    </div>
  );
};

export default QueryValidator; 