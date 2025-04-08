import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AnalysisContext = createContext();

// Storage key for saved analyses
const STORAGE_KEY = 'github_repo_analyses';

/**
 * Provider component that wraps your app and makes analysis context available to any
 * child component that calls useAnalysis().
 */
export function AnalysisProvider({ children }) {
  // Analysis state
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ step: 'init', progress: 0 });
  const [repoUrl, setRepoUrl] = useState('');
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  
  // Load saved analyses from localStorage on initial mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedAnalyses = localStorage.getItem(STORAGE_KEY);
        if (storedAnalyses) {
          setSavedAnalyses(JSON.parse(storedAnalyses));
        }
      }
    } catch (error) {
      console.error('Error loading saved analyses:', error);
    }
  }, []);
  
  // Reset all analysis state
  const resetAnalysis = () => {
    setAnalysisResults(null);
    setIsAnalyzing(false);
    setError(null);
    setProgress({ step: 'init', progress: 0 });
  };
  
  // Store analysis results
  const storeResults = (results) => {
    setAnalysisResults(results);
    setIsAnalyzing(false);
    setProgress({ step: 'complete', progress: 100 });
  };
  
  // Update progress during analysis
  const updateProgress = (progressData) => {
    setProgress(progressData);
  };
  
  // Start a new analysis
  const startAnalysis = (url) => {
    setRepoUrl(url);
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResults(null);
    setProgress({ step: 'init', progress: 0 });
  };
  
  // Handle analysis error
  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsAnalyzing(false);
  };
  
  // Save analysis to localStorage
  const saveAnalysis = (analysis) => {
    try {
      if (typeof window !== 'undefined') {
        const updatedAnalyses = [analysis, ...savedAnalyses.filter(a => a.id !== analysis.id)];
        setSavedAnalyses(updatedAnalyses);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving analysis:', error);
      return false;
    }
  };
  
  // Get all saved analyses from state
  const getSavedAnalyses = () => {
    return savedAnalyses || [];
  };
  
  // Delete a saved analysis
  const deleteAnalysis = (analysisId) => {
    try {
      if (typeof window !== 'undefined') {
        const updatedAnalyses = savedAnalyses.filter(a => a.id !== analysisId);
        setSavedAnalyses(updatedAnalyses);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting analysis:', error);
      return false;
    }
  };
  
  // Context value
  const value = {
    analysisResults,
    isAnalyzing,
    error,
    progress,
    repoUrl,
    savedAnalyses,
    resetAnalysis,
    storeResults,
    updateProgress,
    startAnalysis,
    handleError,
    saveAnalysis,
    getSavedAnalyses,
    deleteAnalysis
  };
  
  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

/**
 * Hook that can be used by components to access the analysis context
 */
export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
} 