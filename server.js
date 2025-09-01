const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createRedisClient, redisAuth } = require('./backend/redis-config');
const { generateToken } = require('./backend/jwt-utils');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redis client
const redisClient = createRedisClient();

// Connect to Redis and initialize demo user once ready
redisClient.connect().then(() => {
  console.log('Connected to Redis');
  // Initialize demo user in Redis
  const initializeDemoUser = async () => {
    try {
      // Check if Redis client is open
      if (!redisClient.isOpen) {
        console.log('Redis client is not open, waiting...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const demoUser = {
        email: 'demo@company.com',
        password: 'demo123',
        name: 'Demo User',
        role: 'admin'
      };
      
      await redisAuth.storeUser(redisClient, demoUser.email, demoUser);
      console.log('Demo user initialized');
    } catch (error) {
      console.error('Error initializing demo user:', error);
    }
  };

  // Initialize demo user on startup
  initializeDemoUser();
}).catch(console.error);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Handle client ready event
  socket.on('client:ready', (data) => {
    console.log('Client ready:', data);
  });
  
  // Handle join room event
  socket.on('join:room', (data) => {
    const { room } = data;
    socket.join(room);
    console.log('Client joined room:', room);
  });
  
 // Handle leave room event
  socket.on('leave:room', (data) => {
    const { room } = data;
    socket.leave(room);
    console.log('Client left room:', room);
  });
  
  // Handle room message event
  socket.on('room:message', (data) => {
    const { room, message, metadata } = data;
    // Broadcast to room except sender
    socket.to(room).emit('room:message', {
      message,
      metadata,
      sender: socket.id,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    // Client disconnected
  });
});

// JWT Authentication middleware
const { verifyToken } = require('./backend/jwt-utils');

const requireAuth = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  const verification = verifyToken(token);
  
  if (!verification.success) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  
  // Add user info to request object
  req.user = verification.payload;
  next();
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, loginType } = req.body;
    
    if (loginType === 'ad') {
      // For AD login, you would integrate with Active Directory
      // For now, we'll use the same validation
    }
    
    const validation = await redisAuth.validateUser(redisClient, email, password);
    
    if (validation.success) {
      // Generate JWT token
      const token = generateToken(validation.user);
      
      res.json({
        success: true,
        user: validation.user,
        token: token,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        message: validation.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  // This endpoint can be used for any server-side cleanup if needed
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Get current user
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Register user endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    // Create user object
    const userData = {
      email,
      password,
      name,
      role: role || 'user' // Default to 'user' if no role provided
    };
    
    // Store user in Redis
    const result = await redisAuth.storeUser(redisClient, email, userData);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'User registered successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message || 'Failed to register user'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// File upload endpoint
app.post('/api/upload', requireAuth, (req, res) => {
  try {
    // In a real implementation, you would handle file upload here
    // For now, we'll return a mock response
    
    const mockJobId = `job_${Date.now()}`;
    
    res.json({
      success: true,
      jobId: mockJobId,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Upload failed'
    });
  }
});

// Run provisioning endpoint
app.post('/api/provision', requireAuth, (req, res) => {
  try {
    const { jobId } = req.body;
    
    // In a real implementation, you would start the provisioning job here
    // For now, we'll return a mock response
    
    res.json({
      success: true,
      jobId: jobId,
      status: 'started',
      message: 'Provisioning job started'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Provisioning failed'
    });
  }
});

// Get job status
app.get('/api/job/:jobId', requireAuth, (req, res) => {
  try {
    const { jobId } = req.params;
    
    // In a real implementation, you would get the actual job status from Redis/database
    // For now, we'll return a mock response
    
    res.json({
      success: true,
      jobId: jobId,
      status: 'completed',
      total: 100,
      success: 95,
      failed: 5,
      results: [
        { id: 1, record: 'AP001', status: 'success', message: 'Provisioned successfully' },
        { id: 2, record: 'AP002', status: 'success', message: 'Provisioned successfully' }
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get job status'
    });
  }
});

// Download sample CSV
app.get('/api/download-sample', requireAuth, (req, res) => {
  try {
    const sampleCSV = `AP_NAME,AP_IP,AP_LOCATION,AP_TYPE
AP001,192.168.1.10,Floor1-Office1,Indoor
AP002,192.168.1.11,Floor1-Office2,Indoor
AP003,192.168.1.12,Floor1-Lobby,Indoor
AP004,192.168.1.13,Floor2-Office1,Indoor
AP005,192.168.1.14,Floor2-Office2,Indoor`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=sample-provisioning.csv');
    res.send(sampleCSV);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Download failed'
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  redisClient.quit();
});

