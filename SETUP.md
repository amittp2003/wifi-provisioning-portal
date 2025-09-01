# WiFi Provisioning Portal - Setup Guide

This guide will help you set up the WiFi Provisioning Portal project on a new desktop.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (version 14 or higher)
2. **npm** (usually comes with Node.js)
3. **Redis** server

### Installing Node.js and npm

1. Visit [Node.js official website](https://nodejs.org/)
2. Download the LTS version for your operating system
3. Run the installer and follow the installation instructions
4. Verify installation by opening a terminal/command prompt and running:
   ```
   node --version
   npm --version
   ```

### Installing Redis

#### Windows:
1. Download Redis for Windows from [Redis official website](https://redis.io/download/) or use WSL (Windows Subsystem for Linux)
2. Follow the installation instructions for your preferred method

#### macOS:
1. Using Homebrew:
   ```
   brew install redis
   ```

#### Linux (Ubuntu/Debian):
1. Run the following commands:
   ```
   sudo apt update
   sudo apt install redis-server
   ```

## Cloning the Repository

1. Open a terminal/command prompt
2. Navigate to the directory where you want to clone the project:
   ```
   cd /path/to/your/desired/directory
   ```
3. Clone the repository:
   ```
   git clone https://github.com/amittp2003/wifi-provisioning-portal.git
   ```
4. Navigate to the project directory:
   ```
   cd wifi-provisioning-portal
   ```

## Installing Dependencies

The project has two parts: frontend and backend, each with their own dependencies.

### Backend Dependencies

1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install backend dependencies:
   ```
   npm install
   ```
3. Navigate back to the root directory:
   ```
   cd ..
   ```

### Frontend Dependencies

1. Install frontend dependencies:
   ```
   npm install
   ```

## Environment Variables

The application requires environment variables to be set for both frontend and backend.

### Backend Environment Variables

1. In the `backend` directory, create a `.env` file:
   ```
   cd backend
   touch .env
   ```
2. Add the following variables to the `.env` file:
   ```
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

### Frontend Environment Variables

1. In the root directory, create a `.env` file:
   ```
   touch .env
   ```
2. Add the following variables to the `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

## Starting Redis Server

Before running the application, ensure Redis server is running:

### Windows:
If using WSL:
```
sudo service redis-server start
```

### macOS:
```
brew services start redis
```

### Linux:
```
sudo service redis-server start
```

Alternatively, you can run Redis in the foreground:
```
redis-server
```

## Running the Application

The application consists of two parts: frontend and backend. You can run them separately or use a single command to run both.

### Method 1: Running Both Parts Separately

1. Start the backend server:
   ```
   cd backend
   npm start
   ```
   or for development with auto-restart:
   ```
   npm run dev
   ```

2. In a new terminal, start the frontend:
   ```
   cd ..
   npm start
   ```

### Method 2: Running Both Parts with a Single Command

From the root directory, you can run both the frontend and backend using:
```
npm run start-backend
```
And in another terminal for the frontend:
```
npm start
```

## Building for Production

To create a production build of the frontend:

1. Run the build command:
   ```
   npm run build
   ```

2. The build files will be in the `build/` directory

3. The backend server can serve these files in production mode by setting the `NODE_ENV` environment variable to `production`:
   ```
   NODE_ENV=production node server.js
   ```

## Default Login Credentials

The application creates a demo user on startup:

- Email: `demo@company.com`
- Password: `demo123`

## Troubleshooting

### Common Issues

1. **Port already in use**: If you get an error that port 3000 or 5000 is already in use, you can change the ports:
   - For frontend, modify the `start` script in `package.json`
   - For backend, change the `PORT` variable in `backend/.env`

2. **Redis connection issues**: Ensure Redis server is running and the connection details in `backend/.env` are correct.

3. **Dependency installation errors**: Try deleting `node_modules` folders and `package-lock.json` files, then run `npm install` again.

### Useful Commands

- Check if Redis is running: `redis-cli ping` (should return "PONG")
- View Redis data: `redis-cli --scan --pattern "*"`
- Stop Redis: `redis-cli shutdown`

## Project Structure

```
wifi-provisioning-portal/
├── backend/              # Backend server code
│   ├── jwt-utils.js      # JWT authentication utilities
│   ├── redis-auth.js     # Redis authentication functions
│   ├── redis-config.js   # Redis configuration
│   ├── test-redis.js     # Redis testing utilities
│   └── .env              # Backend environment variables
├── public/               # Public assets
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API service functions
│   ├── styles/           # CSS styles
│   ├── utils/            # Utility functions
│   └── .env              # Frontend environment variables
├── .gitignore            # Git ignore file
├── package.json          # Frontend package configuration
├── server.js             # Main backend server file
└── SETUP.md              # This setup guide
```

## Additional Resources

- [React Documentation](https://reactjs.org/)
- [Express.js Documentation](https://expressjs.com/)
- [Redis Documentation](https://redis.io/documentation)
- [Node.js Documentation](https://nodejs.org/en/docs/)