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
        
        // Start repository analysis with progress updates
        const updateProgress = (progressData) => {
          // Check if analysis was aborted
          if (activeTasks.get(socket.id)?.aborted) {
            console.log('Analysis was aborted, throwing error');
            throw new Error('Analysis cancelled by user');
          }
          
          console.log(`Sending progress update: ${progressData.step} - ${progressData.progress}%`);
          socket.emit('progress', progressData);
        };
        
        // Analyze repository
        console.log('Starting repository analysis');
        const results = await analyzeRepo(repoUrl, updateProgress);
        
        // Send results back to client
        console.log('Analysis complete, sending results to client');
        socket.emit('analysisResults', {
          status: 'success',
          repoName: results.repoName || repoUrl,
          results: results
        });
        
        // Clean up
        activeTasks.delete(socket.id);
      } catch (error) {
        console.error('Analysis error occurred:', error.message);
        socket.emit('error', { message: error.message });
        
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
  
  // Socket.io server needs specific handling for Next.js API routes
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...');
    
    // Create new Socket.io instance
    const io = new Server(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    
    // Store the io instance on the server
    res.socket.server.io = io;
    
    // Configure socket server handlers
    configureSocketServer(io);
    
    console.log('Socket.io server initialized with path /api/socketio');
  } else {
    console.log('Socket.io server already running');
  }
  
  console.log('Socket handler responding with 200 OK');
  res.status(200).end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default SocketHandler; 