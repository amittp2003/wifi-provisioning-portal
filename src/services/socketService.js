import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventListeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  /**
   * Connect to socket server
   * @param {string} url - Socket server URL
   * @param {Object} options - Connection options
   */
  connect(url = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', options = {}) {
    if (this.socket) {
      this.disconnect();
    }

    const defaultOptions = {
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      timeout: 20000
    };

    this.socket = io(url, { ...defaultOptions, ...options });

    this.setupEventListeners();
    this.socket.connect();
  }

  /**
   * Setup socket event listeners
   */
  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('client:ready', { timestamp: new Date().toISOString() });
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      this.isConnected = false;
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          this.socket.connect();
        }, this.reconnectDelay * this.reconnectAttempts);
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_error', (error) => {
      // Socket reconnection error
    });

    this.socket.on('reconnect_failed', () => {
      // Socket reconnection failed
    });
  }

  /**
   * Emit event to server
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }

  /**
   * Listen for events from server
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   */
  on(event, callback) {
    if (!this.socket) return;

    // Store listener for cleanup
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);

    this.socket.on(event, callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event handler to remove
   */
  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);

    // Remove from stored listeners
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Remove all listeners for an event
   * @param {string} event - Event name
   */
  removeAllListeners(event) {
    if (!this.socket) return;

    this.socket.removeAllListeners(event);
    this.eventListeners.delete(event);
  }

  /**
   * Get connection status
   * @returns {boolean} Connection status
   */
  getConnectionStatus() {
    return this.isConnected;
  }

  /**
   * Get socket instance
   * @returns {Socket|null} Socket instance
   */
  getSocket() {
    return this.socket;
  }

  /**
   * Disconnect from socket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventListeners.clear();
    }
  }

  /**
   * Join a room
   * @param {string} room - Room name
   */
  joinRoom(room) {
    this.emit('join:room', { room });
  }

  /**
   * Leave a room
   * @param {string} room - Room name
   */
  leaveRoom(room) {
    this.emit('leave:room', { room });
  }

  /**
   * Send message to room
   * @param {string} room - Room name
   * @param {string} message - Message content
   * @param {Object} metadata - Additional metadata
   */
  sendToRoom(room, message, metadata = {}) {
    this.emit('room:message', {
      room,
      message,
      metadata,
      timestamp: new Date().toISOString()
    });
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
