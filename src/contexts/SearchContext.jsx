import { createContext, useState, useContext } from 'react';
import { generateSearchQueries, performSearch, analyzeWebContent, generateReport } from '../services/api';

// Création du contexte
const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [searchQueries, setSearchQueries] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [extractedContent, setExtractedContent] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  // Étapes du flux de travail
  const STEPS = {
    IDLE: 0,
    GENERATING_QUERIES: 1,
    SEARCHING: 2,
    ANALYZING: 3,
    GENERATING_REPORT: 4,
    COMPLETE: 5
  };

  // Fonction principale pour démarrer le processus de recherche
  const startSearch = async (userQuery) => {
    try {
      // Réinitialiser l'état
      setQuery(userQuery);
      setSearchQueries([]);
      setSearchResults([]);
      setExtractedContent('');
      setReport('');
      setLoading(true);
      setError(null);
      
      // Étape 1: Générer des requêtes de recherche
      setCurrentStep(STEPS.GENERATING_QUERIES);
      const queries = await generateSearchQueries(userQuery);
      setSearchQueries(queries);
      
      // Étape 2: Effectuer des recherches
      setCurrentStep(STEPS.SEARCHING);
      const results = await performSearch(queries);
      setSearchResults(results);
      
      // Étape 3: Analyser le contenu web
      setCurrentStep(STEPS.ANALYZING);
      const content = await analyzeWebContent(results, userQuery);
      setExtractedContent(content);
      
      // Étape 4: Générer le rapport final
      setCurrentStep(STEPS.GENERATING_REPORT);
      const finalReport = await generateReport(content, userQuery);
      setReport(finalReport);
      
      // Terminer
      setCurrentStep(STEPS.COMPLETE);
    } catch (err) {
      console.error('Erreur dans le processus de recherche:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Exposer toutes les valeurs et fonctions nécessaires
  const value = {
    query,
    searchQueries,
    searchResults,
    extractedContent,
    report,
    loading,
    currentStep,
    error,
    startSearch,
    STEPS
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch doit être utilisé à l'intérieur d'un SearchProvider");
  }
  return context;
}; 