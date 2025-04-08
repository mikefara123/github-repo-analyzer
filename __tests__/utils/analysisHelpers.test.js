import { 
  calculateOverallScore,
  getScoreCategory,
  formatMetricName,
  validateGithubUrl
} from '../../utils/analysisHelpers';

describe('Analysis Helper Functions', () => {
  describe('calculateOverallScore', () => {
    it('calculates the average of all metrics', () => {
      const metrics = {
        codeComplexity: 8.0,
        styleConsistency: 7.0,
        documentationCoverage: 6.0,
        testCoverage: 9.0,
        securityVulnerabilities: 8.0,
        codeDuplication: 7.0,
        fileOrganization: 8.0,
        dependencyManagement: 7.5,
        maintainabilityIndex: 8.0
      };
      
      const result = calculateOverallScore(metrics);
      
      // Average of all metrics (rounded to 1 decimal place)
      expect(result).toBeCloseTo(7.6, 1);
    });
    
    it('returns 0 if no metrics are provided', () => {
      const result = calculateOverallScore({});
      expect(result).toBe(0);
    });
    
    it('handles undefined or null metrics', () => {
      const metrics = {
        codeComplexity: 8.0,
        styleConsistency: null,
        documentationCoverage: undefined,
        testCoverage: 9.0
      };
      
      const result = calculateOverallScore(metrics);
      
      // Should only calculate average for valid metrics
      expect(result).toBeCloseTo(8.5, 1);
    });
  });
  
  describe('getScoreCategory', () => {
    it('returns "Good" for scores >= 7', () => {
      expect(getScoreCategory(7.0)).toBe('Good');
      expect(getScoreCategory(8.5)).toBe('Good');
      expect(getScoreCategory(10.0)).toBe('Good');
    });
    
    it('returns "Fair" for scores >= 4 and < 7', () => {
      expect(getScoreCategory(4.0)).toBe('Fair');
      expect(getScoreCategory(5.5)).toBe('Fair');
      expect(getScoreCategory(6.9)).toBe('Fair');
    });
    
    it('returns "Poor" for scores < 4', () => {
      expect(getScoreCategory(0)).toBe('Poor');
      expect(getScoreCategory(2.5)).toBe('Poor');
      expect(getScoreCategory(3.9)).toBe('Poor');
    });
  });
  
  describe('formatMetricName', () => {
    it('formats camelCase metric names to readable text', () => {
      expect(formatMetricName('codeComplexity')).toBe('Code Complexity');
      expect(formatMetricName('testCoverage')).toBe('Test Coverage');
      expect(formatMetricName('securityVulnerabilities')).toBe('Security Vulnerabilities');
    });
    
    it('handles single word metrics', () => {
      expect(formatMetricName('performance')).toBe('Performance');
    });
    
    it('returns empty string for undefined or null input', () => {
      expect(formatMetricName(undefined)).toBe('');
      expect(formatMetricName(null)).toBe('');
    });
  });
  
  describe('validateGithubUrl', () => {
    it('returns true for valid GitHub repository URLs', () => {
      expect(validateGithubUrl('https://github.com/username/repo')).toBe(true);
      expect(validateGithubUrl('http://github.com/username/repo')).toBe(true);
      expect(validateGithubUrl('https://github.com/username/repo-name')).toBe(true);
      expect(validateGithubUrl('https://github.com/org-name/repo-name')).toBe(true);
    });
    
    it('returns false for invalid GitHub repository URLs', () => {
      expect(validateGithubUrl('')).toBe(false);
      expect(validateGithubUrl('github.com/username/repo')).toBe(false);
      expect(validateGithubUrl('https://example.com/username/repo')).toBe(false);
      expect(validateGithubUrl('https://github.com')).toBe(false);
      expect(validateGithubUrl('https://github.com/username')).toBe(false);
    });
  });
}); 