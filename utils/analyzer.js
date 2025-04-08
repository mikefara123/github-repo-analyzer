import { Octokit } from 'octokit';

// Define analysis steps for progress tracking
export const ANALYSIS_STEPS = [
  { id: 'init', label: 'Initializing Analysis' },
  { id: 'repo-info', label: 'Fetching Repository Info' },
  { id: 'contents', label: 'Analyzing Repository Structure' },
  { id: 'languages', label: 'Analyzing Languages Used' },
  { id: 'contributors', label: 'Analyzing Contributors' },
  { id: 'commits', label: 'Analyzing Commit History' },
  { id: 'branches', label: 'Analyzing Branches' },
  { id: 'pull-requests', label: 'Checking Pull Requests' },
  { id: 'issues', label: 'Reviewing Issues' },
  { id: 'code-patterns', label: 'Analyzing Code Patterns' },
  { id: 'workflows', label: 'Checking CI/CD Workflows' },
  { id: 'readme', label: 'Analyzing Documentation' },
  { id: 'dependencies', label: 'Checking Dependencies' },
  { id: 'security', label: 'Scanning Security' },
  { id: 'calculate', label: 'Calculating Final Scores' },
  { id: 'complete', label: 'Analysis Complete' }
];

/**
 * Extract owner and repo name from a GitHub repository URL
 * @param {string} repoUrl - The GitHub repository URL
 * @returns {Object} - The owner and repo name
 */
export const extractRepoInfo = (repoUrl) => {
  // Clean the URL
  const cleanUrl = repoUrl.trim().replace(/\/$/, '');
  
  // Handle different URL formats
  if (cleanUrl.includes('github.com')) {
    const urlParts = cleanUrl.split('/');
    return {
      owner: urlParts[urlParts.length - 2],
      repo: urlParts[urlParts.length - 1],
    };
  } else {
    throw new Error('Invalid GitHub repository URL');
  }
};

/**
 * Analyze a GitHub repository using the GitHub API
 * @param {string} repoUrl - The GitHub repository URL
 * @param {Function} updateProgress - Function to update progress
 * @returns {Object} - The analysis results
 */
export const analyzeRepo = async (repoUrl, updateProgress = () => {}) => {
  if (!repoUrl) {
    throw new Error('Repository URL is required');
  }
  
  console.log('Starting analysis for repository:', repoUrl);
  
  try {
    // Initialize the GitHub API client
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.warn('No GitHub token found. API rate limits may apply.');
    }
    
    const octokit = new Octokit({
      auth: token || undefined,
    });
    
    // Update progress: Initializing
    updateProgress({ step: 'init', progress: 0 });
    
    // Extract repo info from URL
    const { owner, repo } = extractRepoInfo(repoUrl);
    
    // Initialize results object
    const results = {
      codeComplexity: 0,
      documentationCoverage: 0,
      testCoverage: 0,
      styleConsistency: 0,
      securityVulnerabilities: 0,
      maintainabilityIndex: 0,
      codeDuplication: 0,
      fileOrganization: 0,
      dependencyManagement: 0,
      overallScore: 0,
      // Flag bonus metrics that shouldn't penalize the overall score
      bonusMetrics: ['dependencyManagement'],
      details: {
        repoInfo: null,
        languages: null,
        contributors: null,
        commitActivity: null,
        detectedPatterns: [],
        codeQualityIssues: []
      }
    };
    
    // Step 1: Get basic repository information
    updateProgress({ step: 'repo-info', progress: 7 });
    try {
      const { data: repoData } = await octokit.rest.repos.get({
        owner,
        repo,
      });
      results.details.repoInfo = repoData;
      
      // Initial file organization score based on repository structure
      results.fileOrganization = Math.min(10, Math.max(1, 5 + (repoData.size / 10000)));
      
      // Maintainability score based on repository size and open issues
      const openIssuesRatio = repoData.open_issues_count / Math.max(1, repoData.size / 100);
      results.maintainabilityIndex = Math.min(10, Math.max(1, 10 - openIssuesRatio));
    } catch (error) {
      console.error('Error getting repository info:', error);
    }
    
    // Step 2: Analyze repository structure
    updateProgress({ step: 'contents', progress: 14 });
    try {
      // Check for important files and directories
      const fileChecks = [
        { path: '', name: '.github/workflows', type: 'dir' },
        { path: '', name: '.github/CODEOWNERS', type: 'file' },
        { path: '', name: 'README.md', type: 'file' },
        { path: '', name: 'LICENSE', type: 'file' },
        { path: '', name: 'CONTRIBUTING.md', type: 'file' },
        { path: '', name: 'CODE_OF_CONDUCT.md', type: 'file' },
        { path: '', name: '.eslintrc.json', type: 'file' },
        { path: '', name: '.eslintrc.js', type: 'file' },
        { path: '', name: '.prettierrc', type: 'file' },
        { path: '', name: '.editorconfig', type: 'file' },
        { path: '', name: 'package.json', type: 'file' },
        { path: '', name: 'package-lock.json', type: 'file' },
        { path: '', name: 'yarn.lock', type: 'file' },
        { path: '', name: 'tests', type: 'dir' },
        { path: '', name: 'test', type: 'dir' },
        { path: '', name: '__tests__', type: 'dir' },
        { path: '', name: 'docs', type: 'dir' },
        { path: '', name: 'src', type: 'dir' },
        { path: '', name: 'src/components', type: 'dir' },
        { path: '', name: 'src/containers', type: 'dir' },
        { path: '', name: 'src/services', type: 'dir' },
        { path: '', name: 'src/utils', type: 'dir' },
        { path: '', name: 'src/hooks', type: 'dir' },
        { path: '', name: 'src/providers', type: 'dir' },
        { path: '', name: 'src/context', type: 'dir' },
        { path: '', name: 'src/models', type: 'dir' },
        { path: '', name: 'src/store', type: 'dir' },
      ];
      
      const filePresence = {};
      
      // Check each file/directory
      for (const check of fileChecks) {
        try {
          await octokit.rest.repos.getContent({
            owner,
            repo,
            path: check.name,
          });
          filePresence[check.name] = true;
        } catch (err) {
          filePresence[check.name] = false;
        }
      }
      
      // Calculate scores based on file presence
      
      // Documentation score
      const documentationFiles = [
        'README.md', 
        'LICENSE', 
        'CONTRIBUTING.md', 
        'CODE_OF_CONDUCT.md',
        'docs'
      ];
      
      const docScore = documentationFiles.reduce((score, file) => {
        return score + (filePresence[file] ? 2 : 0);
      }, 0);
      
      results.documentationCoverage = Math.min(10, docScore);
      
      // Style consistency score
      const styleFiles = [
        '.eslintrc.json',
        '.eslintrc.js',
        '.prettierrc',
        '.editorconfig'
      ];
      
      const styleScore = styleFiles.reduce((score, file) => {
        return score + (filePresence[file] ? 2.5 : 0);
      }, 0);
      
      results.styleConsistency = Math.min(10, styleScore);
      
      // Dependency management score
      const depFiles = [
        'package.json',
        'package-lock.json',
        'yarn.lock'
      ];
      
      const depScore = depFiles.reduce((score, file) => {
        return score + (filePresence[file] ? 3.5 : 0);
      }, 0);
      
      results.dependencyManagement = Math.min(10, depScore);
      
      // Test coverage score
      const testDirs = [
        'tests',
        'test',
        '__tests__'
      ];
      
      const testDirExists = testDirs.some(dir => filePresence[dir]);
      results.testCoverage = testDirExists ? 7 : 3;
      
      // File organization score update
      const orgDirs = [
        'src',
        'docs',
        'test',
        'tests',
        '__tests__'
      ];
      
      const orgScore = orgDirs.reduce((score, dir) => {
        return score + (filePresence[dir] ? 2 : 0);
      }, results.fileOrganization / 2);
      
      results.fileOrganization = Math.min(10, orgScore);
      
      // Security score
      const securityFiles = [
        '.github/workflows',
        '.github/CODEOWNERS'
      ];
      
      const secScore = securityFiles.reduce((score, file) => {
        return score + (filePresence[file] ? 5 : 0);
      }, 0);
      
      results.securityVulnerabilities = Math.min(10, secScore);
    } catch (error) {
      console.error('Error analyzing repository structure:', error);
    }
    
    // Step 3: Analyze languages used
    updateProgress({ step: 'languages', progress: 21 });
    try {
      const { data: languages } = await octokit.rest.repos.listLanguages({
        owner,
        repo
      });
      
      results.details.languages = languages;
      
      // Code complexity score based on languages used
      const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
      const languageCount = Object.keys(languages).length;
      
      // Higher score for repositories with more focused language usage
      results.codeComplexity = Math.min(10, Math.max(1, 10 - (languageCount - 1)));
      
      // Code duplication estimate based on repository size and languages
      // This is a rough estimate since we can't directly measure duplication without cloning
      const primaryLanguageBytes = Math.max(...Object.values(languages));
      const primaryLanguageRatio = primaryLanguageBytes / totalBytes;
      
      // Higher primary language ratio might suggest less duplication (more focused)
      results.codeDuplication = Math.min(10, Math.max(1, primaryLanguageRatio * 10));
    } catch (error) {
      console.error('Error analyzing languages:', error);
    }
    
    // Step 4: Analyze contributors
    updateProgress({ step: 'contributors', progress: 28 });
    try {
      const { data: contributors } = await octokit.rest.repos.listContributors({
        owner,
        repo,
        per_page: 100
      });
      
      results.details.contributors = contributors;
      
      // Adjust maintainability based on number of contributors
      const contributorCount = contributors.length;
      const contributorScore = Math.min(5, contributorCount / 2);
      
      results.maintainabilityIndex = Math.min(10, (results.maintainabilityIndex + contributorScore) / 2);
    } catch (error) {
      console.error('Error analyzing contributors:', error);
    }
    
    // Step 5: Analyze commit history
    updateProgress({ step: 'commits', progress: 35 });
    try {
      const { data: commitActivity } = await octokit.rest.repos.getCommitActivityStats({
        owner,
        repo
      });
      
      results.details.commitActivity = commitActivity;
      
      // Calculate commit frequency
      let totalCommits = 0;
      if (commitActivity) {
        totalCommits = commitActivity.reduce((sum, week) => sum + week.total, 0);
      }
      
      // Get repo age in weeks
      const createdAt = new Date(results.details.repoInfo.created_at);
      const now = new Date();
      const ageInWeeks = Math.max(1, Math.floor((now - createdAt) / (1000 * 60 * 60 * 24 * 7)));
      
      // Calculate average commits per week
      const commitsPerWeek = totalCommits / ageInWeeks;
      
      // Score based on commit frequency
      results.commitHistory = Math.min(10, Math.max(1, Math.log2(commitsPerWeek + 1) * 3));
    } catch (error) {
      console.error('Error analyzing commit history:', error);
    }
    
    // Step 6: Analyze branches
    updateProgress({ step: 'branches', progress: 42 });
    try {
      const { data: branches } = await octokit.rest.repos.listBranches({
        owner,
        repo,
        per_page: 100
      });
      
      // Number of branches can indicate development activity and organization
      const branchCount = branches.length;
      
      // Adjust file organization score based on branch count
      // Too few branches might indicate poor organization, too many might indicate chaos
      const branchScore = Math.min(5, 5 * (1 - Math.abs(Math.log10(branchCount) - 1) / 2));
      
      results.fileOrganization = Math.min(10, (results.fileOrganization + branchScore) / 2);
    } catch (error) {
      console.error('Error analyzing branches:', error);
    }
    
    // Step 7: Check pull requests
    updateProgress({ step: 'pull-requests', progress: 49 });
    try {
      const { data: pullRequests } = await octokit.rest.pulls.list({
        owner,
        repo,
        state: 'all',
        per_page: 100
      });
      
      // Analyze PR process
      const openPRs = pullRequests.filter(pr => pr.state === 'open').length;
      const closedPRs = pullRequests.filter(pr => pr.state === 'closed').length;
      const totalPRs = openPRs + closedPRs;
      
      if (totalPRs > 0) {
        // PR close ratio indicates how well the project handles contributions
        const closeRatio = closedPRs / totalPRs;
        
        // Adjust maintainability score based on PR process
        const prScore = closeRatio * 10;
        
        results.maintainabilityIndex = Math.min(10, (results.maintainabilityIndex + prScore) / 2);
      }
    } catch (error) {
      console.error('Error analyzing pull requests:', error);
    }
    
    // Step 8: Review issues
    updateProgress({ step: 'issues', progress: 56 });
    try {
      const { data: issues } = await octokit.rest.issues.listForRepo({
        owner,
        repo,
        state: 'all',
        per_page: 100
      });
      
      // Analyze issue handling
      const openIssues = issues.filter(issue => issue.state === 'open' && !issue.pull_request).length;
      const closedIssues = issues.filter(issue => issue.state === 'closed' && !issue.pull_request).length;
      const totalIssues = openIssues + closedIssues;
      
      if (totalIssues > 0) {
        // Issue close ratio indicates how responsive the project is
        const closeRatio = closedIssues / totalIssues;
        
        // Adjust maintainability score based on issue handling
        const issueScore = closeRatio * 10;
        
        results.maintainabilityIndex = Math.min(10, (results.maintainabilityIndex + issueScore) / 2);
      }
    } catch (error) {
      console.error('Error analyzing issues:', error);
    }
    
    // New Step: Analyze Code Patterns (before workflows)
    updateProgress({ step: 'code-patterns', progress: 60 });
    try {
      // Sample common files for pattern detection
      const patternDetectionFiles = [
        // JavaScript/TypeScript/Web
        'package.json',
        'tsconfig.json',
        'src/index.js',
        'src/index.ts',
        'src/App.js',
        'src/App.tsx',
        'src/store/index.js',
        'src/context/index.js',
        
        // Svelte specific
        'packages/svelte/src/index.js',
        'packages/svelte/compiler/index.js',
        'packages/svelte/src/runtime/index.js',
        'src/lib/index.js',
        'src/routes/+layout.svelte',
        'svelte.config.js',
        
        // Python
        'setup.py',
        'requirements.txt',
        'src/__init__.py',
        'app.py',
        'main.py',
        
        // Go
        'go.mod',
        'main.go',
        'cmd/main.go',
        'pkg/server/server.go',
        'internal/app/app.go',
        
        // Java/Kotlin
        'pom.xml',
        'build.gradle',
        'src/main/java/com/example/Application.java',
        'src/main/kotlin/com/example/Application.kt',
        
        // Ruby
        'Gemfile',
        'app/models/application_record.rb',
        'config/routes.rb',
        'app/controllers/application_controller.rb',
        
        // Generic files that might contain patterns
        'README.md',
        'Dockerfile',
        '.github/workflows/ci.yml',
        'docker-compose.yml'
      ];
      
      // Still analyze pattern detection and code quality, but only for informational purposes
      for (const file of patternDetectionFiles) {
        try {
          const { data: fileData } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: file,
          });
          
          // Only process text files
          if (fileData && fileData.type === 'file') {
            const content = Buffer.from(fileData.content, 'base64').toString();
            
            // Check for various patterns (just for informational purposes)
            detectCodePatterns(content, file, results);
          }
        } catch (err) {
          // File doesn't exist, skip
        }
      }
      
      // We're no longer calculating design patterns or best practices scores here
      
    } catch (error) {
      console.error('Error analyzing code patterns:', error);
    }
    
    // Step 9: Check CI/CD workflows
    updateProgress({ step: 'workflows', progress: 63 });
    try {
      // Check if the repository has GitHub Actions workflows
      try {
        const { data: workflows } = await octokit.rest.actions.listRepoWorkflows({
          owner,
          repo
        });
        
        if (workflows && workflows.total_count > 0) {
          // Having CI/CD workflows improves security and code quality
          results.securityVulnerabilities = Math.min(10, results.securityVulnerabilities + 3);
          results.styleConsistency = Math.min(10, results.styleConsistency + 2);
        }
      } catch (err) {
        // GitHub Actions might not be enabled for this repo
      }
    } catch (error) {
      console.error('Error checking workflows:', error);
    }
    
    // Step 10: Analyze README for comprehensiveness
    updateProgress({ step: 'readme', progress: 70 });
    try {
      try {
        const { data: readmeData } = await octokit.rest.repos.getReadme({
          owner,
          repo
        });
        
        if (readmeData) {
          // Get README content
          const readmeContent = Buffer.from(readmeData.content, 'base64').toString();
          
          // Analyze README quality based on length and sections
          const readmeLength = readmeContent.length;
          const hasHeadings = (readmeContent.match(/#+\s+\w+/g) || []).length;
          const hasCodeBlocks = (readmeContent.match(/```/g) || []).length > 1;
          const hasImages = readmeContent.includes('![');
          
          // Score based on README quality
          let readmeScore = 0;
          if (readmeLength > 500) readmeScore += 2;
          if (readmeLength > 2000) readmeScore += 2;
          if (hasHeadings > 3) readmeScore += 2;
          if (hasCodeBlocks) readmeScore += 2;
          if (hasImages) readmeScore += 2;
          
          // Update documentation score
          results.documentationCoverage = Math.min(10, (results.documentationCoverage + readmeScore) / 2);
        }
      } catch (err) {
        // README might not exist
      }
    } catch (error) {
      console.error('Error analyzing README:', error);
    }
    
    // Step 11: Check for package.json and analyze dependencies
    updateProgress({ step: 'dependencies', progress: 77 });
    try {
      try {
        const { data: packageJson } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: 'package.json'
        });
        
        if (packageJson) {
          // Parse package.json
          const packageData = JSON.parse(Buffer.from(packageJson.content, 'base64').toString());
          
          // Check dependencies
          const hasDependencies = packageData.dependencies && Object.keys(packageData.dependencies).length > 0;
          const hasDevDependencies = packageData.devDependencies && Object.keys(packageData.devDependencies).length > 0;
          
          // Check for testing frameworks
          const testingDeps = ['jest', 'mocha', 'jasmine', 'karma', 'chai', 'cypress', 'enzyme', '@testing-library'];
          const hasTestingDeps = hasDevDependencies && testingDeps.some(dep => 
            Object.keys(packageData.devDependencies).some(d => d.includes(dep))
          );
          
          // Check for linting tools
          const lintingDeps = ['eslint', 'prettier', 'tslint', 'stylelint'];
          const hasLintingDeps = hasDevDependencies && lintingDeps.some(dep => 
            Object.keys(packageData.devDependencies).some(d => d.includes(dep))
          );
          
          // Security related packages
          const securityDeps = ['helmet', 'csrf', 'xss', 'sanitize', 'validate'];
          const hasSecurityDeps = hasDependencies && securityDeps.some(dep => 
            Object.keys(packageData.dependencies).some(d => d.includes(dep))
          );
          
          // Update scores
          if (hasTestingDeps) {
            results.testCoverage = Math.min(10, results.testCoverage + 3);
          }
          
          if (hasLintingDeps) {
            results.styleConsistency = Math.min(10, results.styleConsistency + 2);
          }
          
          if (hasSecurityDeps) {
            results.securityVulnerabilities = Math.min(10, results.securityVulnerabilities + 2);
          }
          
          // Overall dependency management score - improved to be more lenient
          let depManagementScore = 5;  // Start with a moderate baseline
          if (hasDependencies) depManagementScore += 2;
          if (hasDevDependencies) depManagementScore += 1;
          if (packageData.scripts && Object.keys(packageData.scripts).length > 0) depManagementScore += 1;
          if (packageData.scripts && Object.keys(packageData.scripts).length > 3) depManagementScore += 1;
          
          // Check for dependency version pinning (a best practice)
          const hasPinnedVersions = Object.entries(packageData.dependencies || {}).some(
            ([_, version]) => /^\d/.test(version)
          );
          if (hasPinnedVersions) depManagementScore += 1;
          
          results.dependencyManagement = Math.min(10, depManagementScore);
        }
      } catch (err) {
        // package.json might not exist
      }
    } catch (error) {
      console.error('Error analyzing dependencies:', error);
    }
    
    // Step 12: Security analysis
    updateProgress({ step: 'security', progress: 84 });
    try {
      // Check for security policies
      try {
        await octokit.rest.repos.getContent({
          owner,
          repo,
          path: 'SECURITY.md'
        });
        
        // Has security policy
        results.securityVulnerabilities = Math.min(10, results.securityVulnerabilities + 2);
      } catch (err) {
        // SECURITY.md doesn't exist
      }
      
      // Check for Dependabot alerts if we have permission
      try {
        const { data: dependabotAlerts } = await octokit.rest.repos.listVulnerabilityAlerts({
          owner,
          repo
        });
        
        // Deduct points for open security alerts
        if (dependabotAlerts && dependabotAlerts.length > 0) {
          const deduction = Math.min(5, dependabotAlerts.length);
          results.securityVulnerabilities = Math.max(1, results.securityVulnerabilities - deduction);
        }
      } catch (err) {
        // Might not have permission for this API
      }
    } catch (error) {
      console.error('Error analyzing security:', error);
    }
    
    // Step 13: Calculate final scores
    updateProgress({ step: 'calculate', progress: 91 });
    
    // Calculate code complexity (if not already set)
    if (results.codeComplexity === 0) {
      results.codeComplexity = 5; // Default value
    }
    
    // Calculate maintainability (if not already set)
    if (results.maintainabilityIndex === 0) {
      results.maintainabilityIndex = 5; // Default value
    }
    
    // Calculate code duplication (if not already set)
    if (results.codeDuplication === 0) {
      results.codeDuplication = 5; // Default value
    }
    
    // Calculate overall score (average of non-bonus metrics, excluding those we removed)
    const coreMetrics = Object.entries(results)
      .filter(([key, value]) => 
        typeof value === 'number' && 
        key !== 'overallScore' && 
        !key.startsWith('details') &&
        !results.bonusMetrics.includes(key) 
      );
    
    // Calculate core score without bonus metrics
    const coreScore = coreMetrics.reduce((sum, [_, value]) => sum + value, 0) / coreMetrics.length;
    
    // Get bonus score (the average of the bonus metrics, but only counting positive contributions)
    const bonusMetrics = results.bonusMetrics.map(key => Math.max(0, results[key]));
    const bonusScore = bonusMetrics.length > 0 
      ? bonusMetrics.reduce((sum, value) => sum + value, 0) / bonusMetrics.length / 5 // Smaller bonus contribution
      : 0;
    
    // Combine core score with bonus score
    results.overallScore = Math.round(coreScore + bonusScore);
    
    // Ensure score is within range
    results.overallScore = Math.min(10, Math.max(1, results.overallScore));
    
    // Step 14: Complete
    updateProgress({ step: 'complete', progress: 100 });
    
    return results;
  } catch (error) {
    console.error('Error analyzing repository:', error);
    throw error;
  }
};

/**
 * Get design pattern name from directory path - expanded to support various patterns
 * Note: This function is now used only for informational purposes and does not affect scoring
 * @param {string} dirPath - Directory path
 * @returns {Object} - The detected pattern info
 */
function getPatternFromDir(dirPath) {
  const patterns = {
    // React and Web Patterns
    'src/components': { 
      name: 'Component-Based Architecture', 
      type: 'architectural',
      description: 'Divides the UI into reusable, independent components' 
    },
    'src/containers': { 
      name: 'Container/Presentational Pattern', 
      type: 'design',
      description: 'Separates data fetching from data presentation' 
    },
    'src/services': { 
      name: 'Service Pattern', 
      type: 'architectural',
      description: 'Centralizes business logic and API interactions' 
    },
    'src/utils': { 
      name: 'Utility Functions', 
      type: 'organizational',
      description: 'Reusable helper functions across the application' 
    },
    'src/hooks': { 
      name: 'Custom Hooks Pattern', 
      type: 'design',
      description: 'Extracts component logic into reusable functions' 
    },
    'src/providers': { 
      name: 'Provider Pattern', 
      type: 'design',
      description: 'Provides data to components without prop drilling' 
    },
    'src/context': { 
      name: 'Context API Pattern', 
      type: 'design',
      description: 'Manages global state accessible to components' 
    },
    'src/models': { 
      name: 'Domain Model Pattern', 
      type: 'architectural',
      description: 'Represents business entities and logic' 
    },
    'src/store': { 
      name: 'State Management', 
      type: 'architectural',
      description: 'Centralized state management (Redux, MobX, etc.)' 
    },
    
    // Angular Patterns
    'src/app/components': {
      name: 'Angular Component Architecture',
      type: 'architectural',
      description: 'Organizes UI elements into Angular components'
    },
    'src/app/services': {
      name: 'Angular Services Pattern',
      type: 'design',
      description: 'Injectable services for shared functionality and state'
    },
    'src/app/directives': {
      name: 'Angular Directives Pattern',
      type: 'design',
      description: 'Custom DOM manipulations and behaviors'
    },
    'src/app/pipes': {
      name: 'Angular Pipes Pattern',
      type: 'design',
      description: 'Data transformation utilities for templates'
    },
    'src/app/guards': {
      name: 'Angular Route Guards',
      type: 'design',
      description: 'Protects routes with conditional logic'
    },
    'src/app/interceptors': {
      name: 'Angular HTTP Interceptors',
      type: 'design',
      description: 'Intercepts HTTP requests for modification or logging'
    },
    
    // Vue Patterns
    'src/composables': {
      name: 'Vue Composables',
      type: 'design',
      description: 'Reusable composition functions for Vue components'
    },
    'src/mixins': {
      name: 'Vue Mixins',
      type: 'design',
      description: 'Reusable component functionalities via mixins'
    },
    'src/plugins': {
      name: 'Vue Plugins',
      type: 'design',
      description: 'Global features and functionality extensions'
    },
    'src/directives': {
      name: 'Vue Directives',
      type: 'design',
      description: 'Custom DOM manipulations for Vue components'
    },
    
    // Svelte Patterns
    'packages/svelte/src': {
      name: 'Svelte Core Architecture',
      type: 'architectural',
      description: 'Main source code for Svelte implementation'
    },
    'packages/svelte/compiler': {
      name: 'Compiler Design Pattern',
      type: 'architectural',
      description: 'Transforms Svelte components into optimal JavaScript'
    },
    'packages/svelte/internal': {
      name: 'Internal Runtime Pattern',
      type: 'architectural',
      description: 'Core runtime functionality for Svelte apps'
    },
    'src/routes': {
      name: 'Route-based Architecture',
      type: 'architectural',
      description: 'Organizes components by application routes'
    },
    'src/lib': {
      name: 'Library Pattern',
      type: 'organizational',
      description: 'Shared components and utilities in a library'
    },
    
    // Python Patterns
    'src/models': {
      name: 'Python Models',
      type: 'architectural',
      description: 'Data models and business entities'
    },
    'tests': {
      name: 'Test-Driven Development',
      type: 'process',
      description: 'Follows test-driven development practices'
    },
    
    // Go Patterns
    'cmd': {
      name: 'Command Pattern (Go)',
      type: 'architectural',
      description: 'Entry points for application commands'
    },
    'internal': {
      name: 'Internal Package Pattern',
      type: 'organizational',
      description: 'Non-exportable functionality for internal use'
    },
    'pkg': {
      name: 'Package-Oriented Design',
      type: 'architectural',
      description: 'Organizes code into importable packages'
    },
    
    // Ruby on Rails Patterns
    'app/models': {
      name: 'MVC Model Layer',
      type: 'architectural',
      description: 'Models representing database entities'
    },
    'app/views': {
      name: 'MVC View Layer',
      type: 'architectural',
      description: 'Templates for rendering UI'
    },
    'app/controllers': {
      name: 'MVC Controller Layer',
      type: 'architectural',
      description: 'Controllers handling requests and responses'
    },
    'app/helpers': {
      name: 'Helper Methods Pattern',
      type: 'design',
      description: 'Reusable view and controller helpers'
    },
    
    // Java Patterns
    'src/main/java': {
      name: 'Java Standard Directory Layout',
      type: 'organizational',
      description: 'Standard Java project structure'
    },
    'src/test/java': {
      name: 'Java Test Directory',
      type: 'process',
      description: 'Separated test structure for Java projects'
    },
    
    // Generic Patterns
    'domain': {
      name: 'Domain-Driven Design',
      type: 'architectural',
      description: 'Organizes code around business domain concepts'
    },
    'infrastructure': {
      name: 'Hexagonal Architecture',
      type: 'architectural',
      description: 'Separates core logic from external concerns'
    },
    'presentation': {
      name: 'Presentation Layer',
      type: 'architectural',
      description: 'User interface and presentation concerns'
    },
    'application': {
      name: 'Application Layer',
      type: 'architectural',
      description: 'Application-specific business logic'
    },
    'adapters': {
      name: 'Adapter Pattern',
      type: 'design',
      description: 'Adapts external interfaces to internal requirements'
    },
    'interfaces': {
      name: 'Interface Segregation',
      type: 'design',
      description: 'Applies interface segregation principle'
    }
  };
  
  return patterns[dirPath] || { 
    name: 'Custom Architecture', 
    type: 'custom',
    description: 'Custom directory structure that may follow domain-specific patterns' 
  };
}

/**
 * Detect code patterns from file content - expanded to support multiple languages
 * Note: This function is now used only for informational purposes and does not affect scoring
 * @param {string} content - File content
 * @param {string} filePath - File path
 * @param {Object} results - Results object to update
 */
function detectCodePatterns(content, filePath, results) {
  // Determine file type based on extension
  const fileExtension = filePath.split('.').pop().toLowerCase();
  
  // Common patterns across multiple languages
  const commonPatterns = [
    {
      name: 'Singleton Pattern',
      type: 'design',
      regex: /singleton|getInstance|private\s+constructor|static\s+instance|new\s+self|new\s+static/i,
      description: 'Ensures a class has only one instance with global access point'
    },
    {
      name: 'Factory Pattern',
      type: 'design',
      regex: /factory|create[A-Z]\w+|getInstance|newInstance|build|new[A-Z]\w+/i,
      description: 'Creates objects without specifying the exact class or constructor'
    },
    {
      name: 'Observer Pattern',
      type: 'design',
      regex: /observer|subscribe|publish|emit|listen|on\(|addEventListener|dispatch|notify/i,
      description: 'Objects subscribe to events and get notified when they occur'
    },
    {
      name: 'Strategy Pattern',
      type: 'design',
      regex: /strategy|algorithm|\buse[A-Z]\w+Strategy|setStrategy|execute\(\)/i,
      description: 'Defines a family of algorithms and makes them interchangeable'
    },
    {
      name: 'Decorator Pattern',
      type: 'design',
      regex: /decorator|@\w+|decorate|wrap|enhance|withStyles|with[A-Z]\w+/i,
      description: 'Attaches additional responsibilities to objects dynamically'
    }
  ];
  
  // JavaScript/TypeScript specific patterns
  const jsPatterns = [
    {
      name: 'Module Pattern',
      type: 'design',
      regex: /export\s+(default)?\s*(function|class|const)/i,
      description: 'Uses ES modules for code organization'
    },
    {
      name: 'Higher-Order Components',
      type: 'design',
      regex: /function\s+\w+\s*\(\s*\w+\s*\)\s*{\s*return\s+(class|function)/i,
      description: 'Functions that take a component and return a new component'
    },
    {
      name: 'Render Props Pattern',
      type: 'design',
      regex: /render\s*=\s*{\s*\(\s*\)\s*=>\s*\(/i,
      description: 'Sharing code between React components using a prop whose value is a function'
    },
    {
      name: 'Hooks Pattern',
      type: 'design',
      regex: /\buse[A-Z]\w+/i,
      description: 'Uses React hooks for state and effects'
    },
    {
      name: 'Promise/Async Pattern',
      type: 'design',
      regex: /new\s+Promise|\basync\b|\bawait\b|\.then\(|\.catch\(/i,
      description: 'Uses Promises or async/await for asynchronous operations'
    },
    {
      name: 'Flux/Redux Pattern',
      type: 'architectural',
      regex: /createStore|reducer|dispatch|action|useSelector|useDispatch|mapStateToProps/i,
      description: 'Implements unidirectional data flow architecture'
    }
  ];
  
  // Python specific patterns
  const pythonPatterns = [
    {
      name: 'Decorator Pattern (Python)',
      type: 'design',
      regex: /@\w+/,
      description: 'Uses Python decorators to modify function behavior'
    },
    {
      name: 'Context Manager',
      type: 'design',
      regex: /with\s+\w+(\(\))?\s+as\s+\w+|__enter__|__exit__/,
      description: 'Uses context managers for resource management'
    },
    {
      name: 'Type Hints',
      type: 'design',
      regex: /def\s+\w+\(\w+\s*:\s*\w+(\[\w+\])?/,
      description: 'Uses Python type hints for better code clarity'
    },
    {
      name: 'ORM Pattern',
      type: 'design',
      regex: /class\s+\w+\(\s*(db\.)?Model\s*\)|Column\(|relationship\(/,
      description: 'Uses ORM for database interactions'
    }
  ];
  
  // Java specific patterns
  const javaPatterns = [
    {
      name: 'Builder Pattern',
      type: 'design',
      regex: /\.builder\(\)|\.build\(\)|static\s+class\s+Builder|return\s+new\s+Builder/i,
      description: 'Constructs complex objects step by step'
    },
    {
      name: 'Dependency Injection',
      type: 'design',
      regex: /@Inject|@Autowired|@Component|@Service|@Repository|@Controller/i,
      description: 'Injects dependencies instead of creating them'
    },
    {
      name: 'Template Method',
      type: 'design',
      regex: /abstract\s+class|@Override|extends\s+\w+/i,
      description: 'Defines the skeleton of an algorithm, deferring some steps to subclasses'
    }
  ];
  
  // Go specific patterns
  const goPatterns = [
    {
      name: 'Interface Implementation',
      type: 'design',
      regex: /type\s+\w+\s+interface|func\s+\(\w+\s+\*?\w+\)\s+\w+/,
      description: 'Implements interfaces in Go'
    },
    {
      name: 'Error Handling Pattern',
      type: 'design',
      regex: /if\s+err\s+!=\s+nil|return\s+\w+,\s+err|errors\.New/,
      description: 'Go-style error handling pattern'
    },
    {
      name: 'Structural Composition',
      type: 'design',
      regex: /type\s+\w+\s+struct\s*{[^}]*\w+\s+\w+[^}]*}/,
      description: 'Uses structural composition instead of inheritance'
    }
  ];
  
  // Ruby specific patterns
  const rubyPatterns = [
    {
      name: 'Mixin Pattern',
      type: 'design',
      regex: /include\s+\w+|extend\s+\w+|module\s+\w+/i,
      description: 'Uses modules and mixins for shared functionality'
    },
    {
      name: 'DSL Pattern',
      type: 'design',
      regex: /do\s+\|[^|]*\|/,
      description: 'Creates domain-specific languages within Ruby'
    },
    {
      name: 'ActiveRecord Pattern',
      type: 'design',
      regex: /class\s+\w+\s+<\s+ActiveRecord::Base|has_many|belongs_to|has_one/i,
      description: 'ORM pattern from Ruby on Rails'
    }
  ];
  
  // Svelte specific patterns
  const sveltePatterns = [
    {
      name: 'Reactive Declarations',
      type: 'design',
      regex: /\$:\s+\w+/,
      description: 'Svelte reactive variable declarations'
    },
    {
      name: 'Store Pattern',
      type: 'design',
      regex: /writable|readable|derived|get|subscribe|update|set/,
      description: 'Svelte store pattern for state management'
    },
    {
      name: 'Actions Pattern',
      type: 'design',
      regex: /use:\w+/,
      description: 'Reusable element actions in Svelte'
    },
    {
      name: 'Compiler Pattern',
      type: 'architectural',
      regex: /transform|parse|compile|ast|tokenize|walk|visitor/i,
      description: 'Implements compiler-like code transformation'
    }
  ];
  
  // Check language-specific patterns based on file extension
  let patternsToCheck = [...commonPatterns];
  
  if (['js', 'jsx', 'ts', 'tsx'].includes(fileExtension)) {
    patternsToCheck = [...patternsToCheck, ...jsPatterns];
  } else if (['py', 'pyw'].includes(fileExtension)) {
    patternsToCheck = [...patternsToCheck, ...pythonPatterns];
  } else if (['java', 'kt', 'scala'].includes(fileExtension)) {
    patternsToCheck = [...patternsToCheck, ...javaPatterns];
  } else if (['go'].includes(fileExtension)) {
    patternsToCheck = [...patternsToCheck, ...goPatterns];
  } else if (['rb', 'rake'].includes(fileExtension)) {
    patternsToCheck = [...patternsToCheck, ...rubyPatterns];
  } else if (['svelte'].includes(fileExtension)) {
    patternsToCheck = [...patternsToCheck, ...sveltePatterns];
  }
  
  // Special case for Svelte - check compiler-related code in JS/TS files too
  if (filePath.includes('svelte') && ['js', 'ts'].includes(fileExtension)) {
    patternsToCheck = [...patternsToCheck, ...sveltePatterns];
  }
  
  // Check each pattern
  for (const pattern of patternsToCheck) {
    if (pattern.regex.test(content)) {
      // Only add unique patterns
      const alreadyDetected = results.details.detectedPatterns.some(
        p => p.name === pattern.name
      );
      
      if (!alreadyDetected) {
        results.details.detectedPatterns.push({
          name: pattern.name,
          type: pattern.type,
          description: pattern.description,
          foundIn: filePath
        });
      }
    }
  }
  
  // Check for potential code quality issues - expanded for multiple languages
  const codeQualityChecks = [
    // Common issues across languages
    {
      issue: 'Long Functions',
      regex: /function\s+\w+\s*\([^)]*\)\s*{[\s\S]{1000,}?}|def\s+\w+[\s\S]{1000,}?end|func\s+\w+[\s\S]{1000,}?}/i,
      impact: 'high',
      description: 'Functions over 1000 characters may be too complex and need refactoring'
    },
    {
      issue: 'Magic Numbers',
      regex: /\b\d{3,}\b/g,
      impact: 'medium',
      description: 'Unexplained numeric literals should be named constants'
    },
    {
      issue: 'Commented Code',
      regex: /\/\/\s*\w+\s*\(|\/\*[\s\S]*?\*\/\s*\w+\s*\(|#\s*\w+\s*\(/,
      impact: 'low',
      description: 'Commented out code should be removed'
    },
    
    // JavaScript/TypeScript specific issues
    {
      issue: 'Nested Callbacks',
      regex: /\)\s*=>\s*{[^{}]*\([^{]*=>\s*{/i,
      impact: 'medium',
      applicable: ['js', 'jsx', 'ts', 'tsx'],
      description: 'Deeply nested callbacks can lead to callback hell'
    },
    {
      issue: 'Console Statements',
      regex: /console\.(log|warn|error)/i,
      impact: 'low',
      applicable: ['js', 'jsx', 'ts', 'tsx'],
      description: 'Console statements should be removed in production code'
    },
    
    // Python specific issues
    {
      issue: 'Global Variables',
      regex: /^\s*[a-zA-Z_]\w*\s*=/m,
      impact: 'medium',
      applicable: ['py', 'pyw'],
      description: 'Global variables should be avoided'
    },
    
    // Java specific issues
    {
      issue: 'Catch Exception',
      regex: /catch\s*\(\s*Exception\s+/i,
      impact: 'medium',
      applicable: ['java'],
      description: 'Catching generic Exception is not recommended'
    }
  ];
  
  // Check each code quality issue
  for (const check of codeQualityChecks) {
    // Only apply language-specific checks to appropriate files
    if (check.applicable && !check.applicable.includes(fileExtension)) {
      continue;
    }
    
    if (check.regex.test(content)) {
      // Check if this issue for this file is already detected
      const alreadyDetected = results.details.codeQualityIssues.some(
        issue => issue.issue === check.issue && issue.foundIn === filePath
      );
      
      if (!alreadyDetected) {
        results.details.codeQualityIssues.push({
          issue: check.issue,
          impact: check.impact,
          description: check.description,
          foundIn: filePath
        });
      }
    }
  }
} 