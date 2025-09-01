import Papa from 'papaparse';

class CSVService {
  /**
   * Parse CSV file content
   * @param {File} file - CSV file to parse
   * @returns {Promise<Object>} Parsed CSV data
   */
  static async parseCSV(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
          } else {
            resolve({
              data: results.data,
              meta: results.meta,
              errors: results.errors
            });
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        }
      });
    });
  }

  /**
   * Validate CSV structure
   * @param {Array} data - Parsed CSV data
   * @param {Array} requiredColumns - Required column names
   * @returns {Object} Validation result
   */
  static validateCSVStructure(data, requiredColumns = []) {
    if (!data || data.length === 0) {
      return {
        isValid: false,
        errors: ['CSV file is empty']
      };
    }

    const headers = Object.keys(data[0] || {});
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      return {
        isValid: false,
        errors: [`Missing required columns: ${missingColumns.join(', ')}`],
        headers,
        requiredColumns
      };
    }

    return {
      isValid: true,
      headers,
      rowCount: data.length
    };
  }

  /**
   * Generate sample CSV content
   * @param {Array} columns - Column definitions
   * @returns {string} CSV content
   */
  static generateSampleCSV(columns = []) {
    if (columns.length === 0) {
      columns = [
        { name: 'Name', sample: 'John Doe' },
        { name: 'Email', sample: 'john@example.com' },
        { name: 'Department', sample: 'IT' },
        { name: 'Role', sample: 'Developer' }
      ];
    }

    const headers = columns.map(col => col.name);
    const sampleRow = columns.map(col => col.sample || 'Sample Data');
    
    return [headers, sampleRow].map(row => row.join(',')).join('\n');
  }

  /**
   * Export data to CSV
   * @param {Array} data - Data to export
   * @param {string} filename - Output filename
   */
  static exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  /**
   * Clean CSV data
   * @param {Array} data - Raw CSV data
   * @returns {Array} Cleaned data
   */
  static cleanCSVData(data) {
    return data.map(row => {
      const cleanedRow = {};
      Object.keys(row).forEach(key => {
        const value = row[key];
        if (value !== null && value !== undefined) {
          cleanedRow[key.trim()] = value.toString().trim();
        }
      });
      return cleanedRow;
    }).filter(row => Object.keys(row).length > 0);
  }
}

export default CSVService;
