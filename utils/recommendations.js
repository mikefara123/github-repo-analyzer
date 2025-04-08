/**
 * Utility for generating recommendations based on analysis results
 */
import { METRICS } from '../constants/metrics';

/**
 * Recommendation categories
 */
export const RECOMMENDATION_CATEGORIES = {
  CODE_QUALITY: 'codeQuality',
  DOCUMENTATION: 'documentation',
  TESTING: 'testing',
  ORGANIZATION: 'organization',
  SECURITY: 'security',
  MAINTENANCE: 'maintenance'
};

/**
 * Generate recommendations based on analysis results
 * @param {Object} results - Analysis results object
 * @returns {Array} - Array of recommendation objects
 */
export function generateRecommendations(results) {
  if (!results) return [];
  
  const recommendations = [];
  
  // Add recommendations for each metric that needs improvement
  Object.entries(results).forEach(([key, score]) => {
    // Skip non-metric properties and good scores (>= 7)
    if (typeof score !== 'number' || score >= 7 || key === 'overallScore') {
      return;
    }
    
    // Low score recommendations (< 4) 
    if (score < 4) {
      const lowScoreRec = getLowScoreRecommendation(key);
      if (lowScoreRec) {
        recommendations.push({
          ...lowScoreRec,
          priority: 'high',
          score
        });
      }
    } 
    // Medium score recommendations (4-6)
    else if (score < 7) {
      const mediumScoreRec = getMediumScoreRecommendation(key);
      if (mediumScoreRec) {
        recommendations.push({
          ...mediumScoreRec,
          priority: 'medium',
          score
        });
      }
    }
  });
  
  // If all scores are good, provide a general recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Maintain Current Quality Standards',
      description: 'Your repository demonstrates good software engineering practices. Continue maintaining these standards as the project evolves.',
      category: RECOMMENDATION_CATEGORIES.MAINTENANCE,
      priority: 'low',
      score: 10
    });
  }
  
  return recommendations;
}

/**
 * Get recommendation for low score metrics (below 4)
 */
function getLowScoreRecommendation(metricKey) {
  switch (metricKey) {
    case METRICS.CODE_COMPLEXITY:
      return {
        title: 'Significantly Improve Code Complexity',
        description: 'Your codebase has high complexity issues. Consider a major refactoring effort to break down complex functions into smaller, more manageable pieces with clear responsibilities. Implement a maximum complexity rule in your linting configuration.',
        category: RECOMMENDATION_CATEGORIES.CODE_QUALITY,
        actions: [
          'Break down functions longer than 30 lines into smaller functions',
          'Reduce nested conditionals using guard clauses and early returns',
          'Extract complex logic into helper functions with descriptive names',
          'Consider applying the Single Responsibility Principle to classes/modules'
        ]
      };
      
    case METRICS.DOCUMENTATION:
      return {
        title: 'Create Comprehensive Documentation',
        description: 'Your repository lacks essential documentation. Create thorough documentation including a detailed README, installation instructions, usage examples, and API documentation where applicable.',
        category: RECOMMENDATION_CATEGORIES.DOCUMENTATION,
        actions: [
          'Create a comprehensive README with project overview, installation, and usage instructions',
          'Add inline code documentation for public APIs and complex logic',
          'Create contributing guidelines and a code of conduct',
          'Add examples showing how to use your main features'
        ]
      };
      
    case METRICS.TEST_COVERAGE:
      return {
        title: 'Implement a Testing Strategy',
        description: 'Your repository has minimal or no tests. Implement a comprehensive testing strategy including unit, integration, and possibly end-to-end tests.',
        category: RECOMMENDATION_CATEGORIES.TESTING,
        actions: [
          'Set up a testing framework appropriate for your project',
          'Start writing unit tests for core functionality',
          'Implement integration tests for key workflows',
          'Configure a CI pipeline to run tests automatically',
          'Track test coverage and set goals for improvement'
        ]
      };
      
    case METRICS.STYLE_CONSISTENCY:
      return {
        title: 'Establish Code Style Standards',
        description: 'Your codebase lacks consistent styling. Implement code formatting tools and linting to ensure consistency throughout the project.',
        category: RECOMMENDATION_CATEGORIES.CODE_QUALITY,
        actions: [
          'Add ESLint, Prettier, or similar tools for your language',
          'Configure style rules that match team preferences',
          'Add pre-commit hooks to enforce style guidelines',
          'Run a formatter on the entire codebase to establish a baseline'
        ]
      };
      
    case METRICS.SECURITY:
      return {
        title: 'Address Critical Security Issues',
        description: 'Your repository has significant security concerns. Conduct a security audit and implement security best practices throughout the codebase.',
        category: RECOMMENDATION_CATEGORIES.SECURITY,
        actions: [
          'Conduct a security audit to identify vulnerabilities',
          'Add security-focused linting rules',
          'Implement input validation for all user inputs',
          'Review and update dependencies with known vulnerabilities',
          'Implement proper authentication and authorization mechanisms'
        ]
      };
      
    case METRICS.MAINTAINABILITY:
      return {
        title: 'Improve Code Maintainability',
        description: 'Your codebase has significant maintainability issues. Focus on reducing technical debt through refactoring, better architecture, and clearer code organization.',
        category: RECOMMENDATION_CATEGORIES.MAINTENANCE,
        actions: [
          'Identify and refactor areas with high complexity',
          'Improve naming conventions for better code readability',
          'Ensure consistent code patterns throughout the project',
          'Break down large files into more manageable modules',
          'Document architectural decisions and data flows'
        ]
      };
      
    case METRICS.CODE_DUPLICATION:
      return {
        title: 'Eliminate Code Duplication',
        description: 'Your codebase contains significant duplication. Identify and refactor duplicated code into reusable functions, components, or modules.',
        category: RECOMMENDATION_CATEGORIES.CODE_QUALITY,
        actions: [
          'Run a code duplication detection tool to identify problem areas',
          'Extract common logic into shared utilities or helper functions',
          'Implement DRY (Don\'t Repeat Yourself) principles throughout the codebase',
          'Consider design patterns that can help eliminate duplication'
        ]
      };
      
    case METRICS.FILE_ORGANIZATION:
      return {
        title: 'Restructure Project Organization',
        description: 'Your repository structure needs significant improvement. Reorganize files and directories to follow standard practices for your technology stack.',
        category: RECOMMENDATION_CATEGORIES.ORGANIZATION,
        actions: [
          'Research standard project structures for your framework/language',
          'Group files by feature/module rather than by type',
          'Create clear separation between different layers of the application',
          'Document the directory structure in your README'
        ]
      };
      
    case METRICS.DEPENDENCY_MANAGEMENT:
      return {
        title: 'Implement Proper Dependency Management',
        description: 'Your repository needs a better approach to managing dependencies. Implement proper versioning and maintenance of dependencies.',
        category: RECOMMENDATION_CATEGORIES.MAINTENANCE,
        actions: [
          'Pin dependency versions to avoid unexpected changes',
          'Regular audit dependencies for vulnerabilities',
          'Document dependency requirements clearly',
          'Consider using a dependency management tool',
          'Remove unused dependencies to reduce project bloat'
        ]
      };
      
    default:
      return null;
  }
}

/**
 * Get recommendation for medium score metrics (4-6)
 */
function getMediumScoreRecommendation(metricKey) {
  switch (metricKey) {
    case METRICS.CODE_COMPLEXITY:
      return {
        title: 'Reduce Code Complexity',
        description: 'Some parts of your codebase have moderate complexity issues. Focus on simplifying the most complex functions and implementing consistent patterns.',
        category: RECOMMENDATION_CATEGORIES.CODE_QUALITY,
        actions: [
          'Identify and refactor the most complex functions',
          'Use more descriptive variable and function names',
          'Break up long methods into smaller, focused ones'
        ]
      };
      
    case METRICS.DOCUMENTATION:
      return {
        title: 'Enhance Documentation',
        description: 'Your documentation provides basic information but could be improved. Add more detailed explanations, examples, and keep documentation updated with code changes.',
        category: RECOMMENDATION_CATEGORIES.DOCUMENTATION,
        actions: [
          'Add more code examples to the README',
          'Improve API documentation with more details',
          'Create a changelog to track project changes'
        ]
      };
      
    case METRICS.TEST_COVERAGE:
      return {
        title: 'Expand Test Coverage',
        description: 'Your project has some tests, but coverage could be improved. Focus on increasing test coverage for critical components and edge cases.',
        category: RECOMMENDATION_CATEGORIES.TESTING,
        actions: [
          'Identify and test critical paths and error conditions',
          'Add tests for edge cases and boundary conditions',
          'Implement more integration tests for component interactions'
        ]
      };
      
    case METRICS.STYLE_CONSISTENCY:
      return {
        title: 'Improve Code Style Consistency',
        description: 'Your codebase shows some style inconsistencies. Strengthen your linting rules and ensure they are applied across the entire project.',
        category: RECOMMENDATION_CATEGORIES.CODE_QUALITY,
        actions: [
          'Update linting configuration to catch more style issues',
          'Ensure all team members follow the same style guide',
          'Consider using automated formatting on save'
        ]
      };
      
    case METRICS.SECURITY:
      return {
        title: 'Strengthen Security Practices',
        description: 'Your repository has some security considerations, but could benefit from more robust security practices.',
        category: RECOMMENDATION_CATEGORIES.SECURITY,
        actions: [
          'Implement more thorough input validation',
          'Regularly update dependencies to patch vulnerabilities',
          'Add security-focused automated tests'
        ]
      };
      
    case METRICS.MAINTAINABILITY:
      return {
        title: 'Enhance Code Maintainability',
        description: 'Your codebase is moderately maintainable but could be improved. Focus on better documentation, clearer code structure, and more consistent patterns.',
        category: RECOMMENDATION_CATEGORIES.MAINTENANCE,
        actions: [
          'Improve inline documentation for complex logic',
          'Refactor areas with unclear responsibilities',
          'Establish more consistent patterns across the codebase'
        ]
      };
      
    case METRICS.CODE_DUPLICATION:
      return {
        title: 'Reduce Code Duplication',
        description: 'Your codebase has some duplication that could be reduced. Identify common patterns and extract them into reusable components.',
        category: RECOMMENDATION_CATEGORIES.CODE_QUALITY,
        actions: [
          'Extract duplicate logic into helper functions',
          'Create reusable components for UI patterns',
          'Use inheritance or composition to share functionality'
        ]
      };
      
    case METRICS.FILE_ORGANIZATION:
      return {
        title: 'Improve Project Structure',
        description: 'Your project structure could be more organized. Consider reorganizing files and directories to improve clarity and maintainability.',
        category: RECOMMENDATION_CATEGORIES.ORGANIZATION,
        actions: [
          'Group related files more consistently',
          'Create clear boundaries between application layers',
          'Consider feature-based organization where appropriate'
        ]
      };
      
    case METRICS.DEPENDENCY_MANAGEMENT:
      return {
        title: 'Optimize Dependency Management',
        description: 'Your approach to dependencies is adequate but could be improved. Focus on keeping dependencies updated and properly organized.',
        category: RECOMMENDATION_CATEGORIES.MAINTENANCE,
        actions: [
          'Regularly update non-breaking dependencies',
          'Remove unused dependencies',
          'Consider using dependency analysis tools'
        ]
      };
      
    default:
      return null;
  }
} 