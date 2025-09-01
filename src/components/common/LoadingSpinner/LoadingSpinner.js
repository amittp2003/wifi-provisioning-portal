import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`${styles.spinner} ${styles[size]} ${className}`}>
      <div className={styles.spinnerInner}></div>
    </div>
  );
};

export default LoadingSpinner;