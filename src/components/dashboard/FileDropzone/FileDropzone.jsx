import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './FileDropzone.module.css';

const FileDropzone = ({ onFileSelect, acceptedFileTypes = ['.csv'], maxFiles = 1 }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      // Handle rejected files
      const errorMessage = rejectedFiles.length > 1
        ? `Only ${maxFiles} file(s) allowed. Please remove extra files.`
        : `File type not supported. Please upload ${acceptedFileTypes.join(', ')}`;
      alert(errorMessage);
      return;
    }
    
    if (onFileSelect && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles);
    }
  }, [onFileSelect, acceptedFileTypes, maxFiles]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      if (type === '.csv') {
        acc['text/csv'] = ['.csv'];
      } else if (type === '.xlsx') {
        acc['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = ['.xlsx'];
      } else if (type === '.xls') {
        acc['application/vnd.ms-excel'] = ['.xls'];
      }
      return acc;
    }, {}),
    multiple: maxFiles > 1,
    maxFiles: maxFiles,
    maxSize: 10485760 // 10MB limit
  });

  return (
    <div className={styles.dropzoneContainer}>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''} ${isDragReject ? styles.dragReject : ''}`}
      >
        <input {...getInputProps()} />
        <div className={styles.dropzoneContent}>
          {isDragActive ? (
            <>
              <div className={styles.dropzoneIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>
              <p className={styles.dropzoneText}>Drop the file(s) here...</p>
            </>
          ) : (
            <>
              <div className={styles.dropzoneIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <p className={styles.dropzoneText}>
                Drag & drop {maxFiles > 1 ? 'files' : 'a file'} here, or click to select
              </p>
              <p className={styles.dropzoneSubtext}>
                Accepted formats: {acceptedFileTypes.join(', ')} (Max 10MB)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileDropzone;
