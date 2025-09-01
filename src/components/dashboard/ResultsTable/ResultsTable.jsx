import React from 'react';
import styles from './ResultsTable.module.css';

const ResultsTable = ({ data = [] }) => {
  // Function to determine status class
  const getStatusClass = (status) => {
    if (!status) return '';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('success')) return styles.successStatus;
    if (lowerStatus.includes('error') || lowerStatus.includes('failed')) return styles.errorStatus;
    if (lowerStatus.includes('warning')) return styles.warningStatus;
    return styles.infoStatus;
  };

  return (
    <div className={styles.resultsTable}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>#</th>
              <th className={styles.tableHeaderCell}>RECORD</th>
              <th className={styles.tableHeaderCell}>STATUS</th>
              <th className={styles.tableHeaderCell}>MESSAGE</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.tableCell}>{index + 1}</td>
                  <td className={styles.tableCell}>{row.record || ''}</td>
                  <td className={`${styles.tableCell} ${getStatusClass(row.status)}`}>
                    {row.status || ''}
                  </td>
                  <td className={styles.tableCell}>{row.message || ''}</td>
                </tr>
              ))
            ) : (
              <tr className={styles.emptyRow}>
                <td colSpan="4" className={styles.emptyCell}>
                  <div className={styles.emptyState}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.emptyIcon}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p className={styles.emptyText}>No results yet</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;