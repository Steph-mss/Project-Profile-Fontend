import { useState, useEffect } from 'react';
import './App.css';
import { SearchForm } from './components/SearchForm';
import { ResultView } from './components/ResultView';

const API_BASE = import.meta.env.VITE_API_URL;

function App() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('idle');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const MAX_POLLS = 60;


  useEffect(() => {
    if (!jobId || status === 'done' || status === 'failed') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/jobs/${jobId}`);
        if (!res.ok) throw new Error('Fetch failed');

        const data = await res.json();
        setStatus(data.status);

        if (data.status === 'done' || data.status === 'failed') {
          setResult(data.result);
          setIsLoading(false);
          setError(null);
          setPollCount(0);
        }

        // Timeout after MAX_POLLS
        setPollCount(c => {
          if (c + 1 >= MAX_POLLS) {
            setError('Timeout: La collecte a pris trop longtemps');
            setIsLoading(false);
            return 0;
          }
          return c + 1;
        });
      } catch (err) {
        console.error('Poll error:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [jobId, status]);

  const handleSearch = async (data: any) => {
    setIsLoading(true);
    setStatus('pending');
    setResult(null);
    setError(null);
    setPollCount(0);

    try {
      const res = await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (json.jobId) {
        setJobId(json.jobId);
      } else {
        throw new Error('Pas de jobId retourné');
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Erreur lors de la recherche');
      setStatus('failed');
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setJobId(null);
    setStatus('idle');
    setResult(null);
    setError(null);
    setIsLoading(false);
    setPollCount(0);
  };

  return (
    <div className="app-container">
      <header className="app-header fade-in">
        <h1>Profile Collector</h1>
        <p>Analyse de profils professionnels avec intelligence artificielle</p>
      </header>

      <main>
        <div className="main-content">
          {status !== 'done' && status !== 'failed' && (
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          )}

          {error && (
            <div className="error-banner fade-in">
              <span className="error-icon">⚠️</span>
              <div className="error-content">
                <h3>Erreur</h3>
                <p>{error}</p>
              </div>
              <button className="error-close" onClick={handleReset}>✕</button>
            </div>
          )}

          {status === 'pending' && !result && !error && (
            <div className="status-indicator fade-in">
              <div className="loading-spinner"></div>
              <div className="loading-content">
                <p className="loading-title">Analyse en cours...</p>
                <p className="loading-desc">Collecte multi-sources : LinkedIn, Pappers, Societe.com</p>
                <div className="poll-progress">
                  <div className="poll-bar" style={{ width: `${(pollCount / MAX_POLLS) * 100}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="slide-in">
              <ResultView result={result} status={status} onReset={handleReset} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;