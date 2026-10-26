/**
 * AUDIRA BILLING - Universal Client-Side Data Exporter
 * Supports CSV, JSON, and Tabular text export with UTF-8 BOM for Microsoft Excel compatibility
 * Author: Agus Dwi Rianto (AUDIRA) - https://audira.my.id
 */

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) {
    console.warn('exportToCSV: No data to export');
    return false;
  }

  // Extract headers
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      headers
        .map(header => {
          let cell = row[header];
          if (cell === null || cell === undefined) cell = '';
          const strCell = String(cell).replace(/"/g, '""');
          return `"${strCell}"`;
        })
        .join(',')
    )
  ].join('\r\n');

  // Create UTF-8 BOM blob so Excel handles special characters correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export function exportToJSON(filename: string, data: any) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.json') ? filename : `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
