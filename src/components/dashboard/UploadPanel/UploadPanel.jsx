import React, { useState, useCallback } from 'react';
import { useFileUpload } from '../../../hooks/useFileUpload';
import FileDropzone from '../FileDropzone/FileDropzone';
import ResultsTable from '../ResultsTable/ResultsTable';
import styles from './UploadPanel.module.css';

const UploadPanel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadFile, isUploading, uploadProgress, uploadResult, resetUpload } = useFileUpload();

  const handleFileSelect = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      resetUpload();
    }
  }, [resetUpload]);

  const handleUpload = async () => {
    if (selectedFile) {
      await uploadFile(selectedFile);
    }
  };

  const handleClearResults = () => {
    setSelectedFile(null);
    resetUpload();
  };

  const downloadSampleCSV = () => {
    const sampleData = `AP_NAME,AP_IP,AP_LOCATION,AP_TYPE,SSID,CHANNEL
AP001,192.168.1.10,Floor1-Office1,Indoor,CompanyWiFi,6
AP002,192.168.1.11,Floor1-Office2,Indoor,CompanyWiFi,11
AP003,192.168.1.12,Floor1-Lobby,Indoor,CompanyWiFi,1
AP004,192.168.1.13,Floor2-Office1,Indoor,CompanyWiFi,6
AP005,192.168.1.14,Floor2-Office2,Indoor,CompanyWiFi,11`;
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-wifi-provisioning.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Transform job results to table data format
  const transformResultsToTableData = (jobResult) => {
    if (!jobResult || !jobResult.results) return [];
    
    return jobResult.results.map((result, index) => ({
      record: result.record || `Record ${index + 1}`,
      status: result.status || 'Unknown',
      message: result.message || ''
    }));
  };

  // Get table data from upload result
  const tableData = uploadResult?.jobResult
    ? transformResultsToTableData(uploadResult.jobResult)
    : [];

  return (
    <div className={styles.uploadPanel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Upload & Provision</h2>
        <p className={styles.panelSubtitle}>Upload a CSV file to provision WiFi access points</p>
      </div>
      
      <div className={styles.panelContent}>
        {/* File Upload Section */}
        <div className={styles.panelSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 0 0 0-2 2v16a2 2 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 8 9"></polyline>
              </svg>
            </span>
            <div>
              <h3 className={styles.sectionTitle}>File Upload</h3>
              <p className={styles.sectionSubtitle}>Select a CSV file to provision WiFi access points</p>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <FileDropzone
              onFileSelect={handleFileSelect}
              acceptedFileTypes={['.csv']}
              maxFiles={1}
            />
            {selectedFile && (
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 2 2h12a2 2 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 8 9"></polyline>
                  </svg>
                </span>
                <div className={styles.fileDetails}>
                  <div className={styles.fileName}>{selectedFile.name}</div>
                  <div className={styles.fileSize}>
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions Section */}
        <div className={styles.panelSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 1 22 21 10 12 10 13 2"></polygon>
              </svg>
            </span>
            <div>
              <h3 className={styles.sectionTitle}>Actions</h3>
              <p className={styles.sectionSubtitle}>Process your file or download a sample</p>
            </div>
          </div>
          
          <div className={styles.buttonGroup}>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              {isUploading ? (
                <span className={styles.buttonContent}>
                  <span className={styles.spinner}></span>
                  Processing...
                </span>
              ) : (
                <span className={styles.buttonContent}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                  Run Provision
                </span>
              )}
            </button>
            <button
              onClick={downloadSampleCSV}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              <span className={styles.buttonContent}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download sample CSV
              </span>
            </button>
            <button
              onClick={handleClearResults}
              className={`${styles.button} ${styles.dangerButton}`}
            >
              <span className={styles.buttonContent}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Clear results
              </span>
            </button>
          </div>
        </div>
        {/* Progress Bar */}
        {isUploading && (
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              <span className={styles.progressText}>Uploading and processing</span>
              <span className={styles.progressPercentage}>{uploadProgress}%</span>
            </div>
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Results Section */}
        <div className={styles.panelSection}>
          <div className={styles.resultsSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
              <h3 className={styles.resultsTitle}>Results</h3>
            </div>
            <ResultsTable data={tableData} />
          </div>
        </div>
        <div className={styles.footerInfo}>
          <span className={styles.lastUploadText}>Last upload by -- at --</span>
        </div>
      </div>
    </div>
  );
};

export default UploadPanel;