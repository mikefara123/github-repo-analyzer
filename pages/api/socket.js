import { Server } from 'socket.io';
import { analyzeRepo } from '../../utils/analyzer';

// Track active analysis tasks
const activeTasks = new Map();

// Set up socket server handlers
const configureSocketServer = (io) => {
  console.log('Configuring socket server handlers');
  
  io.on('connection', (socket) => {
    console.log('Client connected to socket server:', socket.id);
    
    let analysisAborted = false;

    // Handle analyze request
    socket.on('analyzeRepo', async (data) => {
      const repoUrl = data.repoUrl;
      console.log('Analysis request received for repository:', repoUrl);
      
      try {
        // Reset abort flag
        analysisAborted = false;
        
        // Track this task for potential cancellation
        activeTasks.set(socket.id, { aborted: false });
        
        // Send initial progress update
        console.log('Sending initial progress update');
        socket.emit('progress', { step: 'init', progress: 0 });
        
        // Custom progress updater that skips the code-patterns step
        const updateProgress = (progressData) => {
          // Check if analysis was aborted
          if (activeTasks.get(socket.id)?.aborted) {
            console.log('Analysis was aborted, throwing error');
            throw new Error('Analysis cancelled by user');
          }
          
          // Skip the code-patterns step that might cause rate limits
          let updatedProgressData = { ...progressData };
          if (progressData.step === 'code-patterns') {
            console.log('Skipping code-patterns step to avoid rate limits');
            updatedProgressData = { step: 'workflows', progress: 65 };
          }
          
          console.log(`Sending progress update: ${updatedProgressData.step} - ${updatedProgressData.progress}%`);
          socket.emit('progress', updatedProgressData);
        };
        
        // Set a timeout for the analysis to prevent it from running too long
        const timeoutMs = parseInt(process.env.ANALYSIS_TIMEOUT_MS) || 60000; // Default 60 seconds
        
        // Create a promise that will resolve when the analysis is complete or time out
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Analysis timed out. Repository may be too large to analyze.'));
          }, timeoutMs);
        });
        
        // Create the analysis promise
        const analysisPromise = analyzeRepo(repoUrl, updateProgress);
        
        // Wait for either the analysis to complete or the timeout to trigger
        const results = await Promise.race([analysisPromise, timeoutPromise]);
        
        // Clear the timeout since we finished before it triggered
        clearTimeout(timeoutId);
        
        // Send results back to client
        console.log('Analysis complete, sending results to client');
        socket.emit('analysisResults', {
          status: 'success',
          repoName: results.details?.repoInfo?.name || repoUrl,
          results: results
        });
        
        // Clean up
        activeTasks.delete(socket.id);
      } catch (error) {
        console.error('Analysis error occurred:', error.message);
        
        // Handle specific errors
        let errorMessage = error.message;
        
        // Friendly messages for common errors
        if (error.message.includes('rate limit') || error.message.includes('quota exhausted')) {
          errorMessage = 'GitHub API rate limit exceeded. Please try again later or provide a GitHub token.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Analysis timed out. The repository may be too large or complex to analyze.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Repository not found. Please check the URL and try again.';
        }
        
        socket.emit('error', { message: errorMessage });
        
        // Clean up
        activeTasks.delete(socket.id);
      }
    });
    
    // Handle cancellation request
    socket.on('cancelAnalysis', () => {
      console.log('Analysis cancellation request received from client:', socket.id);
      
      // Mark the analysis as aborted
      if (activeTasks.has(socket.id)) {
        console.log('Marking analysis as aborted');
        activeTasks.get(socket.id).aborted = true;
        socket.emit('error', { message: 'Analysis cancelled by user' });
      } else {
        console.log('No active analysis to cancel');
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected from socket server:', socket.id);
      
      // Clean up any active tasks
      if (activeTasks.has(socket.id)) {
        console.log('Cleaning up active analysis task');
        activeTasks.delete(socket.id);
      }
    });
  });
};

const SocketHandler = (req, res) => {
  console.log('Socket handler invoked, method:', req.method);
  
  if (res.socket.server.io) {
    console.log('Socket.io server already running');
    res.status(200).end();
    return;
  }
  
  console.log('Initializing Socket.io server...');
  
  // Create new Socket.io instance with simplified configuration
  const io = new Server(res.socket.server, {
    path: '/api/socketio',
    transports: ['polling', 'websocket'],
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    connectTimeout: 45000,
    pingTimeout: 30000,
    pingInterval: 25000
  });
  
  // Store the io instance on the server
  res.socket.server.io = io;
  
  // Configure socket server handlers
  configureSocketServer(io);
  
  console.log('Socket.io server initialized with path /api/socketio');
  res.status(200).end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default SocketHandler; 