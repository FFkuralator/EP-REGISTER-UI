/**
 * Formats date to Russian locale (e.g., "15 января 2024 г.").
 * 
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export default function getFormattedDate(date) {
    return new Date(date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
  }