import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import api from '../services/api';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const uploadFile = useCallback(async (file) => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setUploadResult(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadedBy', user?.email || 'unknown');

      // Make API call to upload file
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentage = Math.round((loaded / total) * 100);
          setUploadProgress(percentage);
        }
      });

      if (response.data.success) {
        // If upload successful, start provisioning
        const provisionResponse = await api.post('/api/provision', {
          jobId: response.data.jobId
        });

        // After provisioning starts, get the job results
        const jobResponse = await api.get(`/api/job/${response.data.jobId}`);

        setUploadResult({
          ...response.data,
          provisionResult: provisionResponse.data,
          jobResult: jobResponse.data
        });
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }

    } catch (err) {
      setError(err.message || 'Upload failed');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  }, [user]);

  const resetUpload = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadResult(null);
    setError(null);
  }, []);

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    uploadResult,
    error,
    resetUpload
  };
};
