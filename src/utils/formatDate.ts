/**
 * Форматирует дату в нужный формат
 * @param timestamp - временная метка в миллисекундах
 * @returns отформатированная строка даты
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 