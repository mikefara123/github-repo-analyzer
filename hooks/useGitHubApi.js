import { useCallback } from 'react';
import { analyzeRepo } from '../utils/analyzer';
import { useAnalysis } from '../context/AnalysisContext';

/**
 * Custom hook for GitHub API interactions
 * @returns {Object} - GitHub API functions
 */
export function useGitHubApi() {
  const { 
    updateProgress, 
    startAnalysis, 
    storeResults, 
    handleError 
  } = useAnalysis();
  
  /**
   * Run a repository analysis with progress tracking
   * @param {string} repoUrl - The GitHub repository URL
   * @returns {Promise<Object>} - Analysis results
   */
  const runRepositoryAnalysis = useCallback(async (repoUrl) => {
    if (!repoUrl) {
      handleError('Please enter a valid GitHub repository URL');
      return null;
    }
    
    try {
      // Start analysis tracking
      startAnalysis(repoUrl);
      
      // Run the analysis
      const results = await analyzeRepo(repoUrl, updateProgress);
      
      // Store results
      storeResults(results);
      
      return results;
    } catch (error) {
      console.error('Analysis error:', error);
      handleError(
        `Error analyzing repository: ${error.message || 'Unknown error'}`
      );
      return null;
    }
  }, [updateProgress, startAnalysis, storeResults, handleError]);
  
  /**
   * Extract owner and repo from GitHub URL
   * @param {string} url - GitHub repository URL
   * @returns {Object|null} - Owner and repo names
   */
  const extractRepoInfo = useCallback((url) => {
    try {
      if (!url) return null;
      
      // Handle various GitHub URL formats
      const urlObj = new URL(url);
      if (urlObj.hostname !== 'github.com') {
        return null;
      }
      
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length < 2) {
        return null;
      }
      
      return {
        owner: pathParts[0],
        repo: pathParts[1]
      };
    } catch (error) {
      console.error('Error extracting repo info:', error);
      return null;
    }
  }, []);
  
  return {
    runRepositoryAnalysis,
    extractRepoInfo
  };
} 