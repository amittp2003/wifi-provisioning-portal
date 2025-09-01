import React, { useState, useEffect } from 'react';
import styles from './StatusIndicators.module.css';

const StatusIndicators = () => {
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration - in production this would come from API
  useEffect(() => {
    // Simulate loading stats
    setIsLoading(true);
    setTimeout(() => {
      setStats({
        total: 150,
        success: 142,
        failed: 8
      });
      setIsLoading(false);
    }, 100);
  }, []);

  return (
    <div className={styles.statusIndicators}>
      <div className={`${styles.statusCard} ${styles.total}`}>
        <div className={styles.cardBody}>
          {isLoading ? (
            <div className={styles.loadingValue}></div>
          ) : (
            <div className={styles.statValue}>{stats.total}</div>
          )}
          <div className={styles.statLabel}>Total</div>
        </div>
      </div>
      <div className={`${styles.statusCard} ${styles.success}`}>
        <div className={styles.cardBody}>
          {isLoading ? (
            <div className={styles.loadingValue}></div>
          ) : (
            <div className={styles.statValue}>{stats.success}</div>
          )}
          <div className={styles.statLabel}>Success</div>
        </div>
      </div>
      <div className={`${styles.statusCard} ${styles.failed}`}>
        <div className={styles.cardBody}>
          {isLoading ? (
            <div className={styles.loadingValue}></div>
          ) : (
            <div className={styles.statValue}>{stats.failed}</div>
          )}
          <div className={styles.statLabel}>Failed</div>
        </div>
      </div>
    </div>
  );
};

export default StatusIndicators;