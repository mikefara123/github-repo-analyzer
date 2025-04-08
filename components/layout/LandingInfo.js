import React from 'react';

/**
 * Landing page information component
 */
const LandingInfo = () => {
  return (
    <div className="landing-info landing-section">
      <div className="features-section">
        <h2>Metrics We Analyze</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Code Complexity</h3>
            <p>Analyzes code complexity and readability to ensure your code is maintainable.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Documentation Coverage</h3>
            <p>Evaluates the quality and completeness of your documentation.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🧪</div>
            <h3>Test Coverage</h3>
            <p>Checks for the presence and quality of tests in your codebase.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Style Consistency</h3>
            <p>Examines code style and formatting consistency throughout your project.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Security Score</h3>
            <p>Identifies potential security vulnerabilities in your codebase.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Maintainability</h3>
            <p>Measures how easy your codebase is to maintain over time.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Duplication Score</h3>
            <p>Identifies levels of code duplication to help keep your codebase DRY.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📁</div>
            <h3>File Organization</h3>
            <p>Evaluates project structure and organization for better maintainability.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Dependency Management</h3>
            <p>Assesses how well dependencies are managed in your project.</p>
          </div>
        </div>
      </div>
      
      <div className="how-it-works-section">
        <h2>How It Works</h2>
        
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Enter a GitHub Repository URL</h3>
              <p>Simply provide the URL of any public GitHub repository you want to analyze.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Automated Analysis</h3>
              <p>Our tool fetches repository data, examines code patterns, and calculates metrics.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get Detailed Results</h3>
              <p>View comprehensive metrics and actionable recommendations to improve your codebase.</p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .landing-info {
          margin-bottom: 3rem;
        }
        
        .intro-section {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #0070f3, #00c6ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .description {
          font-size: 1.2rem;
          color: #666;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        .features-section {
          margin-bottom: 4rem;
        }
        
        .features-section h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.8rem;
          color: #333;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .feature-card {
          background-color: #fff;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .feature-card h3 {
          margin: 0 0 0.75rem 0;
          color: #0070f3;
        }
        
        .feature-card p {
          margin: 0;
          color: #555;
          line-height: 1.5;
        }
        
        .how-it-works-section h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.8rem;
          color: #333;
        }
        
        .steps {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .step {
          display: flex;
          margin-bottom: 2rem;
          align-items: flex-start;
        }
        
        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: #0070f3;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          margin-right: 1.5rem;
          flex-shrink: 0;
        }
        
        .step-content {
          flex: 1;
        }
        
        .step-content h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }
        
        .step-content p {
          margin: 0;
          color: #555;
          line-height: 1.5;
        }
        
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .title {
            font-size: 2rem;
          }
          
          .description {
            font-size: 1rem;
          }
          
          .step {
            flex-direction: column;
          }
          
          .step-number {
            margin-bottom: 1rem;
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingInfo; 