import { SearchProvider } from './contexts/SearchContext';
import SearchForm from './components/SearchForm';
import ProgressTracker from './components/ProgressTracker';
import StepDetails from './components/StepDetails';
import SearchStats from './components/SearchStats';
import ResearchReport from './components/ResearchReport';
import './App.css';

function App() {
  return (
    <div className="app">
      <SearchProvider>
        <div className="app-container">
          <SearchForm />
          <ProgressTracker />
          <StepDetails />
          <SearchStats />
          <ResearchReport />
        </div>
      </SearchProvider>
    </div>
  );
}

export default App;
