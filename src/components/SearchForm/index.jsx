import { useState } from 'react';
import { useSearch } from '../../contexts/SearchContext';
import './SearchForm.css';

const SearchForm = () => {
  const [inputQuery, setInputQuery] = useState('');
  const { startSearch, loading, currentStep, STEPS } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputQuery.trim() && !loading) {
      startSearch(inputQuery.trim());
    }
  };

  const isDisabled = loading || currentStep > STEPS.IDLE;

  return (
    <div className="search-form-container">
      <h1>Assistant de Recherche IA</h1>
      <p className="description">
        Posez une question complexe et l'assistant générera un rapport de recherche détaillé.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Exemple: Quels sont les impacts environnementaux de l'agriculture verticale?"
          rows={4}
          disabled={isDisabled}
          className="search-input"
        />
        <button 
          type="submit" 
          disabled={isDisabled || !inputQuery.trim()}
          className="search-button"
        >
          {loading ? 'Recherche en cours...' : 'Lancer la recherche'}
        </button>
      </form>
    </div>
  );
};

export default SearchForm; 