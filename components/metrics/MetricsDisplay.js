import React, { useState } from 'react';
import { getScoreInterpretation } from '../../constants/metrics';
import MetricsRadarChart from '../charts/MetricsRadarChart';

/**
 * Component that displays the metrics analysis results
 */
export default function MetricsDisplay({ results }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!results) return null;
  
  // Get metrics from results, excluding non-metric properties
  const metrics = Object.entries(results).filter(([key]) => 
    typeof results[key] === 'number' && 
    key !== 'overallScore' && 
    key !== 'commitHistory'
  );
  
  /**
   * Get score interpretation CSS class
   */
  const getScoreClass = (score) => {
    const interpretation = getScoreInterpretation(score);
    return `score-${interpretation.label.toLowerCase()}`;
  };
  
  /**
   * Generates recommendations based on metrics
   */
  const getRecommendations = () => {
    const recommendations = [];
    
    // Add recommendations based on low scores
    metrics.forEach(([key, score]) => {
      if (score < 5) {
        switch (key) {
          case 'codeComplexity':
            recommendations.push({
              title: 'Improve Code Complexity',
              description: 'Consider refactoring complex functions into smaller, more manageable pieces.'
            });
            break;
          case 'documentationCoverage':
            recommendations.push({
              title: 'Enhance Documentation',
              description: 'Add more comprehensive README files and code comments to improve documentation.'
            });
            break;
          case 'testCoverage':
            recommendations.push({
              title: 'Increase Test Coverage',
              description: 'Add more unit and integration tests to improve code reliability.'
            });
            break;
          case 'styleConsistency':
            recommendations.push({
              title: 'Standardize Code Style',
              description: 'Implement linting tools and style guides to ensure consistent formatting.'
            });
            break;
          case 'securityVulnerabilities':
            recommendations.push({
              title: 'Address Security Issues',
              description: 'Conduct security audits and implement vulnerability scanning in your CI/CD pipeline.'
            });
            break;
          case 'maintainabilityIndex':
            recommendations.push({
              title: 'Improve Maintainability',
              description: 'Reduce technical debt by refactoring complex code and improving architecture.'
            });
            break;
          case 'codeDuplication':
            recommendations.push({
              title: 'Reduce Code Duplication',
              description: 'Extract duplicated code into reusable functions or components.'
            });
            break;
          case 'fileOrganization':
            recommendations.push({
              title: 'Enhance Project Structure',
              description: 'Reorganize files into a more logical structure with clear separation of concerns.'
            });
            break;
          case 'dependencyManagement':
            recommendations.push({
              title: 'Improve Dependency Management',
              description: 'Update outdated dependencies and implement proper versioning strategies.'
            });
            break;
          default:
            break;
        }
      }
    });
    
    // If all scores are good, provide general recommendations
    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Maintain Current Standards',
        description: 'Your codebase is in good shape! Continue maintaining the current development practices.'
      });
    }
    
    return recommendations;
  };
  
  /**
   * Render metric details by category
   */
  const renderMetricDetails = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="metrics-overview">
            <h3>Overall Score: {results.overallScore.toFixed(1)}/10</h3>
            <div className="score-interpretation">
              <span className={getScoreClass(results.overallScore)}>
                {getScoreInterpretation(results.overallScore).label}
              </span>
              <p>{getScoreInterpretation(results.overallScore).description}</p>
            </div>
            
            <div className="metrics-summary">
              <h4>Summary</h4>
              <ul>
                {metrics.map(([key, value]) => (
                  <li key={key}>
                    <span className="metric-name">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                    </span>
                    <span className={`metric-score ${getScoreClass(value)}`}>
                      {value.toFixed(1)}/10
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="metrics-chart">
              <MetricsRadarChart metrics={metrics} />
            </div>
          </div>
        );
      
      case 'recommendations':
        return (
          <div className="recommendations">
            <h3>Recommendations</h3>
            <ul className="recommendations-list">
              {getRecommendations().map((rec, index) => (
                <li key={index} className="recommendation-item">
                  <h4>{rec.title}</h4>
                  <p>{rec.description}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      
      case 'code':
        return (
          <div className="code-quality">
            <h3>Code Quality</h3>
            <div className="metrics-group">
              <h4>Code Structure</h4>
              <div className="metric-detail">
                <span>Code Complexity:</span>
                <span className={`metric-score ${getScoreClass(results.codeComplexity)}`}>
                  {results.codeComplexity.toFixed(1)}/10
                </span>
                <p>Measures the complexity and readability of your codebase.</p>
              </div>
              
              <div className="metric-detail">
                <span>Code Duplication:</span>
                <span className={`metric-score ${getScoreClass(results.codeDuplication)}`}>
                  {results.codeDuplication.toFixed(1)}/10
                </span>
                <p>Evaluates the level of code duplication in your repository.</p>
              </div>
              
              <div className="metric-detail">
                <span>Style Consistency:</span>
                <span className={`metric-score ${getScoreClass(results.styleConsistency)}`}>
                  {results.styleConsistency.toFixed(1)}/10
                </span>
                <p>Measures the consistency of code style and formatting.</p>
              </div>
            </div>
          </div>
        );
      
      case 'infra':
        return (
          <div className="infrastructure">
            <h3>Infrastructure & Organization</h3>
            <div className="metrics-group">
              <div className="metric-detail">
                <span>File Organization:</span>
                <span className={`metric-score ${getScoreClass(results.fileOrganization)}`}>
                  {results.fileOrganization.toFixed(1)}/10
                </span>
                <p>Evaluates the structure and organization of your project files.</p>
              </div>
              
              <div className="metric-detail">
                <span>Dependency Management:</span>
                <span className={`metric-score ${getScoreClass(results.dependencyManagement)}`}>
                  {results.dependencyManagement.toFixed(1)}/10
                </span>
                <p>Assesses how well dependencies are managed in your project.</p>
              </div>
              
              {results.commitHistory && (
                <div className="metric-detail">
                  <span>Commit History:</span>
                  <span className={`metric-score ${getScoreClass(results.commitHistory)}`}>
                    {results.commitHistory.toFixed(1)}/10
                  </span>
                  <p>Evaluates commit patterns and frequency.</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="security">
            <h3>Security & Maintainability</h3>
            <div className="metrics-group">
              <div className="metric-detail">
                <span>Security Score:</span>
                <span className={`metric-score ${getScoreClass(results.securityVulnerabilities)}`}>
                  {results.securityVulnerabilities.toFixed(1)}/10
                </span>
                <p>Evaluates potential security vulnerabilities in your codebase.</p>
              </div>
              
              <div className="metric-detail">
                <span>Maintainability:</span>
                <span className={`metric-score ${getScoreClass(results.maintainabilityIndex)}`}>
                  {results.maintainabilityIndex.toFixed(1)}/10
                </span>
                <p>Measures how maintainable your codebase is over time.</p>
              </div>
            </div>
          </div>
        );
      
      case 'documentation':
        return (
          <div className="documentation">
            <h3>Documentation & Testing</h3>
            <div className="metrics-group">
              <div className="metric-detail">
                <span>Documentation Coverage:</span>
                <span className={`metric-score ${getScoreClass(results.documentationCoverage)}`}>
                  {results.documentationCoverage.toFixed(1)}/10
                </span>
                <p>Evaluates the quality and completeness of documentation.</p>
              </div>
              
              <div className="metric-detail">
                <span>Test Coverage:</span>
                <span className={`metric-score ${getScoreClass(results.testCoverage)}`}>
                  {results.testCoverage.toFixed(1)}/10
                </span>
                <p>Measures the presence and quality of tests in your codebase.</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="metrics-display">
      <div className="metrics-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'recommendations' ? 'active' : ''} 
          onClick={() => setActiveTab('recommendations')}
        >
          Recommendations
        </button>
        <button 
          className={activeTab === 'code' ? 'active' : ''} 
          onClick={() => setActiveTab('code')}
        >
          Code Quality
        </button>
        <button 
          className={activeTab === 'documentation' ? 'active' : ''} 
          onClick={() => setActiveTab('documentation')}
        >
          Documentation & Tests
        </button>
        <button 
          className={activeTab === 'security' ? 'active' : ''} 
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
        <button 
          className={activeTab === 'infra' ? 'active' : ''} 
          onClick={() => setActiveTab('infra')}
        >
          Organization
        </button>
      </div>
      
      <div className="metrics-content">
        {renderMetricDetails()}
      </div>
    </div>
  );
} 