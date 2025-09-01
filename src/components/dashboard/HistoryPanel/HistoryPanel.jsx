import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useSocket } from '../../../hooks/useSocket';
import { Table, Button, Card } from 'react-bootstrap';
import styles from './HistoryPanel.module.css';

const HistoryPanel = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { socket } = useSocket();

  // Mock data for demonstration - in production this would come from API
  useEffect(() => {
    // Simulate loading history
    setTimeout(() => {
      const mockHistory = [
        {
          id: 1,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          uploader: 'admin@company.com',
          jobId: 'JOB_2025_001',
          total: 150,
          success: 142,
          failed: 8,
          status: 'completed'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 hours ago
          uploader: 'tech@company.com',
          jobId: 'JOB_2025_002',
          total: 89,
          success: 89,
          failed: 0,
          status: 'completed'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(), // 1 day ago
          uploader: 'admin@company.com',
          jobId: 'JOB_2025_003',
          total: 234,
          success: 230,
          failed: 4,
          status: 'completed'
        }
      ];
      setHistory(mockHistory);
      setIsLoading(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('provisioning-complete', (data) => {
        // Add new job to history
        const newJob = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          uploader: data.user || user?.email || 'Unknown',
          jobId: data.jobId || `JOB_${Date.now()}`,
          total: data.total || 0,
          success: data.success || 0,
          failed: data.failed || 0,
          status: 'completed'
        };

        setHistory(prev => [newJob, ...prev.slice(0, 9)]); // Keep last 10 jobs
      });

      return () => {
        socket.off('provisioning-complete');
      };
    }
  }, [socket, user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <Card className={styles.historyPanel}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="h5 mb-1">History</h5>
            <p className="lead mb-0">Recent jobs (latest first)</p>
          </div>
          <Button variant="outline-danger" onClick={handleClearHistory}>
            Clear local history
          </Button>
        </div>
        
        <Table striped hover responsive className="mb-4">
          <thead>
            <tr>
              <th>#</th>
              <th>WHEN</th>
              <th>UPLOADED BY</th>
              <th>JOB ID</th>
              <th>TOTAL</th>
              <th>✓</th>
              <th>✗</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted">No history yet</td>
              </tr>
            ) : (
              history.map((job, index) => (
                <tr key={job.id}>
                  <td>{index + 1}</td>
                  <td>{formatDate(job.timestamp)}</td>
                  <td>{job.uploader}</td>
                  <td>{job.jobId}</td>
                  <td>{job.total}</td>
                  <td>{job.success}</td>
                  <td>{job.failed}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        
      </Card.Body>
    </Card>
  );
};

export default HistoryPanel;
