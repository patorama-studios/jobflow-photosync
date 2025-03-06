
/**
 * Exports data to a CSV file
 * @param data Array of objects to export
 * @param filename Name of the file without extension
 */
export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string): void {
  if (!data || !data.length) {
    console.warn('No data to export');
    return;
  }

  // Get headers from the first item's keys
  const headers = Object.keys(data[0]);
  
  // Create CSV rows
  const csvRows = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row => {
      return headers.map(header => {
        // Handle values that might need quotes
        const value = row[header];
        
        // Convert values to strings, handle null/undefined
        let stringValue = value === null || value === undefined ? '' : String(value);
        
        // Escape quotes and wrap in quotes if needed
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          stringValue = `"${stringValue.replace(/"/g, '""')}"`;
        }
        
        return stringValue;
      }).join(',');
    })
  ].join('\n');
  
  // Create download link
  const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
