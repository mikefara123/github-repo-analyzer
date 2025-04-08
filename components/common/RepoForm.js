import React, { useState } from 'react';
import { useGitHubApi } from '../../hooks/useGitHubApi';

/**
 * Form component for entering GitHub repository URLs
 */
const RepoForm = ({ onSubmit, loading }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const { extractRepoInfo } = useGitHubApi();

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate the URL before submitting
    const repoInfo = extractRepoInfo(repoUrl);
    if (!repoInfo) {
      alert('Please enter a valid GitHub repository URL');
      return;
    }
    
    onSubmit(repoUrl);
  };

  /**
   * Set an example repository URL
   */
  const setExampleRepo = (url) => {
    setRepoUrl(url);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/username/repo"
          className="input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="button"
          disabled={loading || !repoUrl.trim()}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      <div className="examples">
        <p>Examples to try:</p>
        <ul>
          <li>
            <button 
              className="example-button" 
              onClick={() => setExampleRepo('https://github.com/facebook/react')}
              disabled={loading}
            >
              facebook/react
            </button>
          </li>
          <li>
            <button 
              className="example-button" 
              onClick={() => setExampleRepo('https://github.com/vercel/next.js')}
              disabled={loading}
            >
              vercel/next.js
            </button>
          </li>
          <li>
            <button 
              className="example-button" 
              onClick={() => setExampleRepo('https://github.com/nodejs/node')}
              disabled={loading}
            >
              nodejs/node
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RepoForm; 