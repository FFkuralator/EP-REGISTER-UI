export function exportToExcel(data, columns, filename = 'export.xlsx') {
  if (!data || data.length === 0) {
    alert('Нет данных для экспорта');
    return;
  }

  const headers = columns.map(col => col.title);
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key];
      if (Array.isArray(value)) {
        return value.join('; ');
      }
      return value || '';
    });
  });

  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => {
      const escaped = String(cell).replace(/"/g, '""').replace(/\n/g, ' ');
      return `"${escaped}"`;
    }).join(','))
  ].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcelAdvanced(data, columns, filename = 'export.xlsx') {
  try {
    const XLSX = require('xlsx');
    
    const headers = columns.map(col => col.title);
    const rows = data.map(row => {
      return columns.map(col => {
        const value = row[col.key];
        if (Array.isArray(value)) {
          return value.join('; ');
        }
        return value || '';
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Данные');

    // Автоширина колонок
    const colWidths = columns.map(col => ({
      wch: Math.min(Math.max(col.title.length, 15), 30)
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error('Ошибка при экспорте в Excel:', error);
    console.info('Используется вместо этого CSV экспорт');
    exportToExcel(data, columns, filename);
  }
}
