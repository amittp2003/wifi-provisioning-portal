import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('basic');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
     e.preventDefault();
     if (loginType === 'basic' && (!formData.email || !formData.password)) {
       alert('Please fill in all fields');
       return;
     }
     
     setIsLoading(true);
     try {
       const result = await login({ email: formData.email, password: formData.password }, loginType);
       if (result.success) {
         // Redirect to dashboard on successful login
         navigate('/dashboard');
       } else {
         // Handle login failure
         // Error is now handled by AuthContext and displayed below
       }
     } catch (error) {
       // Error is now handled by AuthContext and displayed below
     } finally {
       setIsLoading(false);
     }
   };

return (
    <div className={`${styles.loginForm} w-100`}>
      <h2 className={styles.formTitle}>Sign in</h2>
      <div className={styles.loginTabs}>
        <button
          className={`${styles.tab} ${loginType === 'basic' ? styles.active : ''}`}
          onClick={() => setLoginType('basic')}
        >
          Login
        </button>
        <button
          className={`${styles.tab} ${loginType === 'ad' ? styles.active : ''}`}
          onClick={() => setLoginType('ad')}
        >
          Login via AD
        </button>
      </div>

      {loginType === 'basic' && (
        <form onSubmit={handleLogin}>
          <div className={`${styles.formGroup} mb-3`}>
            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`${styles.formInput} form-control`}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={`${styles.formGroup} mb-3`}>
            <label htmlFor="password" className={styles.formLabel}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`${styles.formInput} form-control`}
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}
          
          <button type="submit" className={`${styles.loginBtn} btn btn-primary w-100`} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}

      {loginType === 'ad' && (
        <div className={`${styles.adLogin} text-center`}>
          <p className={styles.adMessage}>This feature is coming soon.</p>
          <button className={`${styles.adBtn} btn btn-outline-primary w-100`} disabled>Login with AD</button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;