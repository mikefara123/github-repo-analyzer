/**
 * Calculate the overall score based on individual metrics
 * @param {Object} metrics - Object containing individual metric scores
 * @returns {number} - The average score rounded to 1 decimal place
 */
export const calculateOverallScore = (metrics) => {
  if (!metrics || Object.keys(metrics).length === 0) {
    return 0;
  }

  const validScores = Object.values(metrics).filter(
    (score) => score !== undefined && score !== null
  );

  if (validScores.length === 0) {
    return 0;
  }

  const sum = validScores.reduce((acc, score) => acc + score, 0);
  return parseFloat((sum / validScores.length).toFixed(1));
};

/**
 * Get the category of a score (Good, Fair, Poor)
 * @param {number} score - The score to categorize
 * @returns {string} - The category of the score
 */
export const getScoreCategory = (score) => {
  if (score >= 7) {
    return 'Good';
  } else if (score >= 4) {
    return 'Fair';
  } else {
    return 'Poor';
  }
};

/**
 * Format a camelCase metric name to a readable format
 * @param {string} metricName - The camelCase metric name
 * @returns {string} - The formatted metric name
 */
export const formatMetricName = (metricName) => {
  if (!metricName) {
    return '';
  }

  // Convert camelCase to space-separated words
  const formatted = metricName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());

  return formatted;
};

/**
 * Validate if a string is a valid GitHub repository URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const validateGithubUrl = (url) => {
  if (!url) {
    return false;
  }

  // Validate that URL begins with http:// or https:// and contains github.com
  const urlPattern = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/i;
  return urlPattern.test(url);
};

/**
 * Sanitize a URL to prevent XSS attacks
 * @param {string} url - The URL to sanitize
 * @returns {string} - The sanitized URL
 */
export const sanitizeUrl = (url) => {
  if (!url) {
    return '';
  }

  // Remove any potentially dangerous characters or scripts
  return url
    .replace(/<script.*?>.*?<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
};

/**
 * Generate recommendations based on analysis results
 * @param {Object} metrics - The metrics from the analysis
 * @returns {Array<string>} - Array of recommendation strings
 */
export const generateRecommendations = (metrics) => {
  const recommendations = [];

  if (!metrics) {
    return recommendations;
  }

  // Add recommendations based on low scoring metrics
  if (metrics.documentationCoverage < 7) {
    recommendations.push('Improve documentation coverage by adding more inline comments and documentation');
  }

  if (metrics.testCoverage < 7) {
    recommendations.push('Increase test coverage for better code reliability');
  }

  if (metrics.styleConsistency < 7) {
    recommendations.push('Implement a style guide and linting rules to improve code consistency');
  }

  if (metrics.securityVulnerabilities < 7) {
    recommendations.push('Address security vulnerabilities and implement security best practices');
  }

  if (metrics.codeDuplication > 3) {
    recommendations.push('Refactor duplicate code to improve maintainability');
  }

  if (metrics.fileOrganization < 7) {
    recommendations.push('Restructure the codebase for better organization and readability');
  }

  if (metrics.dependencyManagement < 7) {
    recommendations.push('Update dependencies and remove unused packages');
  }

  return recommendations;
};

/**
 * Format a score for display (adds /10 suffix)
 * @param {number} score - The score to format
 * @returns {string} - The formatted score
 */
export const formatScore = (score) => {
  if (score === undefined || score === null) {
    return 'N/A';
  }
  return `${score}/10`;
};

/**
 * Get color code based on score category
 * @param {string} category - The score category (Good, Fair, Poor)
 * @returns {string} - The color code
 */
export const getCategoryColor = (category) => {
  switch (category) {
    case 'Good':
      return '#4caf50'; // Green
    case 'Fair':
      return '#ff9800'; // Orange
    case 'Poor':
      return '#f44336'; // Red
    default:
      return '#9e9e9e'; // Grey
  }
}; 