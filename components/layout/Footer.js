import React from 'react';

/**
 * Application footer component
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="app-container">
        <div className="app-footer-content">
          <div className="app-footer-info">
            <p className="app-copyright">
              &copy; {currentYear} GitHub Repository Analyzer
            </p>
            <p className="app-license">
              Licensed under ISC
            </p>
          </div>
          
          <div className="app-footer-links">
            <a 
              href="https://github.com/mikefara123/github-repo-analyzer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="app-footer-link"
            >
              GitHub
            </a>
            <span className="app-divider">|</span>
            <a 
              href="https://github.com/mikefara123/github-repo-analyzer/issues" 
              target="_blank" 
              rel="noopener noreferrer"
              className="app-footer-link"
            >
              Report an Issue
            </a>
            <span className="app-divider">|</span>
            <a 
              href="https://github.com/mikefara123/github-repo-analyzer#contributing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="app-footer-link"
            >
              Contribute
            </a>
          </div>
        </div>
        
        <div className="app-disclaimer">
          <p>
            This tool is not affiliated with GitHub Inc. It uses the GitHub API to analyze repositories.
          </p>
        </div>
      </div>
    </footer>
  );
} 