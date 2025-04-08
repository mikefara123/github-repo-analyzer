import { useState, useEffect } from 'react';
import Head from 'next/head';
import io from 'socket.io-client';
import MetricsDisplay from '../components/metrics/MetricsDisplay';
import RepoForm from '../components/common/RepoForm';
import ProgressBar from '../components/common/ProgressBar';
import AnalysisLog from '../components/common/AnalysisLog';
import StatusIndicator from '../components/common/StatusIndicator';
import LandingInfo from '../components/layout/LandingInfo';
import { useAnalysis } from '../context/AnalysisContext';
import { formatDate } from '../utils/formatters';
import { getScoreInterpretation } from '../constants/metrics';

// Initialize socket state
let socket;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('init');
  const [socketConnected, setSocketConnected] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [comparing, setComparing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  
  const { saveAnalysis, getSavedAnalyses, deleteAnalysis } = useAnalysis();
  
  useEffect(() => {
    // Only attempt to load analyses if the component is mounted
    let isMounted = true;
    
    try {
      // Load saved analyses when component mounts
      if (typeof getSavedAnalyses === 'function') {
        const analyses = getSavedAnalyses();
        if (isMounted && Array.isArray(analyses)) {
          setSavedAnalyses(analyses);
          
          // If we have saved analyses, show the most recent one
          if (analyses.length > 0) {
            setActiveAnalysis(analyses[0]);
            setResults(analyses[0].results);
          }
        }
      }
    } catch (error) {
      console.error('Error loading saved analyses:', error);
    }
    
    // Initialize socket connection
    initSocket();
    
    // Cleanup socket on unmount
    return () => {
      isMounted = false;
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);
  
  const initSocket = async () => {
    try {
      // Make sure we're on the client side
      if (typeof window === 'undefined') return;
      
      // Initialize socket connection
      console.log('Fetching socket endpoint');
      const fetchResponse = await fetch('/api/socket');
      console.log('Socket endpoint response:', fetchResponse.status);
      
      // Create socket with correct configuration
      console.log('Creating socket with path /api/socketio');
      socket = io({
        path: '/api/socketio',
        addTrailingSlash: false
      });
      
      console.log('Socket connection attempt started');
      
      socket.on('connect', () => {
        console.log('Socket connected successfully:', socket.id);
        setSocketConnected(true);
      });
      
      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message, err);
        setError(`Connection error: ${err.message}`);
      });
      
      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setSocketConnected(false);
      });
      
      socket.on('progress', (data) => {
        console.log('Progress update received:', data);
        setProgress(data.progress);
        setCurrentStep(data.step);
      });
      
      socket.on('analysisResults', (data) => {
        console.log('Analysis results received:', data);
        if (data.status === 'success') {
          const analysisResults = data.results;
          setResults(analysisResults);
          setLoading(false);
          setProgress(100);
          setCurrentStep('complete');
          
          // Save the analysis
          const newAnalysis = {
            id: Date.now().toString(),
            repoName: data.repoName || 'Unknown Repository',
            timestamp: new Date().toISOString(),
            results: analysisResults
          };
          
          if (typeof saveAnalysis === 'function') {
            saveAnalysis(newAnalysis);
          }
          
          setActiveAnalysis(newAnalysis);
          setSavedAnalyses(prev => [newAnalysis, ...prev]);
        } else {
          setError(data.error || 'An error occurred during analysis');
          setLoading(false);
        }
      });
      
      socket.on('error', (error) => {
        console.error('Socket error event received:', error);
        setError(error.message || 'An error occurred');
        setLoading(false);
      });
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      setError('Failed to connect to analysis server. Please try again.');
      setLoading(false);
    }
  };
  
  const cancelAnalysis = () => {
    if (socket) {
      socket.emit('cancelAnalysis');
      setLoading(false);
      setProgress(0);
      setCurrentStep('init');
    }
  };
  
  const analyzeRepo = async (repoUrl) => {
    if (!repoUrl) {
      setError('Please enter a GitHub repository URL');
      return;
    }
    
    setError(null);
    setLoading(true);
    setProgress(0);
    setCurrentStep('init');
    
    try {
      // Check if socket is connected, if not initialize it
      if (!socket || !socketConnected) {
        await initSocket();
      }
      
      console.log('Analyzing repository:', repoUrl);
      
      // Emit analysis request to server
      socket.emit('analyzeRepo', {
        repoUrl,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error starting analysis:', error);
      setError('Could not connect to analysis server. Please try again.');
      setLoading(false);
    }
  };
  
  const viewSavedAnalysis = (analysisId) => {
    const analysis = savedAnalyses.find(a => a.id === analysisId);
    if (analysis) {
      setActiveAnalysis(analysis);
      setResults(analysis.results);
    }
  };

  const deleteSavedAnalysis = (analysisId, event) => {
    event.stopPropagation();
    
    // Use the context's deleteAnalysis function if available
    if (typeof deleteAnalysis === 'function') {
      deleteAnalysis(analysisId);
    }
    
    // Update local state
    const newAnalyses = savedAnalyses.filter(a => a.id !== analysisId);
    setSavedAnalyses(newAnalyses);
    
    // If we're deleting the currently viewed analysis, show the most recent one
    if (activeAnalysis && activeAnalysis.id === analysisId) {
      if (newAnalyses.length > 0) {
        setActiveAnalysis(newAnalyses[0]);
        setResults(newAnalyses[0].results);
      } else {
        setActiveAnalysis(null);
        setResults(null);
      }
    }
  };

  const toggleComparison = () => {
    setComparing(!comparing);
  };

  return (
    <div className="container">
      <Head>
        <title>GitHub Repository Analyzer</title>
        <meta name="description" content="Analyze GitHub repositories and rate them on various metrics" />
      </Head>

      <main>
        <h1 className="title">GitHub Repository Analyzer</h1>
        <p className="description">
          Analyze repositories and get detailed metrics on code quality
        </p>
        
        {error && (
          <div className="error">
            {error}
          </div>
        )}
        
        {!loading && !activeAnalysis && (
          <LandingInfo />
        )}
        
        {!loading && (
          <RepoForm onSubmit={analyzeRepo} />
        )}
        
        {loading && (
          <div className="analysis-container">
            <h2>Analyzing Repository</h2>
            <div className="actions">
              <button 
                className="cancel-button"
                onClick={cancelAnalysis}
              >
                Cancel Analysis
              </button>
            </div>
            <StatusIndicator currentStep={currentStep} progress={progress} />
            <ProgressBar progress={progress} step={currentStep !== 'init' ? `Step: ${currentStep}` : 'Initializing'} />
            <AnalysisLog currentStep={currentStep} progress={progress} />
          </div>
        )}

        {!loading && savedAnalyses.length > 0 && (
          <div className="saved-analyses">
            <div className="saved-header">
              <h3>Saved Analyses</h3>
              {savedAnalyses.length > 1 && (
                <button 
                  className="compare-button"
                  onClick={toggleComparison}
                >
                  {comparing ? 'Hide Comparison' : 'Compare Repositories'}
                </button>
              )}
            </div>
            <div className={`analyses-list ${comparing ? 'comparison-mode' : ''}`}>
              {savedAnalyses.map((analysis) => (
                <div 
                  key={analysis.id}
                  className={`analysis-item ${activeAnalysis && activeAnalysis.id === analysis.id ? 'active' : ''}`}
                  onClick={() => viewSavedAnalysis(analysis.id)}
                >
                  <div className="analysis-info">
                    <div className="repo-name">{analysis.repoName}</div>
                    <div className="analysis-date">{formatDate(analysis.timestamp)}</div>
                    <div className="analysis-score">
                      Score: <span className={`score-${getScoreInterpretation(analysis.results.overallScore).label.toLowerCase()}`}>
                        {analysis.results.overallScore.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                  <button 
                    className="delete-button"
                    onClick={(e) => deleteSavedAnalysis(analysis.id, e)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeAnalysis && !loading && (
          <div className="results">
            <h2>
              {comparing ? 'Repository Comparison' : 'Analysis Results'}
              {comparing && <span className="comparison-note">(Scroll right to view all repositories)</span>}
            </h2>
            <div className={`results-container ${comparing ? 'comparison-view' : ''}`}>
              {comparing ? (
                savedAnalyses.map(analysis => (
                  <div key={analysis.id} className="comparison-column">
                    <h3 className="comparison-title">{analysis.repoName}</h3>
                    <MetricsDisplay results={analysis.results} />
                  </div>
                ))
              ) : (
                <MetricsDisplay results={results} />
              )}
            </div>
          </div>
        )}
      </main>

      <footer>
        <p>
          Analyze and rate GitHub repositories based on code quality metrics
        </p>
        <p className="github-link">
          <a href="https://github.com/yourusername/github-repo-analyzer" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
} 