import { useSearch } from '../../contexts/SearchContext';
import './ProgressTracker.css';

const ProgressTracker = () => {
  const { currentStep, STEPS } = useSearch();

  if (currentStep === STEPS.IDLE) return null;

  const steps = [
    { id: STEPS.GENERATING_QUERIES, label: 'Génération des requêtes' },
    { id: STEPS.VALIDATE_QUERIES, label: 'Validation des requêtes' },
    { id: STEPS.SEARCHING, label: 'Recherche web' },
    { id: STEPS.ANALYZING, label: 'Analyse du contenu' },
    { id: STEPS.GENERATING_REPORT, label: 'Rédaction du rapport' },
    { id: STEPS.COMPLETE, label: 'Terminé' }
  ];

  return (
    <div className="progress-tracker">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(currentStep / (STEPS.COMPLETE)) * 100}%` }}
        ></div>
      </div>
      <div className="steps-container">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`step ${currentStep >= step.id ? 'active' : ''}`}
          >
            <div className="step-indicator">{step.id}</div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker; 