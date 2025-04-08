import { Octokit } from 'octokit';

/**
 * Create a configured GitHub API client
 * @param {string} token - GitHub API token
 * @returns {Octokit} - Configured Octokit instance
 */
export function createGitHubClient(token = process.env.GITHUB_TOKEN) {
  if (!token) {
    throw new Error('GitHub token is required for API access');
  }
  
  return new Octokit({
    auth: token,
  });
}

/**
 * Extract owner and repo from GitHub URL
 * @param {string} url - GitHub repository URL
 * @returns {Object} - Extracted owner and repo
 */
export function extractRepoInfo(url) {
  try {
    // Handle both HTTPS and SSH URLs
    let owner, repo;
    
    if (url.includes('github.com')) {
      // Handle HTTPS URLs
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      if (pathParts.length < 2) {
        throw new Error('Invalid GitHub repository URL');
      }
      
      owner = pathParts[0];
      repo = pathParts[1].replace('.git', '');
    } else if (url.includes('git@github.com')) {
      // Handle SSH URLs (git@github.com:owner/repo.git)
      const pathParts = url.split(':')[1].split('/');
      owner = pathParts[0];
      repo = pathParts[1].replace('.git', '');
    } else {
      throw new Error('Not a valid GitHub URL');
    }
    
    return { owner, repo };
  } catch (error) {
    throw new Error(`Failed to extract repository info: ${error.message}`);
  }
}

/**
 * Fetch basic repository information
 * @param {Octokit} octokit - GitHub API client
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object>} - Repository information
 */
export async function getRepositoryInfo(octokit, owner, repo) {
  try {
    const { data } = await octokit.rest.repos.get({
      owner,
      repo,
    });
    
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch repository info: ${error.message}`);
  }
}

/**
 * Check if a file or directory exists in the repository
 * @param {Octokit} octokit - GitHub API client
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - Path to check
 * @returns {Promise<boolean>} - Whether the path exists
 */
export async function checkPathExists(octokit, owner, repo, path) {
  try {
    await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get file content from repository
 * @param {Octokit} octokit - GitHub API client
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - File path
 * @returns {Promise<string>} - File content
 */
export async function getFileContent(octokit, owner, repo, path) {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    
    if (data.type !== 'file') {
      throw new Error('Path does not point to a file');
    }
    
    return Buffer.from(data.content, 'base64').toString();
  } catch (error) {
    throw new Error(`Failed to fetch file content: ${error.message}`);
  }
} 