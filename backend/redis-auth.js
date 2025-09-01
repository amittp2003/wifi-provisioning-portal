const bcrypt = require('bcryptjs');

class RedisAuth {
  constructor() {
    this.usersKey = 'users';
    this.sessionsKey = 'sessions';
  }

  async storeUser(redisClient, email, userData) {
    try {
      // Hash password if provided
      if (userData.password) {
        const saltRounds = 10;
        userData.password = await bcrypt.hash(userData.password, saltRounds);
      }

      // Store user in Redis
      const userKey = `${this.usersKey}:${email}`;
      await redisClient.hSet(userKey, userData);
      
      // Add email to users list
      await redisClient.sAdd(this.usersKey, email);
      
      return { success: true, message: 'User stored successfully' };
    } catch (error) {
      console.error('Error storing user:', error);
      return { success: false, message: 'Failed to store user', error: error.message };
    }
  }

  async getUser(redisClient, email) {
    try {
      const userKey = `${this.usersKey}:${email}`;
      const userData = await redisClient.hGetAll(userKey);
      
      if (Object.keys(userData).length === 0) {
        return { success: false, message: 'User not found' };
      }
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Error getting user:', error);
      return { success: false, message: 'Failed to get user', error: error.message };
    }
  }

  async validateUser(redisClient, email, password) {
    try {
      const userResult = await this.getUser(redisClient, email);
      
      if (!userResult.success) {
        return { success: false, message: 'Invalid credentials' };
      }
      
      const user = userResult.user;
      
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
      console.error('Error validating user:', error);
      return { success: false, message: 'Authentication failed', error: error.message };
    }
  }

  async updateUser(redisClient, email, updates) {
    try {
      const userKey = `${this.usersKey}:${email}`;
      
      // Hash password if it's being updated
      if (updates.password) {
        const saltRounds = 10;
        updates.password = await bcrypt.hash(updates.password, saltRounds);
      }
      
      // Update user data
      await redisClient.hSet(userKey, updates);
      
      return { success: true, message: 'User updated successfully' };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, message: 'Failed to update user', error: error.message };
    }
  }

  async deleteUser(redisClient, email) {
    try {
      const userKey = `${this.usersKey}:${email}`;
      
      // Remove user data
      await redisClient.del(userKey);
      
      // Remove email from users list
      await redisClient.sRem(this.usersKey, email);
      
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, message: 'Failed to delete user', error: error.message };
    }
  }

  async listUsers(redisClient) {
    try {
      const userEmails = await redisClient.sMembers(this.usersKey);
      const users = [];
      
      for (const email of userEmails) {
        const userResult = await this.getUser(redisClient, email);
        if (userResult.success) {
          users.push(userResult.user);
        }
      }
      
      return { success: true, users };
    } catch (error) {
      console.error('Error listing users:', error);
      return { success: false, message: 'Failed to list users', error: error.message };
    }
  }

  async storeSession(redisClient, sessionId, sessionData) {
    try {
      const sessionKey = `${this.sessionsKey}:${sessionId}`;
      await redisClient.setEx(sessionKey, 86400, JSON.stringify(sessionData)); // 24 hours
      return { success: true };
    } catch (error) {
      console.error('Error storing session:', error);
      return { success: false, error: error.message };
    }
  }

  async getSession(redisClient, sessionId) {
    try {
      const sessionKey = `${this.sessionsKey}:${sessionId}`;
      const sessionData = await redisClient.get(sessionKey);
      
      if (!sessionData) {
        return { success: false, message: 'Session not found' };
      }
      
      return { success: true, session: JSON.parse(sessionData) };
    } catch (error) {
      console.error('Error getting session:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteSession(redisClient, sessionId) {
    try {
      const sessionKey = `${this.sessionsKey}:${sessionId}`;
      await redisClient.del(sessionKey);
      return { success: true };
    } catch (error) {
      console.error('Error deleting session:', error);
      return { success: false, error: error.message };
    }
  }
}




