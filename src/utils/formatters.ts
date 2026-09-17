export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatAuthorName = (author: string): string => {
  if (!author) return 'Unknown Author';
  return author.trim();
};
