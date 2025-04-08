import { analyzeRepo } from '../../utils/analyzer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { repoUrl } = req.body;
  
  if (!repoUrl) {
    return res.status(400).json({ error: 'Repository URL is required' });
  }

  try {
    // This is a REST API fallback for clients without WebSocket support
    console.log('Starting REST API repository analysis');
    
    // Analyze repository (no real-time progress updates)
    const results = await analyzeRepo(repoUrl);
    
    console.log('REST API analysis complete');
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze repository', 
      message: error.message 
    });
  }
} 