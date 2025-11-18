export default function getFormattedDate(date) {
    return new Date(date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
  }