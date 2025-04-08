import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricsDisplay from '../../../components/metrics/MetricsDisplay';

// Create mock analysis data for testing
const mockAnalysisData = {
  overallScore: 7.5,
  metrics: {
    codeComplexity: 8.0,
    styleConsistency: 7.0,
    documentationCoverage: 6.0,
    testCoverage: 9.0,
    securityVulnerabilities: 8.0,
    codeDuplication: 7.0,
    fileOrganization: 8.0,
    dependencyManagement: 7.5,
    maintainabilityIndex: 8.0
  },
  recommendations: [
    'Improve documentation coverage by adding more inline comments',
    'Fix style inconsistencies in the src/components directory',
    'Remove duplicate code in utility functions'
  ]
};

describe('MetricsDisplay Component', () => {
  it('renders the metrics display with all metrics', () => {
    render(<MetricsDisplay analysisData={mockAnalysisData} />);
    
    // Check for overall score
    expect(screen.getByText(/overall score/i)).toBeInTheDocument();
    expect(screen.getByText('7.5/10')).toBeInTheDocument();
    
    // Check for metric categories
    expect(screen.getByText(/code complexity/i)).toBeInTheDocument();
    expect(screen.getByText(/style consistency/i)).toBeInTheDocument();
    expect(screen.getByText(/documentation coverage/i)).toBeInTheDocument();
    expect(screen.getByText(/test coverage/i)).toBeInTheDocument();
    expect(screen.getByText(/security vulnerabilities/i)).toBeInTheDocument();
    expect(screen.getByText(/code duplication/i)).toBeInTheDocument();
    expect(screen.getByText(/file organization/i)).toBeInTheDocument();
    expect(screen.getByText(/dependency management/i)).toBeInTheDocument();
    expect(screen.getByText(/maintainability index/i)).toBeInTheDocument();
    
    // Check for recommendations section
    expect(screen.getByText(/recommendations/i)).toBeInTheDocument();
    
    // Check that individual recommendations are rendered
    mockAnalysisData.recommendations.forEach(recommendation => {
      expect(screen.getByText(recommendation)).toBeInTheDocument();
    });
  });
  
  it('displays appropriate status based on score ranges', () => {
    render(<MetricsDisplay analysisData={mockAnalysisData} />);
    
    // Check for appropriate status indicators
    // Scores above 7.0 should be marked as "Good"
    expect(screen.getAllByText('Good').length).toBeGreaterThan(0);
    
    // Scores between 4.0 and 7.0 should be marked as "Fair"
    expect(screen.getAllByText('Fair').length).toBeGreaterThan(0);
    
    // Note: Our mock data doesn't have any "Poor" scores (below 4.0)
  });
  
  it('renders empty state when no data is provided', () => {
    render(<MetricsDisplay analysisData={null} />);
    
    // Should show a message indicating no data
    expect(screen.getByText(/no analysis data available/i)).toBeInTheDocument();
  });
}); 