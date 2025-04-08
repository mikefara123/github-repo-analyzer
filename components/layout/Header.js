import React from 'react';
import Link from 'next/link';

/**
 * Application header component
 */
export default function Header() {
  return (
    <header className="app-header">
      <div className="app-container">
        <Link href="/" className="app-logo">
          <span className="app-logo-icon">📊</span>
          <span className="app-logo-text">GitHub Repo Analyzer</span>
        </Link>
        
        <nav className="app-nav">
          <Link href="/" className="app-nav-link">
            Home
          </Link>
          <Link href="/about" className="app-nav-link">
            About
          </Link>
          <a 
            href="https://github.com/mikefara123/github-repo-analyzer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="app-nav-link app-nav-link-github"
          >
            <span className="app-github-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </span>
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
} 