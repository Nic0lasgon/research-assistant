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
  const [searchDepth, setSearchDepth] = useState(3); // Valeur par défaut: recherche modérée

  // Étapes du flux de travail
  const STEPS = {
    IDLE: 0,
    GENERATING_QUERIES: 1,
    VALIDATE_QUERIES: 2,
    SEARCHING: 3,
    ANALYZING: 4,
    GENERATING_REPORT: 5,
    COMPLETE: 6
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
      setSearchDepth(3); // Réinitialiser la profondeur de recherche à la valeur par défaut
      
      // Étape 1: Générer des requêtes de recherche
      setCurrentStep(STEPS.GENERATING_QUERIES);
      const queries = await generateSearchQueries(userQuery);
      setSearchQueries(queries);
      
      // Passer à l'étape de validation des requêtes
      setCurrentStep(STEPS.VALIDATE_QUERIES);
      
      // Les étapes suivantes seront déclenchées par validateQueries
    } catch (err) {
      console.error('Erreur dans le processus de recherche:', err);
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  // Valider les requêtes sélectionnées et continuer le processus
  const validateQueries = async (selectedQueries) => {
    try {
      if (!selectedQueries || selectedQueries.length === 0) {
        throw new Error('Aucune requête sélectionnée');
      }
      
      setLoading(true);
      setSearchQueries(selectedQueries);
      
      // Étape 2: Effectuer des recherches avec les requêtes validées
      setCurrentStep(STEPS.SEARCHING);
      const results = await performSearch(selectedQueries, searchDepth);
      setSearchResults(results);
      
      // Étape 3: Analyser le contenu web
      setCurrentStep(STEPS.ANALYZING);
      const content = await analyzeWebContent(results, query);
      setExtractedContent(content);
      
      // Étape 4: Générer le rapport final
      setCurrentStep(STEPS.GENERATING_REPORT);
      const finalReport = await generateReport(content, query);
      setReport(finalReport);
      
      // Terminer
      setCurrentStep(STEPS.COMPLETE);
    } catch (err) {
      console.error('Erreur dans le processus de validation des requêtes:', err);
      setError(err.message || 'Une erreur est survenue lors de la validation des requêtes');
    } finally {
      setLoading(false);
    }
  };

  // Regénérer de nouvelles requêtes basées sur le feedback
  const regenerateQueries = async (feedback) => {
    try {
      setLoading(true);
      setError(null);
      
      // Générer de nouvelles requêtes avec le feedback
      const newQueries = await generateSearchQueries(query, feedback);
      setSearchQueries(newQueries);
      
      // Rester sur l'étape de validation
      setCurrentStep(STEPS.VALIDATE_QUERIES);
    } catch (err) {
      console.error('Erreur lors de la regénération des requêtes:', err);
      setError(err.message || 'Une erreur est survenue lors de la regénération des requêtes');
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
    searchDepth,
    setSearchDepth,
    startSearch,
    validateQueries,
    regenerateQueries,
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