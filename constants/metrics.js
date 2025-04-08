/**
 * Metrics definitions for the GitHub Repository Analyzer
 */

/**
 * Available metrics for repository analysis
 */
export const METRICS = {
  CODE_COMPLEXITY: 'codeComplexity',
  DOCUMENTATION: 'documentationCoverage',
  TEST_COVERAGE: 'testCoverage',
  STYLE_CONSISTENCY: 'styleConsistency',
  SECURITY: 'securityVulnerabilities',
  MAINTAINABILITY: 'maintainabilityIndex',
  CODE_DUPLICATION: 'codeDuplication',
  FILE_ORGANIZATION: 'fileOrganization',
  DEPENDENCY_MANAGEMENT: 'dependencyManagement'
};

/**
 * Metric descriptions for UI display
 */
export const METRIC_DESCRIPTIONS = {
  [METRICS.CODE_COMPLEXITY]: {
    title: 'Code Complexity',
    description: 'Evaluates the complexity and readability of the codebase.',
    icon: 'code',
    color: '#6366F1'
  },
  [METRICS.DOCUMENTATION]: {
    title: 'Documentation Coverage',
    description: 'Assesses the quality and completeness of documentation.',
    icon: 'file-text',
    color: '#F59E0B'
  },
  [METRICS.TEST_COVERAGE]: {
    title: 'Test Coverage',
    description: 'Measures the presence and quality of tests.',
    icon: 'check-circle',
    color: '#10B981'
  },
  [METRICS.STYLE_CONSISTENCY]: {
    title: 'Style Consistency',
    description: 'Evaluates code style and formatting consistency.',
    icon: 'check-square',
    color: '#8B5CF6'
  },
  [METRICS.SECURITY]: {
    title: 'Security Score',
    description: 'Identifies potential security vulnerabilities.',
    icon: 'shield',
    color: '#EF4444'
  },
  [METRICS.MAINTAINABILITY]: {
    title: 'Maintainability',
    description: 'Rates how maintainable the codebase is over time.',
    icon: 'tool',
    color: '#3B82F6'
  },
  [METRICS.CODE_DUPLICATION]: {
    title: 'Duplication Score',
    description: 'Identifies levels of code duplication.',
    icon: 'copy',
    color: '#EC4899'
  },
  [METRICS.FILE_ORGANIZATION]: {
    title: 'File Organization',
    description: 'Evaluates project structure and organization.',
    icon: 'folder',
    color: '#14B8A6'
  },
  [METRICS.DEPENDENCY_MANAGEMENT]: {
    title: 'Dependency Management',
    description: 'Assesses dependency handling practices.',
    icon: 'package',
    color: '#F97316'
  }
};

/**
 * Interpretation guidelines for metric scores
 */
export const SCORE_INTERPRETATIONS = {
  EXCELLENT: {
    range: [8, 10],
    label: 'Excellent',
    description: 'Following best practices',
    color: '#10B981' // Green
  },
  GOOD: {
    range: [6, 7.9],
    label: 'Good',
    description: 'Room for minor improvements',
    color: '#6366F1' // Indigo
  },
  FAIR: {
    range: [4, 5.9],
    label: 'Fair',
    description: 'Needs attention',
    color: '#F59E0B' // Amber
  },
  POOR: {
    range: [1, 3.9],
    label: 'Poor',
    description: 'Significant improvements needed',
    color: '#EF4444' // Red
  }
};

/**
 * Get score interpretation for a given score
 * @param {number} score - Score value (1-10)
 * @returns {Object} Score interpretation
 */
export function getScoreInterpretation(score) {
  if (score >= SCORE_INTERPRETATIONS.EXCELLENT.range[0] && 
      score <= SCORE_INTERPRETATIONS.EXCELLENT.range[1]) {
    return SCORE_INTERPRETATIONS.EXCELLENT;
  } 
  if (score >= SCORE_INTERPRETATIONS.GOOD.range[0] && 
      score <= SCORE_INTERPRETATIONS.GOOD.range[1]) {
    return SCORE_INTERPRETATIONS.GOOD;
  }
  if (score >= SCORE_INTERPRETATIONS.FAIR.range[0] && 
      score <= SCORE_INTERPRETATIONS.FAIR.range[1]) {
    return SCORE_INTERPRETATIONS.FAIR;
  }
  return SCORE_INTERPRETATIONS.POOR;
} 