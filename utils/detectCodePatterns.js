/**
 * A rate-limit safe method for detecting code patterns
 * This is a modified version that's much more conservative with API calls
 * 
 * @param {object} octokit - GitHub API client
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @param {object} results - Analysis results object to update
 * @param {function} updateProgress - Progress update function
 */
export async function safeDetectCodePatterns(octokit, owner, repo, results, updateProgress) {
  // Update progress
  updateProgress({ step: 'code-patterns', progress: 60 });
  
  try {
    // Use a very small number of files to check
    const filesToCheck = ['README.md', 'package.json'];
    
    // Try just one file at a time and stop if we hit any errors
    for (const filePath of filesToCheck) {
      try {
        // Get file content
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: filePath,
        });
        
        // Only process text files
        if (fileData && fileData.type === 'file') {
          const content = Buffer.from(fileData.content, 'base64').toString();
          
          // Store basic file info in results
          if (filePath === 'README.md') {
            results.details.readmeLength = content.length;
            
            // Very basic readme quality check
            if (content.length > 1000) {
              results.documentationCoverage = Math.max(results.documentationCoverage, 7);
            } else if (content.length > 500) {
              results.documentationCoverage = Math.max(results.documentationCoverage, 5);
            }
          }
          
          if (filePath === 'package.json') {
            try {
              const packageData = JSON.parse(content);
              
              // Check for basic quality signals
              if (packageData.dependencies) {
                results.dependencyManagement = Math.max(results.dependencyManagement, 7);
              }
              
              if (packageData.scripts && packageData.scripts.test) {
                results.testCoverage = Math.max(results.testCoverage, 6);
              }
              
              if (packageData.scripts && packageData.scripts.lint) {
                results.styleConsistency = Math.max(results.styleConsistency, 6);
              }
            } catch (e) {
              // Ignore JSON parse errors
            }
          }
        }
      } catch (error) {
        // If we hit any error, just abort pattern detection
        console.warn(`Error getting ${filePath}, skipping remaining pattern detection:`, error.message);
        break;
      }
    }
    
    // Continue with the analysis
    updateProgress({ step: 'workflows', progress: 70 });
    
  } catch (error) {
    console.error('Error in safe code pattern detection:', error.message);
    // Continue with the analysis even on error
    updateProgress({ step: 'workflows', progress: 70 });
  }
} 