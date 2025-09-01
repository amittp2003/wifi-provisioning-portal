import React from 'react';
import StatusIndicators from '../../components/dashboard/StatusIndicators';
import UploadPanel from '../../components/dashboard/UploadPanel/UploadPanel';
import HistoryPanel from '../../components/dashboard/HistoryPanel';
import ActivityLog from '../../components/dashboard/ActivityLog';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  useSocket(); // Initialize socket connection
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <div className={`${styles.dashboardPage} diagonal-dot-pattern`}>
      <main className={styles.mainContent}>
        <div className={styles.contentContainer}>
          {/* Upload Section Card */}
          <div className={styles.uploadSection}>
            <UploadPanel />
          </div>
          
          {/* Status Indicators Row */}
          <div className={styles.statusIndicators}>
            <StatusIndicators />
          </div>
          
          
          {/* History Section Card */}
          <div className={styles.historySection}>
            <HistoryPanel />
          </div>
          
          {/* Activity Log Section (Admin only) */}
          {isAdmin && (
            <div className={styles.activityLog}>
              <ActivityLog />
            </div>
          )}
          
        </div>
      </main>
      
      {/* Footer */}
      <footer className={styles.pageFooter}>
        <div className={styles.footerContainer}>
          <p className={styles.footerText}>© 2025 Managed WiFi</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
