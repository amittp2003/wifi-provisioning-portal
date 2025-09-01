import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { AppProvider } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/common/Header';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Layout component for pages that need header
const Layout = ({ children, isAuthenticated }) => (
  <>
    <Header isAuthenticated={isAuthenticated} />
    {children}
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="App mobile-scroll diagonal-dot-pattern">
            <Routes>
              <Route path="/login" element={
                <PublicRoute>
                  <Layout isAuthenticated={false}>
                    <LoginPage />
                  </Layout>
                </PublicRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout isAuthenticated={true}>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;