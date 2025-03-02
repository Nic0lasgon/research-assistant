import { useSearch } from '../../contexts/SearchContext';
import ReactMarkdown from 'react-markdown';
import './ResearchReport.css';

const ResearchReport = () => {
  const { report, currentStep, STEPS } = useSearch();

  if (currentStep < STEPS.COMPLETE || !report) return null;

  return (
    <div className="research-report">
      <h2>Rapport de Recherche</h2>
      <div className="report-content">
        <ReactMarkdown>{report}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ResearchReport; 