import { describe, it, expect } from '@jest/globals';
import { truncateText, formatAuthorName } from '../src/utils/formatters';

describe('Formatters Utility Tests', () => {
  describe('truncateText', () => {
    it('should truncate strings longer than maxLength', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
    });

    it('should return original text if within length limit', () => {
      expect(truncateText('Short', 10)).toBe('Short');
    });
  });

  describe('formatAuthorName', () => {
    it('should trim author names', () => {
      expect(formatAuthorName('  Alejandro Escamilla  ')).toBe('Alejandro Escamilla');
    });

    it('should handle empty author names gracefully', () => {
      expect(formatAuthorName('')).toBe('Unknown Author');
    });
  });
});
