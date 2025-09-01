const redis = require('redis');
const bcrypt = require('bcryptjs');
const os = require('os');

// Function to get WSL IP address
const getWslIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (!interface.internal && interface.family === 'IPv4' && interface.address.startsWith('172.')) {
        return interface.address;
      }
    }
  }
  return 'localhost'; // Fallback to localhost
};

// Create Redis client
const createRedisClient = () => {
  // Use WSL IP if available, otherwise use environment variable or localhost
  const defaultHost = os.platform() === 'win32' ? getWslIpAddress() : 'localhost';
  
  const client = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || defaultHost,
      port: process.env.REDIS_PORT || 6379,
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('Redis max retries reached');
          return new Error('Redis max retries reached');
        }
        return Math.min(retries * 100, 3000);
      }
    },
    password: process.env.REDIS_PASSWORD || null,
    database: process.env.REDIS_DB || 0
  });

  client.on('connect', () => {
    // Redis client connecting
  });

  client.on('ready', () => {
    // Redis client ready
  });

  client.on('error', (err) => {
    // Redis client error
  });

  client.on('end', () => {
    // Redis client disconnected
  });

  client.on('reconnecting', () => {
    // Redis client reconnecting
  });

  return client;
};

// Simple Redis authentication (for demo purposes)
const redisAuth = {
  async storeUser(client, email, userData) {
    try {
      // Hash password if provided
      if (userData.password) {
        const saltRounds = 10;
        userData.password = await bcrypt.hash(userData.password, saltRounds);
      }

      // Store user in Redis
      const userKey = `user:${email}`;
      await client.set(userKey, JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async validateUser(client, email, password) {
    try {
      const userKey = `user:${email}`;
      const userData = await client.get(userKey);
      
      if (!userData) {
        return { success: false, message: 'Invalid credentials' };
      }
      
      const user = JSON.parse(userData);
      
      // Check if password matches
      if (user.password) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return { success: false, message: 'Invalid credentials' };
        }
      }
      
      // Remove password from user object before returning
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        success: true,
        user: userWithoutPassword,
        message: 'Authentication successful'
      };
    } catch (error) {
      return { success: false, message: 'Authentication failed', error: error.message };
    }
  }
};

module.exports = { createRedisClient, redisAuth };
