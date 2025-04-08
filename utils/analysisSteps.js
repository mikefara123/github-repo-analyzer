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