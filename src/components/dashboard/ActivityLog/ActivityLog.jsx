import React, { useState, useEffect } from 'react';
import { useSocket } from '../../../hooks/useSocket';
import { useAuth } from '../../../hooks/useAuth';
import styles from './ActivityLog.module.css';

const ActivityLog = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (socket) {
      const handleProvisioningStart = (data) => {
        const newActivity = {
          id: Date.now(),
          type: 'info',
          message: `Provisioning job ${data.jobId} started`,
          timestamp: new Date(),
          user: data.user || user?.email || 'Unknown'
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      };

      const handleProvisioningComplete = (data) => {
        const successCount = data.success || 0;
        const failedCount = data.failed || 0;
        const newActivity = {
          id: Date.now() + 1,
          type: failedCount > 0 ? 'warning' : 'success',
          message: `Provisioning job ${data.jobId} completed (${successCount} success, ${failedCount} failed)`,
          timestamp: new Date(),
          user: data.user || user?.email || 'Unknown'
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      };

      const handleFileUpload = (data) => {
        const newActivity = {
          id: Date.now() + 2,
          type: 'info',
          message: `File uploaded for provisioning job ${data.jobId}`,
          timestamp: new Date(),
          user: data.user || user?.email || 'Unknown'
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      };

      socket.on('provisioning-start', handleProvisioningStart);
      socket.on('provisioning-complete', handleProvisioningComplete);
      socket.on('file-upload', handleFileUpload);

      return () => {
        socket.off('provisioning-start', handleProvisioningStart);
        socket.off('provisioning-complete', handleProvisioningComplete);
        socket.off('file-upload', handleFileUpload);
      };
    }
  }, [socket, user]);

  const formatTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 8640) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  return (
    <div className={styles.activityLog}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.titleIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </span>
        Activity Log
      </h3>
      
      {activities.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className={styles.emptyText}>No activities yet</p>
        </div>
      ) : (
        <ul className={styles.logList}>
          {activities.map((activity) => (
            <li key={activity.id} className={styles.logItem}>
              <div className={`${styles.logIcon} ${styles[activity.type]}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className={styles.logContent}>
                <p className={styles.logMessage}>{activity.message}</p>
                <div className={styles.logMeta}>
                  <span className={styles.logTime}>{formatTime(activity.timestamp)}</span>
                  <span className={styles.logUser}>by {activity.user}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLog;