import { analyzeRepo } from '../../utils/analyzer';
import { validateGithubUrl, sanitizeUrl } from '../../utils/analysisHelpers';
import rateLimit from '../../utils/rateLimit';

// Initialize rate limiter: max 10 requests per minute
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100, // Max 100 users per interval
  max: 10, // 10 requests per interval
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Apply rate limiting
    await limiter.check(res, 5, 'ANALYZE_REPO_API'); // 5 requests per minute per IP
  } catch {
    return res.status(429).json({ error: 'Rate limit exceeded, please try again later' });
  }

  const { repoUrl } = req.body;
  
  // Validate input presence
  if (!repoUrl) {
    return res.status(400).json({ error: 'Repository URL is required' });
  }

  // Sanitize and validate URL
  const sanitizedUrl = sanitizeUrl(repoUrl);
  if (!validateGithubUrl(sanitizedUrl)) {
    return res.status(400).json({ error: 'Invalid GitHub repository URL' });
  }

  // Set security headers
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  try {
    // Check if GitHub token is configured
    if (!process.env.GITHUB_TOKEN) {
      console.warn('No GitHub token found in environment variables. API rate limits may be restrictive.');
      // Continue without token, but with a warning
    }
    
    // This is a REST API fallback for clients without WebSocket support
    console.log('Starting REST API repository analysis');
    
    // Set a timeout to prevent long-running analyses
    const timeout = parseInt(process.env.ANALYSIS_TIMEOUT_MS) || 60000; // 60 seconds default
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Analysis timed out')), timeout);
    });
    
    // Analyze repository with timeout
    const analysisPromise = analyzeRepo(sanitizedUrl);
    
    // Race between analysis and timeout
    const results = await Promise.race([analysisPromise, timeoutPromise]);
    
    // If we got results but they're empty or invalid, handle gracefully
    if (!results || typeof results !== 'object' || Object.keys(results).length === 0) {
      throw new Error('Analysis completed but returned invalid results');
    }
    
    console.log('REST API analysis complete');
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error in API handler:', error);
    
    // Determine appropriate error code
    let statusCode = 500;
    let errorMessage = 'Internal server error';
    
    if (error.message === 'Analysis timed out') {
      statusCode = 408; // Request Timeout
      errorMessage = 'Analysis timed out. The repository may be too large or complex to analyze.';
    } else if (error.message.includes('API rate limit exceeded')) {
      statusCode = 429; // Too Many Requests
      errorMessage = 'GitHub API rate limit exceeded. Please try again later.';
    } else if (error.message.includes('not found') || error.message.includes('Not Found')) {
      statusCode = 404; // Not Found
      errorMessage = 'Repository not found. Please check the URL and try again.';
    } else if (error.message.includes('Bad credentials') || error.message.includes('Unauthorized')) {
      statusCode = 401; // Unauthorized
      errorMessage = 'GitHub authentication failed. The analysis will continue without authentication (with lower rate limits).';
      // Fall back to unauthenticated analysis
      try {
        console.log('Retrying analysis without authentication...');
        // Clear the token temporarily for this request
        const originalToken = process.env.GITHUB_TOKEN;
        process.env.GITHUB_TOKEN = '';
        
        // Try analysis again
        const results = await analyzeRepo(sanitizedUrl);
        
        // Restore the token
        process.env.GITHUB_TOKEN = originalToken;
        
        // Return the results
        console.log('Unauthenticated analysis complete');
        return res.status(200).json(results);
      } catch (retryError) {
        console.error('Retry error:', retryError);
        // Continue with error handling for the retry error
      }
    } else if (error.message.includes('socket')) {
      statusCode = 503; // Service Unavailable
      errorMessage = 'Connection issues detected. Please try again.';
    }
    
    // Don't expose detailed error messages to the client
    return res.status(statusCode).json({ 
      error: 'Failed to analyze repository',
      // Only include appropriate error information
      message: process.env.NODE_ENV === 'development' ? error.message : errorMessage
    });
  }
} 